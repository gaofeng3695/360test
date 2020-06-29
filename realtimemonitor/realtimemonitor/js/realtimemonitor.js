
var jasMapApi;
var frm2d;
var hierarchy_level = '';

/**
 * @desc 页面初始化
 */
$(document).ready(function(){

	/* 找到地图那个实体。 */
	let fra = top.$("iframe");
	for ( let i = 0; i < fra.length; i++) {
		if (fra[i].id == 'frm2d') {
			frm2d = fra[i].contentWindow;
			jasMapApi = fra[i].contentWindow.jasMapApi;
			break;
		}
	}
	
	initUnitUrl('');
	onresize();
});

function onresize(){
	var containerWidth = $(window).width() - 30;
	var containerHeight = $(window).height() - $('#count').height() - $('#uniturl').height();/*- $('#playbackbar').height() - $('#button-area').height() - 5;*/
	$('#insinfo').height(containerHeight-30);
	$('#insinfodiv').height(containerHeight-35);
}

/**
 * 初始化顶层部门
 * @param unitid
 * @returns
 */
function initUnitUrl( unitid ){
	$.ajax({
		url : rootPath+"realtimemonitor/realtimemonitor/getUnitByParentid.do?unitid="+unitid,
		type: "post",
		dataType: "json",
		success: function(data){
			if(data.status == 1){
				if(data && data.data.length == 1){
					hierarchy_level = data.data[0].hierarchy;
					$('#uniturl').append('<span class="uniturl" onclick="changeUnit(this);"><input name="oid" type="hidden" value="'
							+data.data[0].oid+';'+data.data[0].hierarchy+'"/>'
							+data.data[0].unitName+'</span>');
					// 根据部门id获取所有有设备的巡线工、管道工个数
					getInspectorCountByUnitid(data.data[0].oid, data.data[0].hierarchy);
					// 根据父部门id获取有巡检任务的子部门
					getPartrolUnitByParentid(data.data[0].oid, data.data[0].hierarchy);
					// 根据部门层级编码、日期，获取当前部门及子孙部门巡检任务中的关键点
//					getInsKeyPointByUnitHierarchy(data.data[0].oid, data.data[0].hierarchy);
				}
			}else if(data.code == "400") {
				$.messager.alert("提示", "请联系管理员！", 'error');
			}else{
				$.messager.alert("提示", data.msg, 'info');
			}
		}
	});
}

/**
 * 导航或详情列表中点击分公司、站
 * @param node
 * @returns
 */
function changeUnit(node){
	var unitid = $(node).children("input")[0].value;
	var unitname = $(node).html().split('>')[1];
	var hierarchy = unitid.split(';')[1];
	unitid = unitid.split(';')[0];
	
	if(hierarchy_level.length > hierarchy.length){
		$(node).nextAll().remove();
	}else if(hierarchy_level.length < hierarchy.length){
		$('#uniturl').append('<span> >> </span><span class="uniturl" onclick="changeUnit(this);"><input name="oid" type="hidden" value="'+unitid+';'+hierarchy+'"/>'+unitname+'</span>');
	}
	
	//根据部门id获取所有有设备的巡线工、管道工个数
	getInspectorCountByUnitid(unitid, hierarchy);
	if(hierarchy.split('.').length-1 == 3){
		//获取巡检人员
		getInspector(unitid, hierarchy);
	}else{
		//根据父部门id获取有巡检任务的子部门
		getPartrolUnitByParentid(unitid, hierarchy);
	}
	//根据部门层级编码、日期，获取当前部门及子孙部门巡检任务中的关键点
//	getInsKeyPointByUnitHierarchy(unitid, hierarchy);
	hierarchy_level = hierarchy;
}

/**
 * 地图上点击分公司或部门
 */
function changeUnitOnmap(unitid, hierarchy, unitname){
	$('#uniturl').append('<span> >> </span><span class="uniturl" onclick="changeUnit(this);"><input name="oid" type="hidden" value="'+unitid+';'+hierarchy+'"/>'+unitname+'</span>');
	//根据部门id获取所有有设备的巡线工、管道工个数
	getInspectorCountByUnitid(unitid, hierarchy);
	if(hierarchy.split('.').length-1 == 3){
		//获取巡检人员
		getInspector(unitid, hierarchy);
	}else{
		//根据父部门id获取有巡检任务的子部门
		getPartrolUnitByParentid(unitid, hierarchy);
	}
	//根据部门层级编码、日期，获取当前部门及子孙部门巡检任务中的关键点
//	getInsKeyPointByUnitHierarchy(unitid, hierarchy);
	hierarchy_level = hierarchy;
}

/**
 * 获取巡检人员，包括管道工、巡线工
 * @returns
 */
