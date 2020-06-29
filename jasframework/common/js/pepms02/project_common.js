/**
 * @desc 设置datagrid自适应
 * 
 * @param id datagrid对象id
 */
function setDatagridFitCoulms(id) {

	setDatagridFitCoulms_private(id);
	var _fn = function() {
		setDatagridFitCoulms_private(id)
	};
	// $(window).bind('resize',_fn);//不能使用该方法
	onWindowResize.add(_fn);// 要使用该方法
}
/**
 * @desc 参照input 设置easyui Combo对象的宽度
 * 
 * @param comboObjId easyui Combo组件对象id
 * @param referenceObjId 参照对象id
 * @param comboObjType easyui Combo组件对象类型，（'combobox'||'combotree'||datetimebox）
 */
function setComboObjReferenceInput(comboObjId, referenceObjId, comboObjType) {

	setComboObjReferenceInput_private(comboObjId, referenceObjId, comboObjType);
	var _fn = function() {
		setComboObjReferenceInput_private(comboObjId, referenceObjId, comboObjType);
	};
	// $(window).bind('resize',_fn);//不能使用该方法
	onWindowResize.add(_fn);// 要使用该方法
}

/**
 * @desc 参照input 设置easyui Combo对象的宽度
 * 
 * @param projectId 项目id
 * @param pipeId    管线id
 * @param sectionId 标段id  没有传空
 * @param contractorId 承包商id  没有传空
 * @param supervisorUnitId 监理单位id 没有传空
 * @param referenceObjId  参照对象id
 * @param fla  标识 "true"标识根据标段生产编号。没有传"false"
 * @param  comboObjType easyui Combo组件对象类型，（'combobox'||'combotree'||datetimebox）
 */
function setfloadProjectPipeprivate(projectId,pipeId,sectionId,contractorId,referenceObjId,fla,supervisorUnitId) {

	floadProjectPipe_private(projectId,pipeId,sectionId,contractorId,referenceObjId,fla,supervisorUnitId);
	var _fn = function() {
		floadProjectPipe_private(projectId,pipeId,sectionId,contractorId,referenceObjId,fla,supervisorUnitId);
	};
	// $(window).bind('resize',_fn);//不能使用该方法
	onWindowResize.add(_fn);// 要使用该方法
}

/**
 * @desc 加载组织机构公司或部门
 * 
 * @param comboObjId easyui Combo组件对象id
 * @param referenceObjId 参照对象id
 * @param dataType 数据类型，（'unit'||'department'||"all"）
 */
function setComboUnitOrDepartment(comboObjId, referenceObjId,dataType) {

	setComboUnitOrDepartment_private(comboObjId, referenceObjId,dataType);
	var _fn = function() {
		setComboUnitOrDepartment_private(comboObjId, referenceObjId,dataType);
	};
}
/**
 * @desc 加载项目组织机构
 * 
 * @param comboObjId easyui Combo组件对象id
 * @param treeItemType 数据类型
 *all 所有 xmb 项目部，xmfb 项目分部，gysh 供应商，shgdw 施工单位，epc EPC，pmc PMC/监理，detection 检测，consDrawDesign 施工图设计，
 * purchase 采办，transfer 中转站，outsource 外协，linCons 线路施工，pipestation 站场，cross 穿跨越，maintenanceroad 伴行路，powerline 外电，other 其它，ffcsh 防腐厂商
 * @param referenceObjId 参照对象id
 */
function setComboProjectUnit(comboObjId,treeItemType, referenceObjId) {
	setComboProjectUnit_private(comboObjId,treeItemType, referenceObjId);
	var _fn = function() {
		setComboProjectUnit_private(comboObjId,treeItemType, referenceObjId);
	};
}
/**
 * @desc 加载项目组织机构树
 * 
 * @param treeObjId easyui tree组件对象id
 * @param treeType 树类型 platform平台 project项目
 * 
 */
function loadProjectUnit(treeObjId,treeType) {
	loadProjectUnit_private(treeObjId,treeType);
	var _fn = function() {
		loadProjectUnit_private(treeObjId,treeType);
	};
}

