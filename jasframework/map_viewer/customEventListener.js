/**
 * 项目自定义地图图层监听事件
 */


var rootPath=getRootPath();
var buttonimgname='';
//地图内弹框
/****
 *  dialogid 弹窗的id
 *  title  弹窗的title
 *  dialogurl 弹窗要打开的页面
 *  width  弹窗要打开的宽度
 *  height 弹窗要打开的高度
 *  top  弹窗打开距顶部的位置
 *  left  弹窗打开距左侧的位置
 *  hideTop  弹窗消失时距离顶部的位置
 *  hideLeft  弹窗消失时距离左侧的位置
 *  
 *  使用场景：一般适用于固定弹出位置，固定隐藏位置，且不能移动的弹窗
 *  常用于  地图中 左上角 功能的弹窗
 *  
 */
var showDialog1 = function(dialogid,title, dialogurl, width, height, top, left, hideTop, hideLeft){
	var dialogid = dialogid ? dialogid:"map_dialog1";
	var hideTop = hideTop ? hideTop:0;
	var hideLeft = hideLeft ? hideLeft:0;
	var content = '<iframe id="mapdialogframe" src="' + dialogurl + '" width="100%" height="99%" frameborder="0" scrolling="no"></iframe>';
    var dlgDiv = $("#" + dialogid);
    if(dlgDiv.length == 0){
    	var boarddiv = '<div id="'+ dialogid +'" class="dialogid-self" title="' + title + '" style="display:none;overflow:hidden;padding:3px;z-index:9999999";position:absolute;"></div>';
        $(document.body).append(boarddiv);
    }
    
    
    // 如果高度超出
    var clientHeight = document.documentElement.clientHeight;
	var clientWidth = document.documentElement.clientWidth;
	
	height = height + 40;
	if (height > clientHeight) {
		height = clientHeight - 20;
	}
	if (width > clientWidth) {
		width = clientWidth - 20;
	}

    var win = $('#'+dialogid).dialog({
    	content : content,
    	width: width,
        height:height,
		top:top,
		left:left,
		collapsible :true,
//	        queryParams:{layerId:layerId,objectId:objectId},
        draggable: false,
        title: title ? title :'详情',
        onBeforeClose:function(){
        	console.log("onBeforeClose");
        },
        onClose: function () {
        	console.log("onClose");
            //弹出层关闭事件
//            $(this).dialog('destroy');
        	if(buttonimgname != ''){
        		$('#'+buttonimgname).attr('src', 'images/'+buttonimgname.replace('_img','')+'.png');
        	}
        },
        onBeforeOpen:function(){
        	console.log("onBeforeOpen");
        	$(".dialogid-self").dialog('close');
        },
        onOpen:function (){
        	console.log("onOpen");
	    },
        onLoad: function () {
        	console.log("onLoad");
        },
        onBeforeCollapse:function(){
        	console.log("onBeforeCollapse");
        },onBeforeExpand:function(){
        	console.log("onBeforeExpand");
        }, 
        onCollapse:function(){
        	console.log("onCollapse");
        	console.log(hideTop,hideLeft);
        	var that = this;
        	var currentPanel = $(that).parent();
        	setTimeout(function(){
        		currentPanel.animate({
            		width:4,
            		height:4
            	},"fast","linear",function(){
            		currentPanel.animate({
                		left:hideLeft+"px",
                		top:hideTop+"px",
                		opacity:0.1
                	},"slow","linear",function(){
                		currentPanel.hide('fast',function(){
                			currentPanel.animate({
                        		opacity:1
                        	})
                		});
                	})
            	})
        	})
        },onExpand:function(){
        	console.log("onExpand");
        }
    });
//    win.dialog('open');
};

/****
 *  dialogid 弹窗的id
 *  title  弹窗的title
 *  dialogurl 弹窗要打开的页面
 *  width  弹窗要打开的宽度
 *  height 弹窗要打开的高度
 *  backflag 是否有返回按钮  true有 false无 
 *  backDialogId 点击返回时要打开的Dialog的id   如果不传 在打开弹窗的时候不关闭之前的弹窗
 *  
 *  使用场景：一般适用于普通弹窗或者带返回按钮的弹窗
 *  常用于  地图中 一般弹窗和带返回按钮的弹窗 
 *  
 */
