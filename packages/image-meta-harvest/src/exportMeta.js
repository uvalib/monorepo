const { walkImageFiles, asyncImConvert, createDateFromMeta } = require('./shared.js');
const argv = require('minimist')(process.argv.slice(2));
const { readFileSync, writeFileSync, existsSync, mkdirSync, statSync, copyFileSync } = require('fs');

function getFile(path,def){
    if (existsSync(path)) {
        console.log(path)
        return JSON.parse(readFileSync(path))
    } else return def;
}

function mergeMeta(meta1, meta2){
    // just worry about merging the curated meta (from cumulus) as the other stuff should be the same
    meta1.curated = {...meta1.curated, ...meta2.curated}
}

function getAllMeta(path, excluded=[]) {
    let meta = {}
    if (!excluded.includes(path)) {
        meta = {
            meta: getFile(path+".meta.json",{}),
            classify: getFile(path+".Classify.json",[]),
            faces: getFile(path+".Faces.json",[]),
            objects: getFile(path+".Objects.json",[]),
            similar: getFile(path+".similar.json",[]),
            close: getFile(path+".veryclose.json",[]),
            duplicates: getFile(path+".duplicatesOf.json",[]),
            curated: getFile(path+".curatedMeta.json",{})
        }
    }   
    excluded.push(path);
    if (meta.duplicates) meta.duplicates.forEach(dup=>mergeMeta(meta, getAllMeta(dup,excluded)))
    return meta;
}

function parseDate(s) {
    var b = s.split(/\D/);
    return new Date(b[0],b[1]-1,b[2],b[3],b[4],b[5]);
}

async function getMeta(file) {
    console.log(file)
    const path = file.replace(/^(.*)\..+$/, "$1")
    if (!existsSync(path+".duplicate.json" && existsSync(path+".jp2") )) {
        const meta = getAllMeta(path);
        console.log(meta.duplicates)
        const doc = `
            <add>
                <doc>
                    <field name="id">${meta.meta.UUID.replace(/\-/g,'')}</field>
                    <field name="work_title2_key_ssort_stored">${
                        file.replace(/.*\/Shoots \d\d\d\d\/(.+)\/.*\.webp/,"$1").replace('/', " - ")
                    }</field>
                    <field name="url_iiif_image_a">https://iiif-dev.internal.lib.virginia.edu/addison/${ meta.meta.jp2Path.replace(/.*\/(.+)\/(.+)\/(.+)\/(.+)\.jp2/i,"$1$2$3$4") }</field>
                    <field name="thumbnail_url_stored">https://iiif-dev.internal.lib.virginia.edu/addison/${ meta.meta.jp2Path.replace(/.*\/(.+)\/(.+)\/(.+)\/(.+)\.jp2/i,"$1$2$3$4") }/full/!200,200/0/default.jpg</field>
                    <field name="pool_f_stored">images</field>
                    <field name="uva_availability_f_stored">Online</field>
                    <field name="anon_availability_f_stored">Online</field>
                    <field name="circulating_f">true</field>
                    <field name="library_f_stored"/>
                    <field name="images_tsearch">Machine generated</field>
                    <!--NO MAPPING FOR recordOrigin, -->
                    <field name="images_tsearch">${ parseDate(createDateFromMeta(meta.meta).rawValue).toISOString() }</field>
                    <!--NO MAPPING FOR recordCreationDate, -->
                    <field name="metadata_source_tsearch_stored">Addison</field>
                    <field name="images_tsearch">8995404</field>
                    <field name="published_daterange">${ createDateFromMeta(meta.meta).year }</field>
                    <field name="published_date">${ parseDate(createDateFromMeta(meta.meta).rawValue).toISOString() }</field>
                    <field name="content_type_tsearch_stored">still image</field>
                    <field name="media_type_tsearch_stored">computer</field>
                    <field name="orig_carrier_typetsearch_stored">online resource</field>
                    <field name="internet_media_type_tsearch_stored">image/jpg</field>
                    <field name="images_tsearch">Rector and Visitors of the University of Virginia</field>
                    <field name="images_tsearch">Charlottesville, Va.</field>
                    <field name="identifier_e_stored">${meta.meta.SourceFile}</field>

                    <field name="images_tsearch">https://iiif-dev.internal.lib.virginia.edu/addison/${ meta.meta.jp2Path.replace(/.*\/(.+)\/(.+)\/(.+)\/(.+)\.jp2/i,"$1$2$3$4") }/full/!250,250/0/default.jpg</field>
                    <field name="data_source_str_stored">iiif-dev</field>
                    <field name="url_label_str_stored">View Online</field>
                    <field name="images_tsearch">${ meta.meta.SourceFile.replace('/Volumes/lib_content107','') }</field>
                    <field name="images_tsearch">${
                        meta.curated.Title? 
                            meta.curated.Title: 
                            file.replace(/.*\/Shoots \d\d\d\d\/(.+)\/.*\.webp/,"$1").replace('/', " - ")+" - Untitled"
                    }</field>
                    <field name="title_tsearch_stored">${
                        meta.curated.Title? 
                            meta.curated.Title: 
                            file.replace(/.*\/Shoots \d\d\d\d\/(.+)\/.*\.webp/,"$1").replace('/', " - ")+" - Untitled"
                    }</field>
                    ${ meta.curated.Description? 
                        `<field name="abstract_tsearch_stored">${ meta.curated.Description }</field>`:
                        ''
                    }
                    <field name="orig_creator_tsearch_stored">Addison, Dan</field>
                    <field name="orig_date_created_tsearch_stored">${ createDateFromMeta(meta.meta).year }</field>
                    <field name="work_type_tsearch_stored">University of Virginia minor and significant moments</field>
                    <field name="author_facet_tsearchf_stored">Addison, Dan (American Photographer) (work creator)</field>
                    <field name="work_creator_tsearch_stored">Addison, Dan (American Photographer)</field>
                    <field name="work_date_tsearch_stored">${ createDateFromMeta(meta.meta).year }</field>
                    ${ meta.curated.Description? 
                        `<field name="work_abstract_summary_tsearch_stored">${ meta.curated.Description }</field>`:
                        ''
                    }
                    <field name="images_tsearch">Dan Addison Archive</field>
                    <field name="images_tsearch">Addison, Dan</field>
                    <field name="rs_uri_a">http://rightsstatements.org/vocab/InC/1.0/</field>
                    ${ meta.classify.map(tag=>{return tag.probability>.50? `<field name="subject_tsearchf_stored">${tag.className}</field>`:''}).join('\n') }
                    <field name="digital_collection_tsearchf_stored">Dan Addison Archive</field>
                </doc>
            </add>
        `;
        writeFileSync(`${argv.out}addison-${meta.meta.UUID.replace(/\-/g,'')}.xml`, doc)
        console.log(`Wrote out meta for ${meta.meta.UUID.replace(/\-/g,'')}`)
    }
}

async function doit(){
    await walkImageFiles(argv.in, getMeta);
}

doit();