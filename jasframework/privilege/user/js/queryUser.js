/** 
 * @file
 * @author  张超飞
 * @version 1.0 
 * @desc  用户主页面js
 * @date  2012-12-18
 * @last modified by lizz
 * @last modified time  2017-08-17
 */

var userRequestPage = rootPath+"jasframework/privilege/user/";
var userRequestUrl = rootPath+"jasframework/privilege/user/";
var userDatagridID = "10060201";

$(function(){
	initTree();
	//datagrid初始化
  	$("#"+userDatagridID).datagrid({
		autoRowHeight: false,
		fitColumns:true,
		idField:'oid',
		nowrap:true,
		columns:[[
		      {field:getLanguageValue("ck"),checkbox:true},   
			  {field:'loginName',title:getLanguageValue("user.loginname"),align:"center",width:100},   
			  {field:'userName',title:getLanguageValue("user.username"),align:"center",width:100}, 
			  {field:'userPostName',title:'用户岗位',align:"center",width:100}, 
			  {field:'roleNames',title:getLanguageValue("user.roleName"),align:"center",width:100}, 
			  {field:'unitName',title:getLanguageValue("user.unitName"),align:"center",width:100}, 
			  {field:'createDatetime',title:'创建时间',align:"center",width:100},
			 /* {field:'isPis',title:"是否PIS用户",align:"center",width:100,formatter:function(value,row,index){
				  if(value == 1){
					  return "是";
				  }else{
					  return "否";
				  }
			  }}, 
			  {field:'cnpcADUser',title:"CNPC登录名",align:"center",width:100}, 
			  {field:'ptrADUser',title:"PTR登录名",align:"center",width:100}, 
			  {field:'syncDate',title:"同步时间",align:"center",width:120,formatter:function(value,row,index){
				  if(value){
					  var date = new Date(value);
					  return date.getFullYear()+"-"+getzf(date.getMonth() + 1)+"-"+getzf(date.getDate())+" "+getzf(date.getHours())
					  	+":"+getzf(date.getMinutes())+":"+getzf(date.getSeconds());
				  }
			  }}, */
			  {field:'phone',title:getLanguageValue("user.phone"),align:"center",width:100},
			  {field:'email',title:getLanguageValue("user.email"),align:"center",width:150},
			  {field:'passwordExpiredDate',title:getLanguageValue("user.passwordExpiredDate"),align:"center",width:150,hidden:true},
			  {field:'description',title:getLanguageValue("user.description"),align:"center",width:200}
//			  ,
//			  {field:'operate',title:getLanguageValue("user.operate"),width:150,align:"center",formatter: function(value,row,index){
//					if (row.oid){
//						var opt = '<p class="table-operate"><a href="#" title = "' + getLanguageValue("view")+'" onclick="viewUser(\'' + row.oid+'\')">\
//										<span class="fa fa-eye"></span>\
//								   </a><a href="#" title = "' + getLanguageValue("edit")+'" onclick="editUser(\'' + row.oid+ '\'\,\'' + row.loginName+'\')">\
//										<span class="fa fa-edit"></span>\
//							   	   </a><a href="#" title = "' + getLanguageValue("delete")+'" onclick="removeUser(\'' + row.oid+'\')">\
//										<span class="fa fa-minus"></span>\
//							       </a><a href="#" title = "' + getLanguageValue("user.jiaoseshezhi")+'" onclick="setRole(\'' + row.oid+'\')">\
//										<span class="fa fa-cog"></span>\
//								   </a></p>'
//						return opt
//					} 
//				}}
			]],
			/*title:"用户查询列表",*/
			onDblClickRow : function(index, row) {
				  $("#"+userDatagridID).datagrid('selectRow',index);  //指定行选中
				  viewUser(row.oid);
			},
			onClickRow:function(index,indexData){
				var rows = $("#"+userDatagridID).datagrid('getSelections');
				for(var i=0;i<rows.length;i++){
					if(rows[i].isPis == '1'){
						$('#P-PRI-0101').linkbutton('disable');
						$('#P-PRI-0140').linkbutton('disable');
						return;
					}
				}
				$('#P-PRI-0101').linkbutton('enable');
                $('#P-PRI-0140').linkbutton('enable');
			},
			onLoadSuccess:function(data){
		    	$("#"+userDatagridID).datagrid('clearSelections'); //clear selected options
		    }
	});
  	
    //高级搜索
	$("#moreQuery").click(function(){
		$(this).toggleClass("active");
		$("#moreTable").toggleClass("active");
		var span = $(this).children().find(".l-btn-icon");
		if($(this).hasClass("active")){
			$(span).removeClass("accordion-expand").addClass("accordion-collapse");
			initDatagrigHeight('10060201','userQuery','147','right');
		}else{
			$(span).removeClass("accordion-collapse").addClass("accordion-expand");
			initDatagrigHeight('10060201','userQuery','64','right');
		}
	});
	$('input[name="userrange"]').change(function() { 
		queryUser();
	});
	
  	tempWidth = $('#right').css('width');
	if(tempWidth.lastIndexOf('px')>0){
		tempWidth = parseInt(tempWidth.substring(0,tempWidth.length-2));
	}
	
	initDatagrigHeight('10060201','userQuery','64','right');
	initResize();

	$('#moreQuery').trigger('click');
});

	var clientWidth = document.documentElement.clientWidth;
	var clientHeight = document.documentElement.clientHeight;
	var div_left_width = 200;
	var tempWidth = 0;
	
	
	
 	/**
 	 * @desc 页面自适应
 	 */
	$(window).bind("resize",function(){
		resizeLayout();
	});
	
	/*function initTree(){
		$('#tt').tree({		
			url: rootPath+'jasframework/privilege/unit/getLeftTree.do',
			onLoadSuccess:function(node,data) {
			 	var aa=$('#tt').tree('select',$('#tt').tree('getRoot').target);
				/!* 为了符合西南个性化需求，管道科的人拥有上级部门的权限，所以呢，就要单独写一个Service。 *!/
				var url = rootPath+"jasframework/privilege/syncDeptUser/getList.do?unitId="+$('#tt').tree('getRoot').id;
				getChildren();
				$("#"+userDatagridID).datagrid("options").url = url;
				$("#"+userDatagridID).datagrid('load'); 
			},
			onClick:function(node){
				$("#"+userDatagridID).datagrid('clearSelections'); // clear
				queryUser();
				if(node.attributes.type){
					//$("#toolbar").hide();
				}else{
					$("#toolbar").show();
				}
			}
		});
	}*/

	function initTree(){
		$('#tt').tree({
			// url: rootPath+'jasframework/privilege/unit/getLeftTree.do',
			url: rootPath+'jasframework/privilege/syncDeptUser/getLeftTree.do',
			onLoadSuccess:function(node,data) {
				var aa=$('#tt').tree('select',$('#tt').tree('getRoot').target);
				/* 为了符合西南个性化需求，管道科的人拥有上级部门的权限，所以呢，就要单独写一个Service。 */
				var url = rootPath+"jasframework/privilege/syncDeptUser/getList.do?userRange=1&&unitId="+$('#tt').tree('getRoot').id;
                var userrange = $("input[name='userrange']:checked").val();
                if(userrange==1){
                    var unitidList = getChildren();
                    url = rootPath+"jasframework/privilege/syncDeptUser/getList.do?unitIdList=" + unitidList;
                }else{
                    url=rootPath+"jasframework/privilege/syncDeptUser/getList.do?unitId=" + $('#tt').tree('getRoot').id;
                }

				getChildren();
				$("#"+userDatagridID).datagrid("options").url = url;
				$("#"+userDatagridID).datagrid('load');
			},
			onClick:function(node){
				$("#"+userDatagridID).datagrid('clearSelections'); // clear
				queryUser();
				if(node.attributes.type){
					//$("#toolbar").hide();
				}else{
					$("#toolbar").show();
				}
			}
		});
	}

	/**
 	 * @desc 窗口的自适应处理
 	 */
	function resizeLayout(){
		try{

			clientWidth = document.documentElement.clientWidth;
			clientHeight = document.documentElement.clientHeight;
			var div_left_width = $("#left").width()+10;
	
			$('#userQuery').panel('resize',{width:clientWidth-div_left_width-5}); 
			$("#"+userDatagridID).datagrid('resize',{width:clientWidth-div_left_width-5,height:clientHeight-$('#userQuery').panel('panel').height()});
			$('#userrange').combobox({
				width :  $('#right').width() * 0.35
			});
		}catch(e){
		}
	}
	
