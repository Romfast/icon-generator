// DOM Elements
const textInput = document.getElementById('text');
const fontFamilySelect = document.getElementById('font-family');
const fontVariantSelect = document.getElementById('font-variant');
const fontSizeInput = document.getElementById('font-size');

// Font variant availability map
const fontVariants = {
    // Sans Serif fonts
    'Roboto': ['Regular', 'Bold', 'Italic', 'Bold Italic'],
    'Open Sans': ['Regular', 'Bold', 'Italic', 'Bold Italic'],
    'Montserrat': ['Regular', 'Bold', 'Italic', 'Bold Italic'],
    'Lato': ['Regular', 'Bold', 'Italic', 'Bold Italic'],
    'Poppins': ['Regular', 'Bold', 'Italic', 'Bold Italic'],
    'Source Sans Pro': ['Regular', 'Bold', 'Italic', 'Bold Italic'],
    'Oswald': ['Regular', 'Bold'],
    'Raleway': ['Regular', 'Bold', 'Italic', 'Bold Italic'],
    'Nunito': ['Regular', 'Bold', 'Italic', 'Bold Italic'],
    'Ubuntu': ['Regular', 'Bold', 'Italic', 'Bold Italic'],
    'Quicksand': ['Regular', 'Bold'],
    'Josefin Sans': ['Regular', 'Bold', 'Italic', 'Bold Italic'],
    'Comfortaa': ['Regular', 'Bold'],
    
    // Serif fonts
    'Playfair Display': ['Regular', 'Bold', 'Italic', 'Bold Italic'],
    'Merriweather': ['Regular', 'Bold', 'Italic', 'Bold Italic'],
    'Abril Fatface': ['Regular'],
    
    // Display fonts
    'Righteous': ['Regular'],
    'Fredoka One': ['Regular'],
    'Concert One': ['Regular'],
    'Bebas Neue': ['Regular'],
    
    // Handwriting fonts
    'Leckerli One': ['Regular'],
    'Lobster': ['Regular'],
    'Pacifico': ['Regular'],
    'Dancing Script': ['Regular', 'Bold'],
    'Caveat': ['Regular', 'Bold'],
    'Sacramento': ['Regular'],
    'Permanent Marker': ['Regular'],
    'Shadows Into Light': ['Regular'],
    'Satisfy': ['Regular'],
    'Great Vibes': ['Regular'],
    'Courgette': ['Regular']
};

function updateFontVariants() {
    const selectedFamily = fontFamilySelect.value;
    const availableVariants = fontVariants[selectedFamily] || ['Regular'];
    
    // Save current variant if possible
    const currentVariant = fontVariantSelect.value;
    
    // Clear and rebuild variant options
    fontVariantSelect.innerHTML = '';
    availableVariants.forEach(variant => {
        const option = document.createElement('option');
        option.value = variant;
        option.textContent = variant;
        fontVariantSelect.appendChild(option);
    });
    
    // Restore previous variant if available, otherwise use first available
    if (availableVariants.includes(currentVariant)) {
        fontVariantSelect.value = currentVariant;
    }
    
    // Hide variant selector if only one variant is available
    fontVariantSelect.parentElement.style.display = availableVariants.length > 1 ? 'flex' : 'none';
}
const fontColorInput = document.getElementById('font-color');
const backgroundColorInput = document.getElementById('background-color');
const backgroundShapeSelect = document.getElementById('background-shape');
const fontColorDisplay = document.getElementById('font-color-display');
const backgroundColorDisplay = document.getElementById('background-color-display');
const iconPreviewCanvas = document.getElementById('icon-preview');
const downloadButton = document.getElementById('download-button');
const iconSizes = [16, 32, 180, 192, 512];
const icoSize = 48;

// Create a font loading promise map
const loadedFonts = new Map();

async function loadFont(fontFamily) {
    if (loadedFonts.has(fontFamily)) {
        return loadedFonts.get(fontFamily);
    }

    const fontPromise = document.fonts.load(`16px "${fontFamily}"`);
    loadedFonts.set(fontFamily, fontPromise);
    return fontPromise;
}

function parseFontDetails() {
    const family = fontFamilySelect.value;
    const variant = fontVariantSelect.value;
    
    return {
        family: family,
        weight: variant.includes('Bold') ? '700' : '400',
        style: variant.includes('Italic') ? 'italic' : 'normal'
    };
}

