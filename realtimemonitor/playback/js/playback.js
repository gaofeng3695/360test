/**
 * @file
 * @author yangyue
 * @desc 添加页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var insfrequnitval = -1;
var jasMapApi;
var frm2d;
var timeoutid;
var inspectoridonmap;
var action=true;
var addwidth = 0;
var offsetW = 0;
var thewidth = 0;
var CurrTime = 0;
var alltime = 0;
var width = 0;
var ywidth = 0;
var stopBarflag = -1;
var options;
var currentIndex;
var pointdata;

/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	let fra = top.$("iframe");
	for ( let i = 0; i < fra.length; i++) {
		if (fra[i].id == 'frm2d') {
			frm2d = fra[i].contentWindow;
			jasMapApi = fra[i].contentWindow.jasMapApi;
			break;
		}
	}
	
	var comboxid='';
	var singleDomainName='';	// 单选值域
	var morecomboxid='';
	var moreDomainName='';	// 多选值域
//	comboxid+='planflag'+',';
//	singleDomainName+='planFlag'+","
	loadSelectData(comboxid,singleDomainName);
	loadMoreSelectData(morecomboxid,moreDomainName);
	
	initInsUnitComboTree('unitid');
	initInspectorCombobox();
	initInstaskdateCombobox();
	initInstimeCombobox();
	initkeypointtable();
	
});

function closeHTML(){
	//清除轨迹起始终止点图层
	jasMapApi.clearGraphicsLayer("drawlayer_PLAYBACK_ABPOINT");
	//清除全路径轨迹图层
	jasMapApi.clearGraphicsLayer("drawlayer_PLAYBACKALL");
	//清除动态轨迹图层
	jasMapApi.clearGraphicsLayer("drawlayer_PLAYBACKALLINTIME");
	//清除巡检人员标绘图层
	jasMapApi.clearGraphicsLayer("drawlayer_INSPECTORONMAP");
	//清除关键点图层
	jasMapApi.clearGraphicsLayer("drawlayer_KEYPOINTONMAP");
	jasMapApi.clearGraphicsLayer("drawlayer_KEYPOINTTEXTONMAP");
	jasMapApi.clearGraphicsLayer("drawlayer_KEYPOINTBUFFERONMAP");
};

/**
 * 初始化当前登陆用户所在部门及子部门树下拉框
 * @returns
 */
function initInsUnitComboTree(unitid){
	$('#'+unitid).combotree({
		panelHeight:250,
		panelWidth:200,
		editable:true,
		mode:'remote',
		valueField : "oid",
		textField : "unitName",
		onSelect: function(node){
			loadInspectorCombobox(node.id);
			$('#instaskdate').combobox('clear');
			$('#instaskdate').combobox('loadData', {});
			$('#instime').combobox('clear');
			$('#instime').combobox('loadData', {});
			$("#keypointtable").datagrid("loadData", { total: 0, rows: [] });
			//清除上一次添加的关键点图层
			jasMapApi.clearGraphicsLayer("drawlayer_KEYPOINTONMAP");
			jasMapApi.clearGraphicsLayer("drawlayer_KEYPOINTTEXTONMAP");
			jasMapApi.clearGraphicsLayer("drawlayer_KEYPOINTBUFFERONMAP");
		}
	});
	setComboObjWidth('unitid',0.31,'combobox');
	$.post(rootPath+'/xncommon/getUnitChildren.do?unitId='+user.unitId+'&unitName='+encodeURI(user.unitName),function(result){
		$('#'+unitid).combotree('loadData', result.data);
	})
}

/**
 * 加载人员下拉框
 * @returns
 */
