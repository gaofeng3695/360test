/**
 * @file
 * @author yangyue
 * @desc 添加页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var insfrequnitval = -1;
var instasklinetimeoid = '';
var inspectorid = '';


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

var user = JSON.parse(sessionStorage.user);
var unitid = user.unitId;
var jasMapApi;
var frm2d;
var rowindex = -1;
var nowDate = getNowDate();

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
	
	//巡检人员下拉框
	loadInspectorCombobox(unitid);
	//加载巡检人员成绩
//	loadInspectorScoretable();
//	initDetailList(); // 初始化详情列表
	loadDetailData(); // 加载数据
	
	$('#insdate').val(nowDate);
	
	$("#detailList").on("click",".detail-list .detail-item",function(){
		console.log("ddd");
		$("#detailList .detail-item").removeClass("select-item");
		$(this).addClass("select-item");
	});
	
	setHeight(); // 设置高度
});



/*
 * 初始化详情列表
 */
function initDetailList(){
	$('#detailList').accordion({
		animate:true,
//		onSelect:function(title,index){
//			var accordion=$('#detailList').accordion('getPanel',index);
//			var currentId=accordion.panel('options').id;
//			
//			//根据父级菜单id获取子节点数据
//			var item=$('#item'+currentId).html();
//			if(item==""){
//				//父级菜单添加事件触发的时候添加子菜单节点
//				loadItemDetail(currentId);
//			}
//		},
		onUnselect:function(title,index){
			
		}
	});
}

/*
 * 加载详情数据
 */
function loadDetailData(){
	showLoadingMessage();
	$('#detailContent').html("");
	$('#detailContent').append('<div id="detailList" class="detail-info-list"></div>');
	$('#detailList').accordion({
		animate:true
	});
	
	var date = $('#insdate').val();
	var url = rootPath+"/playback/getInspectorScore.do?unitid="+unitid+"&date="+date+"&inspectorid="+$('#inspectorid').combobox('getValue');
	$('#detailList').empty();
	
	$.ajax({
//		url:'../../jasframework/map_viewer/demo/json/data6.json',
		url:url,
		dataType:"json",
		success:function(data){
			if(data.length>0){
				var nodes = data;
				console.log(nodes);
				var len=data.length;
				for(var i=0;i<len;i++){
					
					var id=nodes[i].useroid;
//					try{
						//添加父菜单项
						$('#detailList').accordion('add',{
							title:'<table  style="width:100%" onclick="loadItemDetail(\''+ i +'\',\''+ id +'\')">'+
										'<tr>'+
											'<td width="40%" align="left">'+nodes[i].insname+'</td>'+
											'<td width="30%" align="center">'+nodes[i].pathlinerate+'</td>'+
											'<td width="30%" align="center">'+nodes[i].assessscore+'</td>'+
										'</tr>'+
									'</table>',
							//添加ul作为子节点的容器
							content:'<ul id='+'item'+id+' class="detail-list"></ul>',
							id:id,
							onload:function(){
								console.log("dskdkkdkd");
							}
						});
//					}catch(e){
//						console.log(e)
//					}
				}
			}else{
				showAlert("提示", data.msg, "info");
			}
			hiddenLoadingMessage();
		},error:function(){
			hiddenLoadingMessage();
		}
	});
}

/*
 * 加载子节点
 */
function loadItemDetail(idx,currentId){
	var date = $('#insdate').val();
	var url = rootPath+"/gpsinstaskday/getInstaskdateByinspectoridAndinsdate.do?inspectorid="+currentId+"&insdate="+date;
	var item = $('#item'+currentId).html();
	
	if(item==""){
		var menuId = currentId;
		$.ajax({
//			url:'../../jasframework/map_viewer/demo/json/data7.json',
			url:url,
			dataType:"json",
			success:function(data){
				if(data.length>0){
					for(var i = 0 ; i < data.length; i++){
						var str = '<li class="detail-item">'+
										'<table class="detail-item-info">'+
										  '<tr>'+
										  	'<td width="45%" align="left">'+
										  		'<h6>巡检任务名称</h6>'+
												'<p>'+ data[i].codename +'</p>'+
											'</td>'+
											'<td width="25%" align="center">'+
										  		'<a href="#" id="" class="easyui-linkbutton l-btn select-btn" \
													onclick="selectInsTime(\''+i+'\',\''+data[i].codeid+'\',\''+data[i].insfrequnitval+'\')" >选择时段</a>'+
										  		'<div class="playing hide">'+
											  		'<p>正在回放</p>'+
													'<p>09:00~12:00</p>'+
										  		'</div>'+
											'</td>'+
											'<td width="30%" align="center">'+
												'<div class="">'+
													'<input type="hidden" id="instimetd'+i+'"/>'+
													'<input type="hidden" id="instimetexttd'+i+'"/>'+
													'<input type="hidden" id="runbtimetd'+i+'"/>'+
													'<input type="hidden" id="runetimetd'+i+'"/>'+
											  		'<img id="startimg'+i+'" title="播放" class="cursorpoint" src="images/play_en.png" height="20" width="20" style="margin:0 5px;" \
														onclick="start(\''+i+'\',\''+data[i].insfrequnitval+'\',\''+data[i].codeid+'\',\''+data[i].codename+'\',\''+currentId+'\');" >'+
											  		'<img id="pauseimg'+i+'" title="暂停" src="images/pause_dis.png" height="20" width="20" style="margin:0 5px;"  onclick="pause(\''+i+'\');">'+
											  		'<img id="stopimg'+i+'" title="停止" src="images/stop_dis.png" height="20" width="20" style="margin:0 5px;"  onclick="stop(\''+i+'\');">'+
										  		'</div>'+
										  	'</td>'+
										 '</tr>'+
										'</table>'+
									'</li>';
						$("#item"+menuId).append(str);
					}
				}else{
					var str = '<li class="detail-item">'+
								'<table class="detail-item-info">'+
								  '<tr>'+
								  	'<td width="100%" align="center" height="30px">暂无数据</td>'+
								 '</tr>'+
								'</table>'+
							'</li>';
					$("#item"+menuId).append(str);
				}
			}
		});
	}
	
}


