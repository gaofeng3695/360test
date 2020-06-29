function audit(){
	var rows = $('#10060201').datagrid('getSelections');
	if (rows.length == 1){
		var row = $('#10060201').datagrid('getSelected');
		var eventID = row.eventid;
		//top.getDlg("updateDevice.htm?random="+new Date().getTime()+ "&eventID=" + eventID,"updateiframe","修改设备信息",450,485);
		top.getDlg("auditLeave.htm","saveiframe",
		"审核",600,185);
	}else{
		$.messager.alert('提示','请选中一条记录','info');
	}
}
function addImportantevent(){
	top.getDlg("addLeave.htm","saveiframe",
		"新增",700,330);
}

function updateImportantevent(){
	var rows = $('#10060201').datagrid('getSelections');
	if (rows.length == 1){
		var row = $('#10060201').datagrid('getSelected');
		var eventID = row.eventid;
		//top.getDlg("updateDevice.htm?random="+new Date().getTime()+ "&eventID=" + eventID,"updateiframe","修改设备信息",450,485);
		top.getDlg("updateLeave.htm?eventID=" + eventID,"updateiframe",
			"修改",700,310);
	}else{
		$.messager.alert('提示','请选中一条记录','info');
	}
}
		
function viewImportantevent(){
	var rows = $('#10060201').datagrid('getSelections');
	if (rows.length == 1){
		var row = $('#10060201').datagrid('getSelected');
		var eventID =row.eventid;
        top.getDlg("viewLeave.htm?eventID=" + eventID,"viewiframe",
			"查看",700,330);
	}else{
		$.messager.alert('提示','请选中一条记录','info');
	}
}

function reloadData(shortUrl, elementId) {
	var fra = parent.$("iframe");
	for ( var i = 0; i < fra.length; i++) {
		if (fra[i].src.indexOf(shortUrl) != -1) {
			fra[i].contentWindow.$(elementId).datagrid("reload");
		}
	}
}
		
function removeImportantevent(){
	var rows = $('#10060201').datagrid('getSelections');
	if (rows.length > 0){
		var ids="",names="";
		for(var i=0;i<rows.length;i++){
			ids += ","+rows[i].eventid;
		}
		if(ids.length > 0)ids = ids.substring(1);
		$.messager.confirm("删除","您确定要删除选择的信息吗？\n\t",function(r){
			if (r){		
			  	var postUrl = 'deleteImportantEvent.do?ids=' + ids;
				$.post(postUrl,function(result){
					if (result.success){
						$('#10060201').datagrid('reload');	// reload the user data
						$('#10060201').datagrid('clearSelections'); //clear selected options
					} else {
						$.messager.alert('错误',result.msg,'error');
						return;
					}
				},'json');
			}
		});
	}else{
		$.messager.alert('提示','请选中一条记录','info');
		return;
	}
}
function back(){
	var rows = $('#10060201').datagrid('getSelections');
	if (rows.length > 0){
		var ids="",names="";
		for(var i=0;i<rows.length;i++){
			ids += ","+rows[i].eventid;
		}
		if(ids.length > 0)ids = ids.substring(1);
		$.messager.confirm("撤回","您确定要撤回选择的信息吗？\n\t",function(r){
			if (r){		
			  	var postUrl = 'deleteImportantEvent.do?ids=' + ids;
				$.post(postUrl,function(result){
					if (result.success){
						$('#10060201').datagrid('reload');	// reload the user data
						$('#10060201').datagrid('clearSelections'); //clear selected options
					} else {
						$.messager.alert('错误',result.msg,'error');
						return;
					}
				},'json');
			}
		});
	}else{
		$.messager.alert('提示','请选中一条记录','info');
		return;
	}
}

function enterEvent(){
    key=window.event.keyCode;
    if(key==0xD){//判断是否按下回车键 
     	queryImportantevent(); 
    } 
}

