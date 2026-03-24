chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'downloadImage') {
        chrome.storage.local.get(['folderName', 'fileName'], (res) => {

            // 1. Determine the Folder
            let finalFolder = (res.folderName && res.folderName.trim() !== '')
                ? res.folderName.trim()
                : (request.query ? request.query.toLowerCase().replace(/\s+/g, '_') : 'Unsorted');

            // 2. Determine the Base Filename
            let baseName = (res.fileName && res.fileName.trim() !== '')
                ? res.fileName.trim()
                : (request.query ? request.query.toLowerCase().replace(/\s+/g, '_') : 'image');

            // 3. Add a timestamp for uniqueness (Crucial for CV datasets)
            // Format: label_1711283200.jpg
            const timestamp = Math.floor(Date.now() / 1000);

            // 4. Determine Extension (detecting from URL or defaulting to .jpg)
            let extension = '.jpg';
            if (!request.url.startsWith('data:')) {
                const parts = request.url.split('.');
                if (parts.length > 1) {
                    const ext = parts.pop().split(/[#?]/)[0];
                    if (ext.length <= 4) extension = '.' + ext;
                }
            }

            const finalPath = `${finalFolder}/${baseName}_${timestamp}${extension}`;

            chrome.downloads.download({
                url: request.url,
                filename: finalPath,
                saveAs: false
            });
        });
    }
});