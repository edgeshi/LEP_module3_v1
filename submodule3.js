function completeSubmodule3() {
    let curr = parseInt(localStorage.getItem('module3_unlockLevel') || '1');
    if (curr < 4) localStorage.setItem('module3_unlockLevel', '4');

    document.getElementById('successTxt').style.display = 'block';
}
