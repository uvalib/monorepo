import exifr from 'exifr';

export async function getMetadata(filePath) {
    try {
        const exif = await exifr.parse(filePath, { xmp: true });
        return exif;
    } catch (error) {
        console.error(`Error extracting metadata for ${filePath}: ${error.message}`);
        return null;
    }
}
