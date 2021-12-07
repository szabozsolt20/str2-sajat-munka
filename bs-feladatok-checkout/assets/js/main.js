const countries = {
  'Magyarország': ['Baranya', 'Bács-Kiskun', 'Békés', 'Borsod-Abaúj-Zemplén', 'Budapest', 'Csongrád-Csanád', 'Fejér |Győr-Moson-Sopron', 'Hajdú-Bihar', 'Heves', 'Jász-Nagykun-Szolnok', 'Komárom-Esztergom', 'Nógrád', 'Pest', 'Somogy', 'Szabolcs-Szatmár-Bereg', 'Tolna', 'Vas', 'Veszprém', 'Zala'],
  'USA': ['Alabama', 'Alaszka', 'Arizona', 'Arkansas', 'Colorado', 'Connecticut', 'Delaware', 'Dél-Dakota', 'Dél-Karolina', 'Észak-Dakota', 'Észak-Karolina', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kalifornia', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New York', 'Nyugat-Virginia', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'Tennessee', 'Texas', 'Új-Mexikó', 'Utah', 'Vermont', 'Virginia', 'Washington', 'Wisconsin', 'Wyoming']
}

function optionPopulate() {
  const orszag = document.querySelector('#inputCountry');
  const megye = document.querySelector('#inputState');

  //console.log(countries[orszag.value]);
  if (orszag.value == "Choose...") {
    megye.innerHTML = '';
    return null
  };
  megye.innerHTML = '';
  countries[orszag.value].map(item => {
    const option = document.createElement("option");
    option.textContent = item;
    megye.add(option);
  });
}
/* https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_select_add
  https://electrictoolbox.com/javascript-add-options-html-select/ 
  https://pretagteam.com/question/how-to-populate-the-options-of-a-select-element-in-javascript
  https://www.w3schools.com/jsref/dom_obj_select.asp 
  https://www.w3schools.com/jsref/met_select_add.asp
  https://www.w3schools.com/jsref/dom_obj_event.asp
*/