function initInspectorCombobox(){
	$('#inspectorid').combobox({
//		panelHeight:250,
		editable:true,
		valueField : 'codeid',
		textField : 'codename',
		onSelect : function(row){
			var insdate = $('#insdate').val();
			var inspectorid = row.codeid;
			if(insdate && inspectorid){
				loadInstaskdateCombobox(inspectorid, insdate);
			}
			$('#instime').combobox('clear');
			$('#instime').combobox('loadData', {});
			$("#keypointtable").datagrid("loadData", { total: 0, rows: [] });
			//清除上一次添加的关键点图层
			jasMapApi.clearGraphicsLayer("drawlayer_KEYPOINTONMAP");
			jasMapApi.clearGraphicsLayer("drawlayer_KEYPOINTTEXTONMAP");
			jasMapApi.clearGraphicsLayer("drawlayer_KEYPOINTBUFFERONMAP");
		}
	});
	setComboObjWidth('inspectorid',0.31,'combobox');
}

function loadInspectorCombobox(unitid){
	if(!unitid){
		return;
	}
	$.post(rootPath+"/gpsinspector/getInspectorByUnitid.do?unitId="+unitid,function(data) {
		if(data){
			$('#inspectorid').combobox('loadData', data);
		}
		$('#inspectorid').combobox('clear');
		$("#keypointtable").datagrid("loadData", { total: 0, rows: [] });
		//清除上一次添加的关键点图层
		jasMapApi.clearGraphicsLayer("drawlayer_KEYPOINTONMAP");
		jasMapApi.clearGraphicsLayer("drawlayer_KEYPOINTTEXTONMAP");
		jasMapApi.clearGraphicsLayer("drawlayer_KEYPOINTBUFFERONMAP");
	},'json');
}

/**
 * 加载任务时间下拉框
 * @returns
 */
function initInstaskdateCombobox(){
	$('#instaskdate').combobox({
		panelWidth:165,
		editable:true,
		valueField : 'codeid',
		textField : 'codename',
		onSelect : function(row){
			var codename = row.codename;
			var instaskoid = row.codeid;
			insfrequnitval = row.insfrequnitval;
			if(insfrequnitval == 1){
				$('#instime').combobox('enable');
				loadInstimeCombobox(instaskoid);
				$("#keypointtable").datagrid("loadData", { total: 0, rows: [] });
				//清除上一次添加的关键点图层
				jasMapApi.clearGraphicsLayer("drawlayer_KEYPOINTONMAP");
				jasMapApi.clearGraphicsLayer("drawlayer_KEYPOINTTEXTONMAP");
				jasMapApi.clearGraphicsLayer("drawlayer_KEYPOINTBUFFERONMAP");
			}else if(insfrequnitval > 1){
				$('#instime').combobox('disable');
				$('#instime').combobox('clear');
				$('#instime').combobox('loadData', {});
				loadkeypointtable(insfrequnitval, '', instaskoid);
			}
			
			/*if(row.codeid && codename){
				$('#instaskdate').combobox('setText', codename.replace('<br/>',''));
				
			}*/
		}
	});
	setComboObjWidth('instaskdate',0.31,'combobox');
}

function loadInstaskdateCombobox(inspectorid, insdate){
	$.post(rootPath+"/gpsinstaskday/getInstaskdateByinspectoridAndinsdate.do?inspectorid="+inspectorid+"&insdate="+insdate,function(data) {
		if(data){
			$('#instaskdate').combobox('loadData', data);
		}
		$('#instaskdate').combobox('clear');
	},'json');
}

/**
 * 选中巡检日期监听加载任务时间下拉框
 * @returns
 */
function insdatepicked(){
	var insdate = $('#insdate').val();
	var inspectorid = $('#inspectorid').combobox('getValue');
	if(insdate && inspectorid){
		loadInstaskdateCombobox(inspectorid, insdate);
	}
	$('#instime').combobox('clear');
	$('#instime').combobox('loadData', {});
	$("#keypointtable").datagrid("loadData", { total: 0, rows: [] });
	//清除上一次添加的关键点图层
	jasMapApi.clearGraphicsLayer("drawlayer_KEYPOINTONMAP");
	jasMapApi.clearGraphicsLayer("drawlayer_KEYPOINTTEXTONMAP");
	jasMapApi.clearGraphicsLayer("drawlayer_KEYPOINTBUFFERONMAP");
}