//项目id，管线id,
function loadProjectAndPipe(projectId,pipeId,referenceObjId) {
	loadProjectPipe_private(projectId,pipeId,referenceObjId);
	var _fn = function() {
		loadProjectPipe_private(projectId,pipeId,referenceObjId);
	};
}
//项目id
function loadProject(projectId,referenceObjId) {
	loadProject_private(projectId,referenceObjId);
	var _fn = function() {
		loadProject_private(projectId,referenceObjId);
	};
}

//项目id，管线id,
function loadProjectcodeAndPipe(projectId,pipeId,referenceObjId) {
	loadProjectcodePipe_private(projectId,pipeId,referenceObjId);
	var _fn = function() {
		loadProjectcodePipe_private(projectId,pipeId,referenceObjId);
	};
}


//项目id，标段id,
function loadProjectAndSection(projectId,sectionId,referenceObjId) {
	loadProjectSection_private(projectId,sectionId,referenceObjId);
	var _fn = function() {
		loadProjectPipe_private(projectId,sectionId,referenceObjId);
	};
}


/**
 * @desc 参照input 设置easyui Combo对象的宽度
 * @param comboObjId easyui Combo组件对象id
 * @param referenceObjId 参照对象id
 * @param comboObjType easyui Combo组件对象类型，（'combobox'||'combotree'||datetimebox）
 */
function setComboObjReferenceInput_private(comboObjId, referenceObjId, comboObjType) {
	if (comboObjId && comboObjId != ''&&referenceObjId && referenceObjId != '') {
		var comboObjWidth=$("#"+referenceObjId).width();
		var comboObj = $('#' + comboObjId);
		if ('combobox' == comboObjType) {
			comboObj.combobox('resize', comboObjWidth);
		} else if ('combotree' == comboObjType) {
			comboObj.combo('resize', comboObjWidth);
		} else if ('datetimebox' == comboObjType) {
			comboObj.datetimebox('resize', comboObjWidth);
		} else {
			comboObj.combo('resize', comboObjWidth);
		}
	} else {
		$(".combo").each(function() {
			// $(this).parent().css('padding-right','3px');
		});
	}
}

/**
 * @desc 加载组织机构公司或部门
 * 
 * @param comboObjId easyui Combo组件对象id
 * @param referenceObjId 参照对象id
 * @param dataType 数据类型，（'unit'||'department'||"all"）
 */
function setComboUnitOrDepartment_private(comboObjId, referenceObjId,dataType) {
	var params = {"treeViewCode":"unitTreeUserListView"};
	if(dataType=="unit"){
		params.treeViewCode="unitTree_02";
	}
	$("#"+comboObjId).combotree({
	    url:rootPath+'treeView/getRootData.do',
	    queryParams:params,
	    panelHeight:"200",
	    onBeforeExpand:function(node,param){
	    	var tree=$("#"+comboObjId).combotree("tree"); 
	    	//重置请求参数
	    	tree.tree('options').queryParams = {
            	"parentTreeNodeId":node.attributes.treeNodeId,
            	"parentOid":node.id
            }
	    	//重置请求地址
	    	tree.tree('options').url = rootPath+'treeView/getChildData.do';
            return true;
	    },
	    onLoadSuccess:function(node,data){
	    	var tree=$("#"+comboObjId).combotree("tree"); 
	    	tree.tree('expandAll');
	    },
	    loader:function(param,success,error){
	    	var tree=$("#"+comboObjId).combotree("tree"); 
	    	var opts = tree.tree('options');
	    	$.ajax({  
                type : opts.method,  
                url : opts.url,  
                dataType : 'json',  
                contentType : 'application/json;charset=utf-8', // 设置请求头信息  
                data : JSON.stringify(param),  
                success : function(data) {
                	//alert(JSON.stringify(data));
                    success(data.rows);                  
                }  
            });  
	    },
	    loadFilter: function(data){
			//alert(JSON.stringify(data));
			return data;
	    }
	});
	setComboObjReferenceInput_private(comboObjId, referenceObjId, "combotree");
}