function getInspector(unitid, hierarchy){
	$.ajax({
		url : rootPath+"realtimemonitor/realtimemonitor/getInspectorByUnitid.do?unitid="+unitid+"&hierarchy="+hierarchy,
		type: "post",
		dataType: "json",
		success: function(data){
			if(data.status == 1){
				//清除上一次添加的分公司图标图层
				jasMapApi.clearGraphicsLayer("drawlayer_MONITORSUBDEPTONMAP");
				//清除上一次添加的场站图标图层
				jasMapApi.clearGraphicsLayer("drawlayer_MONITORSTATIONONMAP");
				//清除上一次添加的分公司、场站图层文字标注
				jasMapApi.clearGraphicsLayer("drawlayer_MONITORSUBDEPSTATIONTEXTMAP");
				//清除上一次添加的巡检人员图标图层
				jasMapApi.clearGraphicsLayer("drawlayer_MONITORINSPECTORONMAP");
				jasMapApi.clearGraphicsLayer("drawlayer_MONITORINSPECTORTEXTONMAP");
				//清除上一次加载的轨迹起始终止点图层
				jasMapApi.clearGraphicsLayer("drawlayer_MONITORABPOINT");
				//清除上一次加载的当日巡线轨迹图层
				jasMapApi.clearGraphicsLayer("drawlayer_MONITORINSLINE");
				//清除上一次加载的当日关键点图层
				jasMapApi.clearGraphicsLayer("drawlayer_MONITORKEYPOINTONMAP");
				jasMapApi.clearGraphicsLayer("drawlayer_MONITORKEYPOINTTEXTONMAP");
				
				if(data && data.data.length > 0){
					var options;
					var imgurl;
					var imgtitle;
					$('#insinfo tbody').empty();
					
					// 添加巡检人员图层
					options = {
				        "id":"drawlayer_MONITORINSPECTORONMAP",
				        "type":"graphic"
				    };
					jasMapApi.addLayer(options);
					options = {
				        "id":"drawlayer_MONITORINSPECTORTEXTONMAP",
				        "type":"graphic"
				    };
					jasMapApi.addLayer(options);
					
					if(data.data.length < 3){
						if(data.data[0].lon && data.data[0].lat){
							jasMapApi.centerAt(data.data[0].lon, data.data[0].lat);
						}
					}else{
						if(data.data[Math.floor(data.data.length/2)].lon && data.data[Math.floor(data.data.length/2)].lat){
							jasMapApi.centerAt(data.data[Math.floor(data.data.length/2)].lon,data.data[Math.floor(data.data.length/2)].lat);
						}
					}
					
					for(var i=0; i<data.data.length; i++){
						if(data.data[i].status == 0){
							imgurl = "offline.png";
							imgtitle = "离线";
						}else if(data.data[i].status == 1){
							if(data.data[i].inspectortype='01'){
								imgurl = "online.png";
								imgtitle = "在线";
							}else if(data.data[i].inspectortype='02'){
								imgurl = "piipeonline.png";
								imgtitle = "在线";
							}
						}
						
						var rangedata = getInsRangeByInspectorid(data.data[i].inspectorid);
						var datetime='';
						var insrange='';
						if(rangedata && rangedata.length > 0){
							for(var j=0; j<rangedata.length; j++){
								var pointidname = rangedata[j].pointidname;
								var points;
								var point = '';
								if(pointidname){
									points = pointidname.split(',');
									if(points.length == 1){
										point = points[0];
									}else{
										point = points[0]+'~'+points[points.length-1];
									}
								}
								if(j==0){
									datetime = rangedata[j].datetime;
									insrange = rangedata[j].lineloopoidname+':'+point;
								}else{
									datetime += '<br/>'+rangedata[j].datetime;
									insrange += '<br/>'+rangedata[j].lineloopoidname+':'+point;
								}
							}
						}
						
						var battery = 0;
						var batteryTitle = '0%';
						var batterycolor='rgba(100,250,50,1)';
						if(data.data[i].battery){
							battery = data.data[i].battery*26/100;
							batteryTitle = data.data[i].battery+'%';
							if(data.data[i].battery <= 20){
								batterycolor = 'rgba(255,87,34,1)';
							}
						}
						batteryTitle = '电池电量：'+batteryTitle;
						
						if(data.data[i].lon && data.data[i].lat){
							options = {
								url:"../../realtimemonitor/realtimemonitor/images/"+imgurl,//图标地址
						        width:20,//图标大小
						        height:30,
						        attributes:{"OBJECTID":data.data[i].inspectorid,"TITLE":(data.data[i].insname==null?'':data.data[i].insname),"STATUS":data.data[i].status,
						        	"INSPECTORTYPE":data.data[i].inspectortype,"INSRANGE":insrange,"BATTERYTITLE":batteryTitle,"SPEED":data.data[i].speed,
						        	"LON":data.data[i].lon,"LAT":data.data[i].lat,'DATETIME':datetime,'LOCATIONDATE':(data.data[i].locationdate==null?'':data.data[i].locationdate)},//图标属性
						        layerId:"drawlayer_MONITORINSPECTORONMAP"
						    };
							jasMapApi.addPictureGraphic(data.data[i].lon, data.data[i].lat, options);
							options = {
					            fontSize:10 ,
					            fontFamily:"Arial",
					            haloColor:[0,255,0,255],
					            haloSize:2,
					            color :[78,78,78,255],
					            backgroundColor:[222,222,222,255],
					            angle:0,
					            "xOffset": -15,
					            "yOffset": 12,
					            "center": false,
					            layerId:"drawlayer_MONITORINSPECTORTEXTONMAP"
					        };
							jasMapApi.addTextGraphic(data.data[i].lon, data.data[i].lat, data.data[i].insname, options);
						}
						
						var row = 
						'<tr style="background-color:white;">'+
							'<td width="100%" style="vertical-align:top;">'+
								'<table width="100%">'+
									'<tr>'+
										'<td rowspan="4" width="15%" style="padding-left:10px;">'+
											'<img title='+imgtitle+' style="vertical-align: middle;" src="images/'+imgurl+'" height="50" width="33"/>'+
										'</td>'+
										'<td colspan="2" width="85%" style="font-size:15px;font-weight:bold;">'+
											'<span style="cursor: pointer;" class="insinfo" onclick="inspectorInfo(this);">'+
												'<input name="oid" type="hidden" value="'+data.data[i].inspectorid+'"/>'+
												(data.data[i].insname==null?'':data.data[i].insname)+
											'</span>'+
										'</td>'+
									'</tr>'+
									'<tr>'+
										'<td width="18%">'+
											'定位时间：'+
										'</td>'+
										'<td align="left">'+
											(data.data[i].locationdate==null?'':data.data[i].locationdate)+
										'</td>'+
									'</tr>'+
									'<tr>'+
										'<td width="18%">'+
											'工作时间：'+
										'</td>'+
										'<td align="left">'+
											datetime+
										'</td>'+
									'</tr>'+
									'<tr>'+
										'<td width="18%">'+
											'巡检范围：'+
										'</td>'+
										'<td align="left">'+
											insrange+
										'</td>'+
									'</tr>'+
									'<tr><td colspan="3"><div style="height:1px;background-color:#6A6AFF;"></div></td></tr>'+
									'<tr>'+
										'<td align="left">'+
											'<div title='+batteryTitle+' class="batterymm"><div class="batterycc"><div style="width:'+battery+'px;background-color:'+batterycolor+'" class="batteryfiller"></div><div class="batteryright"></div</div></div>'+
										'</td>'+
										'<td colspan="2" align="right">'+
											'<img onclick="getInspectorscore(\''+data.data[i].inspectorid+'\',\''+(data.data[i].insname==null?'':data.data[i].insname)+'\');" title="周成绩" style="vertical-align: middle;cursor: pointer;" src="images/stationscore.png" height="25" width="25"/>'+
											'<img onclick="locateInspector(\''+data.data[i].inspectorid+'\',\''+data.data[i].lon+'\',\''+data.data[i].lat+'\',\''+(data.data[i].insname==null?'':data.data[i].insname)+'\',\'drawlayer_MONITORINSPECTORONMAP\');" title="定位" style="vertical-align: middle;cursor: pointer;" src="images/locate.png" height="25" width="25"/>'+
											'<img onclick="getInsLineByDateInspectorid(\''+data.data[i].inspectorid+'\',\''+(data.data[i].insname==null?'':data.data[i].insname)+'\');" title="当日轨迹" style="vertical-align: middle;cursor: pointer;" src="images/insline.png" height="16" width="16"/>'+
											'<img onclick="getInsKeyPointByInspectorid(\''+data.data[i].inspectorid+'\')" title="关键点" style="vertical-align: middle;cursor: pointer;" src="images/keypoint.png" height="25" width="25"/>'+
//											'<img title="详情" style="vertical-align: middle;cursor: pointer;" src="images/info.png" height="20" width="20"/>'+
										'</td>'+
									'</tr>'+
								'</table>'+
							'</td>'+
						'</tr>';
						
						$('#insinfo').append(row);
					}
				}
			}else if(data.code == "400") {
				$.messager.alert("提示", "请联系管理员！", 'error');
			}else{
				$.messager.alert("提示", data.msg, 'info');
			}
		}
	});
}

