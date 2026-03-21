// Set the default state to OFF when first installed
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ isActive: false });
    chrome.action.setBadgeText({ text: 'OFF' });
    chrome.action.setBadgeBackgroundColor({ color: '#888' });
});

// Toggle the ON/OFF state when the extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
    chrome.storage.local.get(['isActive'], (res) => {
        const newState = !res.isActive;
        chrome.storage.local.set({ isActive: newState });

        // Update the visual badge on the icon
        chrome.action.setBadgeText({ text: newState ? 'ON' : 'OFF' });
        chrome.action.setBadgeBackgroundColor({ color: newState ? '#0a0' : '#888' });
    });
});

// Listen for messages from the content script to download the image
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'downloadImage') {
        chrome.downloads.download({
            url: request.url,
            saveAs: false // This bypasses the "Save As..." popup
        });
    }
});