
/**
 * @file
 * @author 作者
 * @desc 添加页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var uptoids = '';
var deloids = '';

/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	var comboxid='';
	var singleDomainName='';	// 单选值域
	var morecomboxid='';
	var moreDomainName='';	// 多选值域
	comboxid+='instype'+',';
	singleDomainName+='insType'+","
	comboxid+='inspectortype'+',';
	singleDomainName+='workusertype'+","
	/*comboxid+='insfrequnit'+',';
	singleDomainName+='reqUnit'+","*/
	comboxid+='insvehicle'+',';
	singleDomainName+='insTool'+","
//	comboxid+='planflag'+',';
//	singleDomainName+='planFlag'+","
	loadSelectData(comboxid,singleDomainName);
	loadMoreSelectData(morecomboxid,moreDomainName);

    initUnitComboTreeNotLineLoop('execunitid');
	setComboObjWidth('execunitid',0.286,'combobox');
//	initUnitComboTree('unitid');
//	setComboObjWidth('unitid',0.22,'combobox');
//	initLineLoopCombobox('lineloopoid');
//	showPan('beginlocation','endlocation','beginstation','endStation');
	
	
	initLineplantable();
	
	$('#insfrequnit').combobox({
		panelHeight:100,
		url : rootPath+"jasframework/sysdoman/getDoman.do?domainName=reqUnit",
		valueField : 'codeId',
		textField : 'codeName',
		onSelect : function(row){
			//保存个性表单的值域value值
			$('#insfrequnit').val(row.codeId);
			$('#insfrequnitID').val(row.codeName);
		},
		onLoadSuccess:function(data){
			if(data.length>0){
				$('#insfrequnit').combobox('setValue',data[0].codeId);
			}
		}
	});
	setComboObjWidth('insfrequnit',0.07,'combobox');

    /**
     * @desc 添加数据-保存
     */
    $("#saveButton").on("click", function(event){
        event.preventDefault();
        disableButtion("saveButton");

        /* 检查巡检频次，多天多巡不支持。 */
        if($('#insfrequnitval').val() != '1' && $('#insfreq').val() != '1') {
            enableButtion("saveButton");
            top.showAlert("提示", "暂不支持多天多巡！", 'info');
            return false;
        }
        if($('#insfrequnit').combobox('getValue') != '01' && ($('#insfreq').val() != '1' || $('#insfrequnitval').val() != '1')) {
            enableButtion("saveButton");
            top.showAlert("提示", "暂不支持多天多巡！", 'info');
            return false;
        }

        var bool=$("#gpsPlanInfoForm").form('validate');
        if(bool==false){
            enableButtion("saveButton");
            return bool;
        }

        if(compareDate() < 0){
            enableButtion("saveButton");
            top.showAlert("提示", "计划结束时间不能小于计划开始时间，不能保存！", 'info');
            return false;
        }
        $('#uptoids').val(uptoids);
        $('#deloids').val(deloids);
        $.ajax({
            url : rootPath+"/gpsplaninfo/saveplanandline.do",
            type: "post",
            async: false,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            data:JSON.stringify({"plandata":JSON.stringify($("#gpsPlanInfoForm").serializeToJson()), "linedata":JSON.stringify($('#lineplantable').datagrid('getData').rows)}),
            success: function(data){
                if(data.status==1){
                    top.showAlert("提示", "保存成功", 'info', function() {
                        reloadData("query_gps_plan_info.html","#gpsPlanInfodatagrid");
                        closePanel();
                    });
                }else if(data.code == "400") {
                    top.showAlert("提示", "保存失败", 'error');
                    enableButtion("saveButton");
                    return false;
                }else{
                    top.showAlert("提示", data.msg, 'info');
                    enableButtion("saveButton");
                    return false;
                }
            }
        });
        enableButtion("saveButton");
    })
});


