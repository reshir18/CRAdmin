var delivery = require("./delivery.js");
var Util = require("./util.js");
var datas = require('./datas.js');

module.exports = {
    addAmount: addAmount,
    addTaxes: addTaxes,
    calculDelivery : calculDelivery
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