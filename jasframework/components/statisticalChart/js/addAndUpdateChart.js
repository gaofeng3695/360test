//为JS对象提供缓存
var chartObj =new Map();


function closePanol(){
	top.closeDlg('saveiframe');
}
function savechart(){
	var classifield=$("#classifiedfield").combobox("getValues");
	var statisticssize=$("#statisticssize").combobox("getValues");
	var statisticalitem=$("#statisticalitem").combobox("getValues");
	if(statisticalitem.length>1){
		if(classifield.length>2){
			top.showAlert("提示", "统计项大于1时，统计纬度最多可以选择两个", 'info');
		}
	}else{
		if(classifield.length>3){
			top.showAlert("提示", "统计纬度最多可以选择三个", 'info');
		}
	}
	if(statisticssize.length>2){
		top.showAlert("提示", "统计纬度最多可以选择2个", 'info');
	}else{
		$('#addAndUpdateChart').form('submit',{
			   type: "POST",
			   url: rootPath + "jasframework/statisticalchart/saveChartConfig.do?random="+new Date(),
			   success: function(data){
				   data = eval('('+data+')');
				   top.showAlert("提示", data.tip, 'info', function() {
						reloadData('sysStatisticalchart.htm', '#chartTable');
						closePanol();
					});
			   }
			});
	}
}
/**
 * 描述：重新加载数据
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
 * 
 * 方法描述：预览
 * 
 */

