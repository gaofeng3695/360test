/**
 * 人员列表
 */

var person = Vue.component('person', {
    props: {
        /* 查询的是那个部门下的人员 */
        departmentOidProp: String,
        /* 部门的层级 */
        hierarchyProp: String,
        /* 在线 1 离线0 ， 不区分 不写 */
        onlineProp: String,
        /* 01 巡线工 ， 02 管道工*/
        inspectorTypeProp: String,
        parentIdProp: String

    },
    data: function () {
        return {
            token: '',
            personVm: '',
            /* 所有人员 */
            personList: [],

            /* 本站的总人数，在线人数，离线人数。*/
            totalCount: 0,
            onlineCount: 0,
            offlineCount: 0,

            /* 本部门所有的父级。 */
            parentList: [{"oid":1, "hierarchy":0, "unitName":"-"}],
            otherJs: '',
            jasMapApi: '',
            mapWindow: '',

            /* 地图上展示的图层。 */
            allLayer: [],
            layer: 'PERSON',
            /* 当前部门 */
            department: [],

            /* 默认是第一页，默认一页30条 */
            pageNo: 1,
            inspectorName:'',
            date: '',
            /* 日期控件显示中文 */
            /*localeOption: {
                locale: Flatpickr.l10ns.zh,
                onChange: function onChange(selectedDates, dateStr, instance) {
                    person.personVm.date = dateStr;
                }
            },*/
            /* 最顶层部门，一般是登录人的部门 */
            parentId:'',

            rootPath: '',
            state: true,
            personListen: false

        }
    },
    created: function() {
        person.personVm = this;
        person.personVm.$options.methods.dateFormat();
        person.personVm.rootPath = person.personVm.$options.methods.getRootPath();
    },
    mounted: function() {
        /* 获取到token */
        person.personVm.token = localStorage.getItem("token")
        person.personVm.date = new Date().format('yyyy-MM-dd');
        /* 获取其他页面写的js公共方法 */
        let fra = parent.$("iframe");
        for ( let i = 0; i < fra.length; i++) {
            if (fra[i].id == 'frm2d') {
                person.personVm.otherJs = fra[i].contentWindow;
                person.personVm.jasMapApi = fra[i].contentWindow.jasMapApi;
                person.personVm.mapWindow = fra[i].contentWindow;
            }
        }

        /* 设置导航栏。 */
        person.personVm.$options.methods.getParentDeparement( person.personVm.departmentOidProp, person.personVm.parentIdProp );

        /* 创建之初，请求得到所有的人员。 */
        person.personVm.$options.methods.getPerson( person.personVm.onlineProp, person.personVm.hierarchyProp, person.personVm.inspectorTypeProp, person.personVm.pageNo, person.personVm.inspectorName, person.personVm.date );

        /* 得到所有的人员数量 */
        person.personVm.$options.methods.getAllPersonOnlineOrOff(person.personVm.departmentOidProp, person.personVm.hierarchyProp);

        // 添加缓冲区图层
        var keyPointBuffer = {
            "id":"KEY_POINT_BUFFER",
            "type":"graphic"
        };
        person.personVm.jasMapApi.addLayer(keyPointBuffer);
        person.personVm.allLayer.push("KEY_POINT_BUFFER");

    },

    methods: {

        dateFormat() {
            Date.prototype.format = function(fmt) {
                var o = {
                    "M+" : this.getMonth()+1,                 //月份
                    "d+" : this.getDate(),                    //日
                    "h+" : this.getHours(),                   //小时
                    "m+" : this.getMinutes(),                 //分
                    "s+" : this.getSeconds(),                 //秒
                    "q+" : Math.floor((this.getMonth()+3)/3), //季度
                    "S"  : this.getMilliseconds()             //毫秒
                };
                if(/(y+)/.test(fmt)) {
                    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
                }
                for(var k in o) {
                    if(new RegExp("("+ k +")").test(fmt)){
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
                    }
                }
                return fmt;
            };
        },
        /**
         * 获取本部门总人数，在线人数和离线人数。
         */
        getAllPersonOnlineOrOff( unitId, hierarchy ) {
            /* 获取本部门的总人数，在线人数，离线人数。 */
            Vue.prototype.$http.post(person.personVm.rootPath+'/realtimemonitor/realtimemonitor/getInspectorCountByUnitid.do?unitid='+unitId+'&token='+person.personVm.token+'&hierarchy='+hierarchy)
                .then(function (response) {
                    if( response.data.data != null && response.data.data.length > 0 ) {
                        person.personVm.totalCount = response.data.data[0].total;
                        person.personVm.onlineCount = ( response.data.data[0].insonline + response.data.data[0].inspipeonline );
                        person.personVm.offlineCount = ( response.data.data[0].insoffline + response.data.data[0].inspipeoffline );
                    }

                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
                .then(function () {
                    // always executed
                });
        },
        /**
         * 获取到父部门数据
         * @param departmentOid
         */
        getParentDeparement( departmentOid, parentId ) {
            Vue.prototype.$http.post(person.personVm.rootPath+'/realtimemonitor/realtimemonitor/getParentUnitList.do?unitId=' + departmentOid + '&token=' + person.personVm.token+'&parentId='+parentId)
                .then(function (response) {
                    /* 设置列表部门。 */
                    person.personVm.parentList = response.data.data;
                    /* 设置当前部门 */
                    person.personVm.department =  person.personVm.parentList[person.personVm.parentList.length - 1];
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
                .then(function () {
                    // always executed
                });
        },

        /**
         * 点击部门名称获取站或者站下的所有巡线员。
         * @param departmentOid 分公司的OID或者站的OID
         * @param pageNo 获取多少页的数据
         */
        getPerson(online, hierarchy, inspectorType, pageNo, inspectorName, date ) {
            person.personVm.onlineProp = online;
            /* 获取部门下的人员。 */
            Vue.prototype.$http.post(person.personVm.rootPath+'/realtimemonitor/realtimemonitor/getEmployeeByUnitId.do?token=' + person.personVm.token + '&hierarchy=' + hierarchy + "&online=" + online + "&inspectorType=" + inspectorType + "&date=" + person.personVm.date + "&pageNo=" + pageNo ,{"inspectorName":person.personVm.inspectorName},{
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                    /* 设置人员列表。 */
                    person.personVm.personList = response.data.data;

                    /* 定位所有的人员。 */
                    person.personVm.$options.methods.positionPerson();

                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
                .then(function () {
                    // always executed
                });

        },

        /**
         * 获取巡线工一周成绩
         * @param unitId
         * @param unitName
         * @returns
         */
        getInspectorWeekScore(inspectorId, inspectorName){
            person.personVm.otherJs.showDialog2('stationscore',inspectorName+'周成绩', '../../realtimemonitor/realtimemonitor/stationscorestatistics.html?inspectorid='+inspectorId+'&type=inspector', 700, 400, false, '');
        },

        /**
         * 定位所有人员
         */
        positionPerson() {
            /* 先清理所有地图上已经展示的图层。 */
            person.personVm.$options.methods.clearAllLayer();

            if( person.personVm.personList.length > 0 ) {
                /* 放大地图比例尺 */
                person.personVm.jasMapApi.setLevel(9);
            }

            for( let i = 0 ; i < person.personVm.personList.length ; i++ ) {

                /* 在线并且经纬度不为NULL才能定位。 */
                if( person.personVm.personList[i].lon != null && person.personVm.personList[i].lon != ''&&
                    person.personVm.personList[i].lat != null && person.personVm.personList[i].lat != ''&&
                    person.personVm.personList[i].status == 1 ) {
                    let array = [];
                    let position = {};
                    position.lon = person.personVm.personList[i].lon;
                    position.lat = person.personVm.personList[i].lat;
                    position.oid = person.personVm.personList[i].inspectorid;
                    array.push(position);

                    let insname = person.personVm.personList[i].insname;
                    /* 如果是管道工 */
                    let option = {};
                    if( person.personVm.personList[i].inspectortype == '02') {
                        insname = person.personVm.personList[i].insnamePlumber;
                        option.url = "images/inspector02.gif";
                    }else{
                        option.url = "images/inspector.gif";
                    }
                    option.layerId = "PERSON";
                    option.width = 24;
                    option.height = 24;
                    option.attributes = {"oid": position.oid,"date":person.personVm.personList[i].locationdate,"departmentOid":person.personVm.departmentOidProp,"hierarchy":person.personVm.hierarchyProp,"insname":insname};

                    person.personVm.mapWindow.doPosition( array, JSON.stringify(option) );

                    /* 新增点击事件和时间标注 。*/
                    let options = {};
                    options.fontSize = 12 ;
                    options.fontFamily = "微软雅黑";
                    /*options.haloColor = [0,0,0, 130];
                    options.haloSize= 6;*/
                    // options.color= [255,255,255,255];
                    options.color= [41, 52, 94,255];
                    options.background= [0,0,0, 130];
                    options.angle=0;
                    //options.border="1px solid #d3d3d3";

                    options.haloColor = [255,255,255, 130];
                    options.haloSize = 1;
                    options.backgroundColor = [0,0,0, 130];
                    options.fontWeight = "bold";
                    options.angle=0;
                    options.xOffset= -55;
                    options.yOffset= -30;
                    options.center= false;
                    options.layerId= "PERSON_TEXT";
                    /* 如果是巡线工 */
                    if( person.personVm.personList[i].inspectortype == '01' )
                        person.personVm.jasMapApi.addTextGraphic(person.personVm.personList[i].lon, person.personVm.personList[i].lat, person.personVm.personList[i].insname+person.personVm.personList[i].locationdate, options);
                    else
                        person.personVm.jasMapApi.addTextGraphic(person.personVm.personList[i].lon, person.personVm.personList[i].lat, person.personVm.personList[i].insnamePlumber+person.personVm.personList[i].locationdate, options);
                }

            }

            /* 点击相应的人员到达对应的人员详情页面 */
            if( person.personVm.personListen ) {
                person.personVm.jasMapApi.removeEventListener( person.personVm.personListen );
            }
            person.personVm.personListen = person.personVm.jasMapApi.addLayerClickEventListener( "PERSON" ,function(e){
                if(person != undefined && person != '' && person != null && person.personVm._isDestroyed){
                    if(detail != null && detail != undefined && detail != '' && detail.detailVm != null && detail.detailVm != undefined && detail.detailVm != '' ) {
                        detail.detailVm.initDetailProp( e.graphic.attributes.oid, e.graphic.attributes.departmentOid, e.graphic.attributes.hierarchy, e.graphic.attributes.insname, '' );
                    }
                } else {
                    /* 将组件内容切换为人员详情 */
                    person.personVm.$emit( "childupdatepersondetailevent",e.graphic.attributes.departmentOid, e.graphic.attributes.hierarchy, e.graphic.attributes.oid, e.graphic.attributes.insname );
                }

            });
            /* 展示完毕后，将已经加载的图层加入到 allLayer 中 */
            person.personVm.allLayer.push(person.personVm.layer);

        },
        /**
         * 巡线工定位
         */
        locateInspector(inspectorOid, lon, lat, name, status){

            if( status == 0 ) {
                person.personVm.$options.methods.successNotify("人员已离线！");
                return;
            }
            if(inspectorOid == 'undefined'){
                return;
            }
            if(lon==null || lat==null){
                person.personVm.$options.methods.successNotify("该人员没有定位坐标！");
                return;
            }

            /* 放大地图比例尺 */
            person.personVm.jasMapApi.setLevel(14);
            person.personVm.jasMapApi.centerAt( lon, lat );
        },
        /**
         * 清理掉地图上所有的图层
         */
        clearAllLayer() {
            for( let i = 0 ; i < person.personVm.allLayer.length ; i++ ) {
                person.personVm.jasMapApi.clearGraphicsLayer( person.personVm.allLayer[i] );
            }
            person.personVm.allLayer = [];

        },
        /**
         * 获取巡检任务中的关键点
         * @param unitid 部门ID
         * @param hierarchy 层级编码
         * @returns
         */
        getInspectorKeyPoint( inspectorOid ){

            /* 获取部门下的所有部门或者人员。 */
            Vue.prototype.$http.post(person.personVm.rootPath+'/realtimemonitor/realtimemonitor/getInsKeyPointByInspectorid.do?inspectorid='+inspectorOid+'&token='+person.personVm.token+'&date='+person.personVm.date)
                .then(function (response) {
                    let result = response.data;

                    let bufferOptions = {};
                    //清除上一次添加的关键点图层
                    person.personVm.jasMapApi.clearGraphicsLayer("PERSON_KEYPOINT");
                    person.personVm.jasMapApi.clearGraphicsLayer("COMPANY_TEXT");
                    person.personVm.jasMapApi.clearGraphicsLayer("KEY_POINT_BUFFER");

                    if(result && result.data.length > 0){
                        let data = result.data;

                        /* 放大地图比例尺 */
                        person.personVm.jasMapApi.setLevel(14);
                        
                        //添加关键点图层
                        let options = {
                            "id":"PERSON_KEYPOINT",
                            "type":"graphic"
                        };
                        person.personVm.jasMapApi.addLayer(options);

                        if(data.length < 3){
                            person.personVm.jasMapApi.centerAt(data[0].lon,data[0].lat);
                        }else{
                            person.personVm.jasMapApi.centerAt(data[Math.floor(data.length/2)].lon,data[Math.floor(data.length/2)].lat);
                        }

                        for(let i=0; i<data.length; i++){
                            let img = "";
                            if(data[i].keypointtype == 1){//常规关键点
                                if(data[i].pointstatus == 0){
                                    img = "images/keypoint_flag_red.png";

                                    // 关键点缓冲区
                                    bufferOptions = {
                                        "draw":true,//是否将结果绘制到图层上
                                        "layerId":"KEY_POINT_BUFFER",//绘制到图层id
                                        "layerIndex":100,
                                        "attributes":null,
                                        //绘制的样式
                                        "width": 1,
                                        "color": [255,0,0,120],//填充色
                                        "style": "solid",
                                        "outlineColor": [255,0,0,0.35],
                                        "outlineWidth": 1,
                                        "outlineStyle": "solid",
                                        "callback":null,
                                        "fieldName":data[i].oid
                                    };

                                }else if(data[i].pointstatus == 1){
                                    img = "images/keypoint_flag_green.png";
                                    // 关键点缓冲区
                                    bufferOptions = {
                                        "draw":true,//是否将结果绘制到图层上
                                        "layerId":"KEY_POINT_BUFFER",//绘制到图层id
                                        "layerIndex":100,
                                        "attributes":null,
                                        //绘制的样式
                                        "width": 1,
                                        "color": [37,232,65,120],//填充色
                                        "style": "solid",
                                        "outlineColor": [131,201,124,0.35],
                                        "outlineWidth": 1,
                                        "outlineStyle": "solid",
                                        "callback":null,
                                        "fieldName":data[i].oid
                                    };
                                }
                            }else if(data[i].keypointtype == 2){//临时关键点
                                if(data[i].pointstatus == 0){
                                    img = "images/temp-key-point-1.png";
                                    bufferOptions = {
                                        "draw":true,//是否将结果绘制到图层上
                                        "layerId":"KEY_POINT_BUFFER",//绘制到图层id
                                        "layerIndex":100,
                                        "attributes":null,
                                        //绘制的样式
                                        "width": 1,
                                        "color": [255,0,0,120],//填充色
                                        "style": "solid",
                                        "outlineColor": [255,0,0,0.35],
                                        "outlineWidth": 1,
                                        "outlineStyle": "solid",
                                        "callback":null,
                                        "fieldName":data[i].oid
                                    };
                                }else if(data[i].pointstatus == 1){
                                    img = "images/temp-key-point-2.png";
                                    bufferOptions = {
                                        "unitType":"m",
                                        "draw":true, // 是否将结果绘制到图层上
                                        "layerId":"KEY_POINT_BUFFER", // 绘制到图层id
                                        "layerIndex":100,
                                        "attributes":null,
                                        //绘制的样式
                                        "width": 1,
                                        "color": [37,232,65,120],//填充色
                                        "style": "solid",
                                        "outlineColor": [131,201,124,0.35],
                                        "outlineWidth": 1,
                                        "outlineStyle": "solid",
                                        "callback":null,
                                        "fieldName":data[i].oid
                                    };
                                }
                            }

                            let options = {
                                url:img,//图标地址
                                width:24,//图标大小
                                height:24,
                                attributes:{"OBJECTID":data[i].pointid, "LINELOOPPOINTNAME":data[i].lineloopoidname+': '+data[i].pointidname,"type": data[i].keypointtype},//图标属性
                                layerId:"PERSON_KEYPOINT"
                            };

                            var geomJson = {"x":data[i].lon, "y":data[i].lat,"spatialReference":{"wkid" : 4490}};
                            person.personVm.jasMapApi.queryBufferGraphic(geomJson, data[i].buffer, bufferOptions);

                            person.personVm.jasMapApi.addPictureGraphic(data[i].lon, data[i].lat, options);

                            /* 添加点击事件 */
                            person.personVm.jasMapApi.addLayerClickEventListener("PERSON_KEYPOINT",function(e){
                            	var attributes = e.graphic.attributes;
                            	var oid = attributes.OBJECTID;
                            	var type = attributes.type;
                            	if(type == 1){
                            		person.personVm.otherJs.showDialog2('viewGpsKeypoint','关键点详细', '../../realtimemonitor/realtimemonitor/gpskeypoint.html?oid='+oid, 800, 600, false, '');
                            		//queryTop(oid,"GPS_KEYPOINT","../../linePatrolManage/pathLine/keypoint/view_gps_keypoint.html?oid=","viewGpsKeypoint","详细");
                            	}else if(type == 2){
                            		person.personVm.otherJs.showDialog2('viewGpsTemporaryKeypoint','关键点详细', '../../realtimemonitor/realtimemonitor/gpstemporarykeypoint.html?oid='+oid, 800, 600, false, '');
                            		//queryTop(oid,"gps_temporary_keypoint","../../linePatrolManage/insTask/temporaryKeypoint/view_gps_temporary_keypoint.html?oid=","viewGpsTemporaryKeypoint","详细");
                            	}
                            });
                            options = {};
                            options.fontSize = 12 ;
                            options.fontFamily = "微软雅黑";
                            /*options.haloColor = [0,0,0, 130];
                            options.haloSize= 6;*/
                            // options.color= [255,255,255,255];
                            options.color= [41, 52, 94,255];
                            options.background= [0,0,0, 130];
                            options.angle=0;
                            //options.border="1px solid #d3d3d3";

                            options.haloColor = [255,255,255, 130];
                            options.haloSize = 1;
                            options.backgroundColor = [0,0,0, 130];
                            options.fontWeight = "bold";
                            options.angle=0;
                            options.xOffset= -20;
                            options.yOffset= -30;
                            options.center= false;
                            options.layerId= "COMPANY_TEXT";
                            person.personVm.jasMapApi.addTextGraphic(data[i].lon, data[i].lat, data[i].pointidname, options);

                        }

                        /* 展示完毕后，将已经加载的图层加入到 allLayer 中 */
                        person.personVm.allLayer.push("PERSON_KEYPOINT");
                        person.personVm.allLayer.push("COMPANY_TEXT");
                        person.personVm.allLayer.push("KEY_POINT_BUFFER");
                    } else {
                        person.personVm.$options.methods.successNotify(person.personVm.date+"没有任务关键点数据");
                    }



                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
                .then(function () {
                    // always executed
                });

        },
        /**
         * 成功提示信息
         * @param content
         */
        successNotify( content ) {
            this.$notify({
                title: '成功',
                message: content,
                type: 'success'
            });
        },
        /**
         * 等待提示信息
         * @param content
         */
        loadingNotify( content ) {
            this.$notify.info({
                title: '消息',
                message: content
            });
        },
        /**
         * 导航栏点击切换成分公司或者站
         * @param oid   部门OID
         * @param hierarchy 部门层级
         */
        getStation( oid, hierarchy) {
            /* 此处需要判断用户点击的是否是分公司或者总公司，如果只是点击场站，就不必切换。 */
            if( hierarchy.split(".").length <= 3 ) {
                /* 清除所有的地图图层。 */
                person.personVm.$options.methods.clearAllLayer();

                person.personVm.jasMapApi.clearGraphicsLayer("PERSON");
                person.personVm.jasMapApi.clearGraphicsLayer("PERSON_TEXT");

                person.personVm.$emit("childupdatecompanyevent", oid, hierarchy);
            }

        },
        /**
         * 通过人员id获取到该人员当日的轨迹
         */
        getLineByDateInspectorOid( inspectorOid, inspectorName ) {
            Vue.prototype.$http.post(person.personVm.rootPath+'/realtimemonitor/realtimemonitor/getInsLineByDateInspectorid.do?inspectorid='+inspectorOid+'&token='+person.personVm.token)
                .then(function (response) {
                    let data = response.data;
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
                                // 添加轨迹起始终止点图层
                                options = {
                                    "id":"drawlayer_MONITORABPOINT",
                                    "type":"graphic"
                                };
                                jasMapApi.addLayer(options);

                                // 添加回放时加载的起始终止点标绘
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

                                // 添加当日轨迹图层
                                options = {
                                    "id":"drawlayer_MONITORINSLINE",
                                    "type":"graphic"
                                };
                                jasMapApi.addLayer(options);

                                // 添加当日轨迹标绘
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
                            alert( inspectorName+"当日没有巡线！");
                        }
                    }else if(data.code == "400") {
                        alert("请联系管理员！");
                    }else{
                        alert( data.msg);
                    }

                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
                .then(function () {
                    // always executed
                });

            /* 展示完毕后，将已经加载的图层加入到 allLayer 中 */
            person.personVm.allLayer.push("drawlayer_MONITORABPOINT");
            person.personVm.allLayer.push("drawlayer_MONITORINSLINE");
        },
        /**
         * 展示人员详细信息
         */
        showPersonDetail( unitId, hierarchy, inspectorOid, insname ) {
            /* 将组件内容切换为人员详情 */
            if(person != undefined && person != '' && person != null && person.personVm._isDestroyed){
                if(detail != null && detail != undefined && detail != '' && detail.detailVm != null && detail.detailVm != undefined && detail.detailVm != '' ) {
                    detail.detailVm.initDetailProp( inspectorOid, departmentOid, hierarchy, insname, '' );
                }
            } else {
                this.$emit( "childupdatepersondetailevent",unitId, hierarchy, inspectorOid, insname );
            }
        },
        /**
         * 获取部门信息。
         */
        getDepartmentInfo() {

        },
        loadMore: function() {
            person.personVm.pageNo++;
            person.personVm.$options.methods.getPerson( person.personVm.onlineProp, person.personVm.hierarchyProp, person.personVm.inspectorTypeProp, person.personVm.pageNo, person.personVm.inspectorName, person.personVm.date );
        },
        /**
         * 点击查询按钮
         */
        searchTime() {
            /* 清除地图上所有图标以及定时器 */
            person.personVm.$options.methods.clearAllLayer();
            /* 获取人员列表 */
            person.personVm.$options.methods.getPerson( person.personVm.onlineProp, person.personVm.hierarchyProp, person.personVm.inspectorTypeProp, person.personVm.pageNo, person.personVm.inspectorName, person.personVm.date );
        },
        /**
         * @desc 获取系统根路径
         */
        getRootPath() {
            // 获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
            var curWwwPath = window.document.location.href;
            // 获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
            var pathName = window.document.location.pathname;
            var pos = curWwwPath.indexOf(pathName);
            // 获取主机地址，如： http://localhost:8083
            var localhostPaht = curWwwPath.substring(0, pos);
            // 获取带"/"的项目名，如：/uimcardprj
            var projectName = pathName.substring(0, pathName.substring(1).indexOf('/') + 1);
            return (projectName + "/");
        }

    },

    template: `
            <section class= "all-department">
            <div class = "department-head">
				<nav class="breadcrumb" aria-label="breadcrumbs">
                  <ul>
                    <li v-for="( parent, index ) in parentList" v-bind:key ="parent.oid" >
                        <a v-if = "parentList.length > 3" v-on:click = "getStation( parent.oid, parent.hierarchy )" v-bind:title="parent.unitName" href="#">{{ parent.unitName.length > 6?parent.unitName.slice(0,5)+'...':parent.unitName }}</a>
                        <a v-else-if = "parentList.length == 2" v-on:click = "getStation( parent.oid, parent.hierarchy )" v-bind:title="parent.unitName" href="#">{{ parent.unitName.length > 14?parent.unitName.slice(0,13)+'...':parent.unitName }}</a>
                        <a v-else-if = "parentList.length == 3" v-on:click = "getStation( parent.oid, parent.hierarchy )" v-bind:title="parent.unitName" href="#">{{ parent.unitName.length > 6?parent.unitName.slice(0,6)+'...':parent.unitName }}</a>
                        <a v-else v-on:click = "getStation( parent.oid, parent.hierarchy )" v-bind:title="parent.unitName" href="#">{{parent.unitName }}</a>
                    </li>
                  </ul>
                </nav>
                
                <nav class="level person">
                  <div class="level-item" v-on:click = "getPerson('', department.hierarchy, '',pageNo,inspectorName, date )">
                    <div class = 'ins-img'>
                        <img src="../map_viewer/images/allIns.png"> 
                    </div>
                    <div class = 'ins-count'>
                        <p class="heading">全部</p>
                        <p class = "count">{{ totalCount }}</p>
                    </div>
                  </div>
                  
                  <div class="level-item" v-on:click = "getPerson('1', department.hierarchy, '',pageNo,inspectorName, date )">
                    <div class = 'ins-img'>
                        <img src="../map_viewer/images/allonIns.png"> 
                    </div>
                    <div class = 'ins-count'>
                      <p class="heading">在线</p>
                      <p class = 'count'>{{ onlineCount }}</p>
                    </div>
                  </div>
                  <div class="level-item last"  v-on:click = "getPerson('0', department.hierarchy, '',pageNo,inspectorName, date )">
                    <div class = 'ins-img'>
                        <img src="../map_viewer/images/alloffIns.png"> 
                    </div>
                    <div class = 'ins-count'>
                      <p class="heading">离线</p>
                      <p class = 'count'>{{ offlineCount }}</p>
                    </div>
                  </div>
                </nav>
                </div>
                
                
                <!-- 人员列表 -->
                <section class = "all-company" id = "allDetail">
                
                    <!-- 查询页面 -->
                    <nav class="level">
                        <div class="level-left form-person">
                            <div class="field is-grouped">
                             
                                <el-date-picker
                                  v-model="date"
                                  type="date"
                                  value-format="yyyy-MM-dd"
                                  v-bind:placeholder="date"
                                  placeholder="选择日期">
                                </el-date-picker>
                                <input v-model="inspectorName" class="input person-name" type="text" placeholder="人员名称">
                                <a class="button is-info" v-on:click = "searchTime()">
                                  查询
                                </a>
                              
                            </div>
                        </div>
                        
                        <div class="level-right">
                        </div>
                    </nav>
                    
                    <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="0">
                    <section name="detail" class = "detail person" v-for="person in personList" v-bind:key ="person.inspectorid" >
                       
                        <nav class="level company">
                          <!-- Left side -->
                          <div class="level-left person">
                            <div class="level-item person-name">
                              <img v-if = " person.status == 0 && person.inspectortype == '01' " src="../map_viewer/images/line-inspector-offline.png">
                              <img v-else-if = " person.status == 0 && person.inspectortype == '02' " src="../map_viewer/images/manager-offline.png">
                              <img v-else-if = " person.inspectortype == '01' " src="../map_viewer/images/line-inspector-online.png">
                              <img v-else-if = " person.inspectortype == '02' " src="../map_viewer/images/manger-online.png">
                              <img v-else src="../map_viewer/images/manger-online.png">
                              
                              <p>
                                <a v-if = "person.inspectortype == '01'" v-on:click = "showPersonDetail( departmentOidProp, hierarchyProp, person.inspectorid, person.insname )" v-bind:title="person.insname">{{ person.insname.length > 3?person.insname.slice(0,3)+'...':person.insname }}</a>
                                <a v-else-if = "person.insnamePlumber != null" v-on:click = "showPersonDetail( departmentOidProp, hierarchyProp, person.inspectorid, person.insnamePlumber )" v-bind:title="person.insnamePlumber">{{ person.insnamePlumber.length > 3?person.insnamePlumber.slice(0,3)+'...':person.insnamePlumber }}</a>
                                <a v-else>ERROR</a>
                              </p>
                            </div>
                            <div class="level-item person-score">
                              <p>分数</p>
                              <p class = "score-rate">{{ Math.round(person.score*10000)/100 }}</p>
                            </div>
                            <div class="level-item person-matching">
                              <p>匹配</p>
                              <p class = "score-rate" >{{ Math.round(person.rate*10000)/100 }}</p>
                            </div>
                          </div>
                          <!-- Right side -->
                          <div class="level-right">
                            <p class="level-item position"><img v-on:click = "locateInspector( person.inspectorid, person.lon, person.lat, person.insname, person.status )" src="../map_viewer/images/position.png"></p>
                            <p class="level-item score"><img v-on:click = "getInspectorWeekScore( person.inspectorid, person.insname )" src="../map_viewer/images/stationscore.png"></p>
                         <!--   <p class="level-item"><img v-on:click = "getLineByDateInspectorOid( person.inspectorid, person.insname )" src="../map_viewer/images/insline.png"></p>  -->
                            <p class="level-item"><img v-on:click = "getInspectorKeyPoint( person.inspectorid )" src="../map_viewer/images/keypoint.png"></p>
                          </div>
                          </nav>
                    </section>
                    </div>
                    <section name="detail" class = "detail person none" v-if = "personList.length == 0 " >
                        没有巡检人员
                    </section>
                    
                </section>
                
                
               </section>
			`

})

