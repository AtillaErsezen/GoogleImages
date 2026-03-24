// Set defaults on install
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ isActive: false, folderName: 'QuickSaves' });
    chrome.action.setBadgeText({ text: 'OFF' });
    chrome.action.setBadgeBackgroundColor({ color: '#888' });
});

// Listen for the download message from content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'downloadImage') {

        // Fetch the custom folder name from storage
        chrome.storage.local.get(['folderName'], (res) => {

            // Format the folder path (add a slash if a folder is specified)
            let folderPrefix = '';
            if (res.folderName && res.folderName.trim() !== '') {
                folderPrefix = res.folderName.trim() + '/';
            }

            let finalFilename = 'quick_save_image.jpg';
            if (!request.url.startsWith('data:')) {
                try {
                    const urlObj = new URL(request.url);
                    const extractedName = urlObj.pathname.split('/').pop();
                    if (extractedName && extractedName.includes('.')) {
                        finalFilename = extractedName;
                    }
                } catch (e) { }
            }

            // Trigger the download
            chrome.downloads.download({
                url: request.url,
                filename: folderPrefix + finalFilename,
                saveAs: false
            });
        });
    }
});