/**
 * @desc 初始化页面绑定事件
 */
function initResize(){
	
	//自动适应页面大小
	$(".layout-button-left").bind("click",function(){
		$('#userQuery').panel('resize',{width:clientWidth-28-6});
		$("#"+userDatagridID).datagrid('resize',{width:clientWidth-28-6});
		/*$(".layout-button-right").bind("click",function(){
			resizeLayout();
			
			$('#userQuery').panel('resize',{width:tempWidth}); 
			$("#"+userDatagridID).datagrid('resize',{width:tempWidth});
		});*/
	});
}

/**
 * @desc 用户角色设置
 */
function setRoleRow(){
	var rows = $("#"+userDatagridID).datagrid("getSelections");
	if (rows.length != 1) {
		top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"), "info");
		return;
	}
	var row = rows[0];
	setRole(row.oid);
}
function setRole(userId){
	if(!isNull(userId)){
		top.getDlg(userRequestPage+"userRole.htm?refreshPage=queryUser&userId="+userId,"config",getLanguageValue('user.jiaoseshezhi'),550,440,false,true,true);
	}
}

/**
 * @desc 添加用户
 */
function addUser(){
	 var row = $('#tt').tree('getSelected');	
	 if (row != null ){	
		var unitId= row.id; 
	 	var url=userRequestPage+"addUser.htm?refreshPage=queryUser&unitId="+unitId;
		top.getDlg(url,"addUserIframe",getLanguageValue('user.xinzengyonghu'),710,300,false,true,true);
	 }else{
		top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"),'info');
		return;
	}
}