/**
 * 加载巡检时间段下拉框
 * @returns
 */
function initInstimeCombobox(){
	$('#instime').combobox({
//		panelWidth:260,
		panelHeight:100,
		editable:true,
		valueField : 'codeid',
		textField : 'codename',
		onSelect : function(row){
			var instasklinetimeoid = row.codeid;
			loadkeypointtable(1, instasklinetimeoid, '');
		}
	});
	setComboObjWidth('instime',0.77,'combobox');
}

function loadInstimeCombobox(instaskoid){
	$.post(rootPath+"/gpsinstaskday/getInstasktimeByInstaskoid.do?instaskoid="+instaskoid,function(data) {
		if(data){
			$('#instime').combobox('loadData', data);
		}
		$('#instime').combobox('clear');
	},'json');
}

function initkeypointtable(){
	$('#keypointtable').datagrid({
		idField:'pointid',
//		url: rootPath+"/gpsplanlinelnfo/getPage.do",
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
		pagination:false,
		columns: 
		[[
	    	{	
				field:"pointidname",
	    		title:"关键点名称",
	    		width:"290",
	    		resizable:true,
	    		align:'center',
	    		formatter:function(index,row){
	    			return row.lineloopoidname+row.pointidname;
	    		}
	    	},{	
				field:"pointstatusname",
	    		title:"关键点状态",
	    		width:"100",
	    		resizable:true,
	    		align:'center'
	    	}
		]],
		onDblClickRow:function(index,row){
//			jasMapApi.centerAt(row.lon,row.lat);
			jasMapApi.flashGraphic(row.pointid, "drawlayer_KEYPOINTONMAP", null);
		},
		onLoadSuccess:function(data){
	    	$('#keypointtable').datagrid('clearSelections'); //clear selected options
	    }
	});
	
	//页面自适应
	onresize();
	$(window).bind("resize", function () {
		onresize();
     });
}

/**
 * 加载关键点列表
 * @param instasklinetimeoid
 * @returns
 */
function loadkeypointtable(insfrequnitval, instasklinetimeoid, instaskoid){
	var url = '';
	if(insfrequnitval == 1){
		url=rootPath+"/gpsinstaskday/getInstaskKeypointByInstasklinetimeoid.do?instasklinetimeoid="+instasklinetimeoid;
	}else if(insfrequnitval > 1){
		url=rootPath+"/gpsinstaskday/getInstaskKeypointByInstaskoid.do?instaskoid="+instaskoid;
	}
	$.post(url,function(data) {
		if(data){
			$('#keypointtable').datagrid('loadData', data);
			addkeypointOnmap(data);
		}else{
			//清除上一次添加的关键点图层
			jasMapApi.clearGraphicsLayer("drawlayer_KEYPOINTONMAP");
			jasMapApi.clearGraphicsLayer("drawlayer_KEYPOINTTEXTONMAP");
			jasMapApi.clearGraphicsLayer("drawlayer_KEYPOINTBUFFERONMAP");
		}
	});
}

/**
 * 地图上加载关键点图标
 * @param data
 * @returns
 */