/**
 * 根据巡线人员id、当前日期获取巡检范围及巡检工作时间
 * @param inspectorid
 * @returns
 */
function getInsRangeByInspectorid(inspectorid){
//	var date = new Date().Format("yyyy-MM-dd");
//	var date = '2018-09-29';//test
	var rs = null;
	$.ajax({
		url : rootPath+"realtimemonitor/realtimemonitor/getInsRangeByInspectorid.do?inspectorid="+inspectorid,
		type: "post",
		dataType: "json",
		async:false,
		success: function(data){
			if(data.status == 1){
				rs = data.data;
			}else if(data.code == "400") {
				$.messager.alert("提示", "请联系管理员！", 'error');
			}else{
				$.messager.alert("提示", data.msg, 'info');
			}
		}
	});
	return rs;
}

/**
 * 根据部门id获取所有有设备的巡线工、管道工个数
 * @returns
 */
function getInspectorCountByUnitid(unitid, hierarchy){
	$.ajax({
		url : rootPath+"realtimemonitor/realtimemonitor/getInspectorCountByUnitid.do?unitid="+unitid+"&hierarchy="+hierarchy,
		type: "post",
		dataType: "json",
		success: function(data){
			if(data.status == 1){
				if(data && data.data.length == 1){
					$('#allIns').html('');
					$('#allonIns').html('');
					$('#alloffIns').html('');
					$('#allIns').append('<img style="vertical-align: middle;" title="巡线总人数" src="images/allIns.png" height="25" width="25"/>'+data.data[0].total);
					$('#allonIns').append('<img style="vertical-align: middle;" title="在线人数" src="images/allonIns.png" height="25" width="25"/>'+(data.data[0].insonline + data.data[0].inspipeonline));
					$('#alloffIns').append('<img style="vertical-align: middle;" title="离线人数" src="images/alloffIns.png" height="25" width="25"/>'+(data.data[0].insoffline + data.data[0].inspipeoffline));
				}
			}else if(data.code == "400") {
				$.messager.alert("提示", "请联系管理员！", 'error');
			}else{
				$.messager.alert("提示", data.msg, 'info');
			}
		}
	});
}

/**
 * 根据父部门id获取有巡检任务的子部门
 * @param unitid
 * @returns
 */
