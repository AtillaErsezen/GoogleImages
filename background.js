chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'downloadImage') {
        chrome.storage.local.get(['folderName'], (res) => {

            let finalFolder = '';

            // 1. Use manual folder if provided
            if (res.folderName && res.folderName.trim() !== '') {
                finalFolder = res.folderName.trim();
            }
            // 2. Otherwise, use the search query from Google
            else if (request.query) {
                // Sanitize: "golden retriever" -> "golden_retriever"
                finalFolder = request.query.toLowerCase().replace(/\s+/g, '_');
            }
            // 3. Absolute fallback
            else {
                finalFolder = 'Unsorted';
            }

            let finalFilename = 'image.jpg';
            if (!request.url.startsWith('data:')) {
                try {
                    const urlObj = new URL(request.url);
                    finalFilename = urlObj.pathname.split('/').pop() || 'image.jpg';
                } catch (e) { }
            } else {
                // For base64 thumbnails, use a timestamp to avoid overwriting
                finalFilename = `img_${Date.now()}.jpg`;
            }

            chrome.downloads.download({
                url: request.url,
                filename: `${finalFolder}/${finalFilename}`,
                saveAs: false
            });
        });
    }
});