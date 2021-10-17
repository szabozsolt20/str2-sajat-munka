function uzenetKuldes() {
    let nevInput = document.querySelector('form#uzenoForm input#name');
    let emailInput = document.querySelector('form#uzenoForm input#email');
    let uzenetTextrea = document.querySelector('form#uzenoForm textarea#uzenet');

    let nev=nevInput.value;
    let email=emailInput.value;
    let uzenet=uzenetTextrea.value;


    if ((nev.length < 5) || (nev.replaceAll(' ','') == '')) {
        alert("A név legalább 5 karakter hosszú legyen!");

    }

    if (email.indexOf('@')==-1 || email.indexOf('.')==-1 ) {
        alert("Az emailcím nem megfelelő formátumú!");
    }

    if (uzenet.length < 20) {
        alert("Az üzenet legalább 20 karakter hosszú legyen!");

    }
  
    
}