var geometryType={
	"STATIONSERIES":"esriGeometryPolyline"
};

/*
 * 获取要素内何类型
 * @param {Object} featureLayerName
 * @return {TypeName} 
 */
function getGeometryType(featureLayerName)
{
	return geometryType[featureLayerName];
}

/**
*查询空间对象(只返回对象ObjectID值，以逗号隔过)
*url:可以为MapServer及FeatureServer地址，如http://inakcis-pc:8399/arcgis/rest/services/GISDemo/MapServer/0
*geoFilter:空间过滤条件，在此必须为Polygon
*whereFilter:属性过滤条件
*callback：回调函数
*/
function getObjectIds(serviceUrl,geoFilter,whereFilter,callback,method)
{
	try
	{
	    var postUrl=serviceUrl;
	   
	    var requestData={f:"json",returnIdsOnly:"true"};
	    if(geoFilter!=""&&geoFilter!=null)
	    {
	        requestData["geometryType"]="esriGeometryPolygon";
	        requestData["geometry"]=geoFilter;                  
	    }
	    
	    if(whereFilter!="")
	    {          
	        requestData["where"]=whereFilter;           
	    }  
	    var strMethod=method+"";
	    strMethod=strMethod.toUpperCase();
	    if(strMethod=="GET")
	    {
	        $.get(postUrl,requestData,function(data){ var callFun=eval(callback);callFun.call(callFun,data);});
	    }
	    else if(strMethod=="POST")
	    {
	        $.post(postUrl,requestData,function(data){ var callFun=eval(callback);callFun.call(callFun,data);},"jsonp");        
	    }  
	    else if(strMethod=="FLASHPOST")
	    {
	        //var fs = FlashHelper.getFlash();            
			//fs.post(postUrl,requestData,callback);
	    }  
	    else if(strMethod=="HTTPCLIENT")
		{
	    	var strUrl=top.document.location+"";
	    	var iIndex=strUrl.indexOf("/",7);
	    	strUrl=strUrl.substring(0,iIndex);  
	    	strUrl=strUrl+top.crossDomainUrl;
	    	requestData["destination"]=postUrl;
	    	$.post(strUrl,requestData,function(data){var retjson=eval("("+data+")"); var callFun=eval(callback);callFun.call(callFun,retjson);},"json");    		
		} 
	}
	catch(e)
	{
		alert(e);
	}
}


/**
*查询空间对象(只返回对象ObjectID值，以逗号隔过)
*url:可以为MapServer及FeatureServer地址，如http://inakcis-pc:8399/arcgis/rest/services/GISDemo/MapServer/0
*geoFilter:空间过滤条件，在此必须为Polygon
*whereFilter:属性过滤条件
*callback：回调函数
*/
function getObjectIds2(serviceUrl,geoFilter,whereFilter,callback,method)
{
	try
	{
	    var postUrl=serviceUrl;
	   
	    var requestData={f:"json",returnIdsOnly:"true"};
	    if(geoFilter!=""&&geoFilter!=null)
	    {
	        requestData["geometryType"]="esriGeometryPolygon";
	        requestData["geometry"]=JSONUtil.encode(geoFilter);                  
	    }
	    
	    if(whereFilter!="")
	    {          
	        requestData["where"]=whereFilter;           
	    }  
	    var strMethod=method+"";
	    strMethod=strMethod.toUpperCase();
	    if(strMethod=="GET")
	    {
	        $.get(postUrl,requestData,function(data){ var callFun=eval(callback);callFun.call(callFun,data);});
	    }
	    else if(strMethod=="POST")
	    {
	        $.post(postUrl,requestData,function(data){ var callFun=eval(callback);callFun.call(callFun,data);},"jsonp");        
	    }  
	    else if(strMethod=="FLASHPOST")
	    {
	        //var fs = FlashHelper.getFlash();            
			//fs.post(postUrl,requestData,callback);
	    }  
	    else if(strMethod=="HTTPCLIENT")
		{
	    	var strUrl=top.document.location+"";
	    	var iIndex=strUrl.indexOf("/",7);
	    	strUrl=strUrl.substring(0,iIndex);  
	    	strUrl=strUrl+top.crossDomainUrl;
	    	requestData["destination"]=postUrl;
	    	$.post(strUrl,requestData,function(data){var retjson=eval("("+data+")"); var callFun=eval(callback);callFun.call(callFun,retjson);},"json");    		
		} 
	}
	catch(e)
	{
		alert(e);
	}
}

