var customers = require("./customers.js").customers;
var Util = require("./util.js");
var datas = require('./datas.js');

module.exports = {
    addCustomerFunction: addCustomerFunction,
    modifyCustomerFunction : modifyCustomerFunction
}

function addCustomerFunction(customer)
{
	if(validate(customer))
	{
		createCustomer(customer);
		return true;
	}
	return false;
}

function modifyCustomerFunction(customer, idx)
{
	if(validate(customer))
	{
		modifyCustomer(customer, idx);
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
    if(!validateAddressAndMail(customer.address, customer.email))
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
		return code2 && code2.match(/[0-9][A-Za-z][0-9]/);
	}
	return false;
}
function validateAddressAndMail(address, mail)
{
	if(!address)
		return false;
	return (mail);
}

function createCustomer(customer)
{
	let pZone = Util.getPostalZone(customer.postalCode1.toUpperCase());
	let fullPostalCode = (customer.postalCode1 + " " + customer.postalCode2).toUpperCase();
	let objTemp = {
		id: customers.length +1,
		name: customer.name,
		lastName: customer.lastName,
		compagnieName : customer.compagnieName ? customer.compagnieName: "---",
		address : customer.address,
		postalCode : fullPostalCode,
		zone: pZone,
		telephone: customer.telHome,
		cell : customer.telCel ? customer.telCel : "---",
		mail : customer.email,
		nbDeliverys : 0,
	}
	customers.push(objTemp);
}

function modifyCustomer(customer, idx)
{
	let pZone = Util.getPostalZone(customer.postalCode1.toUpperCase());
	let fullPostalCode = (customer.postalCode1 + " " + customer.postalCode2).toUpperCase();
	let objTemp = {
		id: customers[idx].id,
		name: customer.name,
		lastName: customer.lastName,
		compagnieName : customer.compagnieName ? customer.compagnieName: "---",
		address : customer.address,
		postalCode : fullPostalCode,
		zone: pZone,
		telephone: customer.telHome,
		cell : customer.telCel ? customer.telCel : "---",
		mail : customer.email,
		nbDeliverys : customer.nbDeliverys,
	}
	customers[idx] = objTemp;
}