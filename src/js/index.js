/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 /*localStorage.removeItem("Raymond_Michael");
 localStorage.setItem('Raymond_Michael', JSON.stringify(require("./allDelivery"), null, '\t'));*/
 if(!localStorage.getItem('datas'))
 {
    localStorage.setItem('customers', JSON.stringify(require("./customers"), null, '\t'));
    localStorage.setItem('datas', JSON.stringify(require("./datas.js"), null, '\t'));
 }
 //localStorage.setItem('datas', JSON.stringify(require("./datas.js"), null, '\t'));
 /*localStorage.setItem('myKey', JSON.stringify({ my: 'data' }, null, '\t'));
 localStorage.setItem('myKey', JSON.stringify({ my: 'data' }, null, '\t'));*/
window["jQuery"] = window["$"] = require('jquery');
window["customers"] = null;
window["datas"] = null;
var Vue = require("vue");
var Util = require("./util.js");
var VueRouter = require('vue-router');
var delivery = require('./delivery.js');
Vue.use(VueRouter);
require('bootstrap');
require('jquery-ui');
var tarifDelivery = require('./tarifDelivery.js');
var managerCustomer = require('./managerCustomer.js');
let deliveryListCustomer = [];
let currentCustomer = null;
var jsPDF = require("jspdf");
var doc = new jsPDF();
var imgData = "data:image/jpeg;base64,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";
doc.setFontSize(40);
doc.text(30, 20, 'Hello world!');
doc.addImage(imgData, 'JPEG', 15, 40, 66, 66);
//doc.save('IMGTest.pdf');
/*var excelbuilder = require('msexcel-builder');
var workbook = excelbuilder.createWorkbook('./', 'sample.xlsx')
 var sheet1 = workbook.createSheet('sheet1', 10, 12);
  
  // Fill some data 
  sheet1.set(1, 1, 'I am title');
  for (var i = 2; i < 5; i++)
    sheet1.set(i, 1, 'test'+i);

  // Save it
  workbook.save(function(err){
    if (err)
      throw err;
    else
      console.log('congratulations, your workbook created');
  });*/

var Home = Vue.extend({
    ready: function (done) {document.title = "Accueil";},
    template: require("../pages/home.html"),
    data: function () {return {customers : customers}},
    methods: {
        modifyCustomerFunction: function (event) {
            router.go({ name: 'customer', params: { id: event.target.value }});
        },
        addDeliveryFunction: function (event) {
            document.title = "Nouvelle livraison";
            router.go({ name: 'delivery', params: { id: event.target.value }});
        },
        showAllDeliveryFunction : function (event) {
            currentCustomer = customers[event.target.value];
            document.title = "Livraisons de " + currentCustomer.name + " " + currentCustomer.lastName;
            var deliv = localStorage.getItem(currentCustomer.lastName + "_" + currentCustomer.name); //.customers
            if (deliv)
                deliveryListCustomer = JSON.parse(deliv).allDeliverys;
            else
                deliveryListCustomer = [];
            router.go({ name: 'deliverySummary', params: { id: event.target.value }});
        }
    }
})

var customerMenu = Vue.extend({
    ready: function (done) {document.title = "Client";},
    template: require("../pages/customerMenu.html"),
    data: function () {return {datas : datas, customers : customers, managerCustomer : managerCustomer}},
    methods: {
    addNewCustomer: function (event) {
        if(managerCustomer.addCustomerFunction(this.$data.managerCustomer))
        {
            router.go({ name: 'home'});
        }
    },
    modifyCurrentCustomer : function(event){
        if(managerCustomer.modifyCustomerFunction(this.$data.managerCustomer, event.target.value))
        {
            router.go({ name: 'home'});
        }
    }
  }
})

var DeliveryAdd = Vue.extend({
    template: require("../pages/deliveryAdd.html"),
    data: function () {return {datas : datas, customers : customers, delivery: delivery}},
    ready: function (done) {document.title = "Nouvelle livraison"; initSelectCustomer();},
    methods: {
    addNewDelivery: function (event) {
        let msgError = tarifDelivery.addDeliveryToCustomer(this.$data.delivery, $( "#selectCustomerDDL" )[0].selectedIndex - 1);
        if(msgError != null)
        {
            alert(msgError);
        }
        else
        {
            console.log(this.$data.delivery);
            router.go({name: 'home'});
        }
    }
  }
})

var Admin = Vue.extend({
    template:  require("../pages/admin.html"),
    data: function () {return {datas : datas}},
    ready: function (done) {document.title = "Administration";},
    methods : {
        saveModifAdmin : function(event){
            Util.Save('datas', this.$data.datas);
        }
    }
})

var AllDelivery = Vue.extend({
    template:  require("../pages/allDeliveryPerCustomer.html"),
    data: function () {return {delivery : deliveryListCustomer, customer : currentCustomer}}
})

var vueTarifRegulierComponent = Vue.extend({
    template: require("../components/tarifRegulier.html"),
    data: function () {return {delivery: delivery, otherFee:{name:"", cost:0.00}}},
    methods: {
    addNewOtherFee: function (event) {
        tarifDelivery.addOtherFeeToDelivery(this.$data.delivery, this.$data.otherFee)
    }
  }
});
//var vueAllCustomersComponent = Vue.extend({template: require("../components/listAllCustomers.html")})
var vueTotalLivraisonComponent = Vue.extend({
    template: require("../components/totalLivraison.html"),
    data: function () {return {delivery : delivery}}
})
Vue.component('tarif-reg', vueTarifRegulierComponent);
Vue.component('total-livraison', vueTotalLivraisonComponent);

// The router needs a root component to render.
// For demo purposes, we will just use an empty one
// because we are using the HTML as the app template.
// !! Note that the App is not a Vue instance.
var App = Vue.extend({})

