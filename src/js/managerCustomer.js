var Util = require("./util.js");
//var datas = require('./datas.js');

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
    if(!validateNames(customer.name))
    	return false
    if(!validatePhones(customer.telHome))
    	return false;
    if(!validateAddressAndMail(customer.address))
    	return false;
    return validatePostalCodes(customer.postalCode1, customer.postalCode2);
}

function validatePhones(telHome)
{
	if(!telHome)
		return false;
	let phoneRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;
	return telHome.match(phoneRegex);
}

function validateNames(name, lastName)
{
	return (name);
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
function validateAddressAndMail(address)
{
	return address;
	if(!address)
		return address;
	return (mail);
}

function createCustomer(customer)
{
	let pZone = Util.getPostalZone(customer.postalCode1.toUpperCase());
	let fullPostalCode = (customer.postalCode1 + " " + customer.postalCode2).toUpperCase();
	let objTemp = {
		id: customers.length +1,
		name: customer.name,
		compagnieName : customer.compagnieName ? customer.compagnieName: "---",
		address : customer.address,
		postalCode : fullPostalCode,
		zone: pZone,
		telephone: customer.telHome,
		nbDeliverys : 0,
	}
	customers.push(objTemp);
	Util.Save('customers', {customers : customers});
}

function modifyCustomer(customer, idx)
{
	let pZone = Util.getPostalZone(customer.postalCode1.toUpperCase());
	let fullPostalCode = (customer.postalCode1 + " " + customer.postalCode2).toUpperCase();
	let objTemp = {
		id: customers[idx].id,
		name: customer.name,
		compagnieName : customer.compagnieName ? customer.compagnieName: "---",
		address : customer.address,
		postalCode : fullPostalCode,
		zone: pZone,
		telephone: customer.telHome,
		nbDeliverys : customer.nbDeliverys,
	}
	customers[idx] = objTemp;
	Util.Save('customers', {customers : customers});
}