//修改用户信息
function editUserRow() {
	var rows = $("#"+userDatagridID).datagrid("getSelections");
	if (rows.length != 1) {
		top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"), "info");
		return;
	}
	var row = rows[0];
	editUser(row.oid);
}
function editUser(userId){
	if(!isNull(userId)){
		top.getDlg(userRequestPage+"updateUser.htm?id="+userId,"editUserIframe",getLanguageValue('user.xiugaiyonghu'),710,350);
	}
	
}


/**
 * @desc 修改用户密码
 */
function editpassword(index){
	var rows;
	if(!isNull(index)){
		$("#"+userDatagridID).datagrid('selectRow',index);  //指定行选中
	}
	rows = $("#"+userDatagridID).datagrid('getSelections');
	
	if(rows.length == 1) {
		top.getDlg(rootPath+"privilege/user/editPassword.htm?refreshPage=queryUser&id="+rows[0].oid,"editiframe",getLanguageValue('user.xiugaimima'),710,300,false,true,true);
	} else {
		top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"),'info');
	}
}
//查看用户详情
function viewUserRow() {
	var rows = $("#"+userDatagridID).datagrid("getSelections");
	if (rows.length != 1) {
		top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"), "info");
		return;
	}
	var row = rows[0];
	viewUser(row.oid);
}
function viewUser(userId){
	if(!isNull(userId)){
		top.getDlg(userRequestPage+"viewUser.htm?id="+userId,"viewUserIframe",getLanguageValue('user.chakanyonghu'),800,450);
	}
}

//删除用户
function removeUserRow() {
	var rows = $("#"+userDatagridID).datagrid("getSelections");
	if (rows.length != 1) {
		top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"), "info");
		return;
	}
	var ids="";
	for(var i=0;i<rows.length;i++){
		ids += ","+rows[i].oid;
	}
	if(ids.length > 0) ids = ids.substring(1);
	removeUser(ids);
}
function removeUser(userIds){
	var oidList = userIds.split(",");
	var str = JSON.stringify({"idList" : oidList});
//	alert(str);
	$.messager.confirm(getLanguageValue("delete"),getLanguageValue("user.deletecomfirm"),function(r){
		if (r){
			$.ajax({
				url: rootPath+"jdbc/commonData/user/deleteBatch.do",//调用新增接口
				   data: str,
				   type: "POST",
				   contentType: "application/json;charset=utf-8",
				   dataType:"json",
				   async:false,
				   success: function(data){
						if(data.status==1){
							top.showAlert(getLanguageValue("tip"),getLanguageValue("deletesuccess"),"info",function(){
								$("#"+userDatagridID).datagrid('reload');	
								$("#"+userDatagridID).datagrid('clearSelections'); 
							});
						}else{
							top.showAlert(getLanguageValue("error"),data.msg,"error");
						}
				   },
				   error : function(data) {
						top.showAlert(getLanguageValue("error"), data.msg, 'info');
					}
				});
		}
	});
}