function initLineplantable() {
	$('#lineplantable').datagrid({
//		idField:'oid',
//		url: rootPath+"/gpsplanlinelnfo/getPage.do",
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
        fitColumns: true,
		toolbar : "#toolbar",
		frozenColumns:[[
            {field:'ck',checkbox:true}
		]],
		columns: 
		[[
			{	
				field:"oid",
				hidden:'true'
	    	},
			{	
				field:"planeventid",
				hidden:'true'
	    	},
	    	{	
				field:"lineloopoid",
				hidden:'true'
	    	},
	    	{	
				field:"isPis",
				hidden:'true'
	    	},
	    	{	
				field:"rangeflag",
				hidden:'true'
	    	},
			{	
				field:"lineloopoidname",
	    		title:"管线名称",
	    		width:$(this).width() * 0.1,
	    		resizable:true,
    			sortable:true,
	    		align:'center'
	    	},
	    	{	
				field:"beginlocation",
	    		title:"巡检起始位置",
	    		width:$(this).width() * 0.1,
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"endlocation",
	    		title:"巡检终止位置",
	    		width:$(this).width() * 0.1,
	    		resizable:true,
	    		align:'center'
	    	},
	    	{
				field:"beginstation",
	    		title:"起始里程",
	    		width:$(this).width() * 0.1,
	    		resizable:true,
	    		align:'center'
	    	},
	    	{	
				field:"endstation",
	    		title:"终止里程",
	    		width:$(this).width() * 0.1,
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"isPisname",
	    		title:"是否PIS同步",
	    		width:$(this).width() * 0.1,
	    		resizable:true,
	    		align:'center',
	    		formatter:function(value,row,index){
	    			if(row.isPis == 1){
	    				return "是";
	    			}else if(row.isPis == 0){
	    				return "否";
	    			}
	    		} 
	    	},

		  	{
		  		field:'operate',
		  		title:'操作',
		  		align:"center",
		  		width:$(this).width() * 0.1,
		  		formatter: function(value,row,index){
					var opt = '';
					if(row.isPis != 1){
						opt = '<p class="table-operate"></a><a href="#" title = "修改" onclick="update(\'' + index+'\',\''+row.oid+'\',\''+row.lineloopoid
									+'\',\''+row.beginlocation+'\',\''+row.endlocation+'\',\''+row.beginstation+'\',\''+row.endstation+'\')">\
									<span class="fa fa-edit"></span>\
						   	   </a><a href="#" title = "删除" onclick="dele(\'' + index+'\')">\
									<span class="fa fa-minus"></span>\
						       </a></p>';
					}
					return opt;
				}
			}
		]],
		onDblClickRow:function(index,indexData){
//			top.getDlg("view_gps_plan_line_info.html?oid="+indexData.oid,"viewGpsPlanLineInfo","详细",700,400,false,true,true);
		},
		onLoadSuccess:function(data){
	    	$('#lineplantable').datagrid('clearSelections'); //clear selected options
	    }
	});
	
	//页面自适应
	onresize();
	$(window).bind("resize", function () {
		onresize();
     });
	
}

function onresize(){
	var containerWidth = $(window).width() - 40;
	var containerHeight = $(window).height() - $('#plantable').height() - $('#toolbar').height() 
		- $('#button-area').height() - 5;
	$('#lineplantable').datagrid('resize', {
		width : containerWidth,
		height : containerHeight
	});
}

function compareDate(){
	var startdate = $("#insbdate").val();
	var enddate =   $("#insedate").val();
	startdate=Date.parse(new Date(startdate.replace(/-/g, "/")));
	enddate=Date.parse(new Date(enddate.replace(/-/g, "/")));
	var millTime=enddate-startdate;  //时间差的毫秒数
	return millTime;
}


/**
 * @desc 关闭添加页面
 */
function closePanel() {
	top. closeDlg("addGpsPlanInfo");
}

/**
 * @desc 重新加载数据
 * @param shortUrl 重新加载数据的页面
 * @param elementId 权限列表的id
 */
function reloadData(shortUrl, elementId) {
	var fra = parent.$("iframe");
	for ( var i = 0; i < fra.length; i++) {
		if (fra[i].src.indexOf(shortUrl) != -1) {
			fra[i].contentWindow.$(elementId).datagrid("reload");
		}
	}
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
					if(row.domainName == "insType"){
						if(row.codeId == "07"){
							$("#beginWorkTime").val("20:00:00");
							$("#endWorkTime").val("06:00:00");
						}else{
							$("#beginWorkTime").val("06:00:00");
							$("#endWorkTime").val("20:00:00");
						}
					}
				},
				onLoadSuccess:function(data){
					if(data.length>0){
						$('#'+id).combobox('setValue',data[0].codeId);
					}
				}
			});
			setComboObjWidth(id,0.286,'combobox');
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
			setComboObjWidth(id,0.286,'combobox');
		}
	}
}

/**
 * 打开新增巡线计划页面
 * @returns
 */
function add () {
	/* 判断是否选择了执行部门。 */
	var unitId = $('#execunitid').combotree('getValue');
	if(unitId == '' || unitId == null || unitId == undefined) {
        top.showAlert("提示", "请选择执行部门", 'info');
        return ;
	}
	top.getDlg("save_gps_plan_line_info.html?sendHtml=save_gps_plan_info&unitId="+unitId, "saveGpsPlanLineInfo", "新增", 700, 400, false, true, true);
}

/**
 * 打开修改巡线计划页面
 * @returns
 */
