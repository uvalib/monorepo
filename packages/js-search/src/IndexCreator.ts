import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';

export type IndexType = 'flexsearch' | 'fuse';

export class IndexCreator {
  private index: any;
  private inputDir: string;
  private outputIndex?: string;
  private filenames: string[] = [];
  private indexType: IndexType;
  private storedMeta?: string | string[];

  constructor(inputDir: string = '', outputIndex?: string, indexType: IndexType = 'flexsearch', storedMeta?: string | string[]) {
    this.inputDir = inputDir;
    this.outputIndex = outputIndex;
    this.indexType = indexType;
    this.storedMeta = storedMeta;
  }

  private async gatherUniqueFrontmatterFields(): Promise<string[]> {
    const uniqueFields = new Set<string>();
    const files = fs.readdirSync(this.inputDir);
    const markdownFiles = files.filter((file) => path.extname(file) === '.md');

    for (const file of markdownFiles) {
      const filePath = path.join(this.inputDir, file);
      const rawContent = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(rawContent);
      Object.keys(data).forEach(field => uniqueFields.add(field));
    }

    return Array.from(uniqueFields);
  }

  private async processFile(file: string, index: number) {
    const filePath = path.join(this.inputDir, file);
    const rawContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(rawContent);
    const md = new MarkdownIt();
    const htmlContent = md.render(content);
    const textContent = htmlContent.replace(/<[^>]*>/g, '');

    if (data && textContent.trim() !== '' && Object.keys(data).length > 0) {
      const docToAdd = {
        id: index,
        content: textContent,
        ...data
      };

      if (this.indexType === 'flexsearch') {
        this.index.add(docToAdd);
      } else if (this.indexType === 'fuse') {
        this.index.push(docToAdd);
      }

      this.filenames.push(file);
    }
  }

  private async saveIndex(): Promise<Record<string, any>> {
    return new Promise((resolve, reject) => {
      const exportedIndex: Record<string, any> = {};
      let count = 0;
      const numberOfKeysToExport = Object.keys(this.index.index).length * 3 + 3;

      this.index.export((key: any, data: any) => {
        exportedIndex[key] = data;
        count += 1;

        if (count === numberOfKeysToExport) {
          resolve(exportedIndex);
        }
      });
    });
  }

  async createIndex(): Promise<string | void> {
    let storeFields: string[] = [];

    if (this.storedMeta) {
      storeFields = Array.isArray(this.storedMeta) ? this.storedMeta : [this.storedMeta];
    } else {
      storeFields = await this.gatherUniqueFrontmatterFields();
    }

    if (this.indexType === 'flexsearch') {
      const { Document } = await import('flexsearch');
      this.index = new Document({
        document: {
          id: "id",
          index: ["content"],
          store: storeFields
        }
      });
    } else if (this.indexType === 'fuse') {
      this.index = [];
    }

    const files = fs.readdirSync(this.inputDir);
    const markdownFiles = files.filter((file) => path.extname(file) === '.md');

    for (let i = 0; i < markdownFiles.length; i++) {
      await this.processFile(markdownFiles[i], i);
    }

    if (this.indexType === 'flexsearch') {
      const exportedIndex = await this.saveIndex();
      if (this.outputIndex) {
        this.writeIndexToFile(exportedIndex);
      } else {
        return JSON.stringify({
          indexType: this.indexType,
          index: exportedIndex,
          filenames: this.filenames,
        });
      }
    } else if (this.indexType === 'fuse') {
      if (this.outputIndex) {
        this.writeIndexToFile(this.index);
      } else {
        return JSON.stringify({
          indexType: this.indexType,
          index: this.index,
          filenames: this.filenames,
        });
      }
    }
  }

  private writeIndexToFile(indexData: any) {
    try {
      const outputData = {
        indexType: this.indexType,
        index: indexData,
        filenames: this.filenames,
      };

      if (this.outputIndex) {
        fs.writeFileSync(this.outputIndex, JSON.stringify(outputData));
        console.log(`Search index written to ${this.outputIndex}.`);
      }
    } catch (error) {
      console.error(`Error writing search index: ${error}`);
    }
  }
}
