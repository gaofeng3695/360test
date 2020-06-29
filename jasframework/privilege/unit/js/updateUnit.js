var isroot=getParamter("isroot");
	
var jso;
var parentEventid = "";
var oid = getParamter("eventID");	
var unitFormID="updateUnit";
	
/**
 * 初始化
 */
$(document).ready(function(){
	var comboxid='';
	var singleDomainName='';	// 单选值域
	comboxid+='isPipeOffice'+',';
	singleDomainName+='isPipeOffice'+","
	loadSelectData(comboxid,singleDomainName);
	
	pkfield=getParamter("id");
	getUnitById();
});

/**
 * 根据用户id获取用户信息
 * @returns
 */
function getUnitById(){
	$.ajax({
		url: rootPath+"jasframework/privilege/syncDeptUser/findUnitById.do",
		data :{"oid" : oid},
		type : 'GET',
		dataType:"json",
		success : function(data) {
			if(data.isPis == 1){
				$(".pisHidden").hide();
			}
			/*if(!data.parentId){
				 $('#parentId').attr("required", "false");
				 $('#unitName').attr("required", "false");
				 $('#unitCode').attr("required", "false");
				 $('#unitType').attr("required", "false");
			}else{
				$('#parentId').attr("required", "true");
				 $('#unitName').attr("required", "true");
				 $('#unitCode').attr("required", "true");
				 $('#unitType').attr("required", "true");
			}*/
			
			putValue(data);

			$('#isPipeOffice').combobox('setValue',data.isPipeOffice);
			
			$("#unitId").combotree({
				url: rootPath+'jasframework/privilege/unit/getLeftTree.do'
			});
			$("#pisUserId").combobox({
				url: addTokenForUrl(rootPath+'jasframework/privilege/syncDeptUser/getUserByUnitId.do?unitId='+oid),
				valueField:'oid',
			    textField:'userName'
			});
			$("#throughCounties").combotree({
				url: rootPath+'gpsprovincialcity/getLeftTree.do',
				multiple: true,
				onlyLeafCheck: true
			});

			$('#unitId').combotree('setValue', data.unitId);
			$('#pisUserId').combobox('setValue', data.pisUserId);
			var item = data;
			if(item.parentId){
				parenteventid = item.parentId
			 	if( parenteventid != ""){
					$("#parentId").combotree({
						url: addTokenForUrl(rootPath+'jasframework/privilege/unit/getLeftTree.do?isroot='+isroot),
						panelHeight:235,
						onSelect:function(node){
								var uniteventid=$("#oid").val();
								if(node.id==uniteventid){
									alert("上级部门不能为本部门");
									var unittree=$('#parentId').combotree("tree");
									var parentnone=unittree.tree("getParent",unittree.tree("getSelected").target);
									console.log(parentnone)
									$('#parentId').combotree("setValue",parentnone.id);
								}
						}
					});
					$('#parentId').combotree('setValue', parenteventid);
					if("true"==isroot){
						$("#parentId").combotree("disable");
					}
				 }else{
					$("#parentId").attr("disabled", "disabled");
				} 
			}
			$('#unitType').combobox('setValue', data.unitType);
			$('#editgroups').form('load',jso);
			setComboObjWidth('parentId',0.3,'combotree');
			setComboObjWidth('unitType',0.3,'combobox');
			setComboObjWidth("isPatrol", 0.3, "combobox");
			setComboObjWidth("pisUserId", 0.3, "combobox");
			setComboObjWidth("throughCounties", 0.77, "combotree");
			if(data.throughCounties != null){
				$('#throughCounties').combotree('setValues',data.throughCounties.split(","));
			}

		},
		error : function(result) {
			top.showAlert(getLanguageValue("error"), getLanguageValue("queryError"), 'info');
		}
	});
}
		
/**
 * 描述：重新加载数据
 * @param shortUrl 重新加载数据的页面
 * @param elementId 权限树的id
 */
function reloadData(shortUrl, elementId){
	var fra= parent.$("iframe");
	for(var i=0; i<fra.length;i++) {
		if(fra[i].src.indexOf(shortUrl) != -1) {
			fra[i].contentWindow.$(elementId).tree("reload");
			closeUnit();
			break;
		}
	}
	
}
/**
 * 描述：修改部门
 */
