/**
*添加附件js ---by杨恒涛
*/

 var annex=1;

 var upLoadTable ;
	function addTR(){
		if(upLoadTable==null){
			upLoadTable = document.getElementById("uploadtable");
		}
		var length = upLoadTable.rows.length;
//		if ( fileMaxCount!=-1 && length -beforeRows-behindRows+1 > fileMaxCount) {
//			parentIndex.showMessageBox("最多上传10个附件！", 2);
//			return;
//		}
		var oRow1 = upLoadTable.insertRow(length);
		//var aRows = upLoadTable.rows;
		var aCells = oRow1.cells;
		var oCell1_1 = oRow1.insertCell(aCells.length);
		var oCell1_2 = oRow1.insertCell(aCells.length);
		var oCell1_3 = oRow1.insertCell(aCells.length);
		var oCell1_4 = oRow1.insertCell(aCells.length);
		var oCell1_5 = oRow1.insertCell(aCells.length);
		oCell1_1.width = "14%";
		oCell1_1.className="td_text";
		oCell1_2.width = "36%";
		oCell1_2.className="td_element";
		oCell1_3.width = "14%";
		oCell1_3.className="td_text";
		oCell1_4.width = "26%";
		oCell1_4.className="td_element";
		oCell1_5.width = "10%";
		oCell1_5.className="td_text";
		oCell1_5.style.cssText="padding-right:7px;text-align: right;";
		oCell1_2.id = "tdFile" + annex;
		oCell1_2.style.align="left";
		oCell1_1.innerHTML = "附件"+annex+":";
		oCell1_2.innerHTML = "<input id='file' type='file' name='file" + annex + "' style='height:20px;width:156px' class='input_bg' onchange='checkFileSize(this)'  onKeyDown='return false'/>";
		oCell1_3.innerHTML = "附件描述:" ;
		oCell1_4.innerHTML = "<input type='text' class='input_bg' readOnly='true' class='text' id='desinfo" + annex + "' name='file"+annex+"desc' require='false' dataType='Limit' max='250'  msg='附件描述必须在250个字之内'/>"
		oCell1_5.innerHTML = "<input class='button_bg' type='button' value='删除' onclick='deleteTR(this)'>" ;
		annex++;
	}
	function deleteTR(obj) {
		var rowIndex = obj.parentElement.parentElement.rowIndex;
		if (rowIndex > -1){
			upLoadTable.deleteRow(rowIndex);
			annex--;
			setNumber();
		}
		
	}
	
	function setNumber() {
		var num = 0;
		var table = upLoadTable;
//		for (var i = beforeRows; i < table.rows.length - behindRows; i ++) {
//			num ++;
//			var tdObj = table.rows(i).cells(0);
//			tdObj.innerHTML = "附件"+num+":";
//		}
	}
	function onLoadTr(num) {
		if(upLoadTable==null){
			upLoadTable = document.getElementById("uploadtable");
		}
		for (var i = 0; i < num; i++) {;
			addTR();
		}
	}
	
	
	function chkSize (obj,id) {
		var ext = obj.value;
		var ss = ext.split('.');
		var strs = ext.split('\\');
		var exts=document.getElementById("exts").value;
		if (exts.indexOf(ss[ss.length - 1].toLowerCase()) == -1) {
			alert("您上传的文件不符合格式要求，不允许上传！");
			document.getElementById('tdFile'+id).innerHTML="<input type='file' class='input_bg' name='file" + id + "' onChange='chkSize(this," + id + ")' onKeyDown='return false'/>";
			document.getElementById('desinfo' + id).readOnly = true; 
		}else if(strs[strs.length - 1].length > 50){
			alert("文件名不能超过50个字！");
			document.getElementById('tdFile'+id).innerHTML="<input type='file' class='input_bg' name='file" + id + "' onChange='chkSize(this," + id + ")' onKeyDown='return false'/>";
			document.getElementById('desinfo' + id).readOnly = true; 
		}else {
			document.getElementById('desinfo' + id).readOnly = false; 
		}
	}