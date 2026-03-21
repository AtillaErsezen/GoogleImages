let isActive = false;

// Check initial state
chrome.storage.local.get(['isActive'], (res) => {
    isActive = !!res.isActive;
});

// Listen for toggle changes
chrome.storage.onChanged.addListener((changes) => {
    if (changes.isActive) {
        isActive = changes.isActive.newValue;
    }
});

// A helper function to hunt down the image URL, even through overlays
function findImageUrl(element) {
    // 1. Did we click directly on an image?
    if (element.tagName.toLowerCase() === 'img' && element.src) {
        return element.src;
    }

    // 2. Did we click on an overlay? Let's check the parent container for an image tag.
    if (element.parentElement) {
        const hiddenImg = element.parentElement.querySelector('img');
        if (hiddenImg && hiddenImg.src) {
            return hiddenImg.src;
        }
    }

    // 3. Does the element have a CSS background-image?
    const bgImage = window.getComputedStyle(element).backgroundImage;
    if (bgImage && bgImage !== 'none') {
        const match = bgImage.match(/^url\(['"]?(.+?)['"]?\)$/);
        if (match && match[1]) {
            return match[1];
        }
    }

    return null;
}

// Notice the 'true' at the end! This uses the Capture Phase.
document.addEventListener('contextmenu', (event) => {
    if (!isActive) return;

    const imageUrl = findImageUrl(event.target);

    if (imageUrl) {
        event.preventDefault(); // Stop the default browser menu
        event.stopPropagation(); // Stop Google's scripts from overriding us

        chrome.runtime.sendMessage({
            action: 'downloadImage',
            url: imageUrl
        });
    }
}, true); // <-- CRITICAL: 'true' intercepts the click BEFORE the website's JS does.