//清空查询条件
function clearQuery(){
	$('#insdate').val('');
	$('#inspectorid').combobox('setValue','');
}

//巡检人员下拉框
function loadInspectorCombobox(unitid){
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
	setComboObjWidth('inspectorid',0.28,'combobox');
	
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

/*
 * 设置下部的高度
 */
function setHeight(){
	var playbackformH = $("#playbackform").height();
	var queryTableH = $("#plantable").outerHeight();
	var tableHeaderH =  $("#tableHeader").outerHeight();
	var tableHeaderMgT = parseInt($("#tableHeader").css("marginTop"));
	var acH = playbackformH -queryTableH -tableHeaderH - tableHeaderMgT;
	console.log(playbackformH);
	console.log(queryTableH);
	console.log(tableHeaderH);
	console.log(tableHeaderMgT);
	console.log(acH);
	
	$("#detailContent").height(acH);
}



/**
 * 选择时间段
 * @returns
 */
function selectInsTime(index,instaskoid, insfrequnitval){
	$('#index').val(index);
	$('#insTimeDialog').dialog('open');
	if(insfrequnitval == 1){
		$('#instimetr').show();
		loadInstimeCombobox(instaskoid);
	}else if(insfrequnitval > 1){
		$('#instimetr').hide();
	}
}

/**
 * 加载巡检时间段下拉框
 * @param instaskoid
 * @returns
 */
function loadInstimeCombobox(instaskoid){
	$('#instime').combobox({
//		panelWidth:260,
		panelHeight:100,
		editable:true,
		valueField : 'codeid',
		textField : 'codename',
		onSelect : function(row){
//			var instasklinetimeoid = row.codeid;
//			loadkeypointtable(1, instasklinetimeoid, '');
		}
	});
	setComboObjWidth('instime',0.51,'combobox');
	
	$.post(rootPath+"/gpsinstaskday/getInstasktimeByInstaskoid.do?instaskoid="+instaskoid,function(data) {
		if(data){
			$('#instime').combobox('loadData', data);
		}
		$('#instime').combobox('clear');
	},'json');
}

/**
 * 选中时间段
 * @returns
 */
function confirmInsTime(){
	var index = $('#index').val();
	instasklinetimeoid=$('#instime').combobox('getValue');
	$('#instimetd'+index).val($('#instime').combobox('getValue'));
	$('#instimetexttd'+index).val($('#instime').combobox('getText'));
	$('#runbtimetd'+index).val($('#runbtime').val());
	$('#runetimetd'+index).val($('#runetime').val());
	$('#insTimeDialog').dialog('close');
}

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
 * 轨迹回放
 * @returns
 */
function playback(index,insfrequnitval,instaskdate, inspectorid){
	var rs = 0;
	if(timeoutid){
		window.clearInterval(timeoutid);
	}
	var runbtime = $('#runbtimetd'+index).val();
	var runetime = $('#runetimetd'+index).val();
	
	/*if(!$('#unitid').combobox('getValue')){
		$.messager.alert('提示','所属部门不能为空！', 'info');
		rs = -1;
		return rs;
	}*/
	/*if(!$('#inspectorid').combobox('getValue')){
		$.messager.alert('提示','巡线工不能为空！', 'info');
		rs = -1;
		return rs;
	}*/
	if(!$('#insdate').val()){
		$.messager.alert('提示','巡检日期不能为空！', 'info');
		rs = -1;
		return rs;
	}
	/*if(!$('#instaskdate').combobox('getValue')){
		$.messager.alert('提示','任务时间不能为空！', 'info');
		rs = -1;
		return rs;
	}*/
	if(insfrequnitval == 1 && !$('#instimetd'+index).val()){
		$.messager.alert('提示','请先选择时段！', 'info');
		rs = -1;
		return rs;
	}
	if(runbtime || runetime){
		if(runbtime > runetime){
			$.messager.alert('提示','轨迹截止时间必须大于轨迹开始时间！', 'info');
			rs = -1;
			return rs;
		}
		runbtime = $('#runbtimetd'+index).val();
		runetime = $('#runetimetd'+index).val();
	}else{
		if(insfrequnitval > 1){
			var instime = instaskdate;
			instime = instime.split('(')[1].trim().replace(')','');
			runbtime = instime.split('-')[0].trim().replaceAll('/','-')+' 00:00:01';
			runetime = instime.split('-')[1].trim().replaceAll('/','-')+' 23:59:59';
		}else{
			var instime = $('#instimetexttd'+index).val();
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
			inspectorid : inspectorid
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
					rs = -1;
				}else{
					if(!jasMapApi){
						$.messager.alert("提示", "请联系管理员！", 'error');
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
						
						currentIndex = 1;
						addLineinTime(pointdata, options);
						rs = 0;
					}
				}
			}else if(data.code == "400") {
				$.messager.alert("提示", "请联系管理员！", 'error');
				rs = -1;
			}else{
				$.messager.alert("提示", data.msg, 'info');
				rs = -1;
			}
		}
	});
	return rs;
}