/**
*查询空间对象(只返回对象ObjectID值，以逗号隔过)
*url:可以为MapServer及FeatureServer地址，如http://inakcis-pc:8399/arcgis/rest/services/GISDemo/MapServer/0
*ids:ObjectID集合
*geometryType:esriGeometryPoint | esriGeometryMultipoint | esriGeometryPolyline | esriGeometryPolygon | esriGeometryEnvelope 
*callback：回调函数对象
*/
function getGeometryByIds(serviceUrl,ids,geometryType,callback)
{
	try
	{
	    var postUrl=serviceUrl;
	   
	    var requestData={f:"json",returnGeometry:"true"};
	    
	    if(ids==null||ids=="")
	    {
	    	callback(null);
	    	return;
	    }
	    else
		{
	    	requestData["objectIds"]=ids;	
		}
	    
	    if(geometryType!=""&&geometryType!=null)
	    {
	        requestData["geometryType"]=geometryType;                          
	    }    
	    else
		{
			callback(null);
	    	return;
		}
	    
	    requestData["outFields"]="OBJECTID";   
	    
		var strUrl=top.document.location+"";
		var iIndex=strUrl.indexOf("/",7);
		strUrl=strUrl.substring(0,iIndex);  
		strUrl=strUrl+top.crossDomainUrl;
		requestData["destination"]=postUrl;
		$.post(strUrl,requestData,function(data){var retjson=eval("("+data+")"); callback(retjson);},"json");
	}
	catch(e)
	{
		alert(e);
	}
	        
}

/**
*查询空间对象（Json字符串）
*url:可以为MapServer及FeatureServer地址，如http://inakcis-pc:8399/arcgis/rest/services/GISDemo/MapServer/0
*geoFilter:空间过滤条件,在此必须为Polygon，且格式为Esri Json标准格式
*whereFilter:属性过滤条件
*callback：回调函数
*/
function query(serviceUrl,geoFilter,whereFilter,outFieldsFilter,callback,method)
{  
	try
	{
		var postUrl=serviceUrl;
	    var requestData={f:"json",outFields:"*"};
	    if(outFieldsFilter!="")
	    {
	        requestData["outFields"]=outFieldsFilter;
	    }    
	    if(geoFilter!=""&&geoFilter!=null)
	    {
	        requestData["geometryType"]="esriGeometryPolygon";
	        requestData["geometry"]=geoFilter;             
	    }
	    
	    if(whereFilter!="")
	    {          
	        requestData["where"]=whereFilter;           
	    }  
	    var strMethod=method+"";
	    strMethod=strMethod.toUpperCase();
	    if(strMethod=="GET")
	    {
	        $.get(postUrl,requestData,function(data){ var retjson=eval("("+data+")");callback(retjson);});
	    }
	    else if(strMethod=="POST")
	    {
	        $.post(postUrl,requestData,function(data){ var retjson=eval("("+data+")");callback(retjson);},"jsonp");        
	    }  
	    else if(strMethod=="FLASHPOST")
	    {
	        //var fs = FlashHelper.getFlash();            
			//fs.post(postUrl,requestData,callback);
	    }  
	    else if(strMethod=="HTTPCLIENT")
		{
	    	var strUrl=top.document.location+"";
	    	var iIndex=strUrl.indexOf("/",7);
	    	strUrl=strUrl.substring(0,iIndex);  
	    	strUrl=strUrl+top.crossDomainUrl;
	    	requestData["destination"]=postUrl;
	    	$.post(strUrl,requestData,function(data){var retjson=eval("("+data+")");callback(retjson);},"json");    		
		}
	}
	catch(e)
	{
		alert(e);
	}
}

