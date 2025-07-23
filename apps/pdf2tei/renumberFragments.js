import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fragmentsDir = path.join(__dirname, 'fragments');
const numberToSubtract = 6;

async function processDirectory(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    } else if (entry.isFile() && entry.name.startsWith('fragment-') && entry.name.endsWith('.json')) {
      await processFragmentFile(fullPath);
    }
  }
}

async function processFragmentFile(filePath) {
  try {
    const fileName = path.basename(filePath);
    const match = fileName.match(/fragment-(\d+)\.json/);

    if (!match) {
      console.log(`Skipping file with unexpected name format: ${fileName}`);
      return;
    }

    const originalNumber = parseInt(match[1], 10);
    if (isNaN(originalNumber) || originalNumber <= numberToSubtract) {
      console.log(`Skipping file (number is too small or invalid): ${fileName}`);
      return;
    }

    // 1. Calculate new number and new file path
    const newNumber = originalNumber - numberToSubtract;
    const newFileName = `fragment-${newNumber}.json`;
    const newFilePath = path.join(path.dirname(filePath), newFileName);

    // 2. Read and modify JSON content
    const content = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(content);

    if (data.tei && typeof data.tei === 'string') {
      data.tei = data.tei.replace(/<pb n="(\d+)"\/>/, (match, n) => {
        const pageNumber = parseInt(n, 10);
        if (!isNaN(pageNumber)) {
          const newPageNumber = pageNumber - numberToSubtract;
          return `<pb n="${newPageNumber}"/>`;
        }
        return match; // Return original if not a number
      });
    }

    // 3. Write to new file
    await fs.writeFile(newFilePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Created: ${newFilePath}`);

    // 4. Delete original file
    await fs.unlink(filePath);
    console.log(`Deleted: ${filePath}`);

  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

(async () => {
  try {
    console.log(`Starting renumbering process in: ${fragmentsDir}`);
    await processDirectory(fragmentsDir);
    console.log('Renumbering process completed.');
  } catch (error) {
    console.error('Failed to run renumbering script:', error);
  }
})();