function loadProject_private(projectId,referenceObjId){
	$('#'+projectId).combobox({
		valueField: 'oid',    
        textField: 'name',    
        onLoadSuccess:function(data){
        	if(null!=data&&data.length>0){
    			$('#'+projectId).combobox('setValue',data[0].oid)
    		}
        }
	});	
	$.ajax({
		   url: rootPath+"scobaseproject/authorizedProject.do",
		   type: "POST",
		   dataType:"json",
		   async:false,
		   success: function(data){
				if(data.status==1){
					var rows = data.rows;
					$('#'+projectId).combobox("loadData",rows);
				}
		   },
		});
	setComboObjReferenceInput_private(projectId, referenceObjId,"combobox")
}
function loadProjectPipe_private(projectId,pipeId,referenceObjId){
	$('#'+projectId).combobox({
		valueField: 'oid',    
		textField: 'name',    
		onSelect: function(rec){ 
			loadPipe_private(pipeId,rec.oid,referenceObjId);
		},
		onLoadSuccess:function(data){
			if(null!=data&&data.length>0){
				$('#'+projectId).combobox('setValue',data[0].oid)
				loadPipe_private(pipeId,data[0].oid,referenceObjId);
			}
		}
	});	
	$.ajax({
		url: rootPath+"scobaseproject/authorizedProject.do",
		type: "POST",
		dataType:"json",
		async:false,
		success: function(data){
			if(data.status==1){
				var rows = data.rows;
				$('#'+projectId).combobox("loadData",rows);
			}
		},
	});
	setComboObjReferenceInput_private(projectId, referenceObjId,"combobox")
}

function loadProjectcodePipe_private(projectId,pipeId,referenceObjId){
	$('#'+projectId).combobox({
		valueField: 'oid',    
		textField: 'code',    
		onSelect: function(rec){ 
			loadPipe_private(pipeId,rec.oid,referenceObjId);
		},
		onLoadSuccess:function(data){
			if(null!=data&&data.length>0){
				$('#'+projectId).combobox('setValue',data[0].oid)
//				loadPipe_private(pipeId,data[0].oid,referenceObjId);
			}
		}
	});	
	$.ajax({
		url: rootPath+"scobaseproject/authorizedProject.do",
		type: "POST",
		dataType:"json",
		async:false,
		success: function(data){
			if(data.status==1){
				var rows = data.rows;
				$('#'+projectId).combobox("loadData",rows);
			}
		},
	});
	setComboObjReferenceInput_private(projectId, referenceObjId,"combobox")
}
//项目管线标段
function loadProjectPipeSection(projectId,pipeId,sectionId,referenceObjId){
	var dtd = $.Deferred(); 
	$('#'+projectId).combobox({
		valueField: 'oid',    
		textField: 'name',    
		onSelect: function(rec){ 
			loadPipe_private(pipeId,rec.oid,referenceObjId);
			loadSection_private(sectionId,rec.oid,referenceObjId);
		},
		onLoadSuccess:function(data){
			if(null!=data&&data.length>0){
				$('#'+projectId).combobox('setValue',data[0].oid)
			}
		}
	});	
	$.ajax({
		url: rootPath+"scobaseproject/authorizedProject.do",
		type: "POST",
		dataType:"json",
		async:false,
		success: function(data){
			if(data.status==1){
				var rows = data.rows;
				$('#'+projectId).combobox("loadData",rows);
			}
			dtd.resolve();
		},
	});
	setComboObjReferenceInput_private(projectId, referenceObjId,"combobox")
	return dtd;
}
//加载管线
function loadPipe_private(pipeId,projectOid,referenceObjId){
	$('#'+pipeId).combobox({
		valueField: 'oid',    
        textField: 'pipelinename',    
        url: rootPath + "scobasepipeline/getPipelines.do?projectoid="+projectOid,   
        onLoadSuccess:function(data){
        	if(null!=data&&data.length>0){
        		$('#'+pipeId).combobox("setValue",data[0].oid);
        	}
        },
	});
	setComboObjReferenceInput_private(pipeId, referenceObjId,"combobox")
}