function addkeypointOnmap(data){
	//清除上一次添加的关键点图层
	jasMapApi.clearGraphicsLayer("drawlayer_KEYPOINTONMAP");
	jasMapApi.clearGraphicsLayer("drawlayer_KEYPOINTTEXTONMAP");
	jasMapApi.clearGraphicsLayer("drawlayer_KEYPOINTBUFFERONMAP");
	
	//添加关键点缓冲区图层
	var options = {
        "id":"drawlayer_KEYPOINTBUFFERONMAP",
        "type":"graphic",
        "index":11
    };
	jasMapApi.addLayer(options);
	//添加关键点图层
	options = {
        "id":"drawlayer_KEYPOINTONMAP",
        "type":"graphic",
        "index":300
    };
	jasMapApi.addLayer(options);
	options = {
        "id":"drawlayer_KEYPOINTTEXTONMAP",
        "type":"graphic",
        "index":300
    };
	jasMapApi.addLayer(options);
	
	for(var i=0; i<data.length; i++){
		var imgurl='';
		if(data[i].pointstatus == 0){
			imgurl="../../realtimemonitor/playback/images/keypoint_flag_red.png";
		}else if(data[i].pointstatus == 1){
			imgurl="../../realtimemonitor/playback/images/keypoint_flag_green.png";
		}
		options = {
			url:imgurl,//图标地址
	        width:24,//图标大小
	        height:24,
	        attributes:{"OBJECTID":data[i].pointid, "LINELOOPPOINTNAME":data[i].lineloopoidname+': '+data[i].pointidname},//图标属性
	        layerId:"drawlayer_KEYPOINTONMAP"
	    };
		jasMapApi.addPictureGraphic(data[i].lon, data[i].lat, options);
		options = {
            fontSize:10 ,
            fontFamily:"Arial",
            haloColor:[0,255,0,255],
            haloSize:2,
            color :[78,78,78,255],
            backgroundColor:[222,222,222,255],
            angle:0,
            "xOffset": -18,
            "yOffset": -30,
            "center": false,
            layerId:"drawlayer_KEYPOINTTEXTONMAP"
        };
		jasMapApi.addTextGraphic(data[i].lon, data[i].lat, data[i].pointidname, options);
		
		//关键点缓冲区
		options = {
            "draw":true,//是否将结果绘制到图层上
            "layerId":"drawlayer_KEYPOINTBUFFERONMAP",//绘制到图层id
            "layerIndex":10,
            "attributes":null,
            //绘制的样式
            "width": 1,
            "color": [255,0,0,120],//填充色
            "style": "solid",
            "outlineColor": [255,0,0,120],
            "outlineWidth": 1,
            "outlineStyle": "solid",
            "callback":null
        };
		var geomJson = {"x":data[i].lon, "y":data[i].lat,"spatialReference":{"wkid" : 4490}};
		jasMapApi.queryBufferGraphic(geomJson, data[i].buffer, options);
	}
	jasMapApi.flashGraphic(data[0].pointid, "drawlayer_KEYPOINTONMAP", null);
}

/**
 * 轨迹回放
 * @returns
 */
