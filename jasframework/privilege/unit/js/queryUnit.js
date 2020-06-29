	
/**
 * 初始化
 */
$(function() {
	initTree();
});

	function initTree(){
		//初始化部门树
		$('#tt').tree( {
			url : rootPath+'jasframework/privilege/unit/getLeftTree.do?random='+new Date().getTime(),
			onLoadSuccess:function(node,data) {
				//加载成功后选中根节点
		 		$('#tt').tree('select',$('#tt').tree('getRoot').target);
	 			url = rootPath+'jasframework/privilege/syncDeptUser/findUnitById.do?oid='+data[0].id;
				$.post(url, function(bo) {
//					$('#right').form('load', bo);
					loadData(bo);
				}, 'json');
//					$("#delbtn").attr("disabled", "disabled");
				$('#delbtn').linkbutton('disable');
				$('#editbtn').linkbutton('disable'); 
			},
			onBeforeExpand : function(node,param){
			},
			onClick : function(node) {
	 			url = rootPath+'jasframework/privilege/syncDeptUser/findUnitById.do?oid=' + node.id;
				$.post(url, function(bo) {
					console.log(bo);
//					$('#right').form('load', bo);
					loadData(bo);
				}, 'json');
				if (node.attributes.type==0) {
//						$("#delbtn").attr("disabled", "disabled");
					$('#delbtn').linkbutton('disable');
					$('#editbtn').linkbutton('disable'); 
				} else {
					$('#addbtn').linkbutton('enable'); 
					$('#editbtn').linkbutton('enable'); 
					$('#delbtn').linkbutton('enable'); 
//						$("#addbtn").removeAttr("disabled");
//						$("#editbtn").removeAttr("disabled");
//						$("#delbtn").removeAttr("disabled");
				}
			}
		});
	}
	
	/**
	 * 描述：增加新部门
	 */
	function newUnit() {
		var row = $('#tt').tree('getSelected');
		var eventID;
		if (row != null) {
			eventID = row.id;
			url = rootPath+"jasframework/privilege/unit/addUnit.htm?parentid=" + eventID;
			top.getDlg(url, "saveiframe", getLanguageValue("unit.xinzengbumen"), 750, 550);
		} else {
			top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"), 'info');
			return;
		}
	}


	/**
	 * 描述：修改按钮事件
	 */
	function editUnit() {
		var eventID;
		var isroot=false;
		var row = $('#tt').tree('getSelected');
		var treeroot=$("#tt").tree("getRoot");
		if(row.id==treeroot.id){
			isroot=true;
		}
		if (row != null) {
			eventID = row.id;
			url = rootPath+"jasframework/privilege/unit/updateUnit.htm?isroot="+isroot+"&eventID=" + eventID;
			top.getDlg(url, "saveiframe",getLanguageValue("unit.xiugaibumen"), 750, 550);
		} else {
			top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"), 'info');
			return;
		}
	}
	
	/* //检查部门是否存在用户
	function checkunituser(){
		var unitid=$('#tt').tree('getSelected').id;
	  	$.getJSON("checkUserByUnitId.do?unitid="+unitid,function(check) {
			if (check.error=='-1'){
				$.messager.confirm('提示', check.msg+"，确定继续吗？", function(r){
				if(r){
				 removeUnit();
				}
				
				});
			} else{
			 	removeUnit();
			}
		});
	} */
	
	/**
	 * 描述：删除部门
	 */
	function removeUnit() {
		var row = $('#tt').tree('getSelected');
		if(row.id== $('#tt').tree('getRoot').id){
			top.showAlert(getLanguageValue("tip"),getLanguageValue("unit.topunitnotdelete"),'info');
			return;
		}
		if (row != null) {
			//确认删除
			$.messager.confirm(getLanguageValue("unit.deleteunit"), getLanguageValue("unit.deletecomfirm"), function(r) {
				if (r) {
					var url = rootPath+'jasframework/privilege/unit/removeUnitById.do?oid=' + row.id;
					//执行删除
					$.post(url, function(result) {
						if (result.status == 1) {
							top.showAlert(getLanguageValue("unit.deleteunit"), result.msg, 'msg', function() {
							
								var parent11=$('#tt').tree('getParent',$('#tt').tree('getSelected').target);
							
								$('#tt').tree('remove',$('#tt').tree('getSelected').target);
								
					 			url = rootPath+'jasframework/privilege/unit/findUnitById.do?oid='+parent11.id;
								$.post(url, function(bo) {
//									$('#right').form('load', bo);
									loadData(bo);
								}, 'json');
								$('#tt').tree('select',$('#tt').tree('getRoot').target);
							});
									 	
	
						} else {
							top.showAlert(getLanguageValue("unit.deleteunit"), result.msg , 'error');
							return;
						}
					}, 'json');
	
				}
			});
		} else {
			top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"), 'info');
			return;
		}
	}
	
	var clientWidth = document.documentElement.clientWidth;
	var clientHeight = document.documentElement.clientHeight;
	$(document).ready(function(){
		//左侧div宽度
	 	var div_left_width = $(".panel-header").width()+18;
		my_resize(div_left_width);
		$(window).resize(function(){
			clientHeight = document.documentElement.offsetHeight;
			clientWidth = document.documentElement.offsetWidth;
			div_left_width = $(".panel-header").width()+18;
			my_resize(div_left_width);
		});
		//自动适应页面大小
		function my_resize(panelWidth){
			$("#cc").css("width",clientWidth);
			$("#cc").css("height",clientHeight);
			//$("#cc").layout('resize',{height:clientHeight,width:clientWidth});
			$('#left').panel('resize',{height:clientHeight,width:div_left_width});
			$('#right').panel('resize',{height:clientHeight,width:clientWidth - panelWidth});
			
//			if(top.$("#area_map_north").height() > 10 ){
//		 		$("#left").css("height",clientHeight-panel_header_height);
//				$("#right").css("height",clientHeight+15);
//			}else{
//				$("#left").css("height",clientHeight-panel_header_height);
//				$("#right").css("height",clientHeight);
//			}
		}
	
		$(".layout-button-left").hide();
		$(".layout-button-left").bind("click",function(){
			my_resize(div_left_width-21);
			clientWidth = document.documentElement.clientWidth;
			$(".layout-button-right").bind("click",function(){
				var temp = 0-div_left_width+145;
				my_resize(temp);
				clientWidth = document.documentElement.clientWidth;
			});
		});
	});
	
	/**
	 * 同步部门信息
	 * @returns
	 */
	function syncDept(){
		var url = rootPath+'jasframework/privilege/syncDeptUser/syncDept.do';
		showLoadingMessage("正在同步部门，请稍候。。。");
		$.post(url, function(result) {
			if (result == 1) {
				initTree();
				hiddenLoadingMessage();
				top.showAlert(getLanguageValue("tip"),"同步部门成功！",'info');
			} else {
				top.showAlert(getLanguageValue("error"), "同步异常，请联系系统管理员！", 'error');
				hiddenLoadingMessage();
				return;
			}
		}, 'json');
	}
	
	
	 /**
	  * 加载表单数据
	  */
	 function loadData(data){
		 $("#parentName").val(data.parentName);
		 $("#unitCode").val(data.unitCode);
		 $("#unitName").val(data.unitName);
		 $("#unitType").val(data.unitType);
		 $("#phone").val(data.phone);
		 $("#address").val(data.address);
		 $("#description").val(data.description);
		 $("#orderNum").val(data.orderNum);
		 if(data.isPis == 1){
			 $("#isPis").val("是");
			 $('#P-PRI-0082').linkbutton('disable');
		 }else{
			 $("#isPis").val("否");
			 $('#P-PRI-0082').linkbutton('enable');
		 }
		 if(data.syncDate){
			  var date = new Date(data.syncDate);
			  var d = date.getFullYear()+"-"+getzf(date.getMonth() + 1)+"-"+getzf(date.getDate())+" "+getzf(date.getHours())
			  	+":"+getzf(date.getMinutes())+":"+getzf(date.getSeconds());
			  $("#syncDate").val(d);
		 }
		 if(data.isPatrol == 1){
			 $("#isPatrol").val("是");
		 }else{
			 $("#isPatrol").val("否");
		 }
		 $("#lon").val(data.lon);
		 $("#lat").val(data.lat);
		 $("#minLon").val(data.minLon);
		 $("#minLat").val(data.minLat);
		 $("#maxLon").val(data.maxLon);
		 $("#maxLat").val(data.maxLat);
		 $("#pisUserIdName").val(data.pisUserIdName);
		 $("#isPipeOfficeName").val(data.isPipeOfficeName);
		 $("#throughCounties").val(data.throughCountiesName);
	 }
	 
	 //补0操作
	 function getzf(num){
	 	if(parseInt(num) < 10){
	 		num = '0'+num;
	 	}
	 	return num;
	 }