var router = new VueRouter()

// Define some routes.
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// Vue.extend(), or just a component options object.
// We'll talk about nested routes later.
router.map({
    '/home': {
        name: 'home',
        component: Home
    },
    '/admin': {
        name: 'admin',
        component: Admin
    },
    '/customerMenu/:id' : {
        name: 'customer',
        component: customerMenu
    },
    '/deliveryAdd/:id' : {
        name:'delivery',
        component: DeliveryAdd
    },
    '/deliverysSummary/:id' : {
        name:'deliverySummary',
        component: AllDelivery
    }
})

// Now we can start the app!
// The router will create an instance of App and mount to
// the element matching the selector #app.
/*localStorage.setItem('myKey', JSON.stringify({ my: 'data' }, null, '\t'));*/
router.start(App, "#navigationMenu")
document.addEventListener("deviceready", init, false);
function init()
{
    var data = localStorage.getItem('datas'); //.customers
    if (data)
    {
       window["datas"] = JSON.parse(data);
    }
    data = localStorage.getItem('customers');
    if (data)
    {
       window["customers"] = JSON.parse(data).customers;
    }





 
var data = {
  title: 'AKIRA',
  creator: 'Katsuhiro Otomo',
  year: 1988
};
 
var xlsx = new EditXlsx('src.xlsx');
var sheet = xlsx.sheet(0);
 
sheet.update('A1', 'Title');
sheet.update([2, 1], 'Creator');
sheet.update('C1', 'Year');
 
sheet.update([1, 2], data.title);
sheet.update('B2', data.creator);
sheet.update('C2', data.year);
 
sheet = xlsx.sheet(1);
sheet.update('A1', 'test');
 
xlsx.save('output.xlsx');
 
 
xlsx = new EditXlsx('output.xlsx');
sheet = xlsx.sheet(0);
console.log(sheet.value('B2')); //=> 'Katsuhiro Otomo' 
console.log(sheet.value([1, 2], 'C2')); //=> ['AKIRA', 1988] 

}

function onFileSystemSuccess(fileSystem) {
        console.log(fileSystem.name);
    }

    function onResolveSuccess(fileEntry) {
        console.log(fileEntry.name);
    }

    function fail(error) {
        console.log(error.code);
    }
//var vueMainPage = new Vue({ el: '#main-page'})
var app = {
    // Application Constructor
    initialize: function()
    {
        console.log(cordova.file);

        /*$.get("json/datas.json", function(res)
        {
            setDatas(res);
        });
        $.get("json/customers.json", function(res)
        {
            setCustomers(res);
        });*/
        //window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + "www/test.html", gotFile, fail);
    }
};

app.initialize();

$(document).ready(function() {
    initJquery();
});
function initSelectCustomer()
{
    let idx = $( "#selectCustomerDDL" )[0].selectedIndex;
    if(idx > 0)
    {
        $( "#customerPostalCodeDisplay" ).html(customers[idx - 1].postalCode);
        $( "#customerPostalCodeZone" ).val(customers[idx - 1].zone);
    }
    initJquery();
}
function initJquery()
{
    initdatePickers();
    $( "#selectCustomerDDL" ).change(function() {
        let idx = $( "#selectCustomerDDL" )[0].selectedIndex - 1;
        $( "#customerPostalCodeDisplay" ).html("Code postal du client");
        $( "#customerPostalCodeZone" ).val("12");
        if(idx >= 0)
        {
            $( "#customerPostalCodeDisplay" ).html(customers[idx].postalCode);
            $( "#customerPostalCodeZone" ).val(customers[idx].zone);
        }
    });

    if ($( "#datepicker" ).length > 0)
    {
        $( "#datepicker" ).datepicker();
        $( ".spinnerCR" ).spinner();
        $('.ui-spinner-button').click(function() {
           $(this).siblings('input').change();
        });
        $('#btn-datepicker-span').click(function() {
           $( "#datepicker" ).focus();
        });

        $("#datepicker").change(function()
        {
            $( "#datepicker" ).focus();
        });
    }

    $( ".radioButtonFraisSup" ).change(function()
    {
        tarifDelivery.addAmount();
    });

    $( "#btnRadioTypeTarificationReg" ).click(function()
    {
        delivery.isTarifHeure = false;
        tarifDelivery.calculDelivery();
    });

    $( "#btnRadioTypeTarificationHeure" ).click(function()
    {
        delivery.isTarifHeure = true;
        tarifDelivery.calculDelivery();
    });

    $("#addDeliveryForm").change(function()
    {
        tarifDelivery.calculDelivery();
    });
}

function initdatePickers()
{
    jQuery(function($){
        $.datepicker.regional['fr'] = {
            closeText: 'Fermer',
            prevText: '&#x3c;Préc',
            nextText: 'Suiv&#x3e;',
            currentText: 'Aujourd\'hui',
            monthNames: ['Janvier','Fevrier','Mars','Avril','Mai','Juin',
            'Juillet','Aout','Septembre','Octobre','Novembre','Decembre'],
            monthNamesShort: ['Jan','Fev','Mar','Avr','Mai','Jun',
            'Jul','Aou','Sep','Oct','Nov','Dec'],
            dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
            dayNamesShort: ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'],
            dayNamesMin: ['Di','Lu','Ma','Me','Je','Ve','Sa'],
            weekHeader: 'Sm',
            dateFormat: 'dd/mm/yy',
            firstDay: 0,
            isRTL: false,
            showMonthAfterYear: false,
            yearSuffix: '',
            showButtonPanel: true
        };
        $.datepicker.setDefaults($.datepicker.regional['fr']);
    });
}