/**
*查询空间对象（Json字符串）
*url:可以为MapServer及FeatureServer地址，如http://inakcis-pc:8399/arcgis/rest/services/GISDemo/MapServer/0
*geoFilter:空间过滤条件,在此必须为Polygon
*whereFilter:属性过滤条件
*callback：回调函数
*/
function query2(serviceUrl,geoFilter,whereFilter,outFieldsFilter,callback,method)
{  
	try
	{
		var postUrl=serviceUrl;
	    var requestData={f:"json",outFields:"*"};
	    if(outFieldsFilter!="")
	    {
	        requestData["outFields"]=outFieldsFilter;
	    }    
	    if(geoFilter!=""&&geoFilter!=null)
	    {
	        requestData["geometryType"]="esriGeometryPolygon";
	        var temp=JSONUtil.encode(geoFilter);
	        requestData["geometry"]=temp;             
	    }
	    
	    if(whereFilter!="")
	    {          
	        requestData["where"]=whereFilter;           
	    }  
	    var strMethod=method+"";
	    strMethod=strMethod.toUpperCase();
	    if(strMethod=="GET")
	    {
	        $.get(postUrl,requestData,function(data){ var retjson=eval("("+data+")");callback(retjson);});
	    }
	    else if(strMethod=="POST")
	    {
	        $.post(postUrl,requestData,function(data){ var retjson=eval("("+data+")");callback(retjson);},"jsonp");        
	    }  
	    else if(strMethod=="FLASHPOST")
	    {
	        //var fs = FlashHelper.getFlash();            
			//fs.post(postUrl,requestData,callback);
	    }  
	    else if(strMethod=="HTTPCLIENT")
		{
	    	var strUrl=top.document.location+"";
	    	var iIndex=strUrl.indexOf("/",7);
	    	strUrl=strUrl.substring(0,iIndex);  
	    	strUrl=strUrl+top.crossDomainUrl;
	    	requestData["destination"]=postUrl;
	    	$.post(strUrl,requestData,function(data){var retjson=eval("("+data+")");callback(retjson);},"json");    		
		}
	}
	catch(e)
	{
		alert(e);
	}
}

/**
 * 增加空间要素
 * @param {String} serviceUrl 必须为Feature服务，eg:http://inakcis-pc:8399/arcgis/rest/services/GISDemoFeature/FeatureServer/0/addFeatures
 * @param {Json} featuresObj	要素对象json数组
 * @param {String} callback		回调JS函数
 */
function addFeatures(serviceUrl,featuresObj,callback)
{
	try
	{
		var postUrl=serviceUrl;	
		var requestData={f:"json"};
		requestData["features"]=JSONUtil.encode(featuresObj);	
		
		var strUrl=top.document.location+"";
		var iIndex=strUrl.indexOf("/",7);
		strUrl=strUrl.substring(0,iIndex);  
		strUrl=strUrl+top.crossDomainUrl;
		requestData["destination"]=postUrl;
		$.post(strUrl,requestData,function(data){var retjson=eval("("+data+")");callback(retjson);},"json");
	}
	catch(e)
	{
		alert(e);
	}
}

/**
 * 
 * @param {String} serviceUrl 必须为Feature服务，eg:http://inakcis-pc:8399/arcgis/rest/services/GISDemoFeature/FeatureServer/0/updateFeatures
 * @param {Json} features	要素对象json数组
 * @param {String} callback		回调JS函数
 */