function previewchart(){
	var classifield=$("#classifiedfield").combobox("getValues");
	var statisticssize=$("#statisticssize").combobox("getValues");
	if(classifield.length>3){
		top.showAlert("提示", "统计纬度最多可以选择三个", 'info');
	}else if(statisticssize.length>2){
		top.showAlert("提示", "统计纬度最多可以选择2个", 'info');
	}else{
		$('#addAndUpdateChart').form('submit',{
			   type: "POST",
			   url:rootPath + "jasframework/statisticalchart/previewChart.do?random="+new Date(),
			   success: function(data){
				   data = eval('('+data+')');
				   if(data.series.type=="pie"){
					   previewpiechart(data,'viewchart');
				   }else{
					   previewotherchart(data,'viewchart');
				   }
				  
			   }
			});
	}
}
//预览下一粒度的数据
function previewNextChart(nextstatisticssize,unitkeyOrDate){
	$('#nextstatisticssize').val(nextstatisticssize);
	$('#unitkeyOrDate').val(unitkeyOrDate);
	$('#addAndUpdateChart').form('submit',{
		type: "POST",
		url:rootPath + "jasframework/statisticalchart/previewNextChart.do?random="+new Date(),
		success : function(data) {
			data = eval('('+data+')');
		   if(data.series.type=="pie"){
			   previewpiechart(data,'viewchart');
		   }else{
			   previewotherchart(data,'viewchart');
		   }
			  
		}
	});
}
//预览商议粒度的数据
function previewBackChart(nextstatisticssize,data){
	if(data!=null){
		$('#nextstatisticssize').val(nextstatisticssize);
		if(data.series.type=="pie"){
		   previewpiechart(data,'viewchart');
	    }else{
	 	   previewotherchart(data,'viewchart');
	    }	
	}
}
//钻取之后返回上一级
function goback(){
	
	var statisticssize = $('#nextstatisticssize').val();
	var data ;
	if("二级部门"==statisticssize){
		data = chartObj.get("一级部门");
		previewBackChart("一级部门",data);
	}else if("三级部门"==statisticssize){
		data = chartObj.get("二级部门");
		previewBackChart("二级部门",data);
	}else if("四级部门"==statisticssize){
		data = chartObj.get("三级部门");
		previewBackChart("三级部门",data);
	}else if("季度"==statisticssize){
		data = chartObj.get("年");
		previewBackChart("年",data);
	}else if("月"==statisticssize){
		data = chartObj.get("季度");
		previewBackChart("季度",data);
	}else if("日"==statisticssize){
		data = chartObj.get("月");
		previewBackChart("月",data);
	}
}
function previewotherchart(data,divid){
	var categoriesNum = data.xAxis.xAxisCategories.length;
	var dataNum = data.series.length;
	var width = categoriesNum*dataNum*50;
	if(width<666){
		width=666;
	}
	
	new Highcharts.Chart({
		chart: {
        	renderTo: divid,
        	type: data.chart.type,
        	zoomType: 'xy',//拖动鼠标缩放
        	width:width,
        	height:280
        },
		credits: {             
			enabled: false   //右下角不显示LOGO         
		},exporting:{ 
            enabled:true //用来设置是否显示‘打印’,'导出'等功能按钮，不设置时默认为显示 
        },
         title: {
        	 text: data.title.text,
             x: -20 //center
         },
         subtitle: {
             text: '副标题',
             x: -20
         },
         colors: [
                	'#4572A7', 
                	'#AA4643', 
                	'#89A54E', 
                	'#80699B', 
                	'#3D96AE', 
                	'#DB843D', 
                	'#92A8CD', 
                	'#A47D7C', 
                	'#B5CA92'
                ],
         xAxis: {
             categories: data.xAxis.xAxisCategories,
             labels: {
                 rotation: -45,
 				align: 'right',
 				style: {font: 'normal 13px Verdana, sans-serif'}
              }
         },
         yAxis: {
        	 min:data.yAxis.min,
             title: {
                 text: data.yAxis.title.text
             },
             plotLines: [{
                 value: 0,
                 width: 1,
                 color: '#808080'
             }]
         },
         tooltip: {
             valueSuffix: data.tooltip.valueSuffix
         },
         plotOptions: {
             column: {
                 stacking: data.tooltip.stacking,
                 borderWidth: 1,
                 pointWidth: 25, 
        		cursor: 'pointer',                   
        		point: {                        
        			events: {                            
        				click: function(e) {
        					var unitkeyOrDate = data.xAxis.unitkeyOrDate;
        					var unitkeyOrDateMap = new Map();
        					if(unitkeyOrDate!=null&&unitkeyOrDate!=""){
        						for(var i=0;i<unitkeyOrDate.length;i++){
            						unitkeyOrDateMap.put(unitkeyOrDate[i].key,unitkeyOrDate[i].value);
            					}
        					}
        					var category = e.point.category;
        					var unitkeyOrDate = unitkeyOrDateMap.get(category);
        					//目前纬度粒度
        					var statisticssize = data.tooltip.statisticssize;
        					if("一级部门"==statisticssize){
        						previewNextChart("二级部门",unitkeyOrDate);
        						chartObj.put("一级部门",data);
        					}else if("二级部门"==statisticssize){
        						previewNextChart("三级部门",unitkeyOrDate);
        						chartObj.put("二级部门",data);
        					}else if("三级部门"==statisticssize){
        						previewNextChart("四级部门",unitkeyOrDate);
        						chartObj.put("三级部门",data);
        					}else if("年"==statisticssize){
        						previewNextChart("季度",unitkeyOrDate);
        						chartObj.put("年",data);
        					}else if("季度"==statisticssize){
        						previewNextChart("月",unitkeyOrDate);
        						chartObj.put("季度",data);
        					}else if("月"==statisticssize){
        						previewNextChart("日",unitkeyOrDate);
        						chartObj.put("月",data);
        					}
        					
        				}                       
        			}            
        		}
             }
         },
         legend: {
             layout: 'vertical',
             align: 'left',
             verticalAlign: 'top',
             x:30,
             y:30,
             borderWidth: 0,
             floating: true,//颜色区域提示部分是不是悬浮在图表上
             shadow: true
         },
         series: data.series
     });
}
//饼状图
function previewpiechart(data,divid){
//	alert(JSON.stringify(data.series.data))
	 new Highcharts.Chart({
        chart: {
        	renderTo: divid,
        },
		credits: {             
			enabled: false   //右下角不显示LOGO         
		},
        title: {
            text: data.title.text
        },
        colors: [
               	'#4572A7', 
               	'#AA4643', 
               	'#89A54E', 
               	'#80699B', 
               	'#3D96AE', 
               	'#DB843D', 
               	'#92A8CD', 
               	'#A47D7C', 
               	'#B5CA92'
               ],
        tooltip: {
        	formatter: function() { //格式化鼠标滑向图表数据点时显示的提示框
                var s;
            		s = '<b>'+ this.point.name +'</b><br/>'+this.series.name+'：'+ this.y+ '%';
                return s;
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    color: '#000000',
                    connectorColor: '#000000',
//                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    formatter: function() { //格式化鼠标滑向图表数据点时显示的提示框
    	                var s;
    	            		s = '<b>'+ this.point.name +'</b><br/>'+ this.y+ '%';
    	                return s;
    	            }
                },                   
        		point: {                        
        			events: {                            
        				click: function(e) {  
        					
//        					alert(e.point.name+' xxxx:'+e.point.y); 
        				}                       
        			}            
        		}
            }
        },
        series: [{
        	type: data.series.type,
        	name: data.series.name,
            data: data.series.data
        }]
    });

}

