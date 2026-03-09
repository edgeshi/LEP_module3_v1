function completeSubmodule4() {
    let curr = parseInt(localStorage.getItem('module3_unlockLevel') || '1');
    if (curr < 5) localStorage.setItem('module3_unlockLevel', '5');

    document.getElementById('successTxt').style.display = 'block';

    // We can also trigger the global sync right from here so the download button mounts instantly
    if (typeof syncNotesState === 'function') {
        syncNotesState();
    }
}
