import { Index } from 'flexsearch';
import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';


export class IndexCreator {
  private index: Index;
  private inputDir: string;
  private outputIndex: string;

  constructor(inputDir: string, outputIndex: string) {
    this.index = new Index({
      charset: "latin",
      preset: 'match',
      tokenize: 'strict',
      cache: false
    });
    this.inputDir = inputDir;
    this.outputIndex = outputIndex;
  }

  private processFile(file: string, index: number) {
    const filePath = path.join(this.inputDir, file);
    const rawContent = fs.readFileSync(filePath, 'utf8');
    console.log(rawContent)

    const { data, content } = matter(rawContent);

    if (data && content && content.trim() !== '' && Object.keys(data).length > 0) {
      const docToAdd = {
        id: index, // use index as the document ID
        text: content,
      };

      this.index.add(docToAdd.id, docToAdd.text);
    }
   
  }

  createIndex() {
    const files = fs.readdirSync(this.inputDir);

    const markdownFiles = files.filter((file) => path.extname(file) === '.md');

    for (let i = 0; i < markdownFiles.length; i++) {
        this.processFile(markdownFiles[i], i);
    }

    const numberOfKeysToExport = 4;

    let count = 0;
    const exportedIndex: Record<string, any> = {};

    this.index.export((key: any, data: any) => {
      exportedIndex[key] = data;
      count += 1;

      if (count === numberOfKeysToExport) {
        try {
          fs.writeFileSync(this.outputIndex, JSON.stringify(exportedIndex));
          console.log(`Search index written to ${this.outputIndex}.`);
        } catch (error) {
          console.error(`Error writing search index: ${error}`);
        }
      }
    });
  }
}
