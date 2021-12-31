const sortData = data => data.sort((a, b) => {
    let x = a.name.split(' ');
    let y = b.name.split(' ');

    return x[x.length - 1].toUpperCase() <= y[y.length - 1].toUpperCase() ? -1 : 1;
}
);


const rolesBox = document.querySelector(".roles-main");
const createRoleDiv = (roleArr) =>   // "Ned Stark"-ot halottá nyilvánítottam a 48 db miatt
    roleArr.forEach(role => { //a szereplők tömbjének minden elemére...
        let char = document.createElement('div'); //a főkonténer
        char.setAttribute('class', 'roleDiv');
        rolesBox.appendChild(char);

        let charImg = document.createElement('img');
        charImg.src = role.portrait;
        //charImg.src="./assets/arya.png"; //fiexen
        charImg.setAttribute("class", "portrait");
        char.appendChild(charImg);

        let name = document.createElement('div');
        name.setAttribute('class', 'name');
        name.innerHTML = role.name;
        //name.innerHTML="ARYA"; //fiexen
        char.appendChild(name);
        name.addEventListener("click", showDetails); //az szerepel a leírásban, hogy a névre kattintva (nem a képre/div-re)


    });

//Oldalsávi infó megjelenítése:
function showDetails() { ///érdekes: megörökli a roleArr-t
    let name;
    let searchInput = document.querySelector(".searchInput");
    if (this.classList[0] == 'name') {
        name = this.innerHTML;

    } else if (this.classList[0] == 'searchButton') {
        name = searchInput.value;
        searchInput.value = "";

    } else if (this.classList[0] == 'searchInput') {
        name = searchInput.value;
        searchInput.value = "";
    }


    role = roleArr.filter(item => item.name.toUpperCase() == name.toUpperCase())[0]; //a szerepló adatobjektuma
    console.log(name);
    console.log(role);
    console.log(this.classList[0]);

    //console.log(ee);
    //console.log(paramm1);


    let picture = document.querySelector('.rolePicture');
    let housePicture = document.querySelector('.roleHousePicture');
    let nameDiv = document.querySelector('.roleName');
    let bioDiv = document.querySelector('.roleBio');
    if (role) { //ha létezik a hivatkozott szerep objektuma
        //PICTURE
        picSrc = role.picture;
        picture.src = picSrc;
        picture.alt = picSrc;

        //HOUSE
        if (role.house) {
            housePicture.src = `assets/houses/${role.house}.png`;
        } else { housePicture.src = "" };

        //NAME
        if (role.alias) { name = `${name} ("${role.alias}")` };
        nameDiv.textContent = name;

        //BIO
        bio = role.bio;
        bioDiv.innerHTML = bio ? bio : "bio: N/A";
    } else {
        picture.src = "";
        picture.alt = "";
        housePicture.src = "";

        nameDiv.innerHTML = "";
        bioDiv.innerHTML = "Character not found"; // "Hibaüzenet"
    }

};




const getRoles = async () => {
    const response = await fetch('../json/got.json');
    let data = await response.json();
    data = data.filter(item => item.dead === false || !item.hasOwnProperty('dead'));
    roleArr = sortData(data);

    createRoleDiv(roleArr);
    //console.log(roleArr);
    //addClickListener();

    
}


function inputEnter({key}){
    //console.log(key);
    if (key=='Enter') {showDetails.call(this);}
}

document.querySelector(".searchButton").addEventListener('click', showDetails);
document.querySelector(".searchInput").addEventListener('keydown', inputEnter);
getRoles();