function playback(){
	var rs = 0;
	if(timeoutid){
		window.clearInterval(timeoutid);
	}
	disableButtion("playbackButton");
	var runbtime = $('#runbtime').val();
	var runetime = $('#runetime').val();
	
	if(!$('#unitid').combobox('getValue')){
		$.messager.alert('提示','所属部门不能为空！', 'info');
		enableButtion("playbackButton");
		rs = -1;
		return rs;
	}
	if(!$('#inspectorid').combobox('getValue')){
		$.messager.alert('提示','巡线工不能为空！', 'info');
		enableButtion("playbackButton");
		rs = -1;
		return rs;
	}
	if(!$('#insdate').val()){
		$.messager.alert('提示','巡检日期不能为空！', 'info');
		enableButtion("playbackButton");
		rs = -1;
		return rs;
	}
	if(!$('#instaskdate').combobox('getValue')){
		$.messager.alert('提示','任务时间不能为空！', 'info');
		enableButtion("playbackButton");
		rs = -1;
		return rs;
	}
	if(insfrequnitval == 1 && !$('#instime').combobox('getValue')){
		$.messager.alert('提示','巡检时间段不能为空！', 'info');
		enableButtion("playbackButton");
		rs = -1;
		return rs;
	}
	if(runbtime || runetime){
		if(runbtime > runetime){
			$.messager.alert('提示','轨迹截止时间必须大于轨迹开始时间！', 'info');
			enableButtion("playbackButton");
			rs = -1;
			return rs;
		}
		runbtime = $('#runbtime').val();
		runetime = $('#runetime').val();
	}else{
		if(insfrequnitval > 1){
			var instime = $('#instaskdate').combobox('getText');
			instime = instime.split('(')[1].trim().replace(')','');
			runbtime = instime.split('-')[0].trim().replaceAll('/','-')+' 00:00:01';
			runetime = instime.split('-')[1].trim().replaceAll('/','-')+' 23:59:59';
		}else{
			var instime = $('#instime').combobox('getText');
			runbtime = instime.split('-')[0].trim().replaceAll('/','-');
			runetime = instime.split('-')[1].trim().replaceAll('/','-');
		}
	}
	$.ajax({
		url : rootPath+"/patrolxy/getPatrolxyByDate.do",
		type: "post",
		dataType: "json",
		async:false,
		data:{
			runbtime : runbtime,
			runetime : runetime,
			inspectorid : $('#inspectorid').combobox('getValue')
		},
		success: function(data){
			if(data.status == 1){
				//清除上一次加载的轨迹起始终止点图层
				jasMapApi.clearGraphicsLayer("drawlayer_PLAYBACK_ABPOINT");
				
				//清除上一次加载的全路径轨迹图层
				jasMapApi.clearGraphicsLayer("drawlayer_PLAYBACKALL");
				
				//清除上一次加载的动态轨迹图层
				jasMapApi.clearGraphicsLayer("drawlayer_PLAYBACKALLINTIME");
				
				pointdata = data.data.data;
				if(!pointdata || pointdata.length == 0){
					$.messager.alert("提示", "所选巡检时间内该巡线工没有巡线！", 'info');
					enableButtion("playbackButton");
					rs = -1;
				}else{
					if(!jasMapApi){
						$.messager.alert("提示", "请联系管理员！", 'error');
						enableButtion("playbackButton");
						rs = -1;
					}else{
						//添加轨迹起始终止点图层
						options = {
					        "id":"drawlayer_PLAYBACK_ABPOINT",
					        "type":"graphic"
					    };
						jasMapApi.addLayer(options);
						
						//添加回放时加载的起始终止点标绘
						options = {
							url:"../../realtimemonitor/playback/images/inslocation_A.png",//图标地址
						    width:36,//图标大小
						    height:36,
						    attributes:{"OBJECTID":pointdata[0].oid,"TITLE":"轨迹起始点"},//图标属性
						    layerId:"drawlayer_PLAYBACK_ABPOINT"
						};
						jasMapApi.addPictureGraphic(pointdata[0].lon, pointdata[0].lat, options);//A点
						
						options = {
							url:"../../realtimemonitor/playback/images/inslocation_B.png",//图标地址
						    width:36,//图标大小
						    height:36,
						    attributes:{"OBJECTID":pointdata[0].oid,"TITLE":"轨迹结束点"},//图标属性
						    layerId:"drawlayer_PLAYBACK_ABPOINT"
						};
						jasMapApi.addPictureGraphic(pointdata[pointdata.length-1].lon, pointdata[pointdata.length-1].lat, options);//B点
						
						//添加全路径轨迹图层
						options = {
					        "id":"drawlayer_PLAYBACKALL",
					        "type":"graphic"
					    };
						jasMapApi.addLayer(options);
						
						//添加回放时加载的全路径轨迹标绘
						options = {
		                    "layerId":"drawlayer_PLAYBACKALL",//回放时加载的全路径轨迹
		                    "attributes":null,
		                    "center":true,
		                    "width":3,
		                    "color":[255,0,0,255],//红色
		                    "style":"solid"
		                };
						jasMapApi.addPolylineGraphic(data.data.paths, options, true);
						
						//添加动态轨迹图层
						options = {
					        "id":"drawlayer_PLAYBACKALLINTIME",
					        "type":"graphic"
					    };
						jasMapApi.addLayer(options);
						
						//添加回放时加载的动态轨迹标绘
						options = {
		                    "layerId":"drawlayer_PLAYBACKALLINTIME",//回放时加载的动态轨迹
		                    "attributes":null,
		                    "center":false,
		                    "width":3,
		                    "color":[0,0,255,255],//蓝色
		                    "style":"solid"
		                };
						
						//添加巡检人员图层
						var inspectorOptions = {
					        "id":"drawlayer_INSPECTORONMAP",
					        "type":"graphic"
					    };
						jasMapApi.addLayer(inspectorOptions);
						//添加第一次巡检人员图片标绘
						var inspectorPicOptions = {
							url:"../../realtimemonitor/playback/images/inspector.gif",//图标地址
						    width:24,//图标大小
						    height:24,
						    attributes:{"OBJECTID":pointdata[0].oid},//图标属性
						    layerId:"drawlayer_INSPECTORONMAP"
						};
						inspectoridonmap = pointdata[0].oid;
						jasMapApi.addPictureGraphic(pointdata[0].lon, pointdata[0].lat, inspectorPicOptions);
						
						initBar(pointdata);
						currentIndex = 1;
						addLineinTime(pointdata, options);
						rs = 0;
					}
				}
			}else if(data.code == "400") {
				$.messager.alert("提示", "请联系管理员！", 'error');
				enableButtion("playbackButton");
				rs = -1;
			}else{
				$.messager.alert("提示", data.msg, 'info');
				enableButtion("playbackButton");
				rs = -1;
			}
		}
	});
	enableButtion("playbackButton");
	return rs;
}