function getPartrolUnitByParentid(unitid, hierarchy){
	$.ajax({
		url : rootPath+"realtimemonitor/realtimemonitor/getPartrolUnitByParentid.do?unitid="+unitid,
		type: "post",
		dataType: "json",
		async:false,
		success: function(data){
			if(data.status == 1){
				//清除上一次添加的分公司图标图层
				jasMapApi.clearGraphicsLayer("drawlayer_MONITORSUBDEPTONMAP");
				//清除上一次添加的场站图标图层
				jasMapApi.clearGraphicsLayer("drawlayer_MONITORSTATIONONMAP");
				//清除上一次添加的分公司、场站图层文字标注
				jasMapApi.clearGraphicsLayer("drawlayer_MONITORSUBDEPSTATIONTEXTMAP");
				//清除上一次添加的巡检人员图标图层
				jasMapApi.clearGraphicsLayer("drawlayer_MONITORINSPECTORONMAP");
				jasMapApi.clearGraphicsLayer("drawlayer_MONITORINSPECTORTEXTONMAP");
				//清除上一次加载的轨迹起始终止点图层
				jasMapApi.clearGraphicsLayer("drawlayer_MONITORABPOINT");
				//清除上一次加载的当日巡线轨迹图层
				jasMapApi.clearGraphicsLayer("drawlayer_MONITORINSLINE");
				//清除上一次加载的当日关键点图层
				jasMapApi.clearGraphicsLayer("drawlayer_MONITORKEYPOINTONMAP");
				jasMapApi.clearGraphicsLayer("drawlayer_MONITORKEYPOINTTEXTONMAP");
				
				if(data && data.data.length > 0){
					var options;
					var imgurlonmap;
					var layerId;
					var imgurl;
					var xOffset = 0;
					var width = 0;
					var height = 0;
					var widthimg = 0;
					var heightimg = 0;
					$('#insinfo tbody').empty();
					
					if(hierarchy.split('.').length-1 == 1){//加载分公司
						//添加分公司图层
						options = {
					        "id":"drawlayer_MONITORSUBDEPTONMAP",
					        "type":"graphic"
					    };
						jasMapApi.addLayer(options);
						imgurlonmap = "../../realtimemonitor/realtimemonitor/images/subdeptonmap.png";
						width = 63;
						height = 60;
						widthimg = 41;
						heightimg = 50;
						layerId = "drawlayer_MONITORSUBDEPTONMAP";
						imgurl = "images/subdept.png";
						xOffset = -40;
					}else{//加载站
						//添加场站图层
						options = {
					        "id":"drawlayer_MONITORSTATIONONMAP",
					        "type":"graphic"
					    };
						jasMapApi.addLayer(options);
						imgurlonmap = "../../realtimemonitor/realtimemonitor/images/stationonmap.png";
						width = 60;
						height = 50;
						widthimg = 48;
						heightimg = 43;
						layerId = "drawlayer_MONITORSTATIONONMAP";
						imgurl = "images/station.png";
						xOffset = -25;
					}
					//添加分公司、场站图层文字标注
					options = {
				        "id":"drawlayer_MONITORSUBDEPSTATIONTEXTMAP",
				        "type":"graphic"
				    };
					jasMapApi.addLayer(options);
					
					if(data.data.length < 3){
						jasMapApi.centerAt(data.data[0].lon, data.data[0].lat);
					}else{
						jasMapApi.centerAt(data.data[Math.floor(data.data.length/2)].lon,data.data[Math.floor(data.data.length/2)].lat);
					}
					
					for(var i=0; i<data.data.length; i++){
						
						//根据部门id获取所有有设备的巡线工、管道工个数
						$.ajax({
							url : rootPath+"realtimemonitor/realtimemonitor/getInspectorCountByUnitid.do?unitid="+data.data[i].oid+"&hierarchy="+data.data[i].hierarchy,
							type: "post",
							dataType: "json",
							async:false,
							success: function(list){
								if(list.status == 1){
									if(list && list.data.length == 1){
										var title = list.data[0].unitname+"：在线"+
											((list.data[0].insonline==null?0:list.data[0].insonline)+(list.data[0].inspipeonline==null?0:list.data[0].inspipeonline))+
											"人，离线"+((list.data[0].insoffline==null?0:list.data[0].insoffline)+(list.data[0].inspipeoffline==null?0:list.data[0].inspipeoffline))+"人";
										options = {
											url:imgurlonmap,//图标地址
									        width:widthimg,//图标大小
									        height:heightimg,
									        attributes:{"OBJECTID":data.data[i].oid,"TITLE":title,"UNITID":list.data[0].unitid,"HIERARCHY":list.data[0].hierarchy,
									        	"UNITNAME":(list.data[0].unitname==null?'':list.data[0].unitname)
									        },//图标属性
									        layerId:layerId
									    };
										jasMapApi.addPictureGraphic(data.data[i].lon, data.data[i].lat, options);
										options = {
								            fontSize:10 ,
								            fontFamily:"Arial",
								            haloColor:[0,255,0,255],
								            haloSize:2,
								            color :[78,78,78,255],
								            backgroundColor:[222,222,222,255],
								            angle:0,
								            xOffset: xOffset,
								            yOffset: -40,
								            center: false,
								            layerId:"drawlayer_MONITORSUBDEPSTATIONTEXTMAP"
								        };
										jasMapApi.addTextGraphic(data.data[i].lon, data.data[i].lat, list.data[0].unitname, options);
										
										var row = 
											'<tr style="background-color:white;">'+
												'<td width="100%" style="vertical-align:top;">'+
													'<table>'+
														'<tr>'+
															'<td rowspan="3" width="15%" style="padding-left:10px;">'+
																'<img style="vertical-align: middle;" src='+imgurl+' height="'+height+'" width="'+width+'"/>'+
															'</td>'+
															'<td width="85%" style="font-size:15px;font-weight:bold;" colspan="3">'+
																'<span style="cursor: pointer;" class="insinfo" onclick="changeUnit(this);">'+
																	'<input name="oid" type="hidden" value="'+list.data[0].unitid+';'+list.data[0].hierarchy+'"/>'+
																	(list.data[0].unitname==null?'':list.data[0].unitname)+
																'</span>'+
															'</td>'+
														'</tr>'+
														'<tr>'+
															'<td width="20%" class="insinfo">'+
																'<img title="巡线工总人数" style="vertical-align: middle;" src="images/insall.png" height="22" width="15"/>'+
																((list.data[0].insonline==null?0:list.data[0].insonline) + (list.data[0].insoffline==null?0:list.data[0].insoffline))+
															'</td>'+
															'<td width="20%" class="insinfo">'+
																'<img title="巡线工在线人数" style="vertical-align: middle;padding-left:15px;" src="images/insonline.png" height="23" width="21"/>'+
																(list.data[0].insonline==null?0:list.data[0].insonline)+
															'</td>'+
															'<td width="20%" class="insinfo">'+
																'<img title="巡线工离线人数" style="vertical-align: middle;padding-left:15px;" src="images/insoffline.png" height="22" width="15"/>'+
																(list.data[0].insoffline==null?0:list.data[0].insoffline)+
															'</td>'+
														'</tr>'+
														'<tr>'+
															'<td width="20%" class="insinfo">'+
																'<img title="管道工总人数" style="vertical-align: middle;" src="images/inspipeall.png" height="22" width="15"/>'+
																((list.data[0].inspipeonline==null?0:list.data[0].inspipeonline) + (list.data[0].inspipeoffline==null?0:list.data[0].inspipeoffline))+
															'</td>'+
															'<td width="20%" class="insinfo">'+
																'<img title="管道工在线人数" style="vertical-align: middle;padding-left:15px;" src="images/inspipeonline.png" height="24" width="20"/>'+
																(list.data[0].inspipeonline==null?0:list.data[0].inspipeonline)+
															'</td>'+
															'<td width="20%" class="insinfo">'+
																'<img title="管道工离线人数" style="vertical-align: middle;padding-left:15px;" src="images/inspipeoffline.png" height="22" width="15"/>'+
																(list.data[0].inspipeoffline==null?0:list.data[0].inspipeoffline)+
															'</td>'+
														'</tr>'+
														'<tr><td colspan="4"><div style="height:1px;background-color:#6A6AFF;"></div></td></tr>'+
														'<tr>'+
															'<td colspan="4" align="right">'+
																'<img onclick="getStationfstatistic(\''+data.data[i].oid+'\',\''+(list.data[0].unitname==null?'':list.data[0].unitname)+'\');" title="覆盖率统计" style="vertical-align: middle;cursor: pointer;" src="images/stationfstatistics.png" height="25" width="25"/>'+
																'<img onclick="getStationscore(\''+data.data[i].oid+'\',\''+(list.data[0].unitname==null?'':list.data[0].unitname)+'\');" title="周成绩" style="vertical-align: middle;cursor: pointer;" src="images/stationscore.png" height="25" width="25"/>'+
																'<img onclick="getUnitdaywork(\''+data.data[i].oid+'\',\''+(list.data[0].unitname==null?'':list.data[0].unitname)+'\');" title="部门每日工作统计" style="vertical-align: middle;cursor: pointer;" src="images/daywork.png" height="25" width="25"/>'+
																'<img onclick="getUnitInfo(\''+data.data[i].oid+'\',\''+(list.data[0].unitname==null?'':list.data[0].unitname)+'\',\''+data.data[i].lon+'\',\''+data.data[i].lat+'\');" title="部门详情" style="vertical-align: middle;cursor: pointer;" src="images/stationinfo.png" height="25" width="25"/>'+
																'<img onclick="locateUnit(\''+data.data[i].oid+'\',\''+data.data[i].lon+'\',\''+data.data[i].lat+'\',\''+(list.data[0].unitname==null?'':list.data[0].unitname)+'\',\''+layerId+'\');" title="定位" style="vertical-align: middle;cursor: pointer;" src="images/locate.png" height="25" width="25"/>'+
																'<img onclick="getInsKeyPointByUnitHierarchy(\''+data.data[i].oid+'\',\''+data.data[i].hierarchy+'\');" title="关键点" style="vertical-align: middle;cursor: pointer;" src="images/keypoint.png" height="25" width="25"/>'+
//																'<img title="详情" style="vertical-align: middle;cursor: pointer;" src="images/info.png" height="20" width="20"/>'+
															'</td>'+
														'</tr>'+
													'</table>'+
												'</td>'+
											'</tr>';
										$('#insinfo').append(row);
									}
								}else if(data.code == "400") {
									$.messager.alert("提示", "请联系管理员！", 'error');
								}else{
									$.messager.alert("提示", list.msg, 'info');
								}
							}
						});
						
					}
				}
			}else if(data.code == "400") {
				$.messager.alert("提示", "请联系管理员！", 'error');
			}else{
				$.messager.alert("提示", data.msg, 'info');
			}
		}
	});
}

