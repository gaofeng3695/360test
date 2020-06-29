//地图服务地址根路径，每次部署都用
	var mapServerHost =getMapServerHost(); 
	/**
	* 
	* 功能描述：获取地图服务所在应用系统的访问根路径
	* 如果其他应用通过API进行地图服务组件的引用，则根据引用API javascript时的引用路径来获取，否则获取当前应用系统的根路径
	*
	* @returns 地图服务所在应用系统的访问根路径
	*/
	function getMapServerHost(){
		var mapViewerApi_javascriptTag = document.getElementById("mapViewerAPI");
		if(mapViewerApi_javascriptTag){
			mapviewerApiUrl = mapViewerApi_javascriptTag.src;
			if(mapviewerApiUrl!=""){
				mapServerHost = mapviewerApiUrl.substring(0,mapviewerApiUrl.indexOf("/jasframework/mapviewer"));
				return mapServerHost;
			}else{
				mapServerHost = getSystemRootPath();
				return mapServerHost;
			}
		}else{
			mapServerHost = getSystemRootPath();
			return mapServerHost;
		}
	}

	/**
	* 功能描述：获取系统根路径
	*/
	function getSystemRootPath() {
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



	document.write('<script type="text/javascript" src="'+mapServerHost+'/jasframework/mapviewer/js/jquery-1.8.min.js"></script>');
	document.write('<script type="text/javascript" src="'+mapServerHost+'/jasframework/mapviewer/swfobject.js"></script>');
	document.write('<script type="text/javascript" src="'+mapServerHost+'/jasframework/mapviewer/js/json2.js"></script>');
	document.write('<script type="text/javascript" src="'+mapServerHost+'/jasframework/mapviewer/js/FlashAPI.js"></script>');
	document.write('<script type="text/javascript" src="'+mapServerHost+'/jasframework/mapviewer/customConfig/customEvents/CustomButtonEvents.js"></script> ');

	
	
