function initcharts1(_data){
    var option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)",
			position:["50%","50%"]
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            show:false,
            data:['故障设备','正常设备']
        },
        series: [
            {
                name:'',
                type:'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        position: 'right',
                        textStyle: {
                            fontSize: '18',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:[
                    {value:_data.fault , name:'故障设备'},
                    {value:_data.notuser, name:'未分配'},
                    {value:_data.patrodev, name:'巡线工设备'},
                    {value:_data.insdev, name:'管道工设备'},
                ]
            }
        ]
    };
    
    var dom2 = document.getElementById("equipchart");
    var myChart2 = echarts.init(dom2);
    myChart2.setOption(option, true);
    // alert(JSON.stringify(_data))
}
function initcharts2(_data){
	for(var i = 0;i < _data.rsdata.length;i++){
		_data.rsdata[i] = saveTwo(_data.rsdata[i]*100);
	}
    var option = {
		tooltip : {
			trigger: 'axis'
		},
        color:['#00aeff','#4af760','#32fdfe'],
        grid: {
            left: '3%',
            right: '4%',
            top: '15%',
            bottom:'2%',
            containLabel: true
        },
        xAxis: {
            axisLine: {
                lineStyle: {
                    type: 'solid',
                    color: 'rgba(255,255,255,0.3)',//左边线的颜色
                    width:'1'//坐标线的宽度
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#d4e2f2',//坐标值得具体的颜色
                }
            },
            splitLine: {
                show:true,
                lineStyle: {
                    type: 'solid',
                    color: 'rgba(222,222,222,0.2)',//左边线的颜色
                    width:'1'//坐标线的宽度
                }
            },
            type: 'category',
            data: _data.rsdate
        },
        yAxis: {
			min:0,
			max:100,
            type: 'value',
            boundaryGap: false,
            splitLine: {
                show:true,
                lineStyle: {
                    type: 'solid',
                    color: 'rgba(222,222,222,0.2)',//左边线的颜色
                    width:'1'//坐标线的宽度
                }
            },
            axisLine: {
                show:true,
            },
            axisTick:{
                show:true,
            },
            axisLabel: {
                textStyle: {
                    color: '#d4e2f2',//坐标值得具体的颜色
                }
            }
        },
        series: [{
            type: 'line',
            name:'分数',
            label: {
                normal: {
                    show: true,
                    position: 'top'
                }
            },
            markArea: {
                silent: true,
                data: [
                    [{
                        name: ' ',
                        yAxis: '90',
                        itemStyle: {
                            normal: {
                                color: 'rgba(0,174,250,0.3)',
                            }
                        },
                    }, {
                        yAxis: '80'
                    }],
                    [{
                        name: ' ',
                        yAxis: '0',
                        itemStyle: {
                            normal: {
                                color:'rgba(239,51,64,0.3)',
                            }
                        },
                    }, {
                        yAxis: '80'
                    }]
                ]
            },
            data: _data.rsdata,
        }]
    };
    
    var dom2 = document.getElementById("unitweek");
    var myChart2 = echarts.init(dom2);
    myChart2.setOption(option, true);
}
function initcharts3(_data){
	var xdata = [],ydata=[];
	for(var i = 0;i < _data.length;i++){
		xdata.push(_data[i].score);
		ydata.push(_data[i].total);
	}
    var option2 = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        color:['#00aeff','#4af760','#32fdfe'],
        textStyle: {
            color: '#d4e2f2',
            fontSize:"12",
        },//536b92
        legend: { 
            show:false,
            data: []
        },
        grid: {
            left: '3%',
            right: '4%',
            top: '8%',
            bottom:'5%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01],
            splitLine:{show: false},//去除网格线
            splitArea : {show : true,
                areaStyle: {
                    color: ['rgba(0,174,250,0.1)','rgba(255,255,255,0)'],
                },
            },//保留网格区域
            axisLine: {
                show:false,
                lineStyle: {
                    type: 'solid',
                    color: '#71bcf6',//左边线的颜色
                    width:'1'//坐标线的宽度
                }
            },
            axisTick:{
                show:false,
            },
            axisLabel: {
                textStyle: {
                    color: '#d4e2f2',//坐标值得具体的颜色

                }
            }
        },
        yAxis: {
            type: 'category',
            nameTextStyle:{
                color:'#d4e2f2',
            },
            axisTick:{
                show:false,
            },
            axisLine: {
                show:false,
                lineStyle: {
                    type: 'solid',
                    color: '#71bcf6',//左边线的颜色
                    width:'1'//坐标线的宽度
                }
            },
            data: xdata
        },
        series: [
            {
                name: '人数',
                type: 'bar',
                barWidth:'10',
                itemStyle: {
                    normal: { //圆角
                        barBorderRadius:10,
                    }
                },
                data: ydata
            },
        ]
    };
    var dom2 = document.getElementById("unityestday");
    var myChart2 = echarts.init(dom2);
    myChart2.setOption(option2, true);
}
function initcharts4(_data,val){
	var xdata = [],ydata=[];
	var riskrating = _data.countRiskrating[0];
	for(var i in riskrating){
		var warning,obj={};
		if(i == "blueEarlyWarning"){
			warning = "蓝色预警";
		}else if(i == "yellowEarlyWarning"){
			warning = "黄色预警";
		}else if(i == "redEarlyWarning"){
			warning = "红色预警";
		}
		obj = {
			value:riskrating[i],
			name:warning
		}
		xdata.push(warning);
		ydata.push(obj);
	}
    var option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        color:['#fbc60f','#bb3d39','#008fff'],
        legend: {
            orient: 'horizontal',
            //x: 'canter',
            x : 'right',
            show:true,
            left:'center',
            textStyle: {
                color:'#d4e2f2'
            },
			itemWidth:8,
			itemHeight :8,
			icon: "circle", //圆点
            data:xdata
        },
        calculable : true,
        series: [
            {
                name:'第三方统计施工',
                type:'pie',
                center : ['50%', '60%'],
                radius: ['45%', '60%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
						position:"inner"
                    },
                    emphasis: {
                        show: true,
                        position: 'right',
                        textStyle: {
                            fontSize: '18',
                            fontWeight: 'bold'
                        }
                    }
                },
                data:ydata
            }
        ]
    };
    
    var dom2 = document.getElementById("thirdchart");
    var myChart2 = echarts.init(dom2);
    myChart2.setOption(option, true);
}
function initcharts5(_data){
    var optionfooter1 = {
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color:['#00aeff','#0055bf','#096bf2','#47f467','#30f9ff','#ff9549'],
        legend: {
            x : 'right',
            show:true,
            orient: 'vertical',
            textStyle: {
                color:'#d4e2f2'
            },
			right:0,
            itemWidth:8,
            itemHeight :8,
            icon: "circle", //圆点
            itemGap:8,
            data: _data.rsname
        },
        calculable : true,
        series : [
            {
                name:'巡检事件统计',
                type:'pie',
                radius : ['55%', '80%'],
                center : ['25%', '50%'],
                roseType : 'raduis',
                label: {
                    normal: {
                        show: false,
						position:"inner"
                    },
                    emphasis: {
                        show: true,
                        position: 'right',
                        textStyle: {
                            fontSize: '18',
                            fontWeight: 'bold'
                        }
                    }
                },
                data:_data.rsdata
            }
        ]
    };
    
    var domfooter1 = document.getElementById("eventchart");
    var myChartfooter1 = echarts.init(domfooter1);
    myChartfooter1.setOption(optionfooter1, true);
}