/**
 * 部门工作统计
 * @param unitid
 * @param unitname
 * @returns
 */
function getUnitdaywork(unitid, unitname){
	parent.showDialog2('unitdaywork',unitname+'工作统计', '../../realtimemonitor/realtimemonitor/unitdaywork.html?unitid='+unitid, 700, 500, false, '');
}

/**
 * 部门详情
 * @param unitid
 * @param unitname
 * @returns
 */
function getUnitInfo(unitid, unitname, lon, lat){
	$.ajax({
		url : rootPath+"realtimemonitor/realtimemonitor/getUnitInfo.do?unitid="+unitid,
		type: "post",
		dataType: "json",
		async:false,
		success: function(data){
			if(data.status == 1){
				if(data && data.data.length > 0){
					var content = '<table align="center" width="100%" style="table-layout:fixed;empty-cells:show;border-collapse:collapse;border:1px solid #cad9ea;margin:0px;-webkit-border-radius:4px;-moz-border-radius:4px;-ms-border-radius:4px;border-radius:4px;">'
						+'<tr style="height:22px;line-height:22px;word-wrap:break-word;word-break:break-all;border:1px solid #cad9ea;">'
							+'<th width="20%" style="background-color:#f3f8fc;width:20%;text-align:right;color:#666666;border:1px solid #cad9ea;">部门名称</th>'
							+'<td width="80%" style="background-color:#fff;width:80%;text-align:left;color:#333333;border:1px solid #cad9ea;">'+data.data[0].unitname+'</td>'
						+'</tr>'
						+'<tr style="height:22px;line-height:22px;word-wrap:break-word;word-break:break-all;border:1px solid #cad9ea;">'
							+'<th width="20%" style="background-color:#f3f8fc;width:20%;text-align:right;color:#666666;border:1px solid #cad9ea;">管理长度</th>'
							+'<td width="80%" style="background-color:#fff;width:80%;text-align:left;color:#333333;border:1px solid #cad9ea;">'+data.data[0].sublength+'km</td>'
						+'</tr>'
						+'<tr style="height:22px;line-height:22px;word-wrap:break-word;word-break:break-all;border:1px solid #cad9ea;">'
							+'<th width="20%" style="background-color:#f3f8fc;width:20%;text-align:right;color:#666666;border:1px solid #cad9ea;">所辖管线</th>'
							+'<td width="80%" style="background-color:#fff;width:80%;text-align:left;color:#333333;border:1px solid #cad9ea;">'+data.data[0].lineloopname+'</td>'
						+'</tr>'
						+'<tr style="height:22px;line-height:22px;word-wrap:break-word;word-break:break-all;border:1px solid #cad9ea;">'
							+'<th width="20%" style="background-color:#f3f8fc;width:20%;text-align:right;color:#666666;border:1px solid #cad9ea;">PIS巡检负责人</th>'
							+'<td width="80%" style="background-color:#fff;width:80%;text-align:left;color:#333333;border:1px solid #cad9ea;">'+(data.data[0].username==null?'':data.data[0].username+'  '+data.data[0].phone)+'</td>'
						+'</tr>'
					+'</table>';
                     var options = {
				         width:450,
				         height:200
				     };
					jasMapApi.showInfoWindow(lon, lat, unitname+'详情', content, options);

                    // var options = {
					// 	href : rootPath+"realtimemonitor/realtimemonitor/departmentdetail.html",
					// 	modal : false,
                     //    width:218,
                     //    height:240
                    // }
					// jasMapApi.dialog(options);
					jasMapApi.centerAt(lon, lat);
					
				}
			}
		}
	});
}