//加载项目
function loadProjectAndSectionByWidth(projectId,sectionId,width,containerObjId){
	$('#'+projectId).combobox({
		valueField: 'oid',    
        textField: 'name',    
//        url: rootPath + "scobaseproject/getAllProject.do",   
        onSelect: function(rec){ 
        	loadSection(sectionId,rec.oid,width,containerObjId);
        },
        onLoadSuccess:function(data){
        	if(null!=data&&data.length>0){
        		$('#'+projectId).combobox('setValue',data[0].oid)
        		loadSection(sectionId,data[0].oid,width,containerObjId);
        	}
        }
	});
	$.ajax({
		   url: rootPath+"scobaseproject/authorizedProject.do",
		   type: "POST",
		   dataType:"json",
		   async:false,
		   success: function(data){
				if(data.status==1){
					var rows = data.rows;
					$('#'+projectId).combobox("loadData",rows);
				}
		   },
		});
	setComboObjWidth(projectId,width,'combobox',containerObjId);
}

function loadSection(sectionId,projectOid,width,containerObjId){
	$('#'+sectionId).combobox({
		valueField: 'oid',    
        textField: 'tendersname',    
        url: rootPath + "/scobasetenders/queryTendersList.do?projectoid="+projectOid,   
        onLoadSuccess:function(data){
        	if(null!=data&&data.length>0){
        		$('#'+sectionId).combobox("setValue",data[0].oid);
        		//加载承包商
        	}
        }
	});
	setComboObjWidth(sectionId, width,"combobox",containerObjId)
}

//加载项目
function loadProjectSection_private(projectId,sectionId,referenceObjId){
	$('#'+projectId).combobox({
		valueField: 'oid',    
        textField: 'name',    
//        url: rootPath + "scobaseproject/getAllProject.do",   
        onSelect: function(rec){ 
        	loadSection_private(sectionId,rec.oid,referenceObjId);
        },
        onLoadSuccess:function(data){
        	if(null!=data&&data.length>0){
        		$('#'+projectId).combobox('setValue',data[0].oid)
        		loadSection_private(sectionId,data[0].oid,referenceObjId);
        	}
        }
	});
	$.ajax({
		   url: rootPath+"scobaseproject/authorizedProject.do",
		   type: "POST",
		   dataType:"json",
		   async:false,
		   success: function(data){
				if(data.status==1){
					var rows = data.rows;
					$('#'+projectId).combobox("loadData",rows);
				}
		   },
		});
	setComboObjReferenceInput_private(projectId, referenceObjId,"combobox")
}
//加载标段
function loadSection_private(sectionId,projectOid,referenceObjId){
	$('#'+sectionId).combobox({
		valueField: 'oid',    
        textField: 'tendersname',    
//        url: rootPath + "/scobasetenders/getTendersByProjectoid.do?projectoid="+projectOid,   
        url: rootPath + "/scobasetenders/queryTendersList.do?projectoid="+projectOid,   
        onLoadSuccess:function(data){
        	if(null!=data&&data.length>0){
        		$('#'+sectionId).combobox("setValue",data[0].oid);
        		//加载承包商
        	}
        }
	});
	setComboObjReferenceInput_private(sectionId, referenceObjId,"combobox")
}

//加载承包商


//设置datagrid自适应
function setDatagridFitCoulms_private(id){
	$('#'+id).datagrid({
        fitColumns:true
    });

}