/**
 * 播放
 * @returns
 */
function start(index,insfrequnitval,instaskoid,instaskdate,inspectorid){
	var width=290;
	var height=300;
	if(rowindex != index){
		if(insfrequnitval == 1){
			parent.showDialog2('playbackkeypoint','巡检关键点', '../../realtimemonitor/playback/playbackkeypoint.html?insfrequnitval='
					+insfrequnitval+'&instasklinetimeoid='+instasklinetimeoid, width, height, false, '', 
					(parent.window.innerHeight-height)/2,parent.window.innerWidth-width);
		}else if(insfrequnitval > 1){
			parent.showDialog2('playbackkeypoint','巡检关键点', '../../realtimemonitor/playback/playbackkeypoint.html?insfrequnitval='
					+insfrequnitval+'&instaskoid='+instaskoid, width, height, false, '', 
					(parent.window.innerHeight-height)/2,parent.window.innerWidth-width);
		}
		rowindex = index;
	}
	if(stopBarflag == 0){
		return;
	}
	if(stopBarflag == -1 || stopBarflag == 2){//首次播放或停止后再次播放
		var rs = playback(index,insfrequnitval,instaskdate,inspectorid);
		if(rs == -1){
			return;
		}
	}else if(stopBarflag == 1){//暂停后播放
		addLineinTime(pointdata, options);
	}
	$('#startimg'+index).attr('src','images/play_dis.png');
	$('#startimg'+index).removeClass('cursorpoint');
	$('#pauseimg'+index).attr('src','images/pause_en.png');
	$('#pauseimg'+index).addClass('cursorpoint');
	$('#stopimg'+index).attr('src','images/stop_en.png');
	$('#stopimg'+index).addClass('cursorpoint');
	stopBarflag = 0;
}

/**
 * 暂停
 * @returns
 */
function pause(index){
	if(stopBarflag == 1 || stopBarflag == 2){
		return;
	}
	if(timeoutid){
		window.clearInterval(timeoutid);
	}
	$('#startimg'+index).attr('src','images/play_en.png');
	$('#startimg'+index).addClass('cursorpoint');
	$('#pauseimg'+index).attr('src','images/pause_dis.png');
	$('#pauseimg'+index).removeClass('cursorpoint');
	$('#stopimg'+index).attr('src','images/stop_en.png');
	$('#stopimg'+index).addClass('cursorpoint');
	stopBarflag = 1;
}

/**
 * 停止
 * @returns
 */
function stop(index){
	if(stopBarflag == 2){
		return;
	}
	if(timeoutid){
		window.clearInterval(timeoutid);
	}
	//清除轨迹起始终止点图层
	jasMapApi.clearGraphicsLayer("drawlayer_PLAYBACK_ABPOINT");
	
	//清除全路径轨迹图层
	jasMapApi.clearGraphicsLayer("drawlayer_PLAYBACKALL");
	
	//清除动态轨迹图层
	jasMapApi.clearGraphicsLayer("drawlayer_PLAYBACKALLINTIME");
	
	//清除巡检人员标绘图层
	jasMapApi.clearGraphicsLayer("drawlayer_INSPECTORONMAP");
	
	$('#startimg'+index).attr('src','images/play_en.png');
	$('#startimg'+index).addClass('cursorpoint');
	$('#pauseimg'+index).attr('src','images/pause_dis.png');
	$('#pauseimg'+index).removeClass('cursorpoint');
	$('#stopimg'+index).attr('src','images/stop_dis.png');
	$('#stopimg'+index).removeClass('cursorpoint');
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
	
	currentIndex++;
	timeoutid = window.setTimeout(function(){
		addLineinTime(list, options);
	}, 800);
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
 * 获取当前日期
 * @returns
 */
function getNowDate(){
	var myDate = new Date();
	//获取当前年
	var year=myDate.getFullYear();
	//获取当前月
	var month=myDate.getMonth()+1;
	//获取当前日
	var date=myDate.getDate(); 
	return year+'-'+p(month)+"-"+p(date);
}

/**
 * 
 * 判断传入值是否小于10，小于10补0
 */
function p(s) {
    return s < 10 ? '0' + s: s;
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