/**
 * 巡检覆盖率统计
 * @param unitid
 * @param unitname
 * @returns
 */
function getStationfstatistic(unitid,unitname){
	parent.showDialog2('stationfstatistic',unitname+'巡检覆盖率统计', '../../realtimemonitor/realtimemonitor/stationfstatistic.html?unitid='+unitid, 700, 500, false, '');
}

/**
 * 获取部门一周成绩
 * @param unitid
 * @param unitname
 * @returns
 */
function getStationscore(unitid, unitname){
	parent.showDialog2('stationscore',unitname+'周成绩', '../../realtimemonitor/realtimemonitor/stationscorestatistics.html?unitid='+unitid+'&type=station', 700, 400, false, '');
}

/**
 * 获取巡检人员一周成绩
 * @param inspectorid
 * @param insname
 * @returns
 */
function getInspectorscore(inspectorid, insname){
	parent.showDialog2('inspectorscore',insname+'周成绩', '../../realtimemonitor/realtimemonitor/stationscorestatistics.html?inspectorid='+inspectorid+'&type=inspector', 700, 400, false, '');
}

/**
 * 根据部门层级编码、当前时间，获取当前部门及子孙部门巡检任务中的关键点
 * @param unitid
 * @param hierarchy
 * @returns
 */
function getInsKeyPointByUnitHierarchy(unitid, hierarchy){
//	var date = new Date().Format("yyyy-MM-dd HH:mm:ss");
//	var date = '2018-09-29 12:03:56';//test
	$.ajax({
		url : rootPath+"realtimemonitor/realtimemonitor/getInsKeyPointByUnitHierarchy.do?unitid="+unitid+"&hierarchy="+hierarchy,
		type: "post",
		dataType: "json",
		success: function(data){
			if(data.status == 1){
				//清除上一次添加的关键点图层
				jasMapApi.clearGraphicsLayer("drawlayer_MONITORKEYPOINTONMAP");
//				jasMapApi.clearGraphicsLayer("drawlayer_MONITORKEYPOINTTEXTONMAP");
				
				if(data && data.data.length > 0){
					var data = data.data;
					
					//添加关键点图层
					var options = {
				        "id":"drawlayer_MONITORKEYPOINTONMAP",
				        "type":"graphic"
				    };
					jasMapApi.addLayer(options);
					/*options = {
				        "id":"drawlayer_MONITORKEYPOINTTEXTONMAP",
				        "type":"graphic"
				    };
					jasMapApi.addLayer(options);*/
					
					if(data.length < 3){
						jasMapApi.centerAt(data[0].lon,data[0].lat);
					}else{
						jasMapApi.centerAt(data[Math.floor(data.length/2)].lon,data[Math.floor(data.length/2)].lat);
					}
					
					for(var i=0; i<data.length; i++){
						var img = "";
						if(data[i].keypointtype == 1){//常规关键点
							if(data[i].pointstatus == 0){
								img = "../../realtimemonitor/playback/images/keypoint_flag_red.png";
							}else if(data[i].pointstatus == 1){
								img = "../../realtimemonitor/playback/images/keypoint_flag_green.png";
							}
						}else if(data[i].keypointtype == 2){//临时关键点
							if(data[i].pointstatus == 0){
								img = "../../realtimemonitor/playback/images/temporary_keypoint_flag_red.png";
							}else if(data[i].pointstatus == 1){
								img = "../../realtimemonitor/playback/images/temporary_keypoint_flag_green.png";
							}
						}
						
						options = {
							url:img,//图标地址
					        width:24,//图标大小
					        height:24,
					        attributes:{"OBJECTID":data[i].pointid, "LINELOOPPOINTNAME":data[i].lineloopoidname+': '+data[i].pointidname},//图标属性
					        layerId:"drawlayer_MONITORKEYPOINTONMAP"
					    };
						jasMapApi.addPictureGraphic(data[i].lon, data[i].lat, options);
						/*options = {
				            fontSize:10 ,
				            fontFamily:"Arial",
				            haloColor:[0,255,0,255],
				            haloSize:2,
				            color :[78,78,78,255],
				            backgroundColor:[222,222,222,255],
				            angle:0,
				            "xOffset": 0,
				            "yOffset": 5,
				            "center": false,
				            layerId:"drawlayer_MONITORKEYPOINTTEXTONMAP"
				        };
						jasMapApi.addTextGraphic(data[i].lon, data[i].lat, data[i].pointidname, options);*/
					}
				}
			}else if(data.code == "400") {
				$.messager.alert("提示", "请联系管理员！", 'error');
			}else{
				$.messager.alert("提示", data.msg, 'info');
			}
		}
	});
}