var showDialog2 = function(dialogid,title, dialogurl, width, height, backflag, backDialogId, top, left){
	var dialogid = dialogid ? dialogid:"map_dialog2";
	var hideTop = hideTop ? hideTop:0;
	var hideLeft = hideLeft ? hideLeft:0;
	var content = '<iframe id="mapdialogframe2" src="' + dialogurl + '" width="100%" height="99%" frameborder="0" scrolling="no"></iframe>';
    var dlgDiv = $("#" + dialogid);
    if(dlgDiv.length == 0){
    	var boarddiv = '<div id="'+ dialogid +'" class="dialogid-style1" title="' + title + '" style="display:none;overflow:hidden;padding:3px;z-index:9999999";position:absolute;"></div>';
        $(document.body).append(boarddiv);
    }
    
    // 如果高度超出
    var clientHeight = document.documentElement.clientHeight;
	var clientWidth = document.documentElement.clientWidth;
	
	height = height + 40;
	if (height > clientHeight) {
		height = clientHeight - 20;
	}
	if (width > clientWidth) {
		width = clientWidth - 20;
	}

	if( top == undefined ) {
		top = 50;
	}

    if( left == undefined ) {
        left = 400;
    }

    var win = $('#'+dialogid).dialog({
    	content : content,
    	width: width,
        height:height,
        top:top,
		left:left,
		collapsible :false,
        draggable: true,
        title: title ? title :'详情',
        onBeforeClose:function(){
        	console.log("onBeforeClose");
        },
        onClose: function () {
        	console.log("onClose");
        	
        },
        onBeforeOpen:function(){
        	console.log("onBeforeOpen");
        },
        onOpen:function (){
        	console.log("onOpen");
        	var parentObj = $(this).panel('panel');
        	parentObj.addClass("dialogid-style");
        	
        	console.log(backflag);
        	if(backflag){
        		console.log(backDialogId);
        		if(backDialogId){
        			console.log($("#"+backDialogId));
            		$("#"+backDialogId).dialog('close');
            	}
            	var backStyle = '<div class="panel-self-back" onclick="selfBack2(\''+dialogid+'\',' +'\''+ backDialogId +'\')"><span class="fa fa-angle-left" style="margin-right:6px;">   </span>返回</div>';
            	parentObj.find(".panel-header").append(backStyle);
        	}
	    },
        onLoad: function () {
        	console.log("onLoad");
        	var parentObj = $(this).panel('panel').parent();
        	console.log(parentObj);
        	parentObj.find(".panel-header").append();
        },
        onBeforeCollapse:function(){
        	console.log("onBeforeCollapse");
        },onBeforeExpand:function(){
        	console.log("onBeforeExpand");
        }, 
        onCollapse:function(){
        	console.log("onCollapse");
        },onExpand:function(){
        	console.log("onExpand");
        }
    });
};

function selfBack2(dialogid,backDialogId) {
	var dlgDiv = $("#" + dialogid);
	if (dlgDiv.length != 0) {
		dlgDiv.dialog('close');
		if(backDialogId && backDialogId != 'undefined'){
			$("#"+backDialogId).dialog('open');
		}
	}
}

function clearCustomerLayer(flag){
	if(flag){
		
	}
}

