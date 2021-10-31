        // Get the modal
        let modal = document.getElementById("myModal");
        let modalContent = document.getElementById("modal-content");

        // Get the button that opens the modal
        let btn = document.getElementById("myBtn");

        // Get the <span> element that closes the modal
        let span = document.getElementsByClassName("close")[0];
        let ok = document.getElementById("Ok");
        let cancel = document.getElementById("Cancel");


        // When the user clicks the button, open the modal 
        const megnyit=function () {
            modalContent.classList.remove("modal-content-ki");
            modalContent.classList.add("modal-content-be");
            modal.style.display = "flex";
            body.style.backgroundColor = `rgba(0, 0, 0, 0.7)`;
        }
        btn.onclick =megnyit; 

        // When the user clicks on <span> (x), or modal-buttons close the modal
        const bezar = function () {
            setTimeout(() => { modal.style.display = "none"}, 800);
            modalContent.classList.remove("modal-content-be");
            modalContent.classList.add("modal-content-ki");
        }

        span.onclick = bezar;
        ok.onclick = bezar;
        cancel.onclick = bezar;

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
            if (event.target == modal) {
                bezar();
            }
        }