/**
 * 根据巡检人员id、当前时间，获取当前巡检人员当前时间巡检任务中的关键点
 * @param inspectorid
 * @returns
 */
function getInsKeyPointByInspectorid(inspectorid){
//	var date = new Date().Format("yyyy-MM-dd HH:mm:ss");
//	var date = '2018-09-29 12:03:56';//test
	$.ajax({
		url : rootPath+"realtimemonitor/realtimemonitor/getInsKeyPointByInspectorid.do?inspectorid="+inspectorid,
		type: "post",
		dataType: "json",
		success: function(data){
			if(data.status == 1){
				//清除上一次添加的关键点图层
				jasMapApi.clearGraphicsLayer("drawlayer_MONITORKEYPOINTONMAP");
				jasMapApi.clearGraphicsLayer("drawlayer_MONITORKEYPOINTTEXTONMAP");
				
				if(data && data.data.length > 0){
					var data = data.data;
					
					//添加关键点图层
					var options = {
				        "id":"drawlayer_MONITORKEYPOINTONMAP",
				        "type":"graphic"
				    };
					jasMapApi.addLayer(options);
					options = {
				        "id":"drawlayer_MONITORKEYPOINTTEXTONMAP",
				        "type":"graphic"
				    };
					jasMapApi.addLayer(options);
					
					if(data.length < 3){
						jasMapApi.centerAt(data[0].lon,data[0].lat);
					}else{
						jasMapApi.centerAt(data[Math.floor(data.length/2)].lon,data[Math.floor(data.length/2)].lat);
					}
					
					for(var i=0; i<data.length; i++){
						var img;
						if(data[i].keypointtype == 1){//常规关键点
							if(data[i].pointstatus == 0){
								img = "../../realtimemonitor/playback/images/keypoint_flag_red.png";
							}else if(data[i].pointstatus == 1){
								img = "../../realtimemonitor/playback/images/keypoint_flag_green.png";
							}
						}else if(data[i].keypointtype == 2){//临时关键点
							if(data[i].pointstatus == 0){
								img = "../../realtimemonitor/playback/images/temporary_keypoint_flag_red.png";
							}else if(data[i].pointstatus == 1){
								img = "../../realtimemonitor/playback/images/temporary_keypoint_flag_green.png";
							}
						}
						options = {
							url:img,//图标地址
					        width:24,//图标大小
					        height:24,
					        attributes:{"OBJECTID":data[i].pointid, "LINELOOPPOINTNAME":data[i].lineloopoidname+': '+data[i].pointidname},//图标属性
					        layerId:"drawlayer_MONITORKEYPOINTONMAP"
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
				            layerId:"drawlayer_MONITORKEYPOINTTEXTONMAP"
				        };
						jasMapApi.addTextGraphic(data[i].lon, data[i].lat, data[i].pointidname, options);
					}
				}
			}else if(data.code == "400") {
				$.messager.alert("提示", "请联系管理员！", 'error');
			}else{
				$.messager.alert("提示", data.msg, 'info');
			}
		}
	});
}

