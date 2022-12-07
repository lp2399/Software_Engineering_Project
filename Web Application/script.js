let jsonFetchedData = [];
const url ='https://api.npoint.io/02a6606bd83177762972'; 
let VehicleMakes = [];
let VehicleModels = [];
let VehicleBaseColors = [];
const MakeInput = document.getElementById('MakeInput');
const AutoCompleteMake = document.getElementById('AutoCompletedMake');
const ModelInput = document.getElementById('ModelInput');
const AutoCompleteModel = document.getElementById('AutoCompletedModel');
const VehicleYear = document.getElementById('VehicleYear');
const AutoCompletedColor = document.getElementById('AutoCompletedColor');
const ColorInput = document.getElementById('ColorInput');
const NewUsedOptionButtonSection = document.getElementById('NewUsedOptionButtonSection');
const CheckNewOption = document.getElementById('OptionNew');
const CheckUsedOption = document.getElementById('OptionUsed');
const CalculatePriceButton = document.getElementById('CalculatePriceButton');

let SelectedMake = '';
let SelectedModel = '';
let SelectedYear;
let SelectedColor;
let ModelYear;
let isSeletectedConditonNew;
let BasePriceNew;

function GETRequestOnlineAPI(url, callback){
  let jsonObject;
  fetch(url)
    .then(responce => responce.json())
    .then(data => jsonObject = data)
    .then(() => callback(jsonObject))
}

GETRequestOnlineAPI(url, getAPIData);


function getAPIData(Objects){
  Objects.forEach((i) => {
    jsonFetchedData.push(i);
  });
  VehicleMakes = uniqueVehicleMakeValues(jsonFetchedData);
}

function uniqueVehicleMakeValues(array) {
  return [...new Set(array.map(item => item.Car_Make))];
} 

  function AutocompleteMatch(input, options) {
    if (input == '') {
      return [];
    }
      let pattern = new RegExp(input,'gi')
      return options.filter(function(option) {
          if (option.match(pattern)) {
            return option;
          }
      });
  }

  function AutoCompleteSelector(input,options,element) {
    element.innerHTML = '';
    let button = '';
    let selected = AutocompleteMatch(input,options);
    for (i=0; i<selected.length; i++) {
        button += '<li >'+`<button type="button" class="btn btn-primary btn-sm "  id="${selected[i]}" >` + selected[i] + '</button>'+'</li>';   
    }
    element.innerHTML = `<ul id="${element.id}">` + button + '</ul>';
  }

  function DeleteNotSelectedElements(value,element){
    let SelectedOption = value.innerHTML;
    let liElements = document.getElementById(`${element.id}`).getElementsByTagName('li');
    for (var i = 0, len = liElements.length; i < len; i++ ) {
        try {
          if(liElements[i].innerText!=SelectedOption){
               element = document.getElementById(`${liElements[i].innerText}`);
               element.parentNode.removeChild(element);
          }
        }catch (error) {

            return;
          }     
     }
  }

  MakeInput.addEventListener('input',(event)=>{
    AutoCompleteSelector(event.target.value,VehicleMakes,AutoCompleteMake);
      let temp = document.getElementById(AutoCompleteMake.id).getElementsByTagName('button');
        for (let i = 0; i < temp.length; i++) {
         temp[i].addEventListener('click',(e)=>{
          DeleteNotSelectedElements(e.target,AutoCompleteMake);
          UpdateSelectedVehicleMake(e.target);
          removeVehicleModelOptions();
          removeCalculationAlert();
        })
       
      }
  });

function UpdateSelectedVehicleMake(val){
SelectedMake = val.innerText;
DisplayVehicleModelOptions();
DisplayVehicleYearInput();
DisplayVehicleColorOptions();
}

function DisplayVehicleModelOptions(){
  document.getElementById("VehicleModelSection").style.display="block";
  UpdateVehicleModels();
  ModelInput.addEventListener('input',(event)=>{
    AutoCompleteSelector(event.target.value,VehicleModels,AutoCompleteModel);
      let temp = document.getElementById(AutoCompleteModel.id).getElementsByTagName('button');
        for (let i = 0; i < temp.length; i++) {
         temp[i].addEventListener('click',(e)=>{
          DeleteNotSelectedElements(e.target,AutoCompleteModel);
          UpdateSelectedVehicleModel(e.target);
        })
      }
  
  });
}