//实时监控-轨迹回放 关键点监听
var addPlaybackKeypointListeners = function(layerId){
	//鼠标经过提示
    jasMapApi.setLayerTips(layerId,'LINELOOPPOINTNAME');
    //添加点击事件
    jasMapApi.addLayerClickEventListener(layerId,function(e){
        var attributes = e.graphic.attributes;
        var objectId = attributes.OBJECTID;
        $.ajax({
    		url : rootPath+"/gpskeypoint/get.do?token="+localStorage.getItem("token"),
    		data :{"oid" : objectId},
    		type : 'POST',
    		dataType:"json",
    		async:true,
    		success : function(data) {
    			if(data.status==1){
    				if(data.data){
    					var content = '<table align="center" width="100%" style="table-layout:fixed;empty-cells:show;border-collapse:collapse;border:1px solid #cad9ea;margin:0px;-webkit-border-radius:4px;-moz-border-radius:4px;-ms-border-radius:4px;border-radius:4px;">'
    						+'<tr style="height:22px;line-height:22px;word-wrap:break-word;word-break:break-all;border:1px solid #cad9ea;">'
    							+'<th width="20%" style="background-color:#f3f8fc;width:20%;text-align:right;color:#666666;border:1px solid #cad9ea;">管线名称</th>'
    							+'<td width="30%" style="background-color:#fff;width:30%;text-align:left;color:#333333;border:1px solid #cad9ea;">'+data.data.lineloopoName+'</td>'
    							+'<th width="20%" style="background-color:#f3f8fc;width:20%;text-align:right;color:#666666;border:1px solid #cad9ea;">关键点名称</th>'
    							+'<td width="30%" style="background-color:#fff;width:30%;text-align:left;color:#333333;border:1px solid #cad9ea;">'+data.data.pointname+'</td>'
    						+'</tr>'
							+'<tr style="height:22px;line-height:22px;word-wrap:break-word;word-break:break-all;border:1px solid #cad9ea;">'
								+'<th width="20%" style="background-color:#f3f8fc;width:20%;text-align:right;color:#666666;border:1px solid #cad9ea;">经度</th>'
								+'<td width="30%" style="background-color:#fff;width:30%;text-align:left;color:#333333;border:1px solid #cad9ea;">'+data.data.lon+'</td>'
								+'<th width="20%" style="background-color:#f3f8fc;width:20%;text-align:right;color:#666666;border:1px solid #cad9ea;">纬度</th>'
								+'<td width="30%" style="background-color:#fff;width:30%;text-align:left;color:#333333;border:1px solid #cad9ea;">'+data.data.lat+'</td>'
							+'</tr>'
							+'<tr style="height:22px;line-height:22px;word-wrap:break-word;word-break:break-all;border:1px solid #cad9ea;">'
								+'<th width="20%" style="background-color:#f3f8fc;width:20%;text-align:right;color:#666666;border:1px solid #cad9ea;">缓冲范围（米）</th>'
								+'<td colspan="3" width="80%" style="background-color:#fff;width:30%;text-align:left;color:#333333;border:1px solid #cad9ea;">'+data.data.buffer+'</td>'
							+'</tr>'
							+'<tr style="height:22px;line-height:22px;word-wrap:break-word;word-break:break-all;border:1px solid #cad9ea;">'
								+'<th width="20%" style="background-color:#f3f8fc;width:20%;text-align:right;color:#666666;border:1px solid #cad9ea;">描述</th>'
								+'<td colspan="3" width="80%" style="background-color:#fff;width:30%;text-align:left;color:#333333;border:1px solid #cad9ea;">'+(data.data.description==null?'':data.data.description)+'</td>'
							+'</tr>'
						+'</table>';
    					var options = {
		                    width:450,
		                    height:200
		                };
    					jasMapApi.showInfoWindow(data.data.lon, data.data.lat, '关键点信息', content, options);
    				}
    			}else{
    				top.showAlert('错误', '查询出错', 'info');
    			}
    		},
    		error : function(result) {
    			top.showAlert('错误', '查询出错', 'info');
    		}
    	});
    });
}

//实时监控-人员监控 分公司、站图标监听
var addrealmonitordeptandstationListeners = function(layerId){
	//鼠标经过提示
    jasMapApi.setLayerTips(layerId,'TITLE');
    //添加点击事件
    jasMapApi.addLayerClickEventListener(layerId,function(e){
        var attributes = e.graphic.attributes;
        var objectId = attributes.OBJECTID;
        var childWindow = $("#mapdialogframe")[0].contentWindow;
        childWindow.changeUnitOnmap(attributes.UNITID,attributes.HIERARCHY,attributes.UNITNAME);
    });
}

