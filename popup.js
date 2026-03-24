document.addEventListener('DOMContentLoaded', () => {
    const folderInput = document.getElementById('folderName');
    const activeCheckbox = document.getElementById('isActive');
    const saveBtn = document.getElementById('saveBtn');
    const statusDiv = document.getElementById('status');

    // 1. Load existing settings when the popup opens
    chrome.storage.local.get(['folderName', 'isActive'], (res) => {
        if (res.folderName) folderInput.value = res.folderName;
        activeCheckbox.checked = !!res.isActive;
    });

    // 2. Save settings when the button is clicked
    saveBtn.addEventListener('click', () => {
        // Clean up the folder name (remove accidental leading/trailing slashes)
        let folder = folderInput.value.trim().replace(/^\/+|\/+$/g, '');

        chrome.storage.local.set({
            folderName: folder,
            isActive: activeCheckbox.checked
        }, () => {
            // Show a temporary success message
            statusDiv.style.display = 'block';
            setTimeout(() => statusDiv.style.display = 'none', 2000);

            // Update the ON/OFF badge on the extension icon
            chrome.action.setBadgeText({ text: activeCheckbox.checked ? 'ON' : 'OFF' });
            chrome.action.setBadgeBackgroundColor({ color: activeCheckbox.checked ? '#0a0' : '#888' });
        });
    });
});