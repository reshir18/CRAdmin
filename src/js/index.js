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
var jQuery = $ = require('jquery');
var Vue = require("vue");
var Util = require("./util.js");
var VueRouter = require('vue-router');
var datas = require('./datas.js');
var customers = require('./customers.js').customers;
var delivery = require('./delivery.js');
Vue.use(VueRouter);
require('bootstrap');
require('jquery-ui');
var tarifDelivery = require('./tarifDelivery.js');
var managerCustomer = require('./managerCustomer.js');
var allDelivery = require("./allDelivery.js").allDeliverys;
let deliveryListCustomer = [];
let currentCustomer = null;


var Home = Vue.extend({
    ready: function (done) {document.title = "Accueil";},
    template: require("../pages/home.html"),
    data: function () {return {customers : customers, allDelivery : allDelivery}},
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
            deliveryListCustomer = tarifDelivery.sortDeliverForCustomer(currentCustomer.id);
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
            router.go({name: 'home'});
        }
    }
  }
})

var Admin = Vue.extend({
    template:  require("../pages/admin.html"),
    data: function () {return {datas : datas}},
    ready: function (done) {document.title = "Administration";}
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

router.start(App, "#navigationMenu")
//var vueMainPage = new Vue({ el: '#main-page'})
var app = {
    // Application Constructor
    initialize: function() {

        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
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