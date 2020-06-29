window.onload = function() {
	// 获得用户的信息，并将它们加载进页面当中
	getUserInfo();
};
function getUserInfo() {
	$.post(rootPath + "/jasframework/privilege/user/getLoginUser.do", function(result) {
		
		$("#loginName").html(result.loginName);
		$("#userName").html(result.userName);
		$("#phone").html(result.phone);
		$("#email").html(result.email);
		$("#passwordExpiredDate").html(result.passwordExpiredDate);
		$("#role").html(result.roleNames);
		$("#unit").html(result.unitName);
	}, 'json');

};

/**
 * 描述：关闭窗口
 */
function closeWindow(){
	top.closeDlg("viewiframe");
}

