import exifr from 'exifr';

export async function getMetadata(filePath) {
    const exif = await exifr.parse(filePath, { xmp: true });
    return exif;
}
