let isActive = false;

chrome.storage.local.get(['isActive'], (res) => { isActive = !!res.isActive; });
chrome.storage.onChanged.addListener((changes) => {
    if (changes.isActive) isActive = changes.isActive.newValue;
});

function getGoogleSearchQuery() {
    // 1. Try to get it from the search input box directly
    const searchInput = document.querySelector('input[name="q"]');
    if (searchInput && searchInput.value) {
        return searchInput.value.trim();
    }
    // 2. Fallback: Try to get it from the URL parameters
    const params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
}

function findImageUrl(element) {
    if (element.tagName.toLowerCase() === 'img' && element.src) return element.src;
    if (element.parentElement) {
        const hiddenImg = element.parentElement.querySelector('img');
        if (hiddenImg && hiddenImg.src) return hiddenImg.src;
    }
    return null;
}

document.addEventListener('contextmenu', (event) => {
    if (!isActive) return;

    const imageUrl = findImageUrl(event.target);
    if (imageUrl) {
        event.preventDefault();
        event.stopPropagation();

        // Get the search query (e.g., "golden retriever")
        const searchQuery = getGoogleSearchQuery();

        chrome.runtime.sendMessage({
            action: 'downloadImage',
            url: imageUrl,
            query: searchQuery
        });
    }
}, true);