//项目管线标段承包商
function floadProjectPipe_private(projectId,pipeId,sectionId,contractorId,referenceObjId,fla,supervisorUnitId){
	$('#'+projectId).combobox({
		valueField: 'oid',    
        textField: 'name',    
        onSelect: function(rec){ 
        	floadPipe_private(pipeId,rec.oid,sectionId,contractorId,referenceObjId,fla,supervisorUnitId);
        },
        onLoadSuccess:function(data){
        	if(null!=data&&data.length>0){
        		$('#'+projectId).combobox('setValue',data[0].oid)
        		floadPipe_private(pipeId,data[0].oid,sectionId,contractorId,referenceObjId,fla,supervisorUnitId);
        	}
        }
	});	
	$.ajax({
		   url: rootPath+"scobaseproject/authorizedProject.do",
		   type: "POST",
		   dataType:"json",
		   async:false,
		   success: function(data){
				if(data.status==1){
					var rows = data.rows;
					$('#'+projectId).combobox("loadData",rows);
				}
		   },
		});
	setComboObjReferenceInput_private(projectId, referenceObjId,"combobox")
}
//加载管线
function floadPipe_private(pipeId,projectOid,sectionId,contractorId,referenceObjId,fla,supervisorUnitId){
	$('#'+pipeId).combobox({
		valueField: 'oid',    
        textField: 'pipelinename',    
        url: rootPath + "scobasepipeline/getPipelines.do?projectoid="+projectOid,   
        onLoadSuccess:function(data){
        	
        	if(null!=data&&data.length>0){
        		$('#'+pipeId).combobox("setValue",data[0].oid);
        		
        	}
        	//加载标段
        	floadSection_private(sectionId,projectOid,contractorId,referenceObjId,fla,supervisorUnitId);
        }
	});
	setComboObjReferenceInput_private(pipeId, referenceObjId,"combobox")
}


//加载标段
function floadSection_private(sectionId,projectOid,contractorId,referenceObjId,fla,supervisorUnitId){
	$('#'+sectionId).combobox({
		valueField: 'oid',    
        textField: 'tendersname',    
        url: rootPath + "/scobasetenders/getTendersByProjectoid.do?projectoid="+projectOid,   
        onSelect: function(rec){ 
        	floadChengBS_private(projectOid,rec.oid,contractorId,referenceObjId);
        	if(fla=="true"){
        		initcode();
        	}
        	//加载监理
    		if(supervisorUnitId!=null && supervisorUnitId!=""){
    			floadChengJL_private(projectOid,rec.oid,supervisorUnitId,referenceObjId);
    		}
        },
        onLoadSuccess:function(data){
        	if(null!=data&&data.length>0){
        		$('#'+sectionId).combobox("setValue",data[0].oid);
        		//加载承包商
        		floadChengBS_private(projectOid,data[0].oid,contractorId,referenceObjId);
        		//初始化编码
        		if(fla=="true"){
            		initcode();
            	}
        		//加载监理
        		if(supervisorUnitId!=null && supervisorUnitId!=""){
        			floadChengJL_private(projectOid,data[0].oid,supervisorUnitId,referenceObjId);
        		}
        	}
        }
	});
	setComboObjReferenceInput_private(sectionId, referenceObjId,"combobox")
}
//加载承包商
function floadChengBS_private(projectOid,sectionId,contractorId,referenceObjId){
	
	$('#'+contractorId).combobox({
		valueField: 'OID',    
        textField: 'NAME',    
        url: rootPath + "/matplanpickingplan/getloadChengBS.do?sectionId="+sectionId+"&projectId="+projectOid,   
       
        onLoadSuccess:function(data){
        	if(null!=data && data.length!=0){
        		if (currentProjectOrganizationOid!=""){
        			$('#'+contractorId).combobox("setValue",currentProjectOrganizationOid);
        		}else{
        			$('#'+contractorId).combobox("setValue",data[0].OID);
        		}
        		
        	}
        }
	});
	setComboObjReferenceInput_private(contractorId, referenceObjId,"combobox")
}

//加载监理
function floadChengJL_private(projectOid,sectionId,supervisorUnitId,referenceObjId){
	
	$('#'+supervisorUnitId).combobox({
		valueField: 'OID',    
        textField: 'NAME',    
        url: rootPath + "/matplanpickingplan/getloadJL.do?sectionId="+sectionId+"&projectId="+projectOid,   
       
        onLoadSuccess:function(data){
        	if(null!=data && data.length!=0){
        		$('#'+supervisorUnitId).combobox("setValue",data[0].OID);
        	}
        }
	});
	setComboObjReferenceInput_private(supervisorUnitId, referenceObjId,"combobox")
}
/**
 * @desc 重新加载top页面的iframe
 * @param shortUrl 重新加载数据的页面
 * @param elementId 权限列表的id
 */
