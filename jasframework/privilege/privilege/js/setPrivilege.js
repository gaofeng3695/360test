
//初始化
$(function() {
	
		loadRoleSelect();
		//getappsystem();
//		$("#roleSelect").change(function() {
//			if($("#roleSelect").val()==null || $("#roleSelect").val()==""){return;}
//			changeSelect();
//		});
//		$("#appnumber").combobox("onSelect",function(){
//		
//		});
//		$("#appnumber").change(function() {
//			alert(2)
//	
//		});
		/* $("#functionSelect").change(function() {
			
			if($("#roleSelect").val()==null || $("#roleSelect").val()==""){return;}
				changeSelect();
		}); */
	});
	// 选择所有
	function selectAll(checkedValue) {
		$("input[type=checkbox][name=resourceIdList]")
				.attr("checked", checkedValue);
	}
	function showProgress(msg, objid) {
		if (msg == null) {
			msg = getLanguageValue("processing");
		}
		var appendToObj = $(document.body);
		if (objid != null && objid != '') {
			appendToObj = $('#' + objid);
			if (appendToObj == null) {
				appendToObj = $(document.body);
			}
		}
	}
	/**
	 * 描述：加载角色列表
	 */
	function loadRoleSelect() {
		showProgress();
		$.getJSON(rootPath+"jasframework/privilege/role/getListNoSuperadmin.do?", function(d) {
			$('#roleId').combobox({
				 data:d.rows,
				 valueField:'oid',   
				 textField:'roleName'  ,
				 onSelect:function(record){
					 changeSelect(record.oid,$("#appId").combobox("getValue"));
				 },
				 onLoadSuccess:function(){
					if($("#roleId").combobox("getValue")!=null || $("#roleId").combobox("getValue")!=""){
						getappsystem();
					}
				 }
			}); 
			$('#roleId').combobox("setValue",d.rows[0].oid);
			setComboObjWidth('roleId',0.25,'combobox','MainArea');
			/*var APP_NUMBER=$("#appId").combobox("getValue");
			var url = rootPath+"jasframework/privilege/privilege/getAllConfig.do?roleId="+$("#roleId").combobox("getValue")+"&appId="+APP_NUMBER+"&r="+new Date().getTime();
			$('#privilegeId').tree( {
				url : url,
				checkbox:true,
				onLoadSuccess:function(node,data) {
					console.log(data);
				},
				onClick : function(node) {
				}
			});*/
		});
	
	}
	var setting = {
		check: {
			enable: true
		},
		data: {
			simpleData: {
				enable: true
			}
		},treeNodeKey : "oid"
	};

	
	/**
	 * 描述：获得所有权限数据
	 */
	function createTree () {
		var data=[];
		$.ajax({
			url:rootPath+"jasframework/privilege/privilege/getAllConfig.do?r="+new Date().getTime(),
			type: "POST",
			data:'roleId='+$("#roleId").combobox("getValue"),
			success:function(result){
				data=result;
			},
			async:false,
			dataType:'json'
		});
		build(pareseData(data));
	}
	
	
	/**
	 * 描述：解析权限数据
	 * @param data 权限数据
	 * @returns {Array}
	 */
	function pareseData(data) {
		$.each(data, function(i, item) {
			var field = "权限编号";
			item.name=field;
			item.url='';
			if (item.children.length > 0) {
				pareseData(item.children);
			}
		});
		var mokuai = '';
		var value = $("#functionSelect").val();
		if(value == 1) {
				mokuai = '功能菜单';
		} else if(value == 2) {
				mokuai  ='可搜索图层';
			} else if(value == 3 ) {
				mokuai = '切片图层';
			}
			var o = [{"name":mokuai,"open":'true',"children":data,"isParent":true}];
			
			return o;
	}
	function build(zNodes){
		$("#treeDemo").empty();
	}

	/**
	 * 描述：保存设置
	 */
	function saveConfig() {
		disableButtion("P-PRI-0340");
		var nodesChecked = $('#privilegeId').tree('getChecked');	// get checked nodes
		var nodePar = $("#privilegeId").tree("getChecked", "indeterminate");	// get indeterminate nodes
		var privilegeEventIds = '';
		for(var i=0; i<nodesChecked.length; i++){
			if (privilegeEventIds != '') { 
				privilegeEventIds += ',';
			}
			privilegeEventIds += nodesChecked[i].id;
		}
		for(var i=0; i<nodePar.length; i++){
			if (privilegeEventIds != '') {
				privilegeEventIds += ',';
			}
			privilegeEventIds += nodePar[i].id;
		}

		showProgress();
		var roleId = $("#roleId").combobox("getValue");
		$.post(rootPath+"jasframework/privilege/privilege/setPrivilege.do", {
			"roleId":roleId,
			"privilegeIds":privilegeEventIds+"",
			"appId":$("#appId").combobox("getValue")
		}, function(d) {
			if (d.success == 1) {
				top.showAlert(getLanguageValue("tip"),getLanguageValue("savesuccess"), 'info');
				changeSelect(roleId,$("#appId").combobox("getValue"));
			} else {
				top.showAlert(getLanguageValue("tip"), d.msg, 'error');
			}
			enableButtion("P-PRI-0340");
		}, 'json');
	}

	/**
	 * 描述：根据角色加载权限树
	 */
	function changeSelect(roleId,appId) {
		showProgress();
		//createTree();
		//var url = rootPath+"jasframework/privilege/privilege/getAllConfig.do?roleid="+$("#roleSelect").combobox("getValue")+"&appNumber="+$("#appnumber").combobox("getValue")+"&r="+new Date().getTime();
		var url = rootPath+"jasframework/privilege/privilege/getAllConfig.do?roleId="+roleId+"&appId="+appId;
		$('#privilegeId').tree( {
			url : url,
			checkbox:true,
			onLoadSuccess:function(node,data) {
				console.log(data);
			},onClick : function(node) {
			}
		});
	}
	
	/**
	 * 描述：获取应用系统并拼接成下拉列表
	 */
	function getappsystem(){
		$.ajax({
			url:rootPath+"/jasframework/privilege/application/getUserAppsystem.do",
			type:"post",
			success:function(result){
				$('#appId').combobox({
					 data:result,
					 valueField:'oid',   
					 textField:'appName'  ,
					 onSelect:function(record){
						 if($("#roleId").combobox("getValue")==null || $("#roleId").combobox("getValue")==""){return;}
						 changeSelect($("#roleId").combobox("getValue"),record.oid);
					 }
				}); 
				setComboObjWidth('appId',0.25,'combobox','MainArea');
				$('#appId').combobox("setValue",result[0].oid);
			},
			dataType:"json",
			 	async: false,
			 	error:function(){
			}
		});
		
	}
