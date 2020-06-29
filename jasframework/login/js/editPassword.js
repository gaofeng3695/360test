var userId = getParamter("userId");
var msg = getParameter("msg");
window.onload = function() {
	if(msg!=null){
		//如果找回密码链接过期，则询问用户是否回到登录页面，重新发起找回密码的操作
		$.messager.alert(getLanguageValue("tip"), msg, "info",function(){
			window.location = 'login.htm';
		});
	}
};
/**
 * 保存修改
 */
function save() {
	$("#eventid").val(userId);
	var newPassword = $("#newPassword").val();
	var confirmPassword = $("#confirmPassword").val();
	if(newPassword==""){
		$.messager.alert(getLanguageValue("tip"),getLanguageValue("user.writeNewPassword"),'info');
		return false;	
	}
	if(confirmPassword==""){
		$.messager.alert(getLanguageValue("tip"),getLanguageValue("user.writeConfirmPassword"),'info');
		return false;	
	}
	if(newPassword != confirmPassword){
		$.messager.alert(getLanguageValue("tip"),getLanguageValue("user.passdifferent"),'info');
		return false;
	}
	var url = rootPath+"jasframework/login/savePassword.do";
	$('#editPassword').form('submit', {
	   	url: url,
   		dataType:"json",
	   	success: function(result){
	   		var result = eval('(' + result + ')');
			if (result.success){
				$.messager.confirm(getLanguageValue("tip"),result.msg,function(r){
						if (r){
							window.location = 'login.htm';
						}
					});
			} else {
				$.messager.alert(getLanguageValue("error"),result.msg,result.error);
			}
		}
	});
}



