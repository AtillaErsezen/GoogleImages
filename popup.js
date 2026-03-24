document.addEventListener('DOMContentLoaded', () => {
    const folderInput = document.getElementById('folderName');
    const fileInput = document.getElementById('fileName');
    const activeCheckbox = document.getElementById('isActive');
    const saveBtn = document.getElementById('saveBtn');
    const resetBtn = document.getElementById('resetBtn');
    const statusDiv = document.getElementById('status');

    // 1. Load existing settings
    chrome.storage.local.get(['folderName', 'fileName', 'isActive'], (res) => {
        folderInput.value = res.folderName || '';
        fileInput.value = res.fileName || '';
        activeCheckbox.checked = !!res.isActive;
    });

    // 2. Save settings logic
    saveBtn.addEventListener('click', () => {
        chrome.storage.local.set({
            folderName: folderInput.value.trim(),
            fileName: fileInput.value.trim(),
            isActive: activeCheckbox.checked
        }, () => {
            statusDiv.textContent = "Saved successfully!";
            statusDiv.style.color = "green";
            statusDiv.style.display = 'block';
            setTimeout(() => statusDiv.style.display = 'none', 2000);

            // Update the extension icon badge
            chrome.action.setBadgeText({ text: activeCheckbox.checked ? 'ON' : 'OFF' });
            chrome.action.setBadgeBackgroundColor({ color: activeCheckbox.checked ? '#0a0' : '#888' });
        });
    });

    // 3. Reset counters logic
    resetBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to restart all image numbering at 001?")) {
            chrome.storage.local.set({ counters: {} }, () => {
                statusDiv.textContent = "Counters reset to 001!";
                statusDiv.style.color = "#dc3545";
                statusDiv.style.display = 'block';
                setTimeout(() => statusDiv.style.display = 'none', 2000);
            });
        }
    });
});