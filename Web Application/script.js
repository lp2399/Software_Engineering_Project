let jsonFetchedData = [];
const url ='https://api.npoint.io/02a6606bd83177762972'; 
let VehicleMakes = [];
let VehicleModels = [];
let VehicleBaseColors = [];
const MakeInput = document.getElementById('MakeInput');
const AutoCompleteMake = document.getElementById('AutoCompletedMake');
const ModelInput = document.getElementById('ModelInput');
const AutoCompleteModel = document.getElementById('AutoCompletedModel');
const VehicleMileageInput = document.getElementById('SelectedMileage');
const AutoCompletedColor = document.getElementById('AutoCompletedColor');
const ColorInput = document.getElementById('ColorInput');
const NewUsedOptionButtonSection = document.getElementById('NewUsedOptionButtonSection');
const CheckNewOption = document.getElementById('OptionNew');
const CheckUsedOption = document.getElementById('OptionUsed');
const CalculatePriceButton = document.getElementById('CalculatePriceButton');
const displayCalculate = document.getElementById("DisplayCalculation");
const dateInput = document.getElementById('datepicker')
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
        })
       
      }
  });

function UpdateSelectedVehicleMake(val){
SelectedMake = val.innerText;
DisplayVehicleModelOptions();
updateDisplayCalculation();
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
  VehicleBaseColors = ["White", "Black", "Gray", "Silver", "Blue", "Red", "Brown", "Green", "Orange", "Beige", "Purple", "Gold", "Yellow"];
  updateDisplayCalculation();
}
function removeVehicleModelOptions(){
  MakeInput.addEventListener('input',()=>{
    document.getElementById("VehicleModelSection").style.display="none";;
  });
  UpdateVehicleModels();
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

function UpdateSelectedVehicleModel(val){
  SelectedModel = val.innerText;
  updateDisplayCalculation();
  }

function UpdateBaseVehicleYear(val){
  ModelYear= val.innerText;
  }
function UpdateSelectedColor(val){
  SelectedColor = val.innerText;
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


CalculatePriceButton.addEventListener('click',(event)=>{
  CalculateFinalPrice();
})

function updateDisplayCalculation(){
  displayCalculate.innerHTML = '';
}

function CalculateFinalPrice(){
  displayCalculate.innerHTML = "";
  let a = AutoCompleteMake.childNodes[0].innerText;
  let b = AutoCompleteModel.childNodes[0].innerText;
  let c = AutoCompletedColor.childNodes[0].innerText;
  let colorsHashtable = new Map();
  colorsHashtable.set("White", 0);
  colorsHashtable.set("Black", 0);
  colorsHashtable.set("Gray", 300);
  colorsHashtable.set("Silver", 1000);
  colorsHashtable.set("Blue", 1000);
  colorsHashtable.set("Red", 300);
  colorsHashtable.set("Brown", 600);
  colorsHashtable.set("Green", 600);
  colorsHashtable.set("Orange", 500);
  colorsHashtable.set("Beige", 1000);
  colorsHashtable.set("Purple", 100);
  colorsHashtable.set("Gold", 2000);
  colorsHashtable.set("Yellow", 200);

  let temp = [];
  for (let i = 0; i < jsonFetchedData.length; i++) {
      let j =  jsonFetchedData[i];
      if(j.Car_Make==a && j.Car_Model==b){
        temp.push(j)
      }
  }

  let summation = 0;
  for(let i = 0; i < temp.length; i++) {
      summation += temp[i].Car_Price_New;
  }

  let MSRP =  (summation / temp.length)+colorsHashtable.get(String(c));// base price 



  if(isSeletectedConditonNew){
    VehicleMileageInput.value= 0;
  }
  
  displayCalculate.innerHTML = Math.round(MSRP * (1-((VehicleMileageInput.value/2500)/100)));
}