function update(index, oid, lineloopoid, beginlocation, endlocation, beginstation, endstation){
    /* 判断是否选择了执行部门。 */
    var unitId = $('#execunitid').combotree('getValue');
    if(unitId == '' || unitId == null || unitId == undefined) {
        top.showAlert("提示", "请选择执行部门", 'info');
        return ;
    }

    var rows = $('#lineplantable').datagrid('getSelections');
    var getRowIndex = $('#lineplantable').datagrid('getRowIndex',rows[0]);
    var dataId = "";
    if(!isNull(index)){
        dataId = oid;
    }else if (rows.length == 1){
        dataId = rows[0].oid;
    }else{
        top.showAlert("提示","请选中一条记录",'info');
        return;
    }

    var url = "update_gps_plan_line_info.html";

    if(index == undefined) {
        url += "?rowIndex="+encodeURI(getRowIndex)+"&oid="+encodeURI(rows[0].oid)+"&lineloopoid="+encodeURI(rows[0].lineloopoid)+"&beginlocation="+encodeURI(rows[0].beginlocation)+"&endlocation="+encodeURI(rows[0].endlocation)
            +"&beginstation="+encodeURI(rows[0].beginstation)+"&endstation="+encodeURI(rows[0].endstation)+'&sendHtml=update_gps_plan_info&unitId='+encodeURI(unitId);
        top.getDlg(url,"updateGpsPlanLineInfo","修改",700,400,false,true,true);
    }else if(!isNull(index)){
        url += "?rowIndex="+encodeURI(index)+"&oid="+encodeURI(oid)+"&lineloopoid="+encodeURI(lineloopoid)+"&beginlocation="+encodeURI(beginlocation)+"&endlocation="+encodeURI(endlocation)
            +"&beginstation="+encodeURI(beginstation)+"&endstation="+encodeURI(endstation)+'&sendHtml=update_gps_plan_info&unitId='+encodeURI(unitId);
        top.getDlg(url,"updateGpsPlanLineInfo","修改",700,400,false,true,true);
    }else if(rows.length == 1){
        index = $('#lineplantable').datagrid('getRowIndex',rows[0]);
        url += "?rowIndex="+encodeURI(index)+"&oid="+encodeURI(oid)+"&lineloopoid="+encodeURI(rows[0].lineloopoid)+"&beginlocation="+encodeURI(rows[0].beginlocation)+"&endlocation="+encodeURI(rows[0].endlocation)
            +"&beginstation="+encodeURI(rows[0].beginstation)+"&endstation="+encodeURI(rows[0].endstation)+'&sendHtml=update_gps_plan_info&unitId='+encodeURI(unitId);
        top.getDlg(url,"updateGpsPlanLineInfo","修改",700,400,false,true,true);
    }else{
        top.showAlert("提示","请选中一条记录",'info');
        return;
    }
}


//添加一行带数据
function insertRow(data) {
	data = eval('('+data+')');
    $('#lineplantable').datagrid("insertRow", {  
    	index: 0, //如果不写，默认为在最后一行添加
        row: {
        	oid:'',
        	planeventid:'',
        	lineloopoid:data.lineloopoid,
        	lineloopoidname:data.lineloopoidname,
        	beginlocation:data.beginlocation,
        	endlocation:data.endlocation,
        	beginstation:data.beginstation,
        	endstation:data.endstation,
        	isPis:'0'
        }
    });
    var alldata = $('#lineplantable').datagrid('getData');
	$('#lineplantable').datagrid('loadData', alldata);
}

//修改一行带数据
function updateRow(data) {
	data = eval('('+data+')');
    $('#lineplantable').datagrid("updateRow", {  
    	index: data.rowIndex,
        row: {
        	oid:data.oid,
        	lineloopoid:data.lineloopoid,
        	lineloopoidname:data.lineloopoidname,
        	beginlocation:data.beginlocation,
        	endlocation:data.endlocation,
        	beginstation:data.beginstation,
        	endstation:data.endstation
        }
    });
    if(data.oid && data.oid != "undefined"){
    	if(uptoids == ''){
    		uptoids = data.oid;
    	}else{
    		uptoids += ','+data.oid;
    	}
    }
    var alldata = $('#lineplantable').datagrid('getData');
	$('#lineplantable').datagrid('loadData', alldata);
}

/**
 * 删除行数据
 * @param oid
 * @returns
 */
function dele(index){
	var rows = $('#lineplantable').datagrid('getSelections');
	var allrows;
	var alldata;
	var oid;
	var length = rows.length;
	if(!isNull(index)){
		allrows = $("#lineplantable").datagrid("getRows");
		oid = allrows[index].oid;
		if(oid && oid != "undefined"){
			if(deloids == ''){
				deloids = oid;
	    	}else{
	    		deloids += ','+oid;
	    	}
		}
		
		$('#lineplantable').datagrid('deleteRow', index);
		alldata = $('#lineplantable').datagrid('getData');
		$('#lineplantable').datagrid('loadData', alldata);
		
	}else if (length > 0){
		for(var i=0;i<length;i++){
			rows = $('#lineplantable').datagrid('getSelections');
			var rowIndex=$('#lineplantable').datagrid('getRowIndex',rows[0]);
			oid = rows[0].oid;
			if(oid){
				if(deloids == ''){
					deloids = oid;
		    	}else{
		    		deloids += ','+oid;
		    	}
			}
			$('#lineplantable').datagrid('deleteRow', rowIndex);
		}
		alldata = $('#lineplantable').datagrid('getData');
		$('#lineplantable').datagrid('loadData', alldata);
		
	}else{
		top.showAlert("提示","请选择记录",'info');
		return ;
	}
}