//实时监控-人员监控 巡检人员图标监听
var addrealmonitorinspectorListeners = function(layerId){
	//鼠标经过提示
    jasMapApi.setLayerTips(layerId,'TITLE');
  //添加点击事件
    jasMapApi.addLayerClickEventListener(layerId,function(e){
        var attributes = e.graphic.attributes;
        var objectId = attributes.OBJECTID;
        var status = attributes.STATUS;
        var inspectortype = attributes.INSPECTORTYPE;
        var insrange = attributes.INSRANGE;
        var batteryTitle = attributes.BATTERYTITLE;
        var speed = attributes.SPEED;
        var lon = attributes.LON;
        var lat = attributes.LAT;
        var datetime = attributes.DATETIME;
        var status = attributes.STATUS;
        var locationdate = attributes.LOCATIONDATE;
        
//    	var date = new Date().Format("yyyy-MM-dd HH:mm:ss");
//    	var date = '2018-09-29 12:03:56';//test
        $.ajax({
    		url : rootPath+"realtimemonitor/realtimemonitor/getInspectoridInfo.do?inspectorid="+objectId+"&inspectortype="+inspectortype+
    			"&token="+localStorage.getItem("token"),
    		type : 'POST',
    		dataType:"json",
    		async:true,
    		success : function(data) {
    			if(data.status==1){
    				if(data.data){
    					var devcode = data.data.devcode;
    					if(devcode == null){
    						devcode = '';
    					}else{
    						devcode = '('+devcode+')';
    					}
    					var imgurl = '';
    					var imgtitle = '';
    					if(status == 0){
    						imgurl = "../../realtimemonitor/realtimemonitor/images/offline.png";
							imgtitle = "离线";
						}else if(status == 1){
							if(inspectortype='01'){
								imgurl = "../../realtimemonitor/realtimemonitor/images/online.png";
								imgtitle = "在线";
							}else if(inspectortype='02'){
								imgurl = "../../realtimemonitor/realtimemonitor/images/piipeonline.png";
								imgtitle = "在线";
							}
						}
    					var content = 
							'<table width="100%" align="center">'+
								'<tr>'+
									'<td rowspan="4">'+
										'<img title='+imgtitle+' style="vertical-align: middle;" src="'+imgurl+'" height="50" width="33"/>'+
									'</td>'+
									'<td>'+
										'姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：'+data.data.insname+devcode+
									'</td>'+
								'</tr>'+
								'<tr><td>定位时间：'+locationdate+'</td></tr>'+
								'<tr><td>当前速度：'+speed+'km/h</td></tr>'+
								'<tr><td>'+batteryTitle+'</td></tr>'+
								'<tr><td colspan="2"><div style="height:1px;background-color:#6A6AFF;"></div></td></tr>'+
	    						'<tr><td colspan="2">所属部门：'+data.data.unitname+'</td></tr>'+
	    						'<tr><td colspan="2">人员类型：'+data.data.instype+'</td></tr>'+
	    						'<tr><td colspan="2">设备类型：'+data.data.devname+'</td></tr>'+
	    						'<tr><td colspan="2">联系电话：'+data.data.phone+'</td></tr>'+
	    						'<tr><td colspan="2">工作时间：'+datetime+'</td></tr>'+
	    						'<tr><td colspan="2">巡检范围：'+insrange+'</td></tr>'+
	    						'<tr><td colspan="2">关键点数：'+data.data.keypointtotal+'</td></tr>'+
	    						'<tr><td colspan="2">已巡点数：'+data.data.keypointinscount+'</td></tr>'+
	    					'</table>';
    					var options = {
		                    width:345,
		                    height:250
		                };
    					jasMapApi.showInfoWindow(lon, lat, '人员详情', content, options);
    				}
    			}else{
    				top.showAlert('错误', '查询出错', 'info');
    			}
    		},
    		error : function(result) {
    			top.showAlert('错误', '查询出错', 'info');
    		}
    	});
    });
}

