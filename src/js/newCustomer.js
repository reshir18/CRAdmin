var customers = require("./customers.js").customers;
var Util = require("./util.js");
var datas = require('./datas.js');

module.exports = {
    addCustomerFunction: addCustomerFunction
}

function addCustomerFunction(customer)
{
	if(validate(customer))
	{
		return true;
	}
	return false;
}

function validate(customer)
{
    if(!customer)
        return false;
    if(!validateNames(customer.name, customer.lastName))
    	return false
    if(!validatePhones(customer.telHome, customer.telCel))
    	return false;
    return validatePostalCodes(customer.postalCode1, customer.postalCode2);
}

function validatePhones(telHome, telCel)
{
	if(!telHome)
		return false;
	let phoneRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;
	if(telHome.match(phoneRegex))
	{
		return (!telCel || telCel.match(phoneRegex));
	}
	return false;
}

function validateNames(name, lastName)
{
	return (name && lastName);
}

function validatePostalCodes(code1, code2)
{
	let txtPostal = code1.toUpperCase();
	let pZone = Util.getPostalZone(txtPostal)
	if(code1 && pZone != "12")
	{
		return code2 && code2.length == 3;
	}
	return false;
}