function updateUnit(){
	var name = $("#unitName").val();
	var unitCode = $("#unitCode").val();
	var parentEventid = $("#parentId").combotree("getValue");
	var childrenunit;
	var bool=false;
	var unittree=$("#parentId").combotree("tree");
	var unitobj=unittree.tree("find",oid);
	
	disableButtion("saveButton");
	var validateResault = $('#updateUnit').form("validate");
	if(validateResault == false){
//		top.showAlert(getLanguageValue("tip"), getLanguageValue("formVailidateFailed"), 'info');
		top.showAlert(getLanguageValue("tip"), "字段输入有误，不能保存！请重新输入。", 'info');
		enableButtion("saveButton");
		return validateResault;
	}

	if(unitobj){
		childrenunit=unittree.tree("getChildren",unitobj.target);
		$.each(childrenunit,function(i,n){
			if(parentEventid==n.id){
				top.showAlert(getLanguageValue("tip"),"上级部门不能为自己的子部门",'info');
	                bool=true;
			}
		});
		if(bool){
			return ;
		}
	}

	//检验部门是否存在
	console.log(name)
	//所辖管线途经县市 拆成字符串保存
	var value = $('#throughCounties').combotree('getValues'); //会返回id值的数组,逗号连接
	var param = $('#updateUnit').serializeToJson();
	if(value != undefined & value.length >0){
		var throughCountiesValues = "";
		for(j = 0,len=value.length; j < len; j++) {
			if ( value[j] != ""){
				throughCountiesValues += value[j];
				throughCountiesValues += ",";
			}
		}
		param.throughCounties = throughCountiesValues;
	}
	param.parentId = $("#parentId").combotree("getValue");
	$.ajax({
		type: "POST",
		//url: rootPath+'jdbc/commonData/unit/update.do',
		url: rootPath+'jasframework/privilege/unit/update.do',
		contentType: "application/json;charset=utf-8",
		data: JSON.stringify(param),
		success: function (result) {
			enableButtion("savebutton");
			if(result.status==1){
       		 top.showAlert("提示", "保存成功", 'info', function () {
                    reloadData('queryUnit.htm', '#tt');
                });
			}else if(result.code == "400") {
				top.showAlert("提示", "保存失败", 'error');

			}else{
				top.showAlert("提示", result.msg, 'info');
			}
		}
	});
}	
/**
 * 描述：关闭窗口
 */
function closeUnit(){
	top. closeDlg("saveiframe");
}

function putValue(json) {
	$("#oid").val(json.oid);
	$("#parentId").val(json.parentId);
	$("#unitName").val(json.unitName);
	$("#unitCode").val(json.unitCode);	
	$("#ordernum").val(json.orderNum);	
	$("#phone").val(json.phone);	
	$("#address").val(json.address);	
	$("#description").val(json.description);	
	$("#isPatrol").combobox('setValue', json.isPatrol);
	$("#lon").val(json.lon);
	$("#lat").val(json.lat);	
	$("#minLon").val(json.minLon);	
	$("#minLat").val(json.minLat);	
	$("#maxLon").val(json.maxLon);	
	$("#maxLat").val(json.maxLat);
	$("#throughCounties").val(json.throughCounties);
}


/**
 * @desc 加载新增，修改单选下拉列表框
 * @param comboxid 下拉列表框的id，以逗号隔开
 * @param singleDomainName 值域名称，以逗号隔开
 */
function loadSelectData(comboxid,singleDomainName){
	if(comboxid!='' && comboxid !=undefined){
		var select = comboxid.split(",");
		var singleDomainNameArr = singleDomainName.split(",");
		for(var i=0;i<select.length-1;i++){
			if(singleDomainNameArr[i]==''){
				continue;
			}
			var id=select[i];
			$('#' + id).combobox({
				panelHeight:100,
				url : rootPath+"jasframework/sysdoman/getDoman.do?domainName="+singleDomainNameArr[i],
				valueField : 'codeId',
				textField : 'codeName',
				onSelect : function(row){
					//保存个性表单的值域value值
					$('#'+id).val(row.codeId);
					$('#'+id+'ID').val(row.codeName);
				},
				onLoadSuccess:function(data){
					if(data.length>0){
//						$('#'+id).combobox('setValue',data[0].codeId);
					}
				}
			});
			setComboObjWidth(id,0.3,'combobox');
		}
	}
}

/**
 * @desc 加载新增，修改多选选下拉列表框
 * @param comboxid 下拉列表框的id，以逗号隔开
 * @param moreDomainName 值域名称，以逗号隔开
 */
function loadMoreSelectData(comboxid,moreDomainName){
	if(comboxid!='' && comboxid !=undefined){
		var select = comboxid.split(",");
		var moreDomainNameArr = moreDomainName.split(",");
		for(var i=0;i<select.length-1;i++){
			var id=select[i];
			$('#' + id).combobox({
				panelHeight:100,
				multiple:true,
				url : rootPath+"jasframework/sysdoman/getDoman.do?domainName="+moreDomainNameArr[i],
				valueField : 'codeId',
				textField : 'codeName',
				onSelect : function(row){
					//保存个性表单的值域value值
					$('#'+id).val(row.codeId);
					$('#'+id+'ID').val(row.codeName);
				},
				onLoadSuccess:function(data){
					if(data.length>0){
						$('#' + id).combobox('setValue',data[0].codeId);
					}
				}
			});
			setComboObjWidth(id,0.29,'combobox');
		}
	}
}