/**
 * 获取巡检人员当天轨迹
 * @param unitid
 * @param hierarchy
 * @returns
 */
function getInsLineByDateInspectorid(inspectorid, insname){
//	var date = new Date().Format("yyyy-MM-dd");
//	var date = '2018-09-29';//test
	$.ajax({
		url : rootPath+"realtimemonitor/realtimemonitor/getInsLineByDateInspectorid.do?inspectorid="+inspectorid,
		type: "post",
		dataType: "json",
		success: function(data){
			if(data.status == 1){
				//清除上一次加载的轨迹起始终止点图层
				jasMapApi.clearGraphicsLayer("drawlayer_MONITORABPOINT");
				//清除上一次加载的当日巡线轨迹图层
				jasMapApi.clearGraphicsLayer("drawlayer_MONITORINSLINE");
				
				if(data && data.data.data.length > 0){
					pointdata = data.data.data;
					if(!jasMapApi){
						$.messager.alert("提示", "请联系管理员！", 'error');
					}else{
						//添加轨迹起始终止点图层
						options = {
					        "id":"drawlayer_MONITORABPOINT",
					        "type":"graphic"
					    };
						jasMapApi.addLayer(options);
						
						//添加回放时加载的起始终止点标绘
						options = {
							url:"../../realtimemonitor/playback/images/inslocation_A.png",//图标地址
						    width:36,//图标大小
						    height:36,
						    attributes:{"OBJECTID":pointdata[0].oid,"TITLE":"轨迹起始点"},//图标属性
						    layerId:"drawlayer_MONITORABPOINT"
						};
						jasMapApi.addPictureGraphic(pointdata[0].lon, pointdata[0].lat, options);//A点
						
						options = {
							url:"../../realtimemonitor/playback/images/inslocation_B.png",//图标地址
						    width:36,//图标大小
						    height:36,
						    attributes:{"OBJECTID":pointdata[0].oid,"TITLE":"轨迹结束点"},//图标属性
						    layerId:"drawlayer_MONITORABPOINT"
						};
						jasMapApi.addPictureGraphic(pointdata[pointdata.length-1].lon, pointdata[pointdata.length-1].lat, options);//B点
						
						//添加当日轨迹图层
						options = {
					        "id":"drawlayer_MONITORINSLINE",
					        "type":"graphic"
					    };
						jasMapApi.addLayer(options);
						
						//添加当日轨迹标绘
						options = {
		                    "layerId":"drawlayer_MONITORINSLINE",
		                    "attributes":null,
		                    "center":true,
		                    "width":3,
		                    "color":[100,149,237,255],
		                    "style":"solid"
		                };
						jasMapApi.addPolylineGraphic(data.data.paths, options, true);
					}
				}else{
					$.messager.alert("提示", insname+"当日没有巡线！", 'info');
				}
			}else if(data.code == "400") {
				$.messager.alert("提示", "请联系管理员！", 'error');
			}else{
				$.messager.alert("提示", data.msg, 'info');
			}
		}
	});
}

/**
 * 分公司、站定位
 * @param index
 * @returns
 */
function locateUnit(unitoid, lon, lat, name, layerId){
	if(unitoid=='undefined'){
		return;
	}
	if(lon=='null' || lat=='null'){
		$.messager.alert("提示", name+'没有定位坐标！', 'info');
		return;
	}
	var scale;
	if(layerId == "drawlayer_MONITORSUBDEPTONMAP"){
		scale = 10000000;
	}else if(layerId == "drawlayer_MONITORSTATIONONMAP"){
		scale = 200000;
	}
	var options = {
        "repeatCount":3,
        "delay":500,//ms
        "fieldName":"OBJECTID",
        "center":true,
        "scale":scale,
        "expand":1.5,
        "effect":"shine",//flash/shine
        "shineCurve":function(v){
            return 0.001 * v * v * v * v;
        }
    };
	jasMapApi.flashGraphic(unitoid, layerId, options);
}

/**
 * 巡检人员定位
 * @param oid
 * @param layerId
 * @returns
 */
function locateInspector(oid, lon, lat, name, layerId){
	if(oid=='undefined'){
		return;
	}
	if(lon=='null' || lat=='null'){
		$.messager.alert("提示", name+'没有定位坐标！', 'info');
		return;
	}
	jasMapApi.flashGraphic(oid, layerId, null);
}


Date.prototype.Format = function (fmt) { 
	var o = { 
	"M+": this.getMonth() + 1, //月份 
	"d+": this.getDate(), //日 
	"H+": this.getHours(), //小时 
	"m+": this.getMinutes(), //分 
	"s+": this.getSeconds(), //秒 
	"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
	"S": this.getMilliseconds() //毫秒 
	}; 
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length)); 
	for (var k in o){
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length))); 
	}
	return fmt; 
}