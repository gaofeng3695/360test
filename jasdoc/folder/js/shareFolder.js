personchoose = {
	showPersonWindow : function() {
	var deptIds = $("#deptIds").val();
	var roleIds = $("#roleIds").val();
	var userIds = $("#userIds").val();
	var deptroleuserNames = $("#sharescope").val();
		top.getDlg(rootPath + "/jasframework/privilege/page/personfordoc.htm?deptIds="+deptIds+"&roleIds="+roleIds+"&userIds="+userIds+"&deptroleuserNames="+deptroleuserNames+"&r="+new Date().getTime()+"&pagelocation="
				+ window.document.location.href, "dlga", "选人", 700, 500, true);
	},
	setShare : function(deptroleuserNames,deptIds,roleIds,userIds) {
		$("#sharescope").val(deptroleuserNames);
		$("#deptIds").val(deptIds);
		$("#roleIds").val(roleIds);
		$("#userIds").val(userIds);
	}
};

//选中下面的权限自动选中上面的权限
function clickBox(type){
	if($("#"+type).find(":checkbox").attr('checked')){
		$('#privelegetype div').each(function() {
			if (type >= $(this).attr('id')) {
				$(this).find(":checkbox").attr("checked",true); 
			}
		});
	}else{
		$('#privelegetype div').each(function() {
			if (type <= $(this).attr('id')) {
				$(this).find(":checkbox").attr("checked",false); 
			}
		});
	}
}
function saveShare(){
	var role = "";
	$('#privelegetype div').each(function() {
		if($(this).find(":checkbox").attr("checked")=="checked"){
			if (role <= $(this).attr('id')) {
				role = $(this).attr('id');
			}
		}
		});
	$("#role").val(role);
	if($("#sharescope").val()==null||$("#sharescope").val()==""){
		top.showAlert("提示","请选择共享范围。","info");
	}else if($("#shareRemark").val()==null||$("#shareRemark").val()==""){
		top.showAlert("提示","请填写共享说明。","info");
	}else if(!($("#"+20).find(":checkbox").attr('checked')||$("#"+30).find(":checkbox").attr('checked')||$("#"+40).find(":checkbox").attr('checked')||$("#"+50).find(":checkbox").attr('checked')||$("#"+60).find(":checkbox").attr('checked'))){
		top.showAlert("提示","请选择权限类型。","info");
	}else if($("#endDate").val()==null||$("#endDate").val()==""){
		top.showAlert("提示","请选择过期时间。","info");
	}else{
		$('#fileShare').form('submit',{
		url: "../../share/saveShareFolder.do?role = "+role+"&token="+localStorage.getItem("token"),
		onSubmit: function(){
			return $(this).form('validate');
		},
		dataType:"json",
		success: function(result){
			var result=	eval('('+result+')');
			if(result.success==1){
				top.showAlert("提示",result.ok,"info",function(){
					reloadData('queryFoderShareDetails.htm', 'dg');
					try{
						top.reloadMyShareFolder();
					}catch(e){
						alert("刷新我共享的文件夹数据错误");
					}
					closePanol();
				});
						
			}else{
				top.showAlert("提示",result.ok,"info",function(){});
			}
		}
	});
	}
}
$(document).ready(function(){
	var shareid = getParamter("shareid");
	if(shareid!=null&&shareid!=""){
		$("#shareid").val(shareid);
		getMessageById(shareid);
	}
	var role = getParamter("role");
	$('#privelegetype div').each(function() {
			if (role <= $(this).attr('id')) {
				$(this).css("display","none"); 
			}
	});
	var eventid = getParamter("eventid");
	var createuser = getParamter("createuser");
	$("#eventid").val(eventid);
	$("#shareid").val(shareid);
	$("#createuser").val(createuser);
	
});
function reloadData(shortUrl, elementId) {
		var fra = parent.$("iframe");
		for ( var i = 0; i < fra.length; i++) {
			if (fra[i].src.indexOf(shortUrl) != -1) {
				fra[i].contentWindow.$('#'+elementId).datagrid("reload");
			}
		}
}	
//修改时，显示原有信息
function getMessageById(shareid){
	$.ajax({ 
		url: "../../share/getShareFolderById.do?id="+shareid,
		success: function(result){
        	var data = jQuery.parseJSON( result ); 
        	$("#deptIds").val(data.sharescropMap.deptIds);
        	$("#roleIds").val(data.sharescropMap.roleIds);
        	$("#userIds").val(data.sharescropMap.userIds);
        	$("#userIds").val(data.sharescropMap.userIds);
        	$("#sharescope").val(data.sharescrop);
        	$("#shareRemark").val(data.remark);
        	$("#endDate").val(data.overdate);
        	if(data.shareprivilegetype == 20){
        		$("#"+data.shareprivilegetype).find(":checkbox").attr("checked","true");
        	}else if(data.shareprivilegetype == 30){
        		$("#"+20).find(":checkbox").attr("checked","true");
        		$("#"+data.shareprivilegetype).find(":checkbox").attr("checked","true");
        	}else if(data.shareprivilegetype == 40){
        		$("#"+20).find(":checkbox").attr("checked","true");
        		$("#"+30).find(":checkbox").attr("checked","true");
        		$("#"+40).find(":checkbox").attr("checked","true");
        	}else if(data.shareprivilegetype == 50){
        		$("#"+20).find(":checkbox").attr("checked","true");
        		$("#"+30).find(":checkbox").attr("checked","true");
        		$("#"+40).find(":checkbox").attr("checked","true");
        		$("#"+50).find(":checkbox").attr("checked","true");
        	}else if(data.shareprivilegetype == 60){
        		$("#"+20).find(":checkbox").attr("checked","true");
        		$("#"+30).find(":checkbox").attr("checked","true");
        		$("#"+40).find(":checkbox").attr("checked","true");
        		$("#"+50).find(":checkbox").attr("checked","true");
        		$("#"+60).find(":checkbox").attr("checked","true");
        	}
     	}
	});
}
function closePanol(){
	top.closeDlg('share');
}