//实时监控-人员监控 关键点监听
var addrealmonitorKeypointListeners = function(layerId){
	//鼠标经过提示
    jasMapApi.setLayerTips(layerId,'LINELOOPPOINTNAME');
    //添加点击事件
    jasMapApi.addLayerClickEventListener(layerId,function(e){
        var attributes = e.graphic.attributes;
        var objectId = attributes.OBJECTID;
        $.ajax({
    		url : rootPath+"/gpskeypoint/get.do?token="+localStorage.getItem("token"),
    		data :{"oid" : objectId},
    		type : 'POST',
    		dataType:"json",
    		async:true,
    		success : function(data) {
    			if(data.status==1){
    				if(data.data){
    					var content = '<table align="center" width="100%" style="table-layout:fixed;empty-cells:show;border-collapse:collapse;border:1px solid #cad9ea;margin:0px;-webkit-border-radius:4px;-moz-border-radius:4px;-ms-border-radius:4px;border-radius:4px;">'
    						+'<tr style="height:22px;line-height:22px;word-wrap:break-word;word-break:break-all;border:1px solid #cad9ea;">'
    							+'<th width="20%" style="background-color:#f3f8fc;width:20%;text-align:right;color:#666666;border:1px solid #cad9ea;">管线名称</th>'
    							+'<td width="30%" style="background-color:#fff;width:30%;text-align:left;color:#333333;border:1px solid #cad9ea;">'+data.data.lineloopoName+'</td>'
    							+'<th width="20%" style="background-color:#f3f8fc;width:20%;text-align:right;color:#666666;border:1px solid #cad9ea;">关键点名称</th>'
    							+'<td width="30%" style="background-color:#fff;width:30%;text-align:left;color:#333333;border:1px solid #cad9ea;">'+data.data.pointname+'</td>'
    						+'</tr>'
							+'<tr style="height:22px;line-height:22px;word-wrap:break-word;word-break:break-all;border:1px solid #cad9ea;">'
								+'<th width="20%" style="background-color:#f3f8fc;width:20%;text-align:right;color:#666666;border:1px solid #cad9ea;">经度</th>'
								+'<td width="30%" style="background-color:#fff;width:30%;text-align:left;color:#333333;border:1px solid #cad9ea;">'+data.data.lon+'</td>'
								+'<th width="20%" style="background-color:#f3f8fc;width:20%;text-align:right;color:#666666;border:1px solid #cad9ea;">纬度</th>'
								+'<td width="30%" style="background-color:#fff;width:30%;text-align:left;color:#333333;border:1px solid #cad9ea;">'+data.data.lat+'</td>'
							+'</tr>'
							+'<tr style="height:22px;line-height:22px;word-wrap:break-word;word-break:break-all;border:1px solid #cad9ea;">'
								+'<th width="20%" style="background-color:#f3f8fc;width:20%;text-align:right;color:#666666;border:1px solid #cad9ea;">缓冲范围（米）</th>'
								+'<td colspan="3" width="80%" style="background-color:#fff;width:30%;text-align:left;color:#333333;border:1px solid #cad9ea;">'+data.data.buffer+'</td>'
							+'</tr>'
							+'<tr style="height:22px;line-height:22px;word-wrap:break-word;word-break:break-all;border:1px solid #cad9ea;">'
								+'<th width="20%" style="background-color:#f3f8fc;width:20%;text-align:right;color:#666666;border:1px solid #cad9ea;">描述</th>'
								+'<td colspan="3" width="80%" style="background-color:#fff;width:30%;text-align:left;color:#333333;border:1px solid #cad9ea;">'+(data.data.description==null?'':data.data.description)+'</td>'
							+'</tr>'
						+'</table>';
    					var options = {
		                    width:450,
		                    height:200
		                };
    					jasMapApi.showInfoWindow(data.data.lon, data.data.lat, '关键点信息', content, options);
    				}
    			}else{
    				top.showAlert('错误', '查询出错', 'info');
    			}
    		},
    		error : function(result) {
    			top.showAlert('错误', '查询出错', 'info');
    		}
    	});
    });
}

