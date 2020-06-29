
/***页面载入时***/
var domainId=getParamter("id");
$(document).ready(function(){
	$("#eventId").val(domainId);
	$.ajax({
		url:rootPath+"/jasframework/privilege/dataprivilege/getBusinessDomainById.do",
		data:{"domainId":domainId},
		type:"POST",
		dataType:"json",
		success:function(data){
			$("#name").val(data.name);
			$("#description").val(data.description);
			$("#parentId").val(data.parentId);
		}
	
	});
});
function closeWindow(){
	parent.closeWindow('editBuisnessDomain');
}
function saveData(){
	var url=rootPath+"/jasframework/privilege/dataprivilege/updateBusinessDomainById.do";
	var businessDomainName=$("#name").val();
	$.ajax({
		type: "POST",
	   	url: rootPath+"/jasframework/privilege/dataprivilege/checkBusinessDomainNameExist.do",
   		data: {"businessDomainName":businessDomainName},
	   	success: function(check){
     		if (check.success=='0'){
				top.showAlert('错误','名称已存在！','error');
				return false;
			}else{
				$('#addData').form('submit',{
					url: url,
					onSubmit: function(){
						var bool= $(this).form('validate');
						if(!bool){
							enableButtion("savebutton");
							return bool;
						}
					},success: function(result){
						result=eval('('+result+')');
						if(result.success=="1"){
							parent.reloadTree();
							closeWindow();
						}else{
							top.showAlert('错误',result.error,'error');
						}
					}
				});
			}
	   	},
	   	dataType:"json",
	   	async:false
	});
}