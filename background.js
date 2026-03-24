chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'downloadImage') {
        // Fetch settings AND the current counters from storage
        chrome.storage.local.get(['folderName', 'fileName', 'counters'], (res) => {

            // 1. Determine Folder Name (Manual or Search Query)
            let folder = (res.folderName && res.folderName.trim() !== '')
                ? res.folderName.trim()
                : (request.query ? request.query.toLowerCase().replace(/\s+/g, '_') : 'unsorted');

            // 2. Determine Base Filename (Manual or Search Query)
            let baseName = (res.fileName && res.fileName.trim() !== '')
                ? res.fileName.trim()
                : (request.query ? request.query.toLowerCase().replace(/\s+/g, '_') : 'image');

            // 3. Handle Auto-Increment Counter
            let counters = res.counters || {};
            // We track counts per "baseName" so different classes have their own numbering
            let currentCount = (counters[baseName] || 0) + 1;

            // Update storage with the new count immediately
            counters[baseName] = currentCount;
            chrome.storage.local.set({ counters: counters });

            // 4. Format the number with leading zeros (e.g., 001, 002)
            const paddedCount = String(currentCount).padStart(3, '0');

            // 5. Determine Extension
            let extension = '.jpg';
            if (!request.url.startsWith('data:')) {
                const parts = request.url.split('.');
                if (parts.length > 1) {
                    const ext = parts.pop().split(/[#?]/)[0];
                    if (ext.length <= 4) extension = '.' + ext;
                }
            }

            // Final Path: folder/baseName_001.jpg
            const finalPath = `${folder}/${baseName}_${paddedCount}${extension}`;

            chrome.downloads.download({
                url: request.url,
                filename: finalPath,
                saveAs: false
            });
        });
    }
});