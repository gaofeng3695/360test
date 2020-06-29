/**
 * 
 * 文件描述: 选桩控件接口。
 *
 * @author zhanggf
 * @version 1.0
 * 创建时间： 2012-12-10 上午 08:45
 *********************************更新记录******************************
 * 版本：  1.0       修改日期：          修改人： 
 * 修改内容： 
 **********************************************************************
 */


/**
 * 方法描述：加载区域
 * param systemid 区域id
 * param lineloop 管线id
 * param beginmarker 起始桩id
 * param endmarker 结束桩id
 * param callback 回调函数
 */
function initSystemArea(systemid,lineloop,beginmarker,endmarker,callback){
	$('#'+systemid).combobox({  
		url : rootPath +'/jasframework/choosepilecontrol/querySubsytem.do',
		valueField :'EVENTID',
        textField :'SUBSYSTEMNAME',
        editable :true,
        onSelect:function(item){
        	//如果lineloop未设置则不加载区域与管线的级联关系
        	if(lineloop){
        		$('#'+lineloop).combotree('reload',rootPath +"/jasframework/choosepilecontrol/queryLineLoopBySubsystemId.do?subsystemId="+item.EVENTID);
        	}
        	//如果lineloop未设置则不加载区域和起始桩的关联
        	if(beginmarker){
        		$('#'+beginmarker).combobox('reload',rootPath +"/jasframework/choosepilecontrol/queryMarkerByLineAndSys.do?subsystemId="+item.EVENTID);
        	}
        	//如果lineloop未设置则不加载区域和结束桩的关联
        	if(endmarker){
        		$('#'+endmarker).combobox('reload',rootPath +"/jasframework/choosepilecontrol/queryMarkerByLineAndSys.do?subsystemId="+item.EVENTID);
        	}
        },
        onLoadSuccess:function(item){
        	if(callback){
        		callback;
        	}
        }
	}); 
}


/**
 * 方法描述：加载管线
 * param systemid 区域id
 * param lineloop 管线id
 * param beginmarker 起始桩id
 * param endmarker 结束桩id
 */

function initLineloop(lineloop,systemid,beginmarker,endmarker,callback){
	$('#'+lineloop).combotree({  
		url :rootPath +"/jasframework/choosepilecontrol/queryLineLoop.do",
		valueField :'eventid',
        textField :'lineLoopName',
        editable :true,
        onSelect:function(item){
        	//如果lineloop未设置则不加载管线和起始桩的关联
        	if(beginmarker){
        		if(systemid){
        			$('#'+beginmarker).combobox('reload',rootPath +"/jasframework/choosepilecontrol/queryMarkerByLineAndSys.do?subsystemId="+
        					$('#'+systemid).combobox('getValue')+"&lineloopId="+item.id);
        		}else{
        			$('#'+beginmarker).combobox('reload',rootPath +"/jasframework/choosepilecontrol/queryMarkerByLineAndSys.do?lineloop="+
        					item.id);
        		}
        	}
        	//如果lineloop未设置则不加载管线和结束桩的关联
        	if(endmarker){
        		if(systemid){
        			$('#'+endmarker).combobox('reload',rootPath +"/jasframework/choosepilecontrol/queryMarkerByLineAndSys.do?subsystemId="+
        					$('#'+systemid).combobox('getValue')+"&lineloopId="+item.id)
        		}else{
        			$('#'+endmarker).combobox('reload',rootPath +"/jasframework/choosepilecontrol/queryMarkerByLineAndSys.do?lineloop="+
        					item.id);
        		}
        	}
        },
        onLoadSuccess:function(item){
        	if(callback){
        		callback;
        	}
        }
	}); 
}

/**
 * 方法描述：加载桩
 * param systemid 区域id
 * param lineloop 管线id
 * param beginmarker 起始桩id
 * param endmarker 结束桩id
 */

function initLineMarker(markerid,callback){
	$('#'+markerid).combobox({  
		url :rootPath +"/jasframework/choosepilecontrol/queryAllMarkerLocationForRow.do",
		valueField :'EVENTID',
        textField :'MARKERNUMBER',
        editable :true,
        onSelect:function(item){
        	$.getJSON(rootPath +"/jasframework/choosepilecontrol/queryMarkerMessageById.do", { markerId: item.EVENTID }, function(json){
        		//返回数据为桩id，桩名称，桩里程，桩所在战列id
        		$('#'+markerid+1).val(json[0].markerid+","+json[0].markername+","+json[0].markerstation+","+json[0].serieseventid);
        	});
        },
        onLoadSuccess:function(item){
        	if(callback){
        		callback;
        	}
        }
	}); 
}

/**
 * 方法描述：加载桩信息
 */
function initPileControl(markerid,callback){
	$('#'+markerid).combobox({  
		url : rootPath +'/jasframework/choosepilecontrol/queryAllMarkerLocationForRow.do',
		valueField :'EVENTID',
        textField :'MARKERNUMBER',
        editable :true,
        onSelect:function(item){
        	$.getJSON(rootPath +"/jasframework/choosepilecontrol/queryMarkerMessageById.do", { markerId: item.EVENTID }, function(json){
//        		alert(json[0].markerid);
        		//返回数据为桩id，桩名称，桩里程，桩所在战列id
        		$('#'+markerid+1).val(json[0].markerid+","+json[0].markerstation+","+json[0].serieseventid);
        	});
        },
        onLoadSuccess:function(item){
        	if(callback){
        		callback;
        	}
        }
	});  
	$(".combo-text").keyup(function(){  
		var currentid =$(this).parent().find("input:last").attr('name');
		var marker =$(this).val();
		if(marker!='' && markerid==currentid){
			$('#'+markerid).combobox('showPanel');
		    $('#'+markerid).combobox('reload',rootPath +'/jasframework/choosepilecontrol/queryAllMarkerLocationForRow.do?markerName='+marker);
		    $('#'+markerid).combobox('setValue',marker);
		}
	});
//	if(markername!=''){
//		$('#'+markerid).combobox('setValue',markername);
//	}
}

/**
 * 方法描述：加载桩信息
 */
function initPileControlForSearch(markerid,callback){
	$('#'+markerid).combobox({  
		url : rootPath +'/jasframework/choosepilecontrol/queryAllMarkerLocationForRow.do',
		valueField :'EVENTID',
        textField :'MARKERNUMBER',
        editable :true,
        onSelect:function(item){
        	$.getJSON(rootPath +"/jasframework/choosepilecontrol/queryMarkerMessageById.do", { markerId: item.EVENTID }, function(json){
//        		alert(json[0].markerid);
        		//桩所在战列id,桩里程
        		$('#'+markerid+1).val(json[0].serieseventid+":"+json[0].markerstation);
        	});
        },
        onLoadSuccess:function(item){
        	if(callback){
        		callback;
        	}
        }
	});  
	$(".combo-text").keyup(function(){  
		var currentid =$(this).parent().find("input:last").attr('name');
		var marker =$(this).val();
		if(marker!='' && markerid==currentid){
			$('#'+markerid).combobox('showPanel');
		    $('#'+markerid).combobox('reload',rootPath +'/jasframework/choosepilecontrol/queryAllMarkerLocationForRow.do?markerName='+marker);
		    $('#'+markerid).combobox('setValue',marker);
		}
	});
}