async function updateIconPreview() {
    const text = textInput.value;
    const fontSize = parseInt(fontSizeInput.value, 10);
    const fontColor = fontColorInput.value;
    const backgroundColor = backgroundColorInput.value;
    const backgroundShape = backgroundShapeSelect.value;
    const fontDetails = parseFontDetails();
    
    try {
        await loadFont(fontDetails.family);
    } catch (err) {
        console.warn(`Failed to load font: ${fontDetails.family}`, err);
    }

    const ctx = iconPreviewCanvas.getContext('2d');
    const canvasSize = iconPreviewCanvas.width;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

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

    // Draw text with improved centering
    ctx.fillStyle = fontColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${fontDetails.style} ${fontDetails.weight} ${fontSize}px "${fontDetails.family}"`;
    
    // Calculate metrics for better vertical centering
    const metrics = ctx.measureText(text);
    const actualHeight = (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) || fontSize;
    const yOffset = (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2;
    
    // Add subtle shadow for better visibility
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 1;
    
    // Draw text with corrected vertical position
    ctx.fillText(text, canvasSize / 2, canvasSize / 2 + yOffset);
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
}

function updateColorDisplay() {
    fontColorDisplay.textContent = fontColorInput.value;
    fontColorDisplay.style.backgroundColor = fontColorInput.value;
    fontColorDisplay.style.color = calculateContrastColor(fontColorInput.value);
    
    backgroundColorDisplay.textContent = backgroundColorInput.value;
    backgroundColorDisplay.style.backgroundColor = backgroundColorInput.value;
    backgroundColorDisplay.style.color = calculateContrastColor(backgroundColorInput.value);
}

function calculateContrastColor(hexColor) {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
}

async function generateIcon(size) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    const text = textInput.value;
    const fontSize = parseInt(fontSizeInput.value, 10);
    const fontColor = fontColorInput.value;
    const backgroundColor = backgroundColorInput.value;
    const backgroundShape = backgroundShapeSelect.value;
    const fontDetails = parseFontDetails();

    try {
        await loadFont(fontDetails.family);
    } catch (err) {
        console.warn(`Failed to load font: ${fontDetails.family}`, err);
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

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
    ctx.fillStyle = fontColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${fontDetails.style} ${fontDetails.weight} ${fontSize * (size / 128)}px "${fontDetails.family}"`;
    
    // Calculate metrics for better vertical centering
    const metrics = ctx.measureText(text);
    const actualHeight = (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) || fontSize;
    const yOffset = (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2;
    
    // Add subtle shadow for better visibility on smaller sizes
    if (size < 64) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 1;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 1;
    }
    
    ctx.fillText(text, size / 2, size / 2 + yOffset);
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    return canvas.toDataURL('image/png');
}

async function downloadIcons() {
    downloadButton.disabled = true;
    downloadButton.textContent = 'Generating...';

    try {
        const zip = new JSZip();

        // Generate PNG files for different sizes
        for (const size of iconSizes) {
            const iconDataUrl = await generateIcon(size);
            const iconBlob = await fetch(iconDataUrl).then(res => res.blob());
            zip.file(`icon_${size}x${size}.png`, iconBlob);
        }

        // Generate ICO file
        const icoDataUrl = await generateIcon(icoSize);
        const icoBlob = await fetch(icoDataUrl).then(res => res.blob());
        const icoData = await convertPngToIco(icoBlob);
        zip.file('favicon.ico', icoData, { binary: true });

        // Generate and download the zip file
        const blob = await zip.generateAsync({ type: 'blob' });
        saveAs(blob, 'icons.zip');
    } catch (error) {
        console.error('Error generating icons:', error);
        alert('An error occurred while generating icons. Please try again.');
    } finally {
        downloadButton.disabled = false;
        downloadButton.textContent = 'Download';
    }
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
    imageHeader[9] = (pngData.length >> 8) & 0xFF;
    imageHeader[10] = (pngData.length >> 16) & 0xFF;
    imageHeader[11] = (pngData.length >> 24) & 0xFF;
    imageHeader[12] = 22; // Offset to image data
    imageHeader[13] = 0;
    imageHeader[14] = 0;
    imageHeader[15] = 0;

    const ico = new Uint8Array(icoHeader.length + imageHeader.length + pngData.length);
    ico.set(icoHeader, 0);
    ico.set(imageHeader, icoHeader.length);
    ico.set(pngData, icoHeader.length + imageHeader.length);

    return ico;
}

// Debounce function to limit preview updates
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Event Listeners
textInput.addEventListener('input', debounce(updateIconPreview, 150));
fontFamilySelect.addEventListener('change', () => {
    updateFontVariants();
    updateIconPreview();
});
fontVariantSelect.addEventListener('change', updateIconPreview);
fontSizeInput.addEventListener('input', debounce(updateIconPreview, 150));
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

// Initialize
updateFontVariants();
updateIconPreview();
updateColorDisplay();