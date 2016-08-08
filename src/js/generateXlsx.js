var XLSX = require('xlsx-style');
var FileSaver = require('file-saver');
module.exports = {
    CreateXlsx : create
}

function createCompanyBaseInfo(ws)
{
	var range = {s: {c:0, r:7}, e: {c:2, r:12 }};
	//var cell = { v: "9314-6926 Québec Inc." };
	//cell.t = 's';
	//var cell_ref = XLSX.utils.encode_cell({c:0,r:7});
	ws[XLSX.utils.encode_cell({c:0,r:7})] = createInfo("9314-6926 Québec Inc.");
	ws[XLSX.utils.encode_cell({c:0,r:8})] = createInfo("60 Chantovent");
	ws[XLSX.utils.encode_cell({c:0,r:9})] = createInfo("Québec (Qc)");
	ws[XLSX.utils.encode_cell({c:0,r:11})] = createInfo("418-660-8668");
	ws[XLSX.utils.encode_cell({c:0,r:12})] = createInfo("messageriecr@hotmail.com");
	/*cell = { v: "60 Chantovent " };
	cell_ref = XLSX.utils.encode_cell({c:0,r:8});
	ws[cell_ref] = cell;*/

	//MergeLines
	var merges = ws['!merges'] = [];
	merges.push( { s: 'A8', e: 'C8' } );
	merges.push( { s: 'A9', e: 'B9' } );
	merges.push( { s: 'A10', e: 'B10' } );
	merges.push( { s: 'A12', e: 'B12' } );
	merges.push( { s: 'A13', e: 'C13' } );

	merges.push( { s: 'E8', e: 'F8' } );
	merges.push( { s: 'E9', e: 'G9' } );
	merges.push( { s: 'E10', e: 'G11' } );
	merges.push( { s: 'E12', e: 'F12' } );
	ws['!ref'] = XLSX.utils.encode_range(range);
}

function createCustomerBaseInfo(ws)
{
	var range = {s: {c:0, r:7}, e: {c:2, r:12 }};
	//var cell = { v: "9314-6926 Québec Inc." };
	//cell.t = 's';
	//var cell_ref = XLSX.utils.encode_cell({c:0,r:7});
	ws[XLSX.utils.encode_cell({c:0,r:7})] = createInfo("9314-6926 Québec Inc.");
	ws[XLSX.utils.encode_cell({c:0,r:8})] = createInfo("60 Chantovent");
	ws[XLSX.utils.encode_cell({c:0,r:9})] = createInfo("Québec (Qc)");
	ws[XLSX.utils.encode_cell({c:0,r:11})] = createInfo("418-660-8668");
	ws[XLSX.utils.encode_cell({c:0,r:12})] = createInfo("messageriecr@hotmail.com");
	/*cell = { v: "60 Chantovent " };
	cell_ref = XLSX.utils.encode_cell({c:0,r:8});
	ws[cell_ref] = cell;*/

	//MergeLines
	var merges = ws['!merges'] = [];
	merges.push( { s: 'E8', e: 'F8' } );
	merges.push( { s: 'E9', e: 'G9' } );
	merges.push( { s: 'E10', e: 'G11' } );
	merges.push( { s: 'E12', e: 'F12' } );
	ws['!ref'] = XLSX.utils.encode_range(range);
}

function createInfo(info)
{
	cell = { v: info};
	styleC = { italic :true};
	cell.s = styleC;
	cell.t = 's';
	return cell;
}

function create(client)
{
    var wb = {}
	wb.Sheets = {};
	wb.Props = {};
	wb.SSF = {};
	wb.SheetNames = [];
	var ws = {}
	var data = [[1,2,3],[true, false, null, "sheetjs"],["foo","bar","0.3"], ["baz", null, "qux"]]
	var ws_name = "SheetJS";
	var wscols = [
	{},
	{},
	{},
	{wch:32}
];
	ws['!cols'] = wscols;
	/* the range object is used to keep track of the range of the sheet */
	var range = {s: {c:0, r:0}, e: {c:0, r:0 }};
	/* Iterate through each element in the structure */
	for(var R = 0; R != data.length; ++R)
	{
	    if(range.e.r < R)
	        range.e.r = R;
	    for(var C = 0; C != data[R].length; ++C)
	    {
	        if(range.e.c < C)
	            range.e.c = C;
	        /* create cell object: .v is the actual data */
	        var cell = { v: data[R][C] };
	        if(cell.v == null) continue;
	        /* create the correct cell reference */
	        var cell_ref = XLSX.utils.encode_cell({c:C,r:R});

	        /* determine the cell type */
	        if(typeof cell.v === 'number') cell.t = 'n';
	        else if(typeof cell.v === 'boolean') cell.t = 'b';
	        else cell.t = 's';

	        /* add to structure */
	        ws[cell_ref] = cell;
	    }
	}

	ws['!ref'] = XLSX.utils.encode_range(range);
	createCompanyBaseInfo(ws);
	/* add worksheet to workbook */
	wb.SheetNames.push(ws_name);
	wb.Sheets[ws_name] = ws;

	/* write file */
	var wopts = { bookType:'xlsx', bookSST:false, type:'binary'};

	var wbout = XLSX.write(wb,wopts);
	/* the saveAs call downloads a file on the local machine */
	FileSaver.saveAs(new Blob([s2ab(wbout)],{type:""}), client.name + ".xlsx");
}

function s2ab(s)
{
	var buf = new ArrayBuffer(s.length);
	var view = new Uint8Array(buf);
	for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
	return buf;
}