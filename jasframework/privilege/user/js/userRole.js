function closePanel(){
		top. closeDlg("config");
	}
/**
 * 描述：重新加载数据
 * @param url 重新加载数据的页面
 * @param elementId datagridID
 */
	function reloadData(url, elementId){
		var fra= parent.$("iframe");
		for(var i=0; i<fra.length;i++) {
			if(fra[i].src.indexOf(url) != -1) {
				fra[i].contentWindow.$(elementId).datagrid("reload");
			}
		}
	}
	
	
	/**
	 * 描述：提交保存
	 */
	function save(){
		$('#savePcUser').form('submit',{
			url: url,//"createPcUser.do",
			onSubmit: function(){
				return $(this).form('validate');
			},
			success: function(result){
				var result = eval('('+result+')');
				if (result.success){
					reloadData('usermanagement.htm','#10060201');
					closePanel();
					//parent.$("iframe")[2].contentWindow.$("#dg").datagrid("reload");
					//fra[2].src=fra[2].src;
					
				} else {
					top.showAlert(getLanguageValue("error"),result.msg,'error');
				}
			}
		});
	}
	var userId;
	/**
	 * 描述：设置角色
	 */
	function userRoleConfig(){
		userId = getParamter("userId");
		var postUrl = rootPath+"jasframework/privilege/user/getUserRoleRef.do?userId="+userId;
		$.post(postUrl,function(result){
			if (result.success){
				$('#dlg_role').dialog('open').dialog('setTitle',getLanguageValue("user.setrole"));
				$("#hasRole").html("");
				$("#noHasRole").html("");
				var noHasRoleHtml= "";
				for(var i=0;i<result.noHasRole.length;i++){
					var role = result.noHasRole[i];
					if(role.roleName != 'admin' && role.roleName != 'superadmin')
						noHasRoleHtml += "<option value=\""+role.oid+"\">"+role.roleName+"</option>";
				}
				$("#noHasRole").append(noHasRoleHtml);
				
				var hasRoleHtml = "";
				for(var i=0;i<result.hasRole.length;i++){
					var role = result.hasRole[i];
					hasRoleHtml += "<option value=\""+role.oid+"\">"+role.roleName+"</option>";
				}
				$("#hasRole").append(hasRoleHtml);
			} else {
				top.showAlert(getLanguageValue("error"),result.msg,'error');
				return;
			}
		},'json');
		}
		/**
		 * 描述：转移目标
		 * @param a 角色
		 * @param b 角色
		 */
		function move(a,b){
            if(a.selectedIndex == -1){
               return;
            }
            for(var i=a.length-1;i>=0;i--){
                if (a[i].selected){
                	b.options.add(new Option(a[i].innerHTML,a[i].value));
                	a.remove(i);
                }
            }
        }
		
		/**
		 * 描述：保存角色与用户关系
		 */
		function saveUserOfRole(){
			disableButtion("saveButton");
			var roleIds = "";
			$("#hasRole > option").each(function(){
				roleIds += $(this).val() + ",";
			});
			if(roleIds != ""){
				roleIds = roleIds.substring(0,roleIds.length-1);
			}
			
			var postUrl = rootPath+"jasframework/privilege/user/saveUserRoleRef.do?userId="+userId+"&roleIds="+roleIds;
			$.post(postUrl,function(result){
				if (result.success){
						reloadData('queryUser.htm','#10060201');
						top.showAlert(getLanguageValue("tip"),getLanguageValue("savesuccess"),'info',function(){
						closePanel();
					});
				} else {
					top.showAlert(getLanguageValue("error"),result.msg,'error');
					return;
				}
			},'json');
			
		}
		//初始化
	$(function(){
		$('#dlg_role').panel('open');
			userRoleConfig();
	});
		