function addImportanteventObj(){
	
	if( $("#type").val() == "" ){
		$.messager.alert("提示","请选择请假类型","info");
 		 return false;
	}else if( $("#starttime").val() == "" ){
		$.messager.alert("提示","请输入起始时间","info");
 		 return false;
	}else if( $("#endtime").val() == ""){
		$.messager.alert("提示","请输入终止时间","info");
 		 return false;
	}else if($("#starttime").val() > $("#endtime").val()){
 		$.messager.alert("提示","起始时间不能大于终止时间","info");
 		 return false;
 	}else if($("#reason").val() == "" ){
		$.messager.alert("提示","请输入请假原因","info");
 		 return false;
 	}else if($("#arranged").val() == "" ){
		$.messager.alert("提示","请输入工作安排","info");
 		 return false;
 	}else{
 		if( $('#importantevent').form('validate')){
 			$.messager.alert('正确',"成功",'确定',function(){
		    	cloImportantevent();
			});
 		}
 	}
}
function auditObj(){
	
	if( $("#type").val() == "" ){
		$.messager.alert("提示","请选择审核结果","info");
 		 return false;
	}else if( $("#detail").val() == "" ){
		$.messager.alert("提示","请输入审核备注","info");
 		 return false;
	}else{
 		if( $('#importantevent').form('validate')){
 			$.messager.alert('正确',"成功",'确定',function(){
		    	cloImportantevent();
			});
 		}
 	}
}
		
function cloImportantevent(){
	parent.$('#dlg').dialog('close');
	//parent.closeDlg();
}

var eventID = this.location.search.substr(1).split("=")[1];
function load(){
  var postUrl = 'getImportantevent.do';
　　$.getJSON(
         postUrl,{'eventID':eventID,'random=':new Date().getTime()},
         function(data) {
             $('#importantevent').form('load',data.glBo);
         }
    );
}

function updateImportanteventObj(){
    url ='updateImportantEvent.do';
	$('#importantevent').form('submit',{
		url:url,
		onSubmit: function(){
			if( $("#stattime").val() == "" && $("#endtime").val() != ""){
				$.messager.alert("提示","请输入起始时间","info");
		 		 return false;
			}
			if( $("#stattime").val() != "" && $("#endtime").val() == ""){
				$.messager.alert("提示","请输入终止时间","info");
		 		 return false;
			}
			if($("#stattime").val() > $("#endtime").val()){
		 		$.messager.alert("提示","起始时间不能大于终止时间","info");
		 		 return false;
		 	}
			return $('#importantevent').form('validate');
		},
		success: function(result){
			var result = eval('('+result+')');
			if (result.success){
			    $.messager.alert('正确',result.ok,'确定',function(){
					cloImportantevent();
					reloadData('importantevent.htm','#10060201');
				});
			} else {
				$.messager.alert('错误',result.msg,'error');
			}  
		}
	});
}

function loadFroView(){
	
	var postUrl = 'getImportantevent.do';
　　$.getJSON(
         postUrl,{'eventID':eventID,'random=':new Date().getTime()},
         function(data) {
        	 getInfoPrivilege(data.glBo,function(){
	             $("#eventname").text(data.glBo.eventname);
	             $("#eventno").text(data.glBo.eventno);
	             $("#stattime").text(data.glBo.stattime);
	             $("#endtime").text(data.glBo.endtime);
	             
	             $("#x0").text(data.glBo.x0);
	             $("#y0").text(data.glBo.y0);
	             
	             $("#gasreq").text(data.glBo.gasreq);
	             $("#gasreqbyday").text(data.glBo.gasreqbyday);
	             $("#shortdesc").text(data.glBo.shortdesc);
	             $("#details").text(data.glBo.details);
	             $("#lxperson").text(data.glBo.lxperson);
	             $("#lxtele").text(data.glBo.lxtele);
	             $("#remarks").text(data.glBo.remarks);
             });
         }
    );
}