/**
 * @desc 重置用户密码
 */
function resetUserPwd(){
	var rows = $("#"+userDatagridID).datagrid('getSelections');
	if (rows.length > 0){
		var ids="";
		for(var i=0;i<rows.length;i++){
			ids += ","+rows[i].oid;
		}
		if(ids.length > 0)ids = ids.substring(1);
		$.messager.confirm(getLanguageValue('user.resetpass'),getLanguageValue('user.resetconfirm'),function(r){
			if (r){
				var postUrl = rootPath+'jasframework/privilege/user/resetUserPWD.do?ids=' + ids + '&rd='+Math.random();
				$.post(postUrl,function(result){
					if (result.success){
			top.showAlert(getLanguageValue('success'),getLanguageValue('user.resetsuccess'),'info');
					} else {
						top.showAlert(getLanguageValue("error"),result.msg,'error');
						return;
					}
				},'json');
			}
		});
	}else{
		top.showAlert(getLanguageValue("tip"),getLanguageValue("pleasechoose"),'info');
		return;
	}
}
/**
 * @desc 修改用户密码(已过时)
 */
function editUserPass(){
	var rows = $("#"+userDatagridID).datagrid('getSelections');
	if (rows.length == 1){
		var row = $("#"+userDatagridID).datagrid('getSelected');
		var eventID =row.oid;
		top.getDlg(rootPath+"privilege/user/updateUserPass.htm?random="+new Date().getTime()+"&id="+eventID,"updateiframe",getLanguageValue('user.xiugaimima'),450,170,false,true,true);		
	}else{
		top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"),'info');
	}
}

/**
 * @desc 获取选中的树节点
 */
function getChildren(){
	var node = $('#tt').tree('getSelected');
    if (node) {
        var children = $('#tt').tree('getChildren', node.target);
    }
    else {
        var children = $('#tt').tree('getChildren');
    }
    var s = node.id;
    for (var i = 0; i < children.length; i++) {
        s += "," + children[i].id
    }

    s+=node.id + "'";
    //alert(s);
    return s;
}


/**
 * @desc 查询用户
 */
function queryUser(){
	$("#"+userDatagridID).datagrid('clearSelections'); // clear
	var loginName = ($("#loginName").val()||"")!=""?"%"+$("#loginName").val()+"%":"";
	var userName = ($("#userName").val()||"")!=""?"%"+$("#userName").val()+"%":"";
	var userrange = $("input[name='userrange']:checked").val();
	var query={"loginName":loginName,"userName":userName,"userRange":userrange};
	var row = $('#tt').tree('getSelected');
	var url;
	if (row != null ){	
		if(userrange==1){
	 		var unitidList = getChildren();
			url = rootPath+"jasframework/privilege/syncDeptUser/getList.do?unitIdList=" + unitidList;
		}else{
			url=rootPath+"jasframework/privilege/syncDeptUser/getList.do?unitId=" + row.id;
		}	
		$("#"+userDatagridID).datagrid("options").url = url;
		$("#"+userDatagridID).datagrid('options').queryParams=query;
		$("#"+userDatagridID).datagrid('load');	
		$("#"+userDatagridID).datagrid('options').queryParams=null;
	 }else{
		top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"),'info');
		return;
	}
}

/**
 * @desc 清空查询条件
 */
function clearselectform(){
	$("#loginName").val("");
	$("#userName").val("");
	$("#userrange").combobox("setValue","");
	
}

/**
 * 同步用户数据
 * @returns
 */
function syncUser(){
	var url = rootPath+'jasframework/privilege/syncDeptUser/syncUser.do';
	showLoadingMessage("正在同步人员，请稍候。。。");
	$.post(url, function(result) {
		if (result == 1) {
			initTree();
			hiddenLoadingMessage();
			top.showAlert(getLanguageValue("tip"),"同步人员成功！",'info');
		} else {
			hiddenLoadingMessage();
			top.showAlert(getLanguageValue("error"), "同步异常，请联系系统管理员！" , 'error');
			return;
		}
	}, 'json');
}



//补0操作
function getzf(num){
	if(parseInt(num) < 10){
		num = '0'+num;
	}
	return num;
}