'use strict';

let keys = ["id", "name", "email", "address"];

/* // UT2.0 változat:

 function getServerData(url) {
  let fetchOptions = {
    method: "GET",
    mode: "cors",
    cache: "no-cache"
  };
  return fetch(url, fetchOptions).then(
    response => response.json(),
    err => console.error(err)
  )
}
 */

startGetUsers("INIT"); //alap tábla lekérés

//Általános HTML-elem gyártó (name, attributes)-ból
const createAnyElement = (name, attributes) => {
  let element = document.createElement(name);
  for (let key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
  return element;
}


//átírtam a fenti régi változatot asyc fv-re. Ez is egy promise-ban adja vissza a lekért data-tömböt:
async function getServerData(url) {  //const getServerData = async (url) => { //arrow fv-ként nem tudtam a startGetUsers(action)-t előbb meghívni
  let fetchOptions = {
    method: "GET",
    mode: "cors",
    cache: "no-cache"
  };

  let response = await fetch(url, fetchOptions);
  let data = await response.json();
  return data;
}

//lekéri az aktuális tartalmat a megadott url-ről, műveletek után ez frissítteti a táblázat megjelenítéséta fillDataTable-vel.  
function startGetUsers(action) {
  getServerData("http://localhost:3000/users").then(data => fillDataTable(data, "userTable", action));
}

//ÚJRARAJZOLJA A TÁBLÁT A SZERVERRŐL AKTUÁLISAN LEKÉRT ADATOKKAL IS FELTÖLTVE 
const fillDataTable = (data, tableID, action) => {
  let table = document.querySelector(`#${tableID}`);
  if (!table) { console.error(`Table ${tableID} is not found`); return; }
  let tBody = table.querySelector("tbody");
  tBody.innerHTML = "";

  // * itt csak a leírás szerint az új user esetén előre rakom az utolsó objektumot(oda tette az újat)
  if (action == "POST") {
    // let lastObject = data[data.length - 1]; //mivel a bónuszban destructuring-ot kér
    // data.pop();
    // data.unshift(lastObject); 
    data = [data.pop(), ...data];
  }

  let newRow = newUserRow(); //uj user felviteli form
  tBody.appendChild(newRow);


  let ps = false; // ps/ptlan a sor:
  for (let row of data) {
    let tr = createAnyElement("tr");
    ps = !ps;
    for (const key of keys) {

      let td = createAnyElement("td");
      let input = createAnyElement("input", { class: "form-control", value: row[key], name: key, });
      //környezetbe simítás:
      if (ps) { input.setAttribute("style", "background-color: white; border-color: white;"); }
      else { input.setAttribute("style", "background-color: rgb(242,242,242); border-color: rgb(242,242,242);"); }

      //if (key == "id") { // kirajzoláskor egyik sem szerkeszthető, csak a szerkesztés gombra válik azzá
      input.setAttribute("readonly", true);
      input.addEventListener("input", inputValidator);
      //}
      td.appendChild(input);
      tr.appendChild(td);
    }

    let btnGroup = createBtnGroup();
    tr.appendChild(btnGroup);
    tBody.appendChild(tr);
  }
}

//LÉTREHOZZA EGY DIV-BEN A KÉT GOMBOT, ÉS EGY TD-BE PAKOLVA VISSZAADJA  
const createBtnGroup = () => {
  let group = createAnyElement("div", { class: "btn btn-group" });
  let infoBtn = createAnyElement("button", { class: "btn btn-info", onclick: "setRow(this)" });

  let delBtn = createAnyElement("button", { class: "btn btn-danger", onclick: "delRow(this)" });

  infoBtn.innerHTML = '<i class="fa fa-refresh" aria-hidden="true"></i>';
  delBtn.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';

  group.appendChild(infoBtn);
  group.appendChild(delBtn);

  let td = createAnyElement("td");
  td.appendChild(group);

  return td;
}

//TÖRLÉS: a gomb hívja meg
const delRow = (btn) => { //az adott gomb sorában szereplő id-jű objektumot törölteti a szerverrel
  let tr = btn.parentElement.parentElement.parentElement;
  let id = tr.querySelector("input:first-child").value;

  let fetchOptions = {
    method: "DELETE",
    mode: "cors",
    cache: "no-cache"
  };
  return fetch(`http://localhost:3000/users/${id}`, fetchOptions).then(response => response.json(), err => console.error(err))
    .then(
      (data) => {
        startGetUsers("DELETE");//frissítem a táblázatot
      });
}

//ÚJ USER FELVITELI FORM TÁBLA-SOR IMPUTJAINAK LÉTREHOZÁSA(gombbal együtt):
const newUserRow = () => {

  let tr = createAnyElement("tr");
  for (const key of keys) {
    let td = createAnyElement("td");

    if (key !== "id") {//az id td-je üresen marad a többit key-kez passzoló nevű input-tal töltöm meg
      let input = createAnyElement("input", { class: "form-control", name: key });
      input.addEventListener("input", inputValidator);
      td.appendChild(input);
    }
    tr.appendChild(td);
  }

  let td = createAnyElement("td");
  let newBtn = createAnyElement("button", { class: "btn btn-success", onclick: "createUserReq(this)" }); //(a gombot fogom átadni)
  newBtn.innerHTML = '<i class="fa fa-plus-circle" aria-hidden="true"></i>';
  td.appendChild(newBtn);
  tr.appendChild(td);

  return tr;

}

//ELKÜLDÖM AZ ÚJ USER SORÁT A SZERVERNEK
const createUserReq = (btn) => { //a ((felviteli) gomb) hívja meg és a sorának input-adatait kinyeri a getRowData-val, validáltan elküldi
  let tr = btn.parentElement.parentElement; //a gomb tábla-sora

  let data = getRowData(tr);

  // itt kell ellenőrírni a felvinni kívánt adatokat. Ha OK, akkor fusson le a lenti POST-fetch, ha nem, akkor return-nel kihagyjuk
  let valid = validator(data);
  if (!valid) { console.log("Nem VALID értékek!"); return; } //ha nem valid, kilépek

  //EZT MEGHAGYOM EMLÉKÜL A RÉGI FORMÉÁBAN AWAIT NÉLKÜL
  let fetchOptions = {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };

  fetch(`http://localhost:3000/users/`, fetchOptions).then(
    response => response.json(),
    err => console.console.error(err)
  ).then(data => { console.log(data); startGetUsers("POST") });

}

// adott (tábla-sor) input-adatait adja vissza objektumban {input1.name: input1.value,...}
function getRowData(tr) {
  let inputs = tr.querySelectorAll("input.form-control");
  let data = {};
  for (let i = 0; i < inputs.length; i++) {
    data[inputs[i].name] = inputs[i].value;
  }
  return data;
}

//AZ ADOTT (gomb) SORÁT SZERKESZTHETŐVÉ TESZI (ADATAINAK FRISSÍTÉSÉHEZ, GOMBOKAT IS ELLÁTJA ÚJ CLIICK-KEL)
function setRow(btn) {
  let tr = btn.parentElement.parentElement.parentElement;
  let saveBtn = tr.querySelector('button:first-child');//még nem az, de majd mindjárt annak látszik az ikonja
  let redoBtn = tr.querySelector('button:last-child');
  saveBtn.innerHTML = '<i class="fa fa-floppy-o" aria-hidden="true"></i>';
  redoBtn.innerHTML = '<i class="fa fa-undo" aria-hidden="true"></i>';

  //kimentem az eredeti adatokat:
  let oldData = getRowData(tr);

  saveBtn.onclick = saveRow.bind(saveBtn, tr);
  redoBtn.onclick = redoRow.bind(redoBtn, tr, oldData);

  //Letiltom a többi sor gombjait:
  let table = document.querySelector(`#userTable`);
  let buttons = table.querySelectorAll('button');
  buttons.forEach(element => {
    if ((element !== saveBtn) && (element !== redoBtn)) {
      //element.disabled = true; // ehelyett itt tényleg uyganazt az error modalt használom fel "újrafestve" 
      element.onclick = function () {
        document.querySelector("#errorModal .modal-body").innerHTML="Először be kell fejezned az aktuális szerkesztést!"
        document.querySelector("#errorModalLabel").innerHTML="TÜRELEM! :-)!"
        $('#errorModal').modal({ backdrop: 'static' });

        setTimeout(() => {
          $('#errorModal').modal('toggle');
          document.querySelector("#errorModal .modal-body").innerHTML="A kitöltött adatmezők nem elfogadható értékekeket tartalmaznak."
          document.querySelector("#errorModalLabel").innerHTML="HIBÁS BEVITELI ADATOK!"

        }, 5000);
      };
    }
  });

  //írhatóvá teszem az inputokat:
  for (const key of keys) {
    if (key != 'id') {
      let input = tr.querySelector(`input[name=${key}]`);
      input.removeAttribute("readonly");
      input.setAttribute("style", "background-color: azure;");
      //majd valamikor:a startGetUsers frissítéssel visszaáll a háttér és a readonly
    }
  }

}

async function saveRow(tr) {//a save gombra kattintás. Megkapom this-ben a buttont, és mellette a tr-t
  console.log(this, tr);

  let data = getRowData(tr);
  // itt kellene validálni. Ha OK, akkor fusson le a lenti PUT-fetch, ha nem, akkor modal ott, és return-nel kihagyjuk itt 
  let valid = validator(data);
  if (!valid) { console.log("Nem VALID értékek!"); return; } //ha nem valid, kilépek

  let fetchOptions = {
    method: "PUT",
    mode: "cors",
    cache: "no-cache",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };

  let response = await fetch(`http://localhost:3000/users/${data.id}`, fetchOptions);
  let data1 = await response.json();
  startGetUsers("PUT");
  console.log("saveRow(tr):");
  console.log(data1);

  /* //UT2.0 változat:
    fetch(`http://localhost:3000/users/${data.id}`, fetchOptions).then(
      response => response.json(),
      err => console.error(err)
    ).then(
      data => startGetUsers("PUT")
    );
   */
};

//Az adat objektum értékeit validálja. modalt meghívja:
function validator(data) {
  const v = {
    id: /^\d+$/, //csak: mert biztos-ami-biztos...
    name: /^([A-Z]* )*[A-Z]*$/, //csak nagybetűket fogadok el
    email: /^[a-z0-9\-.]+@[a-z0-9\-.]+\.[a-z]{2,4}$/,
    address: /^\d* ([A-Z0-9][a-z0-9 ]*)+$/
  };

  let valid = true;
  for (const key of keys) {
    if (key !== "id") { //az új felviteli fv miatt csak kihagyom az id-t
      valid = valid && v[key].test(data[key]);
      console.log("validator(data):");
      console.log(v[key].test(data[key]));
    }
  }

  //https://getbootstrap.com/docs/4.5/components/modal/#options
  //https://www.w3schools.com/bootstrap/bootstrap_ref_js_modal.asp
  if (valid) {  //todo: ez esetleg a html-ben egy modal-lal is megoldható, ha itt csak az osztályokat cserélem le benne a meghívás előtt.
    //todo: ...mint ahogy a szerkesztés kikattintós hibaüzenetnél. Nem is tudom, nekem így, ha csak kettő van, áttekinthetőbb a HTML-ben...

    $('#successModal').modal({ backdrop: 'static' });
    setTimeout(() => $('#successModal').modal('toggle'), 5000);
  } else {
    $('#errorModal').modal({ backdrop: 'static' });
    setTimeout(() => $('#errorModal').modal('toggle'), 5000);
  }

  return valid;
}

function inputValidator() {
  const v = {
    id: /^\d+$/, //csak: mert biztos-ami-biztos...
    name: /^([A-Z]* )*[A-Z]*$/, //csak nagybetűket fogadok el
    email: /^[a-z0-9\-.]+@[a-z0-9\-.]+\.[a-z]{2,4}$/,
    address: /^\d* ([A-Z0-9][a-z0-9 ]*)+$/
  };

  let valid = true;
  if (v[this.name].test(this.value)) {
    this.setAttribute("style", "border-color: inherit;")
  }
  else {
    this.setAttribute("style", "border-color: red;")
  }

}

//Mégsem gomb hatására visszaíródnak az eredeti értékek:
function redoRow(tr, oldData) { //megkapom a buttont(this-ként), tr-jét, és eredeti adatsorát)
  console.log("redoRow(tr, oldData):");
  console.log(this, tr, oldData)
  for (const key of keys) {
    if (key != 'id') {
      let input = tr.querySelector(`input[name=${key}]`);
      input.value = oldData[key];
    }
  }
  saveRow(tr);
};