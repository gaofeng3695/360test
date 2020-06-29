$(document).ready(function(){
	var id = getParamter("eventid");
	previewchart(id);
});
//为JS对象提供缓存
var chartObj =new Map();

/**
 * 
 * 方法描述：预览
 * 
 */

function previewchart(id){
	$("#id").val(id);
	$.ajax({ 
		   type: "POST",
		   url:rootPath + "jasframework/statisticalchart/previewChartById.do?chartId="+id+"&random="+new Date(),
//		   data: "name=John&location=Boston",
		   success: function(data){
			   data = eval('('+data+')');
			   if(data.series.type=="pie"){
				   previewpiechart(data,'previewchart',id);
			   }else{
				   previewotherchart(data,'previewchart',id);
			   }
			  
		   }
		});
}
function showchart(id,showchartdivid){
	$.ajax({ 
		   type: "POST",
		   url:rootPath + "jasframework/statisticalchart/previewChartById.do?chartId="+id+"&random="+new Date(),
//		   data: "name=John&location=Boston",
		   success: function(data){
			   data = eval('('+data+')');
			   if(data.series.type=="pie"){
				   alert(showchartdivid)
				   previewpiechart(data,showchartdivid,id);
			   }else{
				   previewotherchart(data,showchartdivid,id);
			   }
			  
		   }
		});
}
//预览下一粒度的数据
function previewNextChart(nextstatisticssize,unitkeyOrDate,id){
	 $('#nextstatisticssize').val(nextstatisticssize);
	$.ajax({ 
		type: "POST",
		url:rootPath + "jasframework/statisticalchart/previewNextChartById.do?random="+new Date(),
		data:{"nextstatisticssize":nextstatisticssize,
			  "unitkeyOrDate":unitkeyOrDate,
			  "id":id},
		success : function(data) {
//			alert(data)
			data = eval('('+data+')');
		   if(data.series.type=="pie"){
			   previewpiechart(data,'previewchart',id);
		   }else{
			   previewotherchart(data,'previewchart',id);
		   }
			  
		}
	});
}

//预览商议粒度的数据
function previewBackChart(nextstatisticssize,data){
	var id = $("#id").val();
	if(data!=null){
		$('#nextstatisticssize').val(nextstatisticssize);
		if(data.series.type=="pie"){
		   previewpiechart(data,'previewchart',id);
	    }else{
	 	   previewotherchart(data,'previewchart',id);
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
function previewotherchart(data,divid,id){
	var categoriesNum = data.xAxis.xAxisCategories.length;
	var dataNum = data.series.length;
	var width = categoriesNum*dataNum*50;
	if(width<780){
		width=780;
	}
	new Highcharts.Chart({
		chart: {
        	renderTo: divid,
        	type: data.chart.type,
        	zoomType: 'xy',//拖动鼠标缩放
        	width:width,
        	height:410
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
        						previewNextChart("二级部门",unitkeyOrDate,id);
        						chartObj.put("一级部门",data);
        					}else if("二级部门"==statisticssize){
        						previewNextChart("三级部门",unitkeyOrDate,id);
        						chartObj.put("二级部门",data);
        					}else if("三级部门"==statisticssize){
        						previewNextChart("四级部门",unitkeyOrDate,id);
        						chartObj.put("三级部门",data);
        					}else if("年"==statisticssize){
        						previewNextChart("季度",unitkeyOrDate,id);
        						chartObj.put("年",data);
        					}else if("季度"==statisticssize){
        						previewNextChart("月",unitkeyOrDate,id);
        						chartObj.put("季度",data);
        					}else if("月"==statisticssize){
        						previewNextChart("日",unitkeyOrDate,id);
        						chartObj.put("月",data);
        					}
//        					alert(e.point.category+' xxxx:'+e.point.y); 
//        					chartObj.put("aa",data);
//        					alert(data.chart.type);
//        					alert(chartObj.get("aa").chart.type);
//        					alert(chartObj.get("vv"));
        					
        					
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
        					
        					alert(e.point.name+' xxxx:'+e.point.y); 
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
function closePanol(){
	top.closeDlg('systemView');
}