function updateFeatures(serviceUrl,features,callback)
{
	try
	{
		var postUrl=serviceUrl;	
		var requestData={f:"json"};
		requestData["features"]=JSONUtil.encode(features);	
		
		var strUrl=top.document.location+"";
		var iIndex=strUrl.indexOf("/",7);
		strUrl=strUrl.substring(0,iIndex);  
		strUrl=strUrl+top.crossDomainUrl;
		requestData["destination"]=postUrl;
		$.post(strUrl,requestData,function(data){var retjson=eval("("+data+")");callback(retjson);},"json");
	}
	catch(e)
	{
		alert(e);
	}
}

/**
 * 
 * @param {String} serviceUrl
 * @param {String} objectIds
 * @param {String} callback
 */
function deleteFeaturesByIds(serviceUrl,objectIds,callback)
{
	try
	{
		var postUrl=serviceUrl;	
		var requestData={f:"json"};
		requestData["objectIds"]=objectIds;	
		
		var strUrl=top.document.location+"";
		var iIndex=strUrl.indexOf("/",7);
		strUrl=strUrl.substring(0,iIndex);  
		strUrl=strUrl+top.crossDomainUrl;
		requestData["destination"]=postUrl;
		$.post(strUrl,requestData,function(data){var retjson=eval("("+data+")");callback(retjson);},"json");
	}
	catch(e)
	{
		alert(e);
	}
}

/**
*将字符串解析为PolygonJson字符串
*strRings字符串坐标点首尾一致,如x1,y1,x2,y2,x3,y3...x1,y1
*/
function parseToPolygonJson(strRings)
{
    var arr=strRings.split(",");
    if(arr.length%2!=0) return null;
    var ring1=new Array();
    var pointArray=new Array();
    ring1.push(pointArray);
    var polygonJson={"rings" :[[]]};
    //polygonJson.rings.push([]);
    var point=[];
    var arrlen=arr.length;   
    while(arrlen>0)
    {        
        point=[Number(arr.shift()),Number(arr.shift())]; 
        polygonJson.rings[0].push(point);
        arrlen=arrlen-2;       
    }  
    
    return  polygonJson; 
}

/**
*将字符串解析为MapPointJson字符串
*strRings字符串坐标点首尾一致,如x,y
*/
function parseToMapPointJson(strPoints)
{
    var arr=strRings.split(",");
    if(arr.length%2!=0) return null;
    var point={};
    point["x"]=Number(arr[0]);
    point["y"]=Number(arr[1]);
    return point;
}

/**
*将字符串解析为PolylineJson字符串
*strRings字符串坐标点首尾一致,如x1,y1,x2,y2,x3,y3
*/
function parseToPolylineJson(strPoints)
{
    var arr=strRings.split(",");
    if(arr.length%2!=0) return null;
    var polyline={paths:[[]]};  
    var point=[];
    var arrlen=arr.length;    
    while(arrlen>0)
    {        
        point=[Number(arr.shift()),Number(arr.shift())];
        polyline.paths[0].push(point);
        arrlen=arrlen-2;        
    }    
}

/**
*将字符串解析为GeometryJson字符串
*strRings字符串，格式"几何类型(x1,y1,x2,y2...)",几何类型为point,polygon,polyline,
*括号里的点对规则与对应的几何类型匹配
*/
function parseToGeometryJson(strGeo)
{
    var strPoints="";
    if(strGeo.substr(0,5)=="point")
    {
        strPoints=strGeo.substring(6,strGeo.length-1);
        return parseToMapPointJson();
    }
    else if(strGeo.substr(0,7)=="polygon")
    {
        strPoints=strGeo.substring(8,strGeo.length-1);
        return parseToPolygonJson(strPoints);
    }
    else if(strGeo.substr(0,8)=="polyline")
    {
        strPoints=strGeo.substring(9,strGeo.length-1);
        return parseToPolylineJson(strPoints);
    }
    else
    {
        return null;
    }
}