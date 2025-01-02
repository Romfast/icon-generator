import JSZip from 'jszip';
    import { saveAs } from 'file-saver';

    const textInput = document.getElementById('text');
    const fontFamilySelect = document.getElementById('font-family');
    const fontSizeInput = document.getElementById('font-size');
    const fontColorInput = document.getElementById('font-color');
    const backgroundColorInput = document.getElementById('background-color');
    const backgroundShapeSelect = document.getElementById('background-shape');
    const fontColorDisplay = document.getElementById('font-color-display');
    const backgroundColorDisplay = document.getElementById('background-color-display');
    const iconPreviewCanvas = document.getElementById('icon-preview');
    const downloadButton = document.getElementById('download-button');
    const iconSizes = [16, 32, 180, 192, 512];
    const icoSize = 48;

    function updateIconPreview() {
        const text = textInput.value;
        const fontFamily = fontFamilySelect.value;
        const fontSize = parseInt(fontSizeInput.value, 10);
        const fontColor = fontColorInput.value;
        const backgroundColor = backgroundColorInput.value;
        const backgroundShape = backgroundShapeSelect.value;
        const ctx = iconPreviewCanvas.getContext('2d');
        const canvasSize = iconPreviewCanvas.width;

        ctx.clearRect(0, 0, canvasSize, canvasSize);

        // Draw background
        ctx.fillStyle = backgroundColor;
        if (backgroundShape === 'square') {
            ctx.fillRect(0, 0, canvasSize, canvasSize);
        } else if (backgroundShape === 'rounded') {
            const borderRadius = canvasSize * 0.2;
            ctx.beginPath();
            ctx.moveTo(borderRadius, 0);
            ctx.lineTo(canvasSize - borderRadius, 0);
            ctx.arcTo(canvasSize, 0, canvasSize, borderRadius, borderRadius);
            ctx.lineTo(canvasSize, canvasSize - borderRadius);
            ctx.arcTo(canvasSize, canvasSize, canvasSize - borderRadius, canvasSize, borderRadius);
            ctx.lineTo(borderRadius, canvasSize);
            ctx.arcTo(0, canvasSize, 0, canvasSize - borderRadius, borderRadius);
            ctx.lineTo(0, borderRadius);
            ctx.arcTo(0, 0, borderRadius, 0, borderRadius);
            ctx.closePath();
            ctx.fill();
        } else if (backgroundShape === 'circle') {
            ctx.beginPath();
            ctx.arc(canvasSize / 2, canvasSize / 2, canvasSize / 2, 0, 2 * Math.PI);
            ctx.fill();
        }

        // Draw text
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.fillStyle = fontColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, canvasSize / 2, canvasSize / 2);
    }

    function updateColorDisplay() {
        fontColorDisplay.textContent = fontColorInput.value;
        fontColorDisplay.style.backgroundColor = fontColorInput.value;
        backgroundColorDisplay.textContent = backgroundColorInput.value;
        backgroundColorDisplay.style.backgroundColor = backgroundColorInput.value;
    }

    function generateIcon(size) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        const text = textInput.value;
        const fontFamily = fontFamilySelect.value;
        const fontSize = parseInt(fontSizeInput.value, 10);
        const fontColor = fontColorInput.value;
        const backgroundColor = backgroundColorInput.value;
        const backgroundShape = backgroundShapeSelect.value;

        ctx.clearRect(0, 0, size, size);

        // Draw background
        ctx.fillStyle = backgroundColor;
        if (backgroundShape === 'square') {
            ctx.fillRect(0, 0, size, size);
        } else if (backgroundShape === 'rounded') {
            const borderRadius = size * 0.2;
            ctx.beginPath();
            ctx.moveTo(borderRadius, 0);
            ctx.lineTo(size - borderRadius, 0);
            ctx.arcTo(size, 0, size, borderRadius, borderRadius);
            ctx.lineTo(size, size - borderRadius);
            ctx.arcTo(size, size, size - borderRadius, size, borderRadius);
            ctx.lineTo(borderRadius, size);
            ctx.arcTo(0, size, 0, size - borderRadius, borderRadius);
            ctx.lineTo(0, borderRadius);
            ctx.arcTo(0, 0, borderRadius, 0, borderRadius);
            ctx.closePath();
            ctx.fill();
        } else if (backgroundShape === 'circle') {
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
            ctx.fill();
        }

        // Draw text
        ctx.font = `${fontSize * (size / 128)}px ${fontFamily}`;
        ctx.fillStyle = fontColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, size / 2, size / 2);

        return canvas.toDataURL('image/png');
    }

    function generateIco(size) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        const text = textInput.value;
        const fontFamily = fontFamilySelect.value;
        const fontSize = parseInt(fontSizeInput.value, 10);
        const fontColor = fontColorInput.value;
        const backgroundColor = backgroundColorInput.value;
        const backgroundShape = backgroundShapeSelect.value;

        ctx.clearRect(0, 0, size, size);

        // Draw background
        ctx.fillStyle = backgroundColor;
        if (backgroundShape === 'square') {
            ctx.fillRect(0, 0, size, size);
        } else if (backgroundShape === 'rounded') {
            const borderRadius = size * 0.2;
            ctx.beginPath();
            ctx.moveTo(borderRadius, 0);
            ctx.lineTo(size - borderRadius, 0);
            ctx.arcTo(size, 0, size, borderRadius, borderRadius);
            ctx.lineTo(size, size - borderRadius);
            ctx.arcTo(size, size, size - borderRadius, size, borderRadius);
            ctx.lineTo(borderRadius, size);
            ctx.arcTo(0, size, 0, size - borderRadius, borderRadius);
            ctx.lineTo(0, borderRadius);
            ctx.arcTo(0, 0, borderRadius, 0, borderRadius);
            ctx.closePath();
            ctx.fill();
        } else if (backgroundShape === 'circle') {
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
            ctx.fill();
        }

        // Draw text
        ctx.font = `${fontSize * (size / 128)}px ${fontFamily}`;
        ctx.fillStyle = fontColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, size / 2, size / 2);

        return canvas.toDataURL('image/png');
    }

    async function downloadIcons() {
        const zip = new JSZip();

        for (const size of iconSizes) {
            const iconDataUrl = generateIcon(size);
            const iconBlob = await fetch(iconDataUrl).then(res => res.blob());
            zip.file(`icon_${size}x${size}.png`, iconBlob);
        }

        const icoDataUrl = generateIco(icoSize);
        const icoBlob = await fetch(icoDataUrl).then(res => res.blob());
        zip.file(`icon_${icoSize}x${icoSize}.png`, icoBlob);

        const icoData = await convertPngToIco(icoBlob);
        zip.file('icon.ico', icoData, { binary: true });

        zip.generateAsync({ type: 'blob' }).then(blob => {
            saveAs(blob, 'icons.zip');
        });
    }

    function convertPngToIco(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function() {
                const pngData = new Uint8Array(reader.result);
                const icoData = createIco(pngData);
                resolve(icoData);
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(blob);
        });
    }

    function createIco(pngData) {
        const icoHeader = new Uint8Array(6);
        icoHeader[0] = 0; // Reserved
        icoHeader[1] = 0; // Reserved
        icoHeader[2] = 1; // Type (1 for ICO)
        icoHeader[3] = 0; // Number of images
        icoHeader[4] = 1; // Number of images
        icoHeader[5] = 0; // Number of images

        const imageHeader = new Uint8Array(16);
        imageHeader[0] = icoSize; // Width
        imageHeader[1] = icoSize; // Height
        imageHeader[2] = 0; // Color Palette
        imageHeader[3] = 0; // Reserved
        imageHeader[4] = 1; // Color Planes
        imageHeader[5] = 0; // Color Planes
        imageHeader[6] = 24; // Bits per pixel
        imageHeader[7] = 0; // Bits per pixel
        imageHeader[8] = pngData.length & 0xFF; // Size of image data
        imageHeader[9] = (pngData.length >> 8) & 0xFF; // Size of image data
        imageHeader[10] = (pngData.length >> 16) & 0xFF; // Size of image data
        imageHeader[11] = (pngData.length >> 24) & 0xFF; // Size of image data
        imageHeader[12] = 22; // Offset to image data
        imageHeader[13] = 0; // Offset to image data
        imageHeader[14] = 0; // Offset to image data
        imageHeader[15] = 0; // Offset to image data

        const ico = new Uint8Array(icoHeader.length + imageHeader.length + pngData.length);
        ico.set(icoHeader, 0);
        ico.set(imageHeader, icoHeader.length);
        ico.set(pngData, icoHeader.length + imageHeader.length);

        return ico;
    }

    textInput.addEventListener('input', updateIconPreview);
    fontFamilySelect.addEventListener('change', updateIconPreview);
    fontSizeInput.addEventListener('input', updateIconPreview);
    fontColorInput.addEventListener('input', () => {
        updateColorDisplay();
        updateIconPreview();
    });
    backgroundColorInput.addEventListener('input', () => {
        updateColorDisplay();
        updateIconPreview();
    });
    backgroundShapeSelect.addEventListener('change', updateIconPreview);
    downloadButton.addEventListener('click', downloadIcons);

    updateIconPreview();
    updateColorDisplay();
