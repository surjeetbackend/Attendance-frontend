export const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'anonymous'; // for CORS
        image.onload = () => resolve(image);
        image.onerror = (error) => reject(error);
        image.src = url;
    });