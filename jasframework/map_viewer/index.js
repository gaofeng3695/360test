/**
 * Created by jas on 2018/9/27.
 */

//--------------------------基础配置-------------------------------
	var jasMapApi = null;
	var dojoConfig = {
	    "parseOnLoad": true,
	    "async": true,
	    "baseUrl":"../common/lib/esri/3.18/dojo"
	};
	
	//--------------------------添加事件监听 start --------------------------
	//中线桩
	var addBaseStakeListeners = function(layerId){
	    //鼠标经过提示
	    jasMapApi.setLayerTips(layerId,'STAKENUM');//
	};
	//管线
	var addPipelineListeners = function(layerId){
	    //添加点击事件
	    jasMapApi.addLayerClickEventListener(layerId,function(e){
	        var attributes = e.graphic.attributes;
	        var objectId = attributes.OBJECTID;
	        showDialog('线路段详情',layerId,objectId);
	    });
	    //鼠标经过提示
	    jasMapApi.setLayerTips(layerId,'PIPESEGMENTCODE');
	};
	//管线
	var addPathlineListeners = function(layerId){
	    //添加点击事件
	    jasMapApi.addLayerClickEventListener(layerId,function(e){
	        var attributes = e.graphic.attributes;
	        var dataId = attributes.PATHLINEMAINOID;
//	        showDialog2('viewShowPath','轨迹线详细', '../../realtimemonitor/realtimemonitor/showpath.html?oid='+dataId, 800, 600, false, '');
	        queryTop(dataId,"GPS_PATHLINE","../../linePatrolManage/pathLine/showPath/view_show_path.html?oid=","viewShowPath","轨迹线详细信息");
	    });
	    //鼠标经过提示
	    jasMapApi.setLayerTips(layerId,'PATHLINE');
	};
	//
	var layerAddEventHandler = function(e){
	    var layerId = e.layer.id;
	    switch (layerId){
	        case "sco_base_stake".toUpperCase():
	            addBaseStakeListeners(layerId);
	            break;
	        case "sco_base_pipesegment".toUpperCase():
	            addPipelineListeners(layerId);
	            break;
	        case "gps_pathline".toUpperCase():
	        	addPathlineListeners(layerId);
	        	break;
	        //实时监控-轨迹回放关键点图标监听
	        case "drawlayer_KEYPOINTONMAP".toUpperCase():
	            addPlaybackKeypointListeners(layerId);
	            break;
	        //实时监控-人员监控分公司、站图标监听
	        case "drawlayer_MONITORSUBDEPTONMAP".toUpperCase():
	        case "drawlayer_MONITORSTATIONONMAP".toUpperCase():	
	            addrealmonitordeptandstationListeners(layerId);
	            break;
	        //实时监控-人员监控人员图标监听
	        case "drawlayer_MONITORINSPECTORONMAP".toUpperCase():
	        	addrealmonitorinspectorListeners(layerId);
            	break;
            //实时监控-人员监控关键点监听
	        case "drawlayer_MONITORKEYPOINTONMAP".toUpperCase() :
	        	addrealmonitorKeypointListeners(layerId);
	        	break;
        	//实时监控-人员监控、轨迹回放 轨迹起始结束点监听
	        case "drawlayer_PLAYBACK_ABPOINT".toUpperCase() :
	        case "drawlayer_MONITORABPOINT".toUpperCase() :
	        	addrealmonitorABpointListeners(layerId);
	        	break;
	        case "drawlayer_THREECOLORSR".toUpperCase() :
	        	addThreeColorsListeners(layerId);
	        	break;
	        case "drawlayer_THREECOLORSY".toUpperCase() :
	        	addThreeColorsListeners(layerId);
	        	break;
	        case "drawlayer_THREECOLORSB".toUpperCase() :
	        	addThreeColorsListeners(layerId);
	        	break;
	        default:;
	    }
	};
	
	//--------------------------添加事件监听 end-----------------------------
	
	//--------------------------接口直接调用 start--------------------------
	$(function () {
	    $("#doPosition").click(function(){
	       var layerId = $("#layerId").val();
	       var objectId = $("#objectId").val();
	       if(layerId && objectId){
	           jasMapApi.flashGraphic(objectId,layerId.toUpperCase());
	       }
	    });
	    
	    $("#xy").click(function(){
	    	let x = 1;
	    	let y = 2;
	    	console.log('1,2');
	    	jasMapApi.coorsToXY(1,2);
	    	
	    	//这里的坐标一般是经纬度坐标，要转化成和底图坐标系的坐标值
	        x = parseFloat(x);
	        y = parseFloat(y);
	        var coors = jasMapApi.coorsToXY(x,y);
	        if( x !== '' && y !== ''){
	        	// jasMapApi.clearMapGraphics();
	        	jasMapApi.centerAt(coors[0],coors[1]);
	        	jasMapApi.addPictureGraphic(coors[0],coors[1]);
	        }
	    });
	    /* 获取当前用户登录的部门是那个，并且按照部门名称获取部门所要展示的管线 updateLayer */

	});
	//--------------------------接口直接调用 end-----------------------------
	
	var showDialog = function(title,layerId,objectId,options){
	    $('<div id="map_dialog"/>').dialog({
	        href: 'dialog.html',
	        width: 670,
	        height:400,
	        modal: true,
	        queryParams:{layerId:layerId,objectId:objectId},
	        draggable: true,
	        title: title ? title :'详情',
	        onClose: function () {
	            //弹出层关闭事件
	            $(this).dialog('destroy');
	        },
	        onLoad: function () {
	            //弹出层加载事件
	        }
	    })
	};
	
	/**
	 * 获取XY坐标
	 * @returns
	 */
	function getXY(getLocationCallBack){
		console.log('invoking');
		jasMapApi.getXY(getLocationCallBack);
	}
	
	/**
	 * 定位[{x1,y1},{x2,y2}]
	 */
	function doPosition(param , optionParam, centerAt){
        let x = '';
        let y = '';
       // let oid = param[0].oid;
        // jasMapApi.clearGraphicsLayer( "1" );
        for( let j = 0 ; j< param.length ; j++ ){
            x = param[j].lon;
            y = param[j].lat;
            let coors = translateXY(x ,y );
            if( x !== '' && y !== '') {
                let option = {};
                if (optionParam != undefined && optionParam != null && optionParam != '') {
                    option = JSON.parse(optionParam);
                    if (option.attributes == '' || option.attributes == undefined || option.attributes == null) {
						option.attributes = {};
                	}
                } else {
                    option.layerId = "1";
                    option.url = 'images/flag.png';
                    option.width = 24;
                    option.height = 24;
                    option.attributes = {};
                }

				if (option.attributes.oid == '' || option.attributes.oid == undefined || option.attributes.oid == null) {
					option.attributes.oid = param[j].oid;
				}
				if (option.attributes.type == '' || option.attributes.type == undefined || option.attributes.type == null) {
					option.attributes.type = param[j].type;
				}

                // console.log('x='+x+'--y='+y);
                jasMapApi.addPictureGraphic(coors[0], coors[1], option);
            }
            }
        /* 位置移动到第一个点 */
        if( param[0]!= undefined && param[0].lon != undefined && param[0].lat != undefined ) {
            let coors0 = translateXY(param[0].lon ,param[0].lat );
            if(centerAt != 100) {
                jasMapApi.centerAt(coors0[0],coors0[1]);
                // jasMapApi.setLevel(8);
            }
		}

        /* 添加点击事件 */
        jasMapApi.addLayerClickEventListener("1",function(e){
        	var attributes = e.graphic.attributes;
        	var oid = attributes.oid;
        	var type = attributes.type;
        	/*type如果为gps_keypoint则弹出常规关键点详情页面，否则弹出临时关键点详情页面*/
        	if(type == 'gps_keypoint'){
//        		showDialog2('viewGpsKeypoint','关键点详细', '../../realtimemonitor/realtimemonitor/gpskeypoint.html?oid='+oid, 800, 600, false, '');
        		queryTop(oid,"GPS_KEYPOINT","../../linePatrolManage/pathLine/keypoint/view_gps_keypoint.html?oid=","viewGpsKeypoint","详细");
        	}else if(type == 'gps_temporary_keypoint'){
//        		showDialog2('viewGpsTemporaryKeypoint','关键点详细', '../../realtimemonitor/realtimemonitor/gpstemporarykeypoint.html?oid='+oid, 800, 600, false, '');
        		queryTop(oid,"gps_temporary_keypoint","../../linePatrolManage/insTask/temporaryKeypoint/view_gps_temporary_keypoint.html?oid=","viewGpsTemporaryKeypoint","详细");
        	}else if(type == 'construction'){
                // top.getDlg("view_gps_construction.html?oid="+dataId,"viewGpsConstruction","详细",800,600,false,true,true);
                queryTop(oid,"gps_construction","../../pipeprotect/gps_construction/view_gps_construction.html?oid=","viewGpsConstruction","详细");
            }else if(type == 'event'){
                queryTop(oid,"gps_construction","../../pipeprotect/gps_event/view_gps_event.html?oid=","viewGpsEvent","详细");
            }
        });
    	
	}
	
	/**
	 *  转化xy坐标
	 * @returns
	 */
	function translateXY(x, y){
		//这里的坐标一般是经纬度坐标，要转化成和底图坐标系的坐标值
        x = parseFloat(x);
        y = parseFloat(y);
        let coors = jasMapApi.coorsToXY(x,y);
        return coors;
	}

	/**
	 * 定点闪烁点
	 */
	function flashPoint( param ){
		let flashOption = {};
		flashOption.repeatCount = 8;
		flashOption.delay = 5000;
		flashOption.fieldName = 'oid';
		flashOption.center = true;
		flashOption.scale = 300000;
		jasMapApi.flashGraphic(param[0].oid ,'1', flashOption);
	}
	/**
	 * 弹出新窗口
	 * @param dataId
	 * @param tableName
	 * @param getDlgURL
	 * @param viewName
	 * @param topName
	 * @returns
	 */
	function queryTop(dataId,tableName,getDlgURL,viewName,topName){
		top.getDlg(getDlgURL+dataId,viewName,topName,800,600,false,true,true);	
	}