function UpdateVehicleModels(){
  VehicleModels = [];
  VehicleBaseColors = [];
  for (let i = 0; i < jsonFetchedData.length; i++) {
    if(jsonFetchedData[i].Car_Make==SelectedMake){
      VehicleModels.push(jsonFetchedData[i].Car_Model);
      VehicleBaseColors.push(jsonFetchedData[i].Car_Color);
    }; 
  }
  VehicleModels = [...new Set(VehicleModels)];
  VehicleBaseColors = [...new Set(VehicleBaseColors)];
}
function removeVehicleModelOptions(){
  MakeInput.addEventListener('input',()=>{
    document.getElementById("VehicleModelSection").style.display="none";
    removeVehicleColorOptions();
  });
  UpdateVehicleModels();
  removeVehicleYearInput();
}

function UpdateSelectedVehicleModel(val){
  SelectedModel = val.innerText;
  }

VehicleYear.addEventListener('keypress',(event)=>{
  if (event.key === 'Enter') {
    if(VehicleYearValidation(event.target)){
      SelectedYear = ModelYear;
    }
    console.log(event.target.value)
  }
  else{return;}
})  

function VehicleYearValidation(year){
  for (let i = 0; i < jsonFetchedData.length; i++) {
    if(jsonFetchedData[i].Car_Make==SelectedMake && jsonFetchedData.Car_Model==SelectedMake){
      UpdateBaseVehicleYear(jsonFetchedData[i].Car_Model_Year);
    }
    if(year.value<ModelYear ||year.value > (new Date().getFullYear())+2){
      return false;
    }

  }return true;
}  


function DisplayVehicleYearInput(){
  document.getElementById("VehicleYearSection").style.display="block";
  displayCheckUsedNewButtons();
}

function removeVehicleYearInput(){
  MakeInput.addEventListener('input',(event)=>{
    document.getElementById("VehicleYearSection").style.display="none";
    removeCheckUsedNewButtons();
  });
}

function UpdateBaseVehicleYear(val){
  ModelYear= val.innerText;
  }

  ColorInput.addEventListener('input',(event)=>{
    AutoCompleteSelector(event.target.value,VehicleBaseColors,AutoCompletedColor);
      let temp = document.getElementById(AutoCompletedColor.id).getElementsByTagName('button');
        for (let i = 0; i < temp.length; i++) {
         temp[i].addEventListener('click',(e)=>{
          DeleteNotSelectedElements(e.target,AutoCompletedColor);
          UpdateSelectedColor(e.target);
        })
      }
  });

function UpdateSelectedColor(val){
  SelectedColor = val.innerText;
}  

function DisplayVehicleColorOptions(){
  document.getElementById("VehicleColorSection").style.display="block";
}
function removeVehicleColorOptions(){
  document.getElementById("VehicleColorSection").style.display="none";
}

function displayNewUsedOptionButtonSection(){
  NewUsedOptionButtonSection.style.display='block';
}

function removeNewUsedOptionButtonSection(){
  NewUsedOptionButtonSection.style.display='none';
}

function displayCalculatePriceButton(){
  CalculatePriceButton.style.display = 'block';
}


function removeCalculatePriceButton(){
  CalculatePriceButton.style.display = 'none';
}

function displayCheckUsedNewButtons(){
  NewUsedOptionButtonSection.style.display='block';
}

function removeCheckUsedNewButtons(){
  NewUsedOptionButtonSection.style.display='none';
}

CheckNewOption.addEventListener('click',(event)=>{
  if(event.target.value =='ON'){
    isSeletectedConditonNew = true;  
  }
})

CheckUsedOption.addEventListener('click',(event)=>{
  if(event.target.value =='ON'){
    isSeletectedConditonNew = false;  
  }
})

function displayCalculationAlert(){
  document.getElementById('DisplayCalculation').style.display='block';
}


function removeCalculationAlert(){
  document.getElementById('DisplayCalculation').style.display='block';
}

const displayCalculate = document.getElementById("DisplayCalculation");

CalculatePriceButton.addEventListener('click',(event)=>{
  displayCalculate.innerHTML = "Test";
})


function CalculateFinalPrice(){
  if(isSeletectedConditonNew){
    /* Then we will use the base price */
  }
  // upon calculation call displayCalcualtionAlert change the inner text to reflect the final price 
}