document.addEventListener('DOMContentLoaded', () => {
    const folderInput = document.getElementById('folderName');
    const fileInput = document.getElementById('fileName');
    const activeCheckbox = document.getElementById('isActive');
    const saveBtn = document.getElementById('saveBtn');

    // Load existing settings
    chrome.storage.local.get(['folderName', 'fileName', 'isActive'], (res) => {
        folderInput.value = res.folderName || '';
        fileInput.value = res.fileName || '';
        activeCheckbox.checked = !!res.isActive;
    });

    saveBtn.addEventListener('click', () => {
        chrome.storage.local.set({
            folderName: folderInput.value.trim(),
            fileName: fileInput.value.trim(),
            isActive: activeCheckbox.checked
        }, () => {
            const status = document.getElementById('status');
            status.style.display = 'block';
            setTimeout(() => status.style.display = 'none', 2000);
        });
    });
});