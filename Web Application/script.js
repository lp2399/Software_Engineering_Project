let jsonFetchedData = [];
const url ='https://api.npoint.io/02a6606bd83177762972'; 
let VehicleMakes = [];
let VehicleModels = [];
let VehicleBaseColors = [];
const MakeInput = document.getElementById('MakeInput');
const AutoCompleteMake = document.getElementById('AutoCompletedMake');
const ModelInput = document.getElementById('ModelInput');
const AutoCompleteModel = document.getElementById('AutoCompletedModel');
const VehicleYearInput = document.getElementById('SelectedMileage');
const AutoCompletedColor = document.getElementById('AutoCompletedColor');
const ColorInput = document.getElementById('ColorInput');
const NewUsedOptionButtonSection = document.getElementById('NewUsedOptionButtonSection');
const CheckNewOption = document.getElementById('OptionNew');
const CheckUsedOption = document.getElementById('OptionUsed');
const CalculatePriceButton = document.getElementById('CalculatePriceButton');
const displayCalculate = document.getElementById("DisplayCalculation");
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

function displayCalculationAlert(){
  document.getElementById('DisplayCalculation').style.display='block';
}


function removeCalculationAlert(){
  document.getElementById('DisplayCalculation').style.display='block';
}

CalculatePriceButton.addEventListener('click',(event)=>{
  CalculateFinalPrice();
})


function CalculateFinalPrice(){
  displayCalculate.innerHTML = VehicleYearInput.value;
  let  CalculatedFinalPrice;
  if(isSeletectedConditonNew){
    /* Then we will use the base price */
    CalculatedFinalPrice = MSRP;
  }
  // upon calculation call displayCalcualtionAlert change the inner text to reflect the final price 
    const percentage = 100 - ((miles/5000)/100);
    CalculatedFinalPrice = MSRP*percentage;
}

const MSRP = Car_Price_New;