//实时监控-人员监控、轨迹回放 轨迹起始结束点监听
var addrealmonitorABpointListeners = function(layerId){
	//鼠标经过提示
    jasMapApi.setLayerTips(layerId,'TITLE');
}

/**
 * 实时监控-轨迹回放
 * @returns
 */
function playback(node){
	showDialog1('playback','轨迹回放', '../../realtimemonitor/playback/playback1.html', 490, 650, 10, 60, 60, 23);
	$('#'+node.id).attr('src', 'images/playback_click.png');
	buttonimgname = node.id;
}

/**
 * 实时监控-实时监控
 * @returns
 */
/*function realtimemonitor(node){
	showDialog1('realtimemonitor','实时监控', '../../realtimemonitor/realtimemonitor/realtimemonitor.html', 430, 650, 10, 60, 23, 23);
	$('#'+node.id).attr('src', 'images/realtimemonitor_click.png');
	buttonimgname = node.id;
}*/

function realtimemonitor(node){
     showDialog1('realtimemonitor','实时监控', '../../realtimemonitor/realtimemonitor/realtimemonitor.html', 430, 650, 10, 60, 23, 23);

    $('#'+node.id).attr('src', 'images/realtimemonitor_click.png');
    buttonimgname = node.id;
}


function testbtn1(){
	showDialog1('demo1','demo1', './demo/demo1.html', 500, 400, 10, 60, 100, 30);
}

/**
 * 第三方施工
 */