function reloadTopData(shortUrl, elementId) {
	var fra = top.$("iframe");
	for ( var i = 0; i < fra.length; i++) {
		if (fra[i].src.indexOf(shortUrl) != -1) {
			fra[i].contentWindow.$(elementId).datagrid("reload");
		}
	}
}

function loadProjectUnit_private(treeObjId,treeType) {
	var params = {"treeViewCode":"projectOffice"};
	if(treeType=="platform"){
		params = {"treeViewCode":"platformOffice"};
	}
	$("#"+treeObjId).tree({
	    url:rootPath+'treeView/getRootData.do',
	    queryParams:params,
	    onBeforeExpand:function(node,param){
	    	//重置请求参数
	    	$("#"+treeObjId).tree('options').queryParams = {
            	"parentTreeNodeId":node.attributes.treeNodeId,
            	"parentOid":node.id
            }
            return true;
	    },
	    onLoadSuccess:function(node,data){
	    	//$("#"+treeObjId).tree('expandAll');
	    },
	    loader:function(param,success,error){
	    	var opts = $("#"+treeObjId).tree('options');
	    	$.ajax({  
                type : opts.method,  
                url : opts.url,  
                dataType : 'json',  
                contentType : 'application/json;charset=utf-8', // 设置请求头信息  
                data : JSON.stringify(param),  
                success : function(data) {
                    success(data.rows);                  
                }  
            });  
	    },
	    loadFilter: function(data){
			return data;
	    }
	});
}
function setComboProjectUnit_private(comboObjId,treeItemType,referenceObjId) {
	var params = {"treeViewCode":"projectOrg_02","paramStrList":treeItemType};
	if(treeItemType=="all"){
		params = {"treeViewCode":"projectOrgAll_02"};
	}
	$("#"+comboObjId).combotree({
		url:rootPath+'treeView/getRootData.do',
		queryParams:params,
		panelHeight:"200",
		onBeforeExpand:function(node,param){
			var tree=$("#"+comboObjId).combotree("tree"); 
			//重置请求参数
			tree.tree('options').queryParams = {
				"parentTreeNodeId":node.attributes.treeNodeId,
				"parentOid":node.id
			}
			//重置请求地址
			//tree.tree('options').url = rootPath+'treeView/getChildData.do';
			return true;
		},
		onLoadSuccess:function(node,data){
			var tree=$("#"+comboObjId).combotree("tree"); 
			tree.tree('expandAll');
		},
		loader:function(param,success,error){
			var tree=$("#"+comboObjId).combotree("tree"); 
			var opts = tree.tree('options');
			$.ajax({  
				type : opts.method,  
				url : opts.url,  
				dataType : 'json',  
				contentType : 'application/json;charset=utf-8', // 设置请求头信息  
				data : JSON.stringify(param),  
				success : function(data) {
					//alert(JSON.stringify(data));
					success(data.rows);                  
				}  
			});  
		},
		loadFilter: function(data){
			//alert(JSON.stringify(data));
			return data;
		}
	});
	setComboObjReferenceInput_private(comboObjId, referenceObjId, "combotree");
}
/**
 * currentProjectOrganizationOid 获得当前项目组织机构的oid
 */
var currentProjectOrganizationOid="";
function getCurrentProjectOrganizationOid(){
	$.ajax({
		   url: rootPath+"matapplypicking/unitmake.do",
		   type: "POST",
		   dataType:"json",
		   async:false,
		   success: function(data){
				if(data.status==1){
					currentProjectOrganizationOid =data.data.oid;
				}
		   },
		});
}

//注入单位 
function setunitmake(company){
	$.ajax({
		   url: rootPath+"matapplypicking/unitmake.do",
		   type: "POST",
		   dataType:"json",
		   async:false,
		   success: function(data){
				if(data.status==1){
					if(company==null){
						setcom(data.data);
					}
					$("#"+company+"Id").val(data.data.oid);
					$("#"+company+"Name").val(data.data.name);
				}
		   },
		});
}