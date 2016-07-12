var delivery = require("./delivery.js");
var Util = require("./util.js");
var datas = require('./datas.js');
var allDelivery = require("./allDelivery.js").allDeliverys;
var customers = require('./customers.js').customers;

module.exports = {
    addAmount: addAmount,
    addTaxes: addTaxes,
    calculDelivery : calculDelivery,
    addDeliveryToCustomer : addDeliveryToCustomer,
    sortDeliverForCustomer : sortDeliverForCustomer
}

function addAmount()
{
    delivery.isCOD = document.getElementById('cbxCOD').checked;
    delivery.isCamion = document.getElementById('cbxCamion').checked;
    delivery.isAllerRetour = document.getElementById('cbxAllerRetour').checked;
}

function addTaxes()
{
    delivery.gazPrice = datas.SurchargeEssence /100 * delivery.basePrice;
    delivery.taxesPrice = (datas.PercentTPS /100 * delivery.basePrice + datas.PercentTVQ /100 * delivery.basePrice);
    delivery.gazPrice = Util.roundToTwo(delivery.gazPrice);
    delivery.taxesPrice = Util.roundToTwo(delivery.taxesPrice);
    delivery.totalDelivery = Util.roundToTwo(delivery.basePrice + delivery.gazPrice + delivery.taxesPrice);
}

function addDeliveryToCustomer(deliveryObj, idx)
{
    let id = customers[idx].id
    let fullPostalCode = (deliveryObj.codeP1 + " " + deliveryObj.codeP2).toUpperCase();
    let objTemp = Object.assign({}, deliveryObj);
    allDelivery.push(objTemp);
    allDelivery[allDelivery.length -1].idDelivery = allDelivery.length;
    allDelivery[allDelivery.length -1].idCustomer = id;
    allDelivery[allDelivery.length -1].postalCodeD = fullPostalCode;
    customers[idx].nbDeliverys++;
}

function sortDeliverForCustomer(idCus)
{
    let arrayTemp = [];
    for(let i = 0; i < allDelivery.length; i++)
    {
        if(allDelivery[i].idCustomer === idCus)
        {
            arrayTemp.push(allDelivery[i]);
        }
    }
    arrayTemp.sort(function(a, b){return new Date(a.date) - new Date(b.date)});
    return arrayTemp;
}

function changeTypeTarifRegulier(myRadio)
{
    delivery.typeTarifRegulier = myRadio.value;
}

function calculDelivery()
{
    if($( "#inputPostalCodeA" ).val().length === 3)
    {
        let txtPostal = $( "#inputPostalCodeA" ).val().toUpperCase();
        let zoneP = Util.getPostalZone(txtPostal);
        if(delivery.isTarifHeure)
        {
            delivery.basePrice = $( "#inputNbHour" ).val() * datas.TarifHeure;
            addTaxes();
            return;
        }
        if($("#customerPostalCodeZone").val() === "12" || zoneP === "12")
        {
            return;
        }
        var selected = $("input:radio[name='radio']:checked").val();
        if (!selected)
            return;
        delivery.typeTarifRegulier = selected;
        if(delivery.typeTarifRegulier == 1)
            delivery.basePrice = datas.arrayService1[$("#customerPostalCodeZone").val()][zoneP];
        else if(delivery.typeTarifRegulier == 2)
            delivery.basePrice = datas.arrayService2[$("#customerPostalCodeZone").val()][zoneP];
        else if(delivery.typeTarifRegulier == 3)
            delivery.basePrice = datas.arrayService3[$("#customerPostalCodeZone").val()][zoneP];

        delivery.basePrice += delivery.isCOD ? datas.COD : 0;
        delivery.basePrice += delivery.isCamion ? datas.Camion : 0;
        delivery.basePrice += delivery.isAllerRetour ? delivery.basePrice : 0;
        delivery.nbLbsPlus = $( "#inputNBPoundsPlus" ).val();
        delivery.nbMinutesWaitPlus = $( "#inputNBMinutesWaitPlus" ).val();
        delivery.nbMinutesFindPlus = $( "#inputNBMinutesFindPlus" ).val();
        delivery.basePrice += delivery.nbLbsPlus * datas.lbsPrix;
        delivery.basePrice += delivery.nbMinutesWaitPlus * datas.tempsAPrix;
        delivery.basePrice += delivery.nbMinutesFindPlus * datas.tempsRPrix;
        delivery.basePrice = Util.roundToTwo(delivery.basePrice);
        addTaxes();
    }
}