var addThreeColorsListeners = function(layerId){
	//鼠标经过提示
//    jasMapApi.setLayerTips(layerId,'LINELOOPPOINTNAME');
    //添加点击事件
    jasMapApi.addLayerClickEventListener(layerId,function(e){
    	var attributes = e.graphic.attributes;
        var objectId = attributes.OBJECTID;
        $.ajax({
    		url : rootPath+"/gpsconstruction/getInfo.do?token="+localStorage.getItem("token"),
    		data :{"oid" : objectId},
    		type : 'POST',
    		dataType:"json",
    		async:true,
    		success : function(data) {
    			if(data.status==1){
    				if(data.data){
    					var unitidname = data.data.unitidname == null ? "" : data.data.unitidname;
    					var stakenumname = data.data.stakenumname  == null ? "" : data.data.stakenumname;
    					var progressidCodeName = data.data.progressidCodeName  == null ? "" : data.data.progressidCodeName;
    					var inspectoroidname = data.data.inspectoroidname  == null ? "" : data.data.inspectoroidname;
    					var inspectorphone = data.data.inspectorphone  == null ? "" : data.data.inspectorphone;
    					var oid = data.data.oid;
    					
    					var content = '<table align="center" width="100%" style="table-layout:fixed;empty-cells:show;border-collapse:collapse;border:1px solid #cad9ea;margin:0px;-webkit-border-radius:4px;-moz-border-radius:4px;-ms-border-radius:4px;border-radius:4px;">'
    						+'<tr style="height:22px;line-height:22px;word-wrap:break-word;word-break:break-all;border:1px solid #cad9ea;">'
    							+'<th width="20%" style="background-color:#f3f8fc;width:20%;text-align:right;color:#666666;border:1px solid #cad9ea;">部门</th>'
    							+'<td width="30%" style="background-color:#fff;width:30%;text-align:left;color:#333333;border:1px solid #cad9ea;">'+unitidname+'</td>'
    							+'<th width="20%" style="background-color:#f3f8fc;width:20%;text-align:right;color:#666666;border:1px solid #cad9ea;">桩号</th>'
    							+'<td width="30%" style="background-color:#fff;width:30%;text-align:left;color:#333333;border:1px solid #cad9ea;">'+stakenumname+'</td>'
    						+'</tr>'
							+'<tr style="height:22px;line-height:22px;word-wrap:break-word;word-break:break-all;border:1px solid #cad9ea;">'
								+'<th width="20%" style="background-color:#f3f8fc;width:20%;text-align:right;color:#666666;border:1px solid #cad9ea;">工程进展</th>'
								+'<td width="30%" style="background-color:#fff;width:30%;text-align:left;color:#333333;border:1px solid #cad9ea;">'+progressidCodeName+'</td>'
								+'<th width="20%" style="background-color:#f3f8fc;width:20%;text-align:right;color:#666666;border:1px solid #cad9ea;">现场监护人</th>'
								+'<td width="30%" style="background-color:#fff;width:30%;text-align:left;color:#333333;border:1px solid #cad9ea;">'+inspectoroidname+'</td>'
							+'</tr>'
							+'<tr style="height:22px;line-height:22px;word-wrap:break-word;word-break:break-all;border:1px solid #cad9ea;">'
								+'<th width="20%" style="background-color:#f3f8fc;width:20%;text-align:right;color:#666666;border:1px solid #cad9ea;">联系电话</th>'
								+'<td colspan="3" width="80%" style="background-color:#fff;width:30%;text-align:left;color:#333333;border:1px solid #cad9ea;">'+inspectorphone+'</td>'
							+'</tr>'
							+'<tr style="height:22px;line-height:22px;word-wrap:break-word;word-break:break-all;border:1px solid #cad9ea;">'
							+'<td colspan="2" width="50%" style="background-color:#fff;width:30%;text-align:left;color:#333333;border:1px solid #cad9ea;"><center><button style="background: #1E90FF;cursor: pointer;color: white;width: 80px;height:25px" onclick="viewconstruction(\''+oid+'\')">详情</button></center></td>'
							+'<td colspan="2" width="50%" style="background-color:#fff;width:30%;text-align:left;color:#333333;border:1px solid #cad9ea;"><center><button style="background: #1E90FF;cursor: pointer;color: white;width: 80px;height:25px">实景图</button></center></td>'
							+'</tr>'
						+'</table>';
    					var options = {
		                    width:450,
		                    height:200
		                };
    					jasMapApi.showInfoWindow(data.data.lon, data.data.lat, '第三方施工', content, options);
    				}
    			}else{
    				top.showAlert('错误', '查询出错', 'info');
    			}
    		},
    		error : function(result) {
    			top.showAlert('错误', '查询出错', 'info');
    		}
    	});
    })
}

/**
 * 第三方施工详细信息
 * @param oid
 * @returns
 */
function viewconstruction(oid){
	let fra = top.$("iframe");
	var frm2d;
	for ( let i = 0; i < fra.length; i++) {
		if (fra[i].id == 'frm2d') {
			frm2d = fra[i].contentWindow;
			break;
		}
	}
	frm2d.showDialog2('viewInfoGpsConstruction','第三方施工详细信息', rootPath + 'pipeprotect/gps_construction/mapstatistics/view_info_gps_construction_map.html?oid='+oid, 800, 600,false);
}

function testbtn6(){
//	showDialog1('demo6','demo6', './demo/demo6.html', 500, 400, 10, 60, 280, 30);
	showDialog1('demo6','demo6', '../../realtimemonitor/playback/playback.html', 500, 400, 10, 60, 280, 30);
}
/**
 * @desc 获取系统根路径
 */
function getRootPath() {
	// 获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
	var curWwwPath = window.document.location.href;
	// 获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
	var pathName = window.document.location.pathname;
	var pos = curWwwPath.indexOf(pathName);
	// 获取主机地址，如： http://localhost:8083
	var localhostPaht = curWwwPath.substring(0, pos);
	// 获取带"/"的项目名，如：/uimcardprj
	var projectName = pathName.substring(0, pathName.substring(1).indexOf('/') + 1);
	return (localhostPaht + projectName + "/");
}

/**
 * 做一个可以移动的自定义弹框
 * @since 2019-03-13
 */
function moveDialog() {

}
