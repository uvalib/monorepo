import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';

export type IndexType = 'flexsearch' | 'fuse';

export class IndexCreator {
  private index: any;
  private inputDir: string;
  private outputIndex: string;
  private filenames: string[];
  private indexType: IndexType;

  constructor(inputDir: string, outputIndex: string, indexType: IndexType = 'flexsearch') {
    this.inputDir = inputDir;
    this.outputIndex = outputIndex;
    this.filenames = [];
    this.indexType = indexType;
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
        text: textContent,
      };

      if (this.indexType === 'flexsearch') {
        this.index.add(docToAdd.id, docToAdd.text);
      } else if (this.indexType === 'fuse') {
        this.index.push(docToAdd);
      }

      this.filenames.push(file);
    }
  }

  async createIndex() {
    // Dynamic import based on index type
    if (this.indexType === 'flexsearch') {
      const { Index } = await import('flexsearch');
      this.index = new Index({
        charset: "latin",
        preset: 'match',
        tokenize: 'strict',
        cache: false
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
      const numberOfKeysToExport = 4;
      let count = 0;
      const exportedIndex: Record<string, any> = {};

      this.index.export((key: any, data: any) => {
        exportedIndex[key] = data;
        count += 1;

        if (count === numberOfKeysToExport) {
          this.writeIndexToFile(exportedIndex);
        }
      });
    } else if (this.indexType === 'fuse') {
      this.writeIndexToFile(this.index);
    }
  }

  private writeIndexToFile(indexData: any) {
    try {
      const outputData = {
        indexType: this.indexType,
        index: indexData,
        filenames: this.filenames,
      };

      fs.writeFileSync(this.outputIndex, JSON.stringify(outputData));
      console.log(`Search index written to ${this.outputIndex}.`);
    } catch (error) {
      console.error(`Error writing search index: ${error}`);
    }
  }
}