/**
 * 播放
 * @returns
 */
function start(){
	if(stopBarflag == 0){
		return;
	}
	if(stopBarflag == -1 || stopBarflag == 2){
		var rs = playback();
		if(rs == -1){
			return;
		}
	}else if(stopBarflag == 1){
		addLineinTime(pointdata, options);
	}
	$('#startimg').attr('src','images/play_dis.png');
	$('#startimg').removeClass('cursorpoint');
	$('#pauseimg').attr('src','images/pause_en.png');
	$('#pauseimg').addClass('cursorpoint');
	$('#stopimg').attr('src','images/stop_en.png');
	$('#stopimg').addClass('cursorpoint');
	stopBarflag = 0;
}

/**
 * 暂停
 * @returns
 */
function pause(){
	if(stopBarflag == 1 || stopBarflag == 2){
		return;
	}
	if(timeoutid){
		window.clearInterval(timeoutid);
	}
	$('#startimg').attr('src','images/play_en.png');
	$('#startimg').addClass('cursorpoint');
	$('#pauseimg').attr('src','images/pause_dis.png');
	$('#pauseimg').removeClass('cursorpoint');
	$('#stopimg').attr('src','images/stop_en.png');
	$('#stopimg').addClass('cursorpoint');
	stopBarflag = 1;
}

/**
 * 停止
 * @returns
 */
function stop(){
	if(stopBarflag == 2){
		return;
	}
	if(timeoutid){
		window.clearInterval(timeoutid);
	}
	$('.TheColorBar').css("width", 0);
    $('.TimeBall').css("left", 0);
    $('#showpointtime').html("当前时间：");
	//清除轨迹起始终止点图层
	jasMapApi.clearGraphicsLayer("drawlayer_PLAYBACK_ABPOINT");
	
	//清除全路径轨迹图层
	jasMapApi.clearGraphicsLayer("drawlayer_PLAYBACKALL");
	
	//清除动态轨迹图层
	jasMapApi.clearGraphicsLayer("drawlayer_PLAYBACKALLINTIME");
	
	//清除巡检人员标绘图层
	jasMapApi.clearGraphicsLayer("drawlayer_INSPECTORONMAP");
	
	$('#startimg').attr('src','images/play_en.png');
	$('#startimg').addClass('cursorpoint');
	$('#pauseimg').attr('src','images/pause_dis.png');
	$('#pauseimg').removeClass('cursorpoint');
	$('#stopimg').attr('src','images/stop_dis.png');
	$('#stopimg').removeClass('cursorpoint');
	currentIndex = 1;
	stopBarflag = 2;
}

/**
 * 轨迹动态画线
 * @param frm2d
 * @param i
 * @param list
 * @param options
 * @returns
 */
