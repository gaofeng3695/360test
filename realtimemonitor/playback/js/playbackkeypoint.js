
/**
 * @file
 * @author 作者
 * @desc 网格化查询页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */
var insfrequnitval=getParamter("insfrequnitval");
var instasklinetimeoid=getParamter("instasklinetimeoid");
var instaskoid=getParamter("instaskoid");

var jasMapApi;
var frm2d;

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
	
	loadkeypointtable();
	
//	//页面自适应
//	initDatagrigHeight('keypointtable','queryDiv','100');
});

function onresize(){
	var containerWidth = $(window).width();
	var containerHeight = $(window).height();
	$('#keypointtable').datagrid('resize', {
		width : containerWidth,
		height : containerHeight
	});
}

/**
 * 加载关键点列表
 * @param instasklinetimeoid
 * @returns
 */
function loadkeypointtable(){
	$('#keypointtable').datagrid({
		idField:'pointid',
//		url: rootPath+"/gpsplanlinelnfo/getPage.do",
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
		singleSelect:true,
		pagination:false,
		nowrap:false,
		rowStyler: function (index, row) {
			return 'background-color:white;';
		},
		columns: 
		[[
	    	{	
				field:"pointidname",
	    		title:"关键点名称",
	    		width:"177",
	    		resizable:true,
	    		align:'center',
	    		formatter:function(index,row){
	    			return row.lineloopoidname+row.pointidname;
	    		}
	    	},{	
				field:"pointstatusname",
	    		title:"状态",
	    		width:"62",
	    		resizable:true,
	    		align:'center',
	    		formatter:function(value,row,index){
	    			var img = '';
	    			var title = '';
	    			var width;
	    			var height;
	    			if(row.pointstatus == 0){
	    				img = 'images/pointstatus0.png';
	    				title = '未巡检';
	    				width = 14;
	    				height = 14;
	    			}else if(row.pointstatus == 1){
	    				img = 'images/pointstatus1.png';
	    				title = '已巡检';
	    				width = 16;
	    				height = 12;
	    			}
	    			return '<img title="'+title+'" src="'+img+'" height="'+height+'" width="'+width+'"/>';
	    		}
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
 * 日期计算
 * date 日期yyyy-MM-dd
 * day 正整数或负整数
 * @returns
 */
function dateCalculate(date,day){
	var myDate = new Date(date);
	//获取新时间
	myDate.setDate(myDate.getDate()+day); 
	//获取当前年
	var year=myDate.getFullYear();
	//获取当前月
	var month=myDate.getMonth()+1;
	//获取当前日
	var date=myDate.getDate(); 
	return year+'-'+p(month)+"-"+p(date);
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