/**
 * 
 * 方法描述：用于显示模版添加结果的窗口
 * 
 */
$(function(){
	$('#nextstatisticssize').val("");
	$('#unitkeyOrDate').val("");
	var importErrorInfoWindow = top.document.getElementById('importErrorInfoWindow');
	if(!importErrorInfoWindow){
		top.$("body").append('<div id="importErrorInfoWindow" class="easyui-dialog"  style="overflow-y:auto;"></div>')
	}
	top.$('#importErrorInfoWindow').dialog({
		title: '解析错误信息',  
		width: 300,  
		height: 300,
		closed: true,
		modal: true,
		maximizable:true
	});
	try{
		
	
		$("#charttype").combobox({
			url:rootPath + "jasframework/sysdoman/getsysdoman.do?domainname="+"charttype",
			valueField:"codeid",
			textField:"codename",
			panelHeight:100
		});
	}catch(e){
		alert(e)
	}
	$("#statisticalmethods").combobox({
		url:rootPath + "jasframework/sysdoman/getsysdoman.do?domainname="+"statisticalmethods",
		valueField:"codeid",
		textField:"codename",
		panelHeight:50
	});
	$("#statisticssize").combobox({
		url:rootPath + "jasframework/sysdoman/getsysdoman.do?domainname="+"statisticssize",
		valueField:"codeid",
		textField:"codename",
		multiple:true,
		onSelect:function(){
			var statisticssize=$("#statisticssize").combobox("getValues");
			if(statisticssize.length>2){
				top.showAlert("提示", "统计纬度最多可以选择2个", 'info');
			}
			
		} 
	});
	$("#businesstablename").combobox({
		url:rootPath + "jasframework/statisticalchart/getAllViewName.do",
		valueField:"VIEW_NAME",
		textField:"VIEW_NAME",
		onSelect:function(){
			onSelectMethod();
		}
	});
	setComboObjWidth("businesstablename",0.35,"combobox","");
	setComboObjWidth("classifiedfield",0.35,"combobox","");
	setComboObjWidth("statisticalitem",0.35,"combobox","");
	setComboObjWidth("groupbyfield",0.35,"combobox","");
	setComboObjWidth("queryfield",0.35,"combobox","");
	setComboObjWidth("charttype",0.35,"combobox","");
	setComboObjWidth("statisticalmethods",0.35,"combobox","");
	setComboObjWidth("statisticssize",0.35,"combobox","");
	setComboObjWidth("querysymbol",0.13,"combobox","");
	setComboObjWidth("queryfield",0.35,"combobox","");
	var eventid =  getParamter("eventid");
	var mychart =  getParamter("mychart");
	//更新操作，复制
	if(mychart!=null&&mychart!=""){
		$("#mychart").val(mychart);
	}
	if(eventid!=null&&eventid!=""){
		$("#eventid").val(eventid);
		setChartMessage(eventid);
	}
});
function onSelectMethod(){
	var viewname=$("#businesstablename").combobox("getValue");
	$.ajax({ 
		url:rootPath + "jasframework/statisticalchart/getAllColsbyViewName.do", 
		data:{"viewname":viewname},
		dataType: "json", 
		async:false,
		success: function(data){
			
//			$("#classifiedfield").combobox("loadData",data);
//			$("#statisticalitem").combobox("loadData",data);
			$("#classifiedfield").combobox({
				data:data,
				multiple:true,
				onSelect:function(){
					var classifield=$("#classifiedfield").combobox("getValues");
					var statisticalitem=$("#statisticalitem").combobox("getValues");
					if(statisticalitem.length>1){
						if(classifield.length>2){
							top.showAlert("提示", "统计项大于1时，统计纬度最多可以选择两个", 'info');
						}
					}else{
						if(classifield.length>3){
							top.showAlert("提示", "统计纬度最多可以选择三个", 'info');
						}
					}
				}  
			});
			$("#statisticalitem").combobox({
				data:data,
				multiple:true
			});
			$("#groupbyfield").combobox({
				data:data,
				multiple:true  
			});
			setComboObjWidth("classifiedfield",0.35,"combobox","");
			setComboObjWidth("statisticalitem",0.35,"combobox","");
			setComboObjWidth("groupbyfield",0.35,"combobox","");
			$("#queryfield").combobox("loadData",data);
		}
	});
}
//如果是更新的话页面填充数据
function setChartMessage(eventid){
	$.ajax({ 
		   type: "POST",
		   url:rootPath + "jasframework/statisticalchart/getChartConfigById.do?chartId="+eventid+"&random="+new Date(),
//		   data: "name=John&location=Boston",
		   success: function(data){
			   data = eval('('+data+')');
			   $("#businesstablename").combobox('setValue',data.businesstablename);
			   onSelectMethod();
			   $("#chartname").val(data.chartname);
			   $("#charttype").combobox('setValue',data.charttype);
			   $("#statisticalmethods").combobox('setValue',data.statisticalmethods);
			   var classifiedfield = data.classifiedfield.split(","); 
			   $("#classifiedfield").combobox('setValues',classifiedfield);
			   if(!(data.statisticssize==null||data.statisticssize=="")){
				   var statisticssize = data.statisticssize.split(","); 
				   $("#statisticssize").combobox('setValues',statisticssize);
			   }
			   if(data.statisticalitem!=null){
				   var statisticalitem = data.statisticalitem.split(","); 
				   $("#statisticalitem").combobox('setValues',statisticalitem);
			   }
			   $("#groupbyfield").combobox('setValue',data.groupbyfield);
			   $("#queryfield").combobox('setValue',data.queryfield);
			   $("#querysymbol").combobox('setValue',data.querysymbol);
			   $("#xtitle").val(data.xtitle);
			   $("#xunit").val(data.xunit);
			   $("#ytitle").val(data.ytitle);
			   $("#yunit").val(data.yunit);
			   $("#querycontext").val(data.querycontext);
			   previewchart();
		   }
		});
}
/**
 * 
 * 描述：js实现的map方法
 * @returns {Map}
 */
function Map(){
	var struct = function(key, value) {
		this.key = key;
		this.value = value;
	}
	var put = function(key, value){
		 for (var i = 0; i < this.arr.length; i++) {
			if ( this.arr[i].key === key ) {
				this.arr[i].value = value;
				return;
			}
		}
		this.arr[this.arr.length] = new struct(key, value);
	}
		 
	var get = function(key) {
		for (var i = 0; i < this.arr.length; i++) {
			if ( this.arr[i].key === key ) {
				return this.arr[i].value;
			}
		}
	return null;
	}
		 
	var remove = function(key) {
		var v;
		for (var i = 0; i < this.arr.length; i++) {
			v = this.arr.pop();
			if ( v.key === key ) {
				continue;
			}
			this.arr.unshift(v);
		}
	}
		 
	var size = function() {
		return this.arr.length;
	}
		 
	var isEmpty = function() {
		return this.arr.length <= 0;
	}
	this.arr = new Array();
	this.get = get;
	this.put = put;
	this.remove = remove;
	this.size = size;
	this.isEmpty = isEmpty;
}