#!/usr/bin/env node

import { program } from 'commander';
import { JSDOM } from 'jsdom';
import { glob } from 'glob';
import fs from 'fs-extra';
import path from 'path';

program
    .option('-i, --input <dir>', 'Input directory containing DocBook XML files', './input')
    .option('-o, --output <dir>', 'Output directory for TEI XML files', './output')
    .parse(process.argv);

const options = program.opts();
const inputDir = path.resolve(options.input);
const outputDir = path.resolve(options.output);

console.log(`Input Directory: ${inputDir}`);
console.log(`Output Directory: ${outputDir}`);

const TEI_NS = 'http://www.tei-c.org/ns/1.0';

// Helpers
function escapeXml(str) {
    return str.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

const INLINE_TAGS = new Set([
    'hi', 'ref', 'pb', 'graphic', 'figure', 'titlePart', 'byline', 'docImprint',
    'lb', 'anchor', 'persName', 'placeName', 'rs', 'span', 'code', 'ident', 'edition'
]);

function isMixedContent(node) {
    // Check if node has any non-whitespace text children
    return Array.from(node.childNodes).some(n => n.nodeType === 3 && n.textContent.trim().length > 0);
}

function serializeHEI(node, level = 0) {
    if (node.nodeType === 3) {
        // Text node
        // If it's pure whitespace and we are in a structural context, we might ignore it? 
        // But the caller handles that.
        // For mixed content, we return as is (escaped).
        return escapeXml(node.textContent);
    }

    if (node.nodeType === 1) {
        const tagName = node.tagName;
        const isInline = INLINE_TAGS.has(tagName);
        const hasText = isMixedContent(node);

        // Attributes
        let attrs = '';
        for (let i = 0; i < node.attributes.length; i++) {
            const attr = node.attributes[i];
            attrs += ` ${attr.name}="${escapeXml(attr.value)}"`;
        }

        // Start tag
        let out = '';

        // Logic:
        // If inline, just print.
        // If block, print newline + indent.

        // Note: The caller usually handles the newline/indent of the *current* node if it's a child of a structural node.
        // But since we recurse, we can handle it here if we assume 'level' implies we are a child.
        // We need to know if the PARENT treated us as structural child.

        // Let's adopt the strategy:
        // Returns the string for this node.

        let content = '';
        const children = Array.from(node.childNodes);

        if (isInline || hasText) {
            // Mixed or Inline mode
            // No indentation for children, just run them
            children.forEach(child => {
                content += serializeHEI(child, level + 1);
            });
            return `<${tagName}${attrs}>${content}</${tagName}>`;
        } else {
            // Structural Block (elements only)
            // We expect children to be blocks usually.
            const indent = '    '.repeat(level);
            const childIndent = '    '.repeat(level + 1);

            children.forEach(child => {
                if (child.nodeType === 3 && child.textContent.trim().length === 0) return; // skip whitespace text in structural

                const childStr = serializeHEI(child, level + 1);
                // If child is inline but in a structural block (unlikely but possible, e.g. empty p?), we still indent?
                if (child.nodeType === 1) {
                    // If child is inline, we might still want it on new line? No, inline is inline.
                    // But if it's 'bibl' or something?
                    // Let's rely on child being block/inline.
                    if (INLINE_TAGS.has(child.tagName)) {
                        content += `\n${childIndent}${childStr}`;
                    } else {
                        // Block child
                        content += `\n${childIndent}${childStr}`;
                    }
                } else {
                    // Text node non-empty? (Should be covered by hasText check above, but maybe mixed)
                    content += childStr;
                }
            });

            if (content.length > 0) {
                return `<${tagName}${attrs}>${content}\n${indent}</${tagName}>`;
            } else {
                // Empty structural
                return `<${tagName}${attrs}/>`;
            }
        }
    }
    return '';
}

// Wrapper for serialization that handles the root indent
function serializeDocument(rootNode) {
    // Root is <TEI>. It's structural.
    return serializeHEI(rootNode, 0);
}


async function convertFile(filePath) {
    try {
        let xmlContent = await fs.readFile(filePath, 'utf8');
        xmlContent = xmlContent.replace(/<!DOCTYPE[^>]+>/, '');
        const dom = new JSDOM(xmlContent, { contentType: 'application/xml' });
        const doc = dom.window.document;

        const root = doc.documentElement;
        if (root.tagName !== 'book' && root.getAttribute('xmlns') !== 'http://docbook.org/ns/docbook') {
            console.warn(`Skipping ${filePath}: Not a recognized DocBook 5.0 file.`);
            return;
        }

        // --- Create TEI DOM ---
        const teiDom = new JSDOM('<TEI xmlns="http://www.tei-c.org/ns/1.0"></TEI>', { contentType: 'application/xml' });
        const teiDoc = teiDom.window.document;
        const teiRoot = teiDoc.documentElement;

        // Helper
        function createElement(tagName) {
            return teiDoc.createElementNS(TEI_NS, tagName);
        }

        // --- Header Conversion ---
        const teiHeader = createElement('teiHeader');
        teiRoot.appendChild(teiHeader);

        const fileDesc = createElement('fileDesc');
        teiHeader.appendChild(fileDesc);

        const titleStmt = createElement('titleStmt');
        fileDesc.appendChild(titleStmt);

        const info = doc.querySelector('info') || doc.querySelector('bookinfo');

        // Title
        if (info) {
            const title = info.querySelector('title');
            if (title) {
                const teiTitle = createElement('title');
                teiTitle.textContent = title.textContent;
                titleStmt.appendChild(teiTitle);
            }
            // Authors/Editors
            const authors = info.querySelectorAll('author personname, editor personname');
            authors.forEach(person => {
                const teiAuthor = createElement('author');
                teiAuthor.textContent = person.textContent.replace(/\s+/g, ' ').trim();
                titleStmt.appendChild(teiAuthor);
            });
            // RespStmt
            const respStmt = createElement('respStmt');
            const resp = createElement('resp');
            resp.textContent = 'TEI P5 XML markup in conformance with the TEI DTD';
            respStmt.appendChild(resp);
            const name = createElement('name');
            name.textContent = 'AEL Data';
            respStmt.appendChild(name);
            titleStmt.appendChild(respStmt);
        }

        const publicationStmt = createElement('publicationStmt');
        fileDesc.appendChild(publicationStmt);

        if (info) {
            const publisher = info.querySelector('publishername');
            if (publisher) {
                const teiPub = createElement('publisher');
                teiPub.textContent = publisher.textContent;
                publicationStmt.appendChild(teiPub);
            }
            const pubDate = info.querySelector('pubdate, date');
            if (pubDate) {
                const teiDate = createElement('date');
                teiDate.textContent = pubDate.textContent;
                publicationStmt.appendChild(teiDate);
            }
            const address = info.querySelector('address');
            if (address) {
                const teiPubPlace = createElement('pubPlace');
                teiPubPlace.textContent = address.textContent.trim();
                publicationStmt.appendChild(teiPubPlace);
            }
        }

        const sourceDesc = createElement('sourceDesc');
        fileDesc.appendChild(sourceDesc);
        const bibl = createElement('bibl');
        let biblText = "Converted from DocBook source";
        if (info && info.querySelector('title')) {
            biblText = info.querySelector('title').textContent;
        }
        bibl.textContent = biblText;
        sourceDesc.appendChild(bibl);

        // ProfileDesc
        const profileDesc = createElement('profileDesc');
        teiHeader.appendChild(profileDesc);
        const langUsage = createElement('langUsage');
        profileDesc.appendChild(langUsage);
        const language = createElement('language');
        language.setAttribute('ident', 'en');
        language.textContent = 'English';
        langUsage.appendChild(language);


        // --- Text Conversion ---
        const text = createElement('text');
        teiRoot.appendChild(text);

        // --- Front Matter ---
        const front = createElement('front');
        text.appendChild(front);

        // TitlePage
        if (info) {
            const titlePage = createElement('titlePage');
            front.appendChild(titlePage);

            const pb = createElement('pb');
            titlePage.appendChild(pb);

            const docTitle = createElement('docTitle');
            titlePage.appendChild(docTitle);
            const titlePart = createElement('titlePart');
            titlePart.setAttribute('type', 'main');
            if (info.querySelector('title')) {
                titlePart.textContent = info.querySelector('title').textContent;
            }
            docTitle.appendChild(titlePart);

            const docImprint = createElement('docImprint');
            titlePage.appendChild(docImprint);

            if (info.querySelector('publishername')) {
                const p = createElement('publisher');
                p.textContent = info.querySelector('publishername').textContent;
                docImprint.appendChild(p);
            }
            if (info.querySelector('date')) {
                const d = createElement('date');
                d.textContent = info.querySelector('date').textContent;
                docImprint.appendChild(d);
            }
        }

        const body = createElement('body');
        text.appendChild(body);

        function processNode(node, parentTeiNode) {
            if (node.nodeType === 3) {
                const txt = node.textContent;
                if (txt.length > 0) {
                    parentTeiNode.appendChild(teiDoc.createTextNode(txt));
                }
                return;
            }
            if (node.nodeType !== 1) return;

            let newTeiNode = null;
            let targetParent = parentTeiNode;

            switch (node.tagName) {
                case 'part':
                    // If part is role=front, we process children into current parent (which might be front)
                    // If parent is not front, we might want to put them in front?
                    // But here we rely on the main loop passing 'front' as parent for front parts.
                    if (node.getAttribute('role') === 'front') {
                        // Just recurse
                        Array.from(node.childNodes).forEach(child => processNode(child, parentTeiNode));
                        return;
                    }
                    newTeiNode = createElement('div');
                    newTeiNode.setAttribute('type', 'chapter');
                    if (node.hasAttribute('xml:id')) newTeiNode.setAttribute('xml:id', node.getAttribute('xml:id'));
                    break;
                case 'chapter':
                    newTeiNode = createElement('div');
                    newTeiNode.setAttribute('type', 'chapter');
                    if (node.hasAttribute('xml:id')) newTeiNode.setAttribute('xml:id', node.getAttribute('xml:id'));
                    break;
                case 'section':
                    newTeiNode = createElement('div');
                    newTeiNode.setAttribute('type', 'section');
                    if (node.hasAttribute('xml:id')) newTeiNode.setAttribute('xml:id', node.getAttribute('xml:id'));
                    break;
                case 'title':
                    newTeiNode = createElement('head');
                    if (parentTeiNode.getAttribute('type') === 'section') {
                        newTeiNode.setAttribute('type', 'sub');
                    }
                    break;
                case 'para':
                    newTeiNode = createElement('p');
                    if (node.hasAttribute('xml:id')) newTeiNode.setAttribute('xml:id', node.getAttribute('xml:id'));
                    break;
                case 'emphasis':
                    newTeiNode = createElement('hi');
                    const role = node.getAttribute('role');
                    if (role === 'bold' || role === 'strong') newTeiNode.setAttribute('rend', 'bold');
                    else if (role === 'italic' || role === 'em') newTeiNode.setAttribute('rend', 'italic');
                    else if (role === 'smallcaps') newTeiNode.setAttribute('rend', 'smallcaps');
                    else newTeiNode.setAttribute('rend', 'italic');
                    break;
                case 'link':
                    newTeiNode = createElement('ref');
                    if (node.getAttribute('xlink:href')) newTeiNode.setAttribute('target', node.getAttribute('xlink:href'));
                    break;
                case 'orderedlist':
                    newTeiNode = createElement('list');
                    newTeiNode.setAttribute('type', 'ordered');
                    break;
                case 'itemizedlist':
                    newTeiNode = createElement('list');
                    newTeiNode.setAttribute('type', 'unordered');
                    break;
                case 'listitem':
                    newTeiNode = createElement('item');
                    break;
                case 'preface':
                case 'dedication':
                case 'colophon':
                case 'legalnotice':
                case 'abstract':
                    // Map to div type=...
                    newTeiNode = createElement('div');
                    newTeiNode.setAttribute('type', node.tagName);
                    break;
                case 'info':
                case 'biblioid':
                    return;
                default:
                    // Recurse without wrapping
                    Array.from(node.childNodes).forEach(child => processNode(child, parentTeiNode));
                    return;
            }

            if (newTeiNode) {
                targetParent.appendChild(newTeiNode);
                Array.from(node.childNodes).forEach(child => processNode(child, newTeiNode));
            }
        }

        // Iterate root children
        Array.from(root.childNodes).forEach(child => {
            if (child.nodeType === 1 && child.tagName !== 'info') {
                if (['preface', 'dedication', 'colophon', 'legalnotice'].includes(child.tagName)) {
                    processNode(child, front);
                } else if (child.tagName === 'part' && child.getAttribute('role') === 'front') {
                    // Pass 'front' as parent so children like 'preface' inside 'part' go to 'front'
                    processNode(child, front);
                } else {
                    processNode(child, body);
                }
            }
        });

        // Write Output with PIs
        const relativePath = path.relative(inputDir, filePath);
        const outputFilePath = path.join(outputDir, relativePath);
        await fs.ensureDir(path.dirname(outputFilePath));

        const pis = '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<?xml-stylesheet type="text/xslt" href="../../frameworks/tei/xml/tei/stylesheet/html/tei.xsl"?>\n' +
            '<?oxygen RNGSchema="http://www.tei-c.org/release/xml/tei/custom/schema/relaxng/tei_lite.rng" type="xml"?>\n';

        let xmlString = serializeDocument(teiRoot);

        await fs.writeFile(outputFilePath, pis + xmlString);
        console.log(`Converted: ${relativePath}`);

    } catch (error) {
        console.error(`Error converting ${filePath}:`, error);
        if (error.stack) console.error(error.stack);
    }
}

async function main() {
    await fs.ensureDir(outputDir);
    const files = await glob('**/*.xml', { cwd: inputDir, absolute: true });
    // Filter out hidden files
    const xmlFiles = files.filter(f => !path.basename(f).startsWith('.'));
    console.log(`Found ${xmlFiles.length} XML files.`);

    for (const file of xmlFiles) {
        await convertFile(file);
    }
}

main();
