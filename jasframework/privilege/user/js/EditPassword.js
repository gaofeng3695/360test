
/** 
 * @file
 * @author  xxx
 * @version 1.0 
 * @desc  修改密码js
 * @date  2012-08-30 上午17:46:07 
 * @last modified by lizz
 * @last modified time  2017-08-17
 */


/**
 * @desc 修改登录用户密码
 */
function editPassword(){
	var password = $("#newPwd").val();
	var odlpassword=$("#oldPwd").val();
	var confirmPassword=$("#confirmPassword").val();
	if(password==""){
		$.messager.alert('提示','请填写新密码','info');
			return false;	
	}
	if(odlpassword==""){
		$.messager.alert('提示','请填写原密码','info');
			return false;	
	}
	if(confirmPassword==""){
		$.messager.alert('提示','请填写确认密码','info');
			return false;	
	}
	if(yanzheng(password)){
		$.messager.alert('提示','密码不能有空格','info');
		return false;
	}
	var confirmPassword = $("#confirmPassword").val();
	if(password != 'undefined' && password != confirmPassword){
		$.messager.alert('提示','两次密码输入不一致','info');
		return false;
	}
	var formData = $("#editpassword").serializeToJson();
	formData.newPwd=password.toString().txtEncryption();
	formData.odlpassword=odlpassword.toString().txtEncryption();
	$.ajax({
		url: rootPath+"jasframework/privilege/user/editPassword.do",
	    method: "post",
	    contentType: "application/json;charset=utf-8",
	    dataType: "json",
	    data:JSON.stringify(formData),//获取表单中的json,
	    success: function(result){
	    	if(result.status==1){
				  $.messager.alert('提示', '修改密码成功', 'success',function(){
					  closePass();
	    	     });
			}else{
				  $.messager.alert('提示', result.msg, 'error');
			} 
	    }
	});
}


/**
 * @desc 修改登录用户密码
 * @param password 密码
 * @returns boolean
 */
function yanzheng(password){
	if(password.indexOf(" ")!=-1){
		return true;
	}else{
		return false;
	}
}

/**
 * @desc 关闭弹窗
 */
function closePass(){
	top. closeDlg("updateUserPass");
}	

