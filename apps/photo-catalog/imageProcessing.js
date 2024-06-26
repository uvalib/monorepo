import sharp from 'sharp';

export async function processImage(filePath, metadata, supportedResolutions) {
    // Convert image to JPEG and rotate it if necessary
    let image = sharp(filePath).jpeg();
    if (metadata.Orientation) {
        image = applyOrientation(image, metadata.Orientation);
    }
    const imageBuffer = await image.toBuffer();
    console.log(`Converted and possibly rotated ${filePath} to JPEG format`);

    const { width, height } = await sharp(imageBuffer).metadata();
    const bestRes = getBestResolution(width, height, supportedResolutions);

    const resizedImageBuffer = await sharp(imageBuffer)
        .resize({
            width: bestRes.width,
            height: bestRes.height,
            fit: 'contain',
            background: { r: 0, g: 0, b: 0 } // Change to white { r: 255, g: 255, b: 255 } if preferred
        })
        .toBuffer();
    console.log(`Resized ${filePath} to best resolution: ${bestRes.width}x${bestRes.height}`);

    // Create and save a WebP version of the original image resized to a max of 800px
    const webpImageBuffer = await sharp(filePath)
        .resize({ width: 800, height: 800, fit: 'inside' })
        .webp()
        .toBuffer();
    console.log(`Saved WebP image at ${filePath}`);

    return { resizedImageBuffer, webpImageBuffer };
}

export function applyOrientation(image, orientation) {
    switch (orientation) {
        case 'Rotate 90 CW':
            return image.rotate(90);
        case 'Rotate 180':
            return image.rotate(180);
        case 'Rotate 270 CW':
            return image.rotate(270);
        default:
            return image;
    }
}

export function getBestResolution(width, height, supportedResolutions) {
    return supportedResolutions.reduce((best, res) => {
        const resAspectRatio = res.width / res.height;
        const imageAspectRatio = width / height;
        
        const padWidth = res.width - (res.height * imageAspectRatio);
        const padHeight = res.height - (res.width / imageAspectRatio);

        const padding = Math.max(padWidth, 0) * res.height + Math.max(padHeight, 0) * res.width;

        return padding < best.padding ? { ...res, padding } : best;
    }, { width: 0, height: 0, padding: Infinity });
}
