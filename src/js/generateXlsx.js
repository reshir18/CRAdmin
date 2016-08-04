var XLSX = require('xlsx');
var FileSaver = require('file-saver');
module.exports = {
    CreateXlsx : create
}

function crateCompanyBaseInfo(ws)
{
	var range = {s: {c:0, r:7}, e: {c:2, r:8 }};
	var cell = { v: "9314-6926 Québec Inc." };
	cell.t = 's';
	var cell_ref = XLSX.utils.encode_cell({c:0,r:7});
	ws[cell_ref] = cell;
	cell = { v: "60 Chantovent " };
	cell_ref = XLSX.utils.encode_cell({c:0,r:8});
	ws[cell_ref] = cell;

	//MergeLines
	var merges = ws['!merges'] = [];
	merges.push( { s: 'A8', e: 'C8' } );
	merges.push( { s: 'A9', e: 'B9' } );
	ws['!ref'] = XLSX.utils.encode_range(range);
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
	crateCompanyBaseInfo(ws);
	/* add worksheet to workbook */
	wb.SheetNames.push(ws_name);
	wb.Sheets[ws_name] = ws;

	/* write file */
	var wopts = { bookType:'xlsx', bookSST:false, type:'binary' };

	var wbout = XLSX.write(wb,wopts);
	/* the saveAs call downloads a file on the local machine */
	FileSaver.saveAs(new Blob([s2ab(wbout)],{type:""}), client + ".xlsx");
}

function s2ab(s)
{
	var buf = new ArrayBuffer(s.length);
	var view = new Uint8Array(buf);
	for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
	return buf;
}