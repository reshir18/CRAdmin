var delivery = require("./delivery.js");
var Util = require("./util.js");
//var datas = require('./datas.js');
var allDelivery = require("./allDelivery.js").allDeliverys;
let arrayErrorMessage = ["Un client doit être choisi", "Le nom et/ou l'adresse du destinataire sont non valides" ,
 "Le code postal du destinataire est non valide", "Le cout de la livraison doit être supérieur à zéro"];

module.exports = {
    addAmount: addAmount,
    addTaxes: addTaxes,
    calculDelivery : calculDelivery,
    addDeliveryToCustomer : addDeliveryToCustomer,
    sortDeliverForCustomer : sortDeliverForCustomer,
    addOtherFeeToDelivery : addOtherFeeToDelivery
}

function addAmount()
{
    delivery.isCOD = document.getElementById('cbxCOD').checked;
    delivery.isCamion = document.getElementById('cbxCamion').checked;
    delivery.isPickUp = document.getElementById('cbxPickUp').checked;
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
    if(idx < 0)
        return arrayErrorMessage[0];
    let fullPostalCode = (delivery.codeP1 + " " + delivery.codeP2).toUpperCase();
    if(fullPostalCode.length < 7)
        return arrayErrorMessage[2];

    let errorMessage = validateDelivery(delivery);
    if( errorMessage == null)
    {
        let id = customers[idx].id;
        let objTemp = Object.assign({}, delivery);
        var deliv = localStorage.getItem(customers[idx].lastName + "_" + customers[idx].name); //.customers
        allDeliveryArray = [];
        if (deliv)
        {
            allDeliveryArray = JSON.parse(deliv).allDeliverys;
            console.log(allDeliveryArray);
        }
        customers[idx].nbDeliverys++;
        allDeliveryArray.push(objTemp);
        allDeliveryArray[allDeliveryArray.length -1].idDelivery = allDeliveryArray.length;
        allDeliveryArray[allDeliveryArray.length -1].postalCodeD = fullPostalCode;
        Util.Save(customers[idx].lastName + "_" + customers[idx].name, {allDeliverys : allDeliveryArray});
        Util.Save('customers', {customers : customers});
        resetDelivery();
        return null;
    }
    return errorMessage;
}

function validateDelivery(deliveryObj)
{
    if(!delivery.adresseD)
        return arrayErrorMessage[1];
    if(delivery.basePrice <= 0)
        return arrayErrorMessage[3];
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

function addOtherFeeToDelivery(deliveryObj, fee)
{
    if(fee.cost && fee.name && !isNaN(fee.cost))
    {
        let objTemp = Object.assign({}, fee)
        objTemp.cost = Util.roundToTwo(parseFloat(objTemp.cost));
        delivery.otherFee.push(objTemp);
        delivery.basePrice += objTemp.cost;
        $( "#panelOtherFee" ).append( "<button class=\" otherFee btn btn-success btn-xs\" type=\"button\"><span class=\"glyphicon glyphicon-trash\"></span>&nbsp;"
        + objTemp.name + " : " + objTemp.cost + "$</button> ");
        $(".otherFee").click(function()
        {
            if(this && this.parentNode && this.parentNode.removeChild(this))
            {
                removeOtherFeeToDelivery(objTemp);
            }
        });
        calculDelivery();
    }
}

function removeOtherFeeToDelivery(fee)
{
    let index = -1;
    for(let i = 0; i < delivery.otherFee.length; i++)
    {
        if(delivery.otherFee[i].cost == fee.cost && delivery.otherFee[i].name == fee.name)
        {
            index = i;
            break;
        }
    }
    if(index > -1)
    {
        delivery.otherFee.splice(index, 1);
        calculDelivery();
    }
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
        if($("#customerPostalCodeZone").val() === "12" || zoneP === "12" || $("#customerPostalCodeZone").val() === "" )
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

        for(let i = 0; i < delivery.otherFee.length; i++)
        {
            delivery.basePrice += parseFloat(delivery.otherFee[i].cost);
        }

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

function resetDelivery()
{
    delivery.isAllerRetour = false;
    $('#cbxAllerRetour').prop('checked', false);
    delivery.isCamion = false;
    $('#cbxCamion').prop('checked', false);
    delivery.isCOD = false;
    $('#cbxCOD').prop('checked', false);
    delivery.typeTarifRegulier = 0;
    $("input:radio[name='radio']:checked").prop('checked', false);
    delivery.basePrice = 0;
    delivery.otherFee = [];
    addTaxes();
}