function addLineinTime(list, options){
	var inspectorOptions;
	if(currentIndex >= list.length){
		//巡检结束清除巡检人员标绘
		inspectorOptions = {	
			layerId:"drawlayer_INSPECTORONMAP",
			attributes:{"OBJECTID":inspectoridonmap}
		}
		jasMapApi.removeGraphics(inspectorOptions);
		return;
	}
	var point = [];
	var line = [];
	var paths = [];
	point.push(list[currentIndex-1].lon);
	point.push(list[currentIndex-1].lat);
	line.push(point);
	
	point = [];
	point.push(list[currentIndex].lon);
	point.push(list[currentIndex].lat);
	line.push(point);
	
	paths.push(line);
	jasMapApi.addPolylineGraphic(paths, options, false);
	
	//清除上一次加载的巡检人员标绘
	inspectorOptions = {	
		layerId:"drawlayer_INSPECTORONMAP",
		attributes:{"OBJECTID":inspectoridonmap}
	}
	jasMapApi.removeGraphics(inspectorOptions);
	//添加巡检人员图片标绘
	var inspectorPicOptions = {
		url:"../../realtimemonitor/playback/images/inspector.gif",//图标地址
	    width:24,//图标大小
	    height:24,
	    attributes:{"OBJECTID":list[currentIndex].oid},//图标属性
	    layerId:"drawlayer_INSPECTORONMAP"
	};
	inspectoridonmap = list[currentIndex].oid;
	jasMapApi.addPictureGraphic(list[currentIndex].lon, list[currentIndex].lat, inspectorPicOptions);
	
	/*if(i >= list){
		return;
	}*/
	changeBar(currentIndex, list);
	
	currentIndex++;
	timeoutid = window.setTimeout(function(){
		addLineinTime(list, options);
	}, 800);
}

function initBar(data) {
//    CleanAll();
	alltime = data.length-1;
    width = $('.TheBar').width();
    times = alltime;
    rwidth = width;
    if(alltime == 0){
    	addwidth = 0;
    	ywidth = 0;
    }else{
    	addwidth = width/times;
//    	ywidth = Math.round(width % times);
    }
    $('#showpointtime').html("当前时间："+formatDate(data[0].locationdate));
};

function changeBar(currenttime, list) {
//    thewidth = thewidth * 1 + addwidth - offsetW;
    thewidth = addwidth * currenttime - offsetW;
    if (offsetW > 0) {
        offsetW = 0
    }
    if (currenttime >= list.length && alltime != 0) {
        thewidth = rwidth;
//        StopBar()
    }
    $('.TheColorBar').css("width", thewidth);
    $('.TimeBall').css("left", thewidth);
    $('#showpointtime').html("当前时间："+formatDate(list[currenttime].locationdate));
}

function onresize(){
	var containerWidth = $(window).width() - 30;
	var containerHeight = $(window).height() - $('#plantable').height() - $('#barDiv').height() - 30 /*- $('#playbackbar').height() - $('#button-area').height() - 5;*/
	$('#keypointtable').datagrid('resize', {
		width : containerWidth,
		height : containerHeight
	});
}

String.prototype.replaceAll  = function(s1,s2){     
    return this.replace(new RegExp(s1,"gm"),s2);     
}

/**
 * @desc 关闭添加页面
 */
function closePanel() {
	top. closeDlg("playback");
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

function formatDate(str) { 
	var now = new Date(str);
	var year=1900+now.getYear(); 
	var month=now.getMonth()+1; 
	var date=now.getDate(); 
	var hour=now.getHours(); 
	var minute=now.getMinutes(); 
	var second=now.getSeconds(); 
	return year+"-"+(month<10?'0'+month:month)+"-"+date+" "+(hour<10?'0'+hour:hour)+":"+(minute<10?'0'+minute:minute)+":"+(second<10?'0'+second:second); 
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
						$('#'+id).combobox('setValue',data[0].codeId);
					}
				}
			});
			setComboObjWidth(id,0.21,'combobox');
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

