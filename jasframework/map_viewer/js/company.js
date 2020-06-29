/**
 * 分公司
 */

var company = Vue.component('company', {
    props: {
        /* 查询的是那个部门 */
        departmentOidProp: String,
        /* 部门的层级 */
        hierarchyProp: String,
        parentIdProp: String
    },
    data: function () {
        return {
            card:  '',           // ID 创建一个随机值
            token: '',
            user: '',
            vm: '',
            /* 所有的分公司和站 */
            departmentList: '',

            /* 本部门的总人数，在线人数，离线人数。*/
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
            /* 默认是站，0表示分公司。 */
            flag: 1,
            layer: 'STATION',
            /* 当前部门 */
            department: [],
            departmentOid:'',
            departmentName:'',
            departmentHierarchy:'',

            rootPath: '',

        }
    },
    mounted: function() {
        company.vm = this;
        /* 获取到token */
        company.vm.token = localStorage.getItem("token");
        company.vm.user = localStorage.getItem("user");

        /* 字符串转JSON */
        company.vm.user = JSON.parse(company.vm.user);

        company.vm.rootPath = company.vm.$options.methods.getRootPath();

        /* 获取其他页面写的js公共方法 */
        let fra = parent.$("iframe");
        for ( let i = 0; i < fra.length; i++) {
            if (fra[i].id == 'frm2d') {
                company.vm.otherJs = fra[i].contentWindow;
                company.vm.jasMapApi = fra[i].contentWindow.jasMapApi;
                company.vm.mapWindow = fra[i].contentWindow;
            }
        }

        if( company.vm.departmentOidProp != null && company.vm.departmentOidProp != ''
            && company.vm.hierarchyProp != null && company.vm.hierarchyProp != '' ) {
            company.vm.departmentOid = company.vm.departmentOidProp;
            company.vm.departmentHierarchy = company.vm.hierarchyProp;
        } else {

            /* 这里获取的应该是当前登录用户的部门 */
            company.vm.departmentOid = '5ab981e0-9598-11e1-b20e-e61f13e462af';
            company.vm.departmentHierarchy = 'Unit.0003';
            /*company.vm.departmentOid = company.vm.user.unitId;
            company.vm.departmentHierarchy = 'Unit.0003';*/
        }

        /* 设置导航栏。 */
        company.vm.$options.methods.getParentDeparement( company.vm.departmentOid, company.vm.parentIdProp );

        /* 创建之初，请求得到所有的公司。 */
        company.vm.$options.methods.getStationOrPerson(company.vm.departmentOid, company.vm.departmentHierarchy);

        /* 得到所有的人员数量 */
        company.vm.$options.methods.getAllPersonOnlineOrOff(company.vm.departmentOid, company.vm.departmentHierarchy);
        /* 获取本部门的所有父部门集合，用于展示导航栏。 */

        /* 接收广播，判断应该是刷新的是公司，站还是人员。 */
        company.vm.$root.eventHub.$on('clicktop', ( unitId, hierarchy, clickType ) => {
            /* 监听广播，如果不是自己的数据包，直接丢弃，如果是自己的广播，接收后，终止广播。 */
            if( clickType == 0 || clickType == 1 ) {
                company.vm.$options.methods.handleClickTop( unitId, hierarchy, clickType );
            }

        } )

    },

    methods: {
        /**
         * 处理首部点击事件
         */
        handleClickTop( unitId, hierarchy ) {
            console.log("分公司点击事件");
        },
        /**
         * 获取本部门总人数，在线人数和离线人数。
         */
        getAllPersonOnlineOrOff( unitId, hierarchy ) {
            /* 获取本部门的总人数，在线人数，离线人数。 */
            Vue.prototype.$http.post(company.vm.rootPath+'/realtimemonitor/realtimemonitor/getInspectorCountByUnitid.do?unitid='+unitId+'&token='+company.vm.token+'&hierarchy='+hierarchy)
                .then(function (response) {
                    if( response.data.data != null && response.data.data.length > 0 ) {
                        company.vm.totalCount = response.data.data[0].total;
                        company.vm.onlineCount = ( response.data.data[0].insonline + response.data.data[0].inspipeonline );
                        company.vm.offlineCount = ( response.data.data[0].insoffline + response.data.data[0].inspipeoffline );
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
        getParentDeparement( departmentOid ,parentId) {
            Vue.prototype.$http.post(company.vm.rootPath+'/realtimemonitor/realtimemonitor/getParentUnitList.do?unitId=' + departmentOid + '&token=' + company.vm.token + '&parentId='+parentId)
                .then(function (response) {
                    /* 设置列表部门。 */
                    company.vm.parentList = response.data.data;
                    /* 设置当前部门 */
                    company.vm.department =  company.vm.parentList[company.vm.parentList.length - 1];
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
         */
        getStationOrPerson( departmentOid, hierarchy ) {
            /* 清空地图上的所有标注。 */
            company.vm.$options.methods.clearAllLayer();
            /* 如果是站，子组件就要通知父组件更换内容组件。 */
            if( company.vm.departmentList != '' && hierarchy.split(".").length-1 > 2 ) {
                this.$emit( "childupdatepersonevent", departmentOid, hierarchy,'','' );
            }else {
                /* 设置导航栏。 */
                company.vm.$options.methods.getParentDeparement( departmentOid, company.vm.parentIdProp );

                /* 得到所有的人员数量 Unit.0003 */
                company.vm.$options.methods.getAllPersonOnlineOrOff(departmentOid, hierarchy );

                /* 获取部门下的所有部门或者人员。 */
                Vue.prototype.$http.post(company.vm.rootPath+'/realtimemonitor/realtimemonitor/getPartrolUnitByParentid.do?unitid='+departmentOid+'&token='+company.vm.token)
                    .then(function (response) {

                        /* 设置当前部门 */
                        company.vm.departmentOid = departmentOid;
                        company.vm.departmentHierarchy = hierarchy;
                        /* 设置列表部门。 */
                        company.vm.departmentList = response.data.data;

                        /* 分公司为零，场站为1。*/
                        if( company.vm.departmentList != null && company.vm.departmentList.length > 0 ) {
                            /* 分公司 */
                            if( company.vm.departmentList[0].hierarchy.split(".").length-1 == 2 ) {
                                company.vm.flag = 0;
                                company.vm.layer = 'COMPANY';
                            } else {
                                company.vm.flag = 1;
                                company.vm.layer = 'STATION';
                            }
                        }

                        /* 定位所有的场站和公司。 */
                        company.vm.$options.methods.positionDepartment();

                    })
                    .catch(function (error) {
                        // handle error
                        console.log(error);
                    })
                    .then(function () {
                        // always executed
                    });
            }

        },
        /**
         * 获取巡检实时统计
         */
        getRealtimeStatistics(unitId,unitName){
        	company.vm.otherJs.showDialog2('realtimestatistics',unitName+'巡检实时统计', '../../realtimemonitor/realtimemonitor/realtimestatistics.html?unitid='+unitId, 1100, 600, false, '');
        },

        /**
         * 获取覆盖率统计
         */
        getStationfstatistics( unitId,unitName ) {
            company.vm.otherJs.showDialog2('stationfstatistic',unitName+'巡检覆盖率统计', '../../realtimemonitor/realtimemonitor/stationfstatistic.html?unitid='+unitId, 1100, 600, false, '');
        },

        /**
         * 获取部门一周成绩
         * @param unitId
         * @param unitName
         * @returns
         */
        getStationWeekScore(unitId, unitName){
            company.vm.otherJs.showDialog2('stationscore',unitName+'周成绩', '../../realtimemonitor/realtimemonitor/stationscorestatistics.html?unitid='+unitId+'&type=station', 700, 400, false, '');
        },

        /**
         * 部门每日工作统计
         * @param unitId
         * @param unitName
         * @returns
         */
        getUnitDayWork(unitId, unitName){
            company.vm.otherJs.showDialog2('unitdaywork',unitName+'工作统计', '../../realtimemonitor/realtimemonitor/unitdaywork.html?unitid='+unitId, 1100, 600, false, '');
        },

        /**
         * 定位所有场站或者公司 getDepartmentInfo
         */
        positionDepartment() {
            /* 先清理所有地图上已经展示的图层。 */
            company.vm.$options.methods.clearAllLayer();

            for( let i = 0 ; i < company.vm.departmentList.length ; i++ ) {
                let array = [];
                let position = {};
                position.lon = company.vm.departmentList[i].lon;
                position.lat = company.vm.departmentList[i].lat;
                position.oid = company.vm.departmentList[i].oid;
                position.unitName = company.vm.departmentList[i].unitName;
                array.push(position);

                let option = {};

                if( company.vm.flag == 0 ){
                    option.url = "images/subdeptonmap.png";
                    option.layerId = "COMPANY";
                }else{
                    option.url = "images/stationonmap.png";
                    option.layerId = "STATION";
                }
                option.width = 30;
                option.height = 45;
                option.attributes = {"oid": position.oid,"lon": position.lon, "lat":position.lat, "unitName":position.unitName};

                company.vm.mapWindow.doPosition( array, JSON.stringify(option) );

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

                options.xOffset= -35;
                options.yOffset= -45;
                options.center= false;
                options.layerId= "COMPANY_TEXT";
                company.vm.jasMapApi.addTextGraphic(company.vm.departmentList[i].lon, company.vm.departmentList[i].lat, company.vm.departmentList[i].unitName, options);



                var weatherFlag = company.vm.departmentList[i].ext_field1;
                var weatherUrl = '';
                if (weatherFlag == "00"){
                    weatherUrl = '';
                }else if (weatherFlag == "01"){
                    weatherUrl = 'images/sun.png';
                }else if (weatherFlag == "02"){
                    weatherUrl = 'images/overcast.png';
                }else if (weatherFlag == "03"){
                    weatherUrl = 'images/rain.png';
                }else if (weatherFlag == "04"){
                    weatherUrl = 'images/snow.png';
                }

                let optionsWeather = {
                    url:weatherUrl,//图标地址
                    width:24,//图标大小
                    height:24,
                    xoffset:25,
                    yoffset:25,
                    //attributes:{"OBJECTID":data[i].pointid, "LINELOOPPOINTNAME":data[i].lineloopoidname+': '+data[i].pointidname,"type": data[i].keypointtype},//图标属性
                    attributes:{"oid": position.oid,"lon": position.lon, "lat":position.lat, "unitName":position.unitName},
                    layerId:"WEATHER"
                };
                company.vm.jasMapApi.addPictureGraphic(company.vm.departmentList[i].lon, company.vm.departmentList[i].lat,optionsWeather);
            }

            if( company.vm.flag == 0 ) {
                //添加点击事件
                company.vm.jasMapApi.addLayerClickEventListener( "COMPANY" ,function(e){
                    company.vm.$options.methods.getDepartmentInfo( e.graphic.attributes.oid, e.graphic.attributes.unitName, e.graphic.attributes.lon, e.graphic.attributes.lat );
                });
            }else {
                //添加点击事件
                company.vm.jasMapApi.addLayerClickEventListener( "STATION" ,function(e){
                    company.vm.$options.methods.getDepartmentInfo( e.graphic.attributes.oid, e.graphic.attributes.unitName, e.graphic.attributes.lon, e.graphic.attributes.lat );
                });
            }

            //天气详情展示
            company.vm.jasMapApi.addLayerClickEventListener( "WEATHER" ,function(e){
                company.vm.$options.methods.getWeatherInfo( e.graphic.attributes.oid, e.graphic.attributes.unitName, e.graphic.attributes.lon, e.graphic.attributes.lat );
            });


            /* 展示完毕后，将已经加载的图层加入到 allLayer 中 */
            company.vm.allLayer.push(company.vm.layer);
            company.vm.allLayer.push("COMPANY_TEXT");
            company.vm.allLayer.push("WEATHER");

        },
        /**
         * 分公司、站定位
         * @returns
         */
        locateUnit(unitoid, lon, lat, name){

            if(unitoid=='undefined'){
                return;
            }
            if(lon=='null' || lat=='null'){
                $.messager.alert("提示", name+'没有定位坐标！', 'info');
                return;
            }
            let scale;
            if(company.vm.layer == "COMPANY"){
                scale = 10000000;
            }else if(company.vm.layer == "STATION"){
                scale = 200000;
            }
            let options = {
                "repeatCount":3,
                "delay":500,    // ms
                "fieldName":"oid",
                "center":true,
                "scale":scale,
                "expand":1.5,
                "effect":"shine",   //  flash or shine
                "shineCurve":function(v){
                    return 0.001 * v * v * v * v;
                }
            };
            company.vm.jasMapApi.flashGraphic(unitoid, company.vm.layer, options);
        },

        /**
         * 清理掉地图上所有的图层
         */
        clearAllLayer() {
            for( let i = 0 ; i < company.vm.allLayer.length ; i++ ) {
                company.vm.jasMapApi.clearGraphicsLayer( company.vm.allLayer[i] );
            }
            company.vm.allLayer = [];

        },

        /**
         * 根据部门层级编码、当前时间，获取当前部门及子孙部门巡检任务中的关键点
         * @param unitid 部门ID
         * @param hierarchy 层级编码
         * @returns
         */
        getInsKeyPointByUnitHierarchy(unitid, hierarchy){

            /* 获取部门下的所有部门或者人员。 */
            Vue.prototype.$http.post(company.vm.rootPath+'/realtimemonitor/realtimemonitor/getInsKeyPointByUnitHierarchy.do?unitid='+unitid+'&token='+company.vm.token+'&hierarchy='+hierarchy)
                .then(function (response) {
                    let data = response.data.data;

                    //清除上一次添加的关键点图层
                    company.vm.jasMapApi.clearGraphicsLayer("KEYPOINT");

                    if(data && data.length > 0){
                        //添加关键点图层
                        let options = {
                            "id":"KEYPOINT",
                            "type":"graphic"
                        };
                        company.vm.jasMapApi.addLayer(options);

                        if(data.length < 3){
                            company.vm.jasMapApi.centerAt(data[0].lon,data[0].lat);
                        }else{
                            company.vm.jasMapApi.centerAt(data[Math.floor(data.length/2)].lon,data[Math.floor(data.length/2)].lat);
                        }

                        for(let i=0; i<data.length; i++){
                            let img = "";
                            if(data[i].keypointtype == 1){//常规关键点
                                if(data[i].pointstatus == 0){
                                    img = "images/keypoint_flag_red.png";
                                }else if(data[i].pointstatus == 1){
                                    img = "images/keypoint_flag_green.png";
                                }
                            }else if(data[i].keypointtype == 2){//临时关键点
                                if(data[i].pointstatus == 0){
                                    img = "images/temp-key-point-1.png";
                                }else if(data[i].pointstatus == 1){
                                    img = "images/temp-key-point-2.png";
                                }
                            }

                            options = {
                                url:img,//图标地址
                                width:24,//图标大小
                                height:24,
                                attributes:{"OBJECTID":data[i].pointid, "LINELOOPPOINTNAME":data[i].lineloopoidname+': '+data[i].pointidname,"type": data[i].keypointtype},//图标属性
                                layerId:"KEYPOINT"
                            };
                            company.vm.jasMapApi.addPictureGraphic(data[i].lon, data[i].lat, options);

                            /* 添加点击事件 */
                            company.vm.jasMapApi.addLayerClickEventListener("KEYPOINT",function(e){
                            	var attributes = e.graphic.attributes;
                            	var oid = attributes.OBJECTID;
                            	var type = attributes.type;
                            	if(type == 1){
                            		company.vm.otherJs.showDialog2('viewGpsKeypoint','关键点详细', '../../realtimemonitor/realtimemonitor/gpskeypoint.html?oid='+oid, 800, 600, false, '');
                            		// queryTop(oid,"GPS_KEYPOINT","../../linePatrolManage/pathLine/keypoint/view_gps_keypoint.html?oid=","viewGpsKeypoint","详细");
                            	}else if(type == 2){
                            		company.vm.otherJs.showDialog2('viewGpsTemporaryKeypoint','关键点详细', '../../realtimemonitor/realtimemonitor/gpstemporarykeypoint.html?oid='+oid, 800, 600, false, '');
                            		//queryTop(oid,"gps_temporary_keypoint","../../linePatrolManage/insTask/temporaryKeypoint/view_gps_temporary_keypoint.html?oid=","viewGpsTemporaryKeypoint","详细");
                            	}
                            });
                        }

                        /* 放大地图比例尺 */
                        company.vm.jasMapApi.setLevel(12);
                        /* 定位到第一个 */
                        company.vm.jasMapApi.centerAt( data[0].lon, data[0].lat );
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
         * 获取人员列表
         * @param online 在线 1， 离线 0 ，不区分不传值
         * @param hierarchy 当前部门层级
         */
        getEmployeeByUnitId( departmentOid, hierarchy, online, inspectorType ){

            /* 先清理所有地图上已经展示的图层。 */
            company.vm.$options.methods.clearAllLayer();

            /* 切换到人员列表页面 */
            this.$emit( "childupdatepersonevent", departmentOid, hierarchy, online, inspectorType );

        },

        /**
         * 获取部门信息。
         */
        getDepartmentInfo( unitId, unitName, lon, lat ) {
            Vue.prototype.$http.post(company.vm.rootPath+'/realtimemonitor/realtimemonitor/getUnitInfo.do?unitid=' + unitId + '&token=' + company.vm.token)
                .then(function (response) {
                    var result = response.data.data[0];
                    var content = "<div class=\"columns is-gapless is-multiline is-mobile department-detail-info\">";
                    content += "<div class=\"column  is-two-fifths\">";
                    content += "部门名称：";
                    content += "</div>";
                    content += "<div class=\"column is-left  is-three-fifths\">";
                    content += result.unitname;
                    content += "</div>";

                    content += "<div class=\"column  is-two-fifths\">";
                    content += "管理长度：";
                    content += "</div>";
                    content += "<div class=\"column  is-three-fifths\">";
                    if( result.sublength == null )
                        content += "0Km";
                    else
                        content += result.sublength+"Km";
                    content += "</div>";

                    content += "<div class=\"column  is-two-fifths\">";
                    content += "部门地址：";
                    content += "</div>";
                    content += "<div class=\"column  is-three-fifths\">";
                    if( result.address != null ) {
                        content += result.address;
                    } else {
                        content += "暂无";
                    }
                    content += "</div>";

                   /* content += "<div class=\"column  is-one-quarter\">";
                    content += "所辖管线：";
                    content += "</div>";
                    content += "<div class=\"column  is-three-quarters\">";
                    content += result.lineloopname;
                    content += "</div>";*/

                    content += "<div class=\"column  is-two-fifths\">";
                    content += "部门巡检负责人：";
                    content += "</div>";
                    content += "<div class=\"column  is-three-fifths\">";
                    if( result.username != null ) {
                        if( result.phone != null ) {
                            content += result.username+"  "+ result.phone;
                        } else {
                            content += result.username;
                        }

                    } else {
                        content += "暂无";
                    }

                    content += "</div>";


                    content += "</div>";


                    var content1 = "<table class=\'detail-table\'>";
                    content1 += "<tr>";
                    content1 += "<th width='50%'><span>部门名称</span></th>";
                    content1 += "<td width='50%'><span>";
                    content1 += result.unitname;
                    content1 += "</span></td>";
                    content1 += "</tr>";

                    content1 += "<tr>";
                    content1 += "<th width='50%'><span>管理长度</span></th>";
                    content1 += "<td width='50%'><span>";
                    if (result.sublength == null) content1 += "0Km";else content1 += result.sublength + "Km";
                    content1 += "</span></td>";
                    content1 += "</tr>";

                    content1 += "<tr>";
                    content1 += "<th width='50%'><span>部门地址</span></th>";
                    content1 += "<td width='50%'><span>";
                    if (result.address != null) {
                        content1 += result.address;
                    } else {
                        content1 += "暂无";
                    }
                    content1 += "</span></td>";
                    content1 += "</tr>";

                    content1 += "<tr>";
                    content1 += "<th width='50%'><span>部门巡检负责人</span></th>";
                    content1 += "<td width='50%'><span>";
                    if (result.username != null) {
                        content1 += result.username;
                    } else {
                        content1 += "暂无";
                    }

                    content1 += "</span></td>";
                    content1 += "</tr>";


                    content1 += "<tr>";
                    content1 += "<th width='50%'><span>巡检负责人电话</span></th>";
                    content1 += "<td width='50%'><span>";
                    if (result.phone != null) {
                        content1 += result.phone;
                    } else {
                        content1 += "暂无";
                    }

                    content1 += "</span></td>";
                    content1 += "</tr>";

                    content1 += "</table>";

                    var options = {
                        width:400,
                        height:260
                    };
                    jasMapApi.showInfoWindow(lon, lat, unitName+'详情', content1, options);
                    jasMapApi.centerAt(lon, lat);

                    /* 被移动的对象 */
                    var target = "";
                    /* 获取到所有的标注的内容。 */
                    var targetList = document.getElementsByClassName('esriPopupWrapper');
                    /* 获取到这些标注集合中的，刚刚我添加的标注。 */
                    for (var i = 0; i < targetList.length; i++) {
                        /* 如果标注中的表头的内容和我查询的部门名称相同，就表明是我需要的对象。 */
                        if (document.getElementsByClassName('esriPopupWrapper')[i].firstElementChild.innerText == unitName + '详情') {
                            target = document.getElementsByClassName('esriPopupWrapper')[i];
                            document.getElementsByClassName('esriPopupWrapper')[i].style.opacity = "0.8";
                            break;
                        }
                    }
                    /* 如果查询出来的target还是""，说明出问题了 */
                    if(target == "" ) {
                        return;
                    }
                    /* 给目标赋予点击事件 */
                    target.firstElementChild.onmousedown = function() {
                        company.vm.$options.methods.move( document.getElementsByTagName("body")[0], target, false );
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
         * 获取天气信息
         */
        getWeatherInfo( unitId, unitName, lon, lat ) {
            Vue.prototype.$http.post(company.vm.rootPath+'/meteorologicalinformation/getThroughCountiesByUnitId.do?unitId=' + unitId + '&token=' + company.vm.token)
                .then(function (response) {
                    var result = response.data.data;
                    var content1 = "<table class=\'detail-table\'>";
                    content1 += "<tr>";
                    content1 += "<th width='20%'>县市</th>";
                    content1 += "<th width='20%'>气温</th>";
                    content1 += "<th width='20%'>天气</th>";
                    content1 += "<th width='40%'>小时降水量</th>";
                    content1 += "</tr>";

                    if (result.length >0 ){
                        for (let i = 0; i < result.length ; i++) {
                            content1 += "<tr>";
                            content1 += "<td width='20%'>";
                            content1 += result[i].siteCity==undefined?"--":result[i].siteCity;
                            content1 += "</td>";
                            content1 += "<td width='20%'>";
                            content1 += result[i].temperatureSituation==undefined?"--":result[i].temperatureSituation;
                            content1 += "</td>";
                            content1 += "<td width='20%'>";
                            content1 += result[i].weatherCondition==undefined?"--":result[i].weatherCondition.replace("今天","").replace("晚上","");
                            content1 += "</td>";
                            content1 += "<td width='40%'>";
                            content1 += "<a onclick=\"getPrecipitationDetails('"+ unitId +"','"+ unitName+"','"+ lon+"','"+lat+"','"+result[i].topsixIdcards+"')\">详情</a>";
                            content1 += "</td>";
                            content1 += "</tr>";
                        }
                    }
                    var options = {
                        width: 400,
                        height: 245
                    };
                    jasMapApi.showInfoWindow(lon, lat, unitName+'气象信息', content1, options);
                    jasMapApi.centerAt(lon, lat);

                    /* 被移动的对象 */
                    var target = "";
                    /* 获取到所有的标注的内容。 */
                    var targetList = document.getElementsByClassName('esriPopupWrapper');
                    /* 获取到这些标注集合中的，刚刚我添加的标注。 */
                    for (var i = 0; i < targetList.length; i++) {
                        /* 如果标注中的表头的内容和我查询的部门名称相同，就表明是我需要的对象。 */
                        if (document.getElementsByClassName('esriPopupWrapper')[i].firstElementChild.innerText == unitName + '气象信息') {
                            target = document.getElementsByClassName('esriPopupWrapper')[i];
                            document.getElementsByClassName('esriPopupWrapper')[i].style.opacity = "0.8";
                            break;
                        }
                    }



                    /* 如果查询出来的target还是""，说明出问题了 */
                    if(target == "" ) {
                        return;
                    }

                    /* 给目标赋予点击事件 */
                    target.firstElementChild.onmousedown = function() {
                        company.vm.$options.methods.move( document.getElementsByTagName("body")[0], target, false );
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
         *  使用弹框可以移动
         *  @param region 在某个范围内移动
         *  @param target 被移动的对象
         */
        move( region, target, status ) {
            /* 点击移动头部时候的坐标X,Y */
            let initX = '';
            let initY = '';
            /* 鼠标释放之后的X，Y 坐标 */
            let nextX = '';
            let nextY = '';

            /* 记录弹框被按下之前的位置。 */
            let originalX = target.offsetLeft;       // 获取对应父容器的上边距
            let originalY = target.offsetTop;       // 获取对应父容器的左边距

            console.log('originalX='+originalX+'----originalY='+originalY);
            region.onmousemove = function( event ) {
                nextX = event.clientX;
                nextY = event.clientY;

                if( status ) {
                    console.log('pppppporiginalX='+originalX+'----originalY='+originalY);
                    /* 移动的距离 */
                    let distanceX = nextX - initX ;
                    let distanceY = nextY - initY ;
                    /* 如果移动的距离大于最大距离，则移动距离就是最大距离。*/

                    /* 设置移动时，弹出框的坐标位置。*/
                    target.style.left = (originalX + distanceX )+'px';
                    target.style.top =  (originalY + distanceY ) + 'px';

                }
            }

            /* 鼠标按下的头部的时候才可以拖动。*/
            target.firstElementChild.onmousedown = function( e1 ) {
                initX = e1.clientX;
                initY = e1.clientY;
                status = true;
            }

            /* 鼠标松开  */
            // target.firstElementChild.onmouseup = function( e2 ) {
            target.firstElementChild.onmouseup = function( e2 ) {
                if( status == true ) {
                    status = false;
                    originalX = originalX + nextX - initX ;
                    originalY = originalY + nextY - initY;
                }

            }

        },
        noAuthority() {
            Vue.prototype.$notify.warning({content: "暂无此权限"});
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
                        <a v-on:click = "getStationOrPerson( parent.oid, parent.hierarchy, parent.unitName )" v-bind:title="parent.unitName" href="#">{{ parent.unitName.length > 16?parent.unitName.slice(0,5)+'...':parent.unitName }}</a>
                    </li>
                  </ul>
                </nav>
                
                <!-- 如果导航栏抵达的部门层级比当前登录用户的部门层级大，就不允许点击。 -->
                <nav class="level person" v-if = "(departmentHierarchy && user.ext_field3) && departmentHierarchy.split('\.').length < user.ext_field3.split('\.').length">
                  <div class="level-item" v-on:click = "noAuthority()">
                    <div class = 'ins-img'>
                        <img src="../map_viewer/images/allIns.png"> 
                    </div>
                    <div class = 'ins-count'>
                        <p class="heading">全部</p>
                        <p class = "count">{{ totalCount }}</p>
                    </div>
                  </div>
                  
                  <div class="level-item" v-on:click = "noAuthority()">
                    <div class = 'ins-img'>
                        <img src="../map_viewer/images/allonIns.png"> 
                    </div>
                    <div class = 'ins-count'>
                      <p class="heading">在线</p>
                      <p class = 'count'>{{ onlineCount }}</p>
                    </div>
                  </div>
                  <div class="level-item last" v-on:click = "noAuthority()">
                    <div class = 'ins-img'>
                        <img src="../map_viewer/images/alloffIns.png"> 
                    </div>
                    <div class = 'ins-count'>
                      <p class="heading">离线</p>
                      <p class = 'count'>{{ offlineCount }}</p>
                    </div>
                  </div>
                </nav>
                
                <nav class="level person" v-else>
                  <div class="level-item" v-on:click = "getEmployeeByUnitId( departmentOid, departmentHierarchy, '', '' )">
                    <div class = 'ins-img'>
                        <img src="../map_viewer/images/allIns.png"> 
                    </div>
                    <div class = 'ins-count'>
                        <p class="heading">全部</p>
                        <p class = "count">{{ totalCount }}</p>
                    </div>
                  </div>
                  
                  <div class="level-item" v-on:click = "getEmployeeByUnitId( departmentOid,departmentHierarchy, '1','')">
                    <div class = 'ins-img'>
                        <img src="../map_viewer/images/allonIns.png"> 
                    </div>
                    <div class = 'ins-count'>
                      <p class="heading">在线</p>
                      <p class = 'count'>{{ onlineCount }}</p>
                    </div>
                  </div>
                  <div class="level-item last" v-on:click = "getEmployeeByUnitId( departmentOid,departmentHierarchy, '0','')">
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
                
                <!-- 分公司详细 -->
                <section class = "all-company">
                   
                    <section name="detail" v-for="department in departmentList" v-bind:key ="department.oid" >
                        <nav class="level">
                          <!-- Left side -->
                          <div class="level-left">
                            <div class="level-item count-detail-img" >
                              <img v-if = "flag == 0" src="../map_viewer/images/subdept.png">
                              <img v-if = "flag == 1" src="../map_viewer/images/station.png">
                            </div>
                          </div>
                        
                          
                          <!-- Right side -->
                          <div class="level-right">
                          <div class = "count-detail">
                            <!-- 层级相同，但是ID不同，就不允许点击。 -->
                            <div v-if = "user.ext_field3.split('\.').length == department.hierarchy.split('\.').length && user.ext_field2 != department.oid" class = "level-item has-text-left heading disable"> <a v-on:click = "noAuthority()" >{{ department.unitName }}</a></div>
                            <div v-else class = "level-item has-text-left heading"> <a v-on:click = "getStationOrPerson( department.oid, department.hierarchy, department.unitName )" >{{ department.unitName }}</a></div>
                                <div class="level-item group" v-if = "user.ext_field3.split('.').length == department.hierarchy.split('.').length && user.ext_field2 != department.oid">
                                    <div class = "group-person">
                                        <div class = "per" v-on:click = "noAuthority()">
                                            <img title = "管道工总人数"  src="../map_viewer/images/inspipeall.png" >
                                            <span>{{ (department.inspipeonline == null?0:department.inspipeonline) + (department.inspipeoffline==null?0:department.inspipeoffline) }}</span>
                                        </div>
                                        <div v-on:click = "noAuthority()">
                                            <img title = "巡线工总人数" src="../map_viewer/images/insall.png">
                                            <span> {{ (department.insonline == null?0:department.insonline) + (department.insoffline == null?0:department.insoffline) }} </span>
                                        </div>
                                    </div>
                                    <div class = "group-person">
                                        <div class = "per" v-on:click = "noAuthority()">
                                             <img title = "管道工在线人数" src="../map_viewer/images/inspipeonline.png">
                                             <span>{{ (department.inspipeonline == null?0:department.inspipeonline) }}</span>
                                        </div>
                                        <div class="level-item" v-on:click = "noAuthority()">
                                              <img title = "巡线工在线人数" src="../map_viewer/images/insonline.png">
                                              <span> {{ department.insonline == null?0:department.insonline }} </span>
                                        </div>
                                    </div>
                                    
                                    <div class = "group-person">
                                        <div class = "per" v-on:click = "noAuthority()">
                                            <img title = "管道工离线人数" src="../map_viewer/images/inspipeoffline.png">
                                            <span> {{ department.inspipeoffline==null?0:department.inspipeoffline }} </span>
                                        </div>
                                        <div v-on:click = "noAuthority()">
                                             <img title = "巡线工离线人数" src="../map_viewer/images/insoffline.png">
                                             <span> {{ department.insoffline == null?0:department.insoffline }} </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="level-item group" v-else >
                                    <div class = "group-person">
                                        <div class = "per" v-on:click = "getEmployeeByUnitId( department.oid, department.hierarchy, '','02')">
                                            <img title = "管道工总人数"  src="../map_viewer/images/inspipeall.png" >
                                            <span>{{ (department.inspipeonline == null?0:department.inspipeonline) + (department.inspipeoffline==null?0:department.inspipeoffline) }}</span>
                                        </div>
                                        <div v-on:click = "getEmployeeByUnitId( department.oid,department.hierarchy, '','01')">
                                            <img title = "巡线工总人数" src="../map_viewer/images/insall.png">
                                            <span> {{ (department.insonline == null?0:department.insonline) + (department.insoffline == null?0:department.insoffline) }} </span>
                                        </div>
                                    </div>
                                    <div class = "group-person">
                                        <div class = "per" v-on:click = "getEmployeeByUnitId( department.oid,department.hierarchy, '1','02')">
                                             <img title = "管道工在线人数" src="../map_viewer/images/inspipeonline.png">
                                             <span>{{ (department.inspipeonline == null?0:department.inspipeonline) }}</span>
                                        </div>
                                        <div class="level-item" v-on:click = "getEmployeeByUnitId( department.oid,department.hierarchy, '1','01')">
                                              <img title = "巡线工在线人数" src="../map_viewer/images/insonline.png">
                                              <span> {{ department.insonline == null?0:department.insonline }} </span>
                                        </div>
                                    </div>
                                    
                                    <div class = "group-person">
                                        <div class = "per" v-on:click = "getEmployeeByUnitId( department.oid,department.hierarchy, '0','02')">
                                            <img title = "管道工离线人数" src="../map_viewer/images/inspipeoffline.png">
                                            <span> {{ department.inspipeoffline==null?0:department.inspipeoffline }} </span>
                                        </div>
                                        <div v-on:click = "getEmployeeByUnitId( department.oid,department.hierarchy, '0','01')">
                                             <img title = "巡线工离线人数" src="../map_viewer/images/insoffline.png">
                                             <span> {{ department.insoffline == null?0:department.insoffline }} </span>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                            
                          </div>
                        </nav>
                        
                        <nav class="level company">
                          <!-- Left side -->
                          <div class="level-left">
                          </div>
                          <!-- Right side -->
                          <div class="level-right">
                          	<p class="level-item" v-if = "department.hierarchy.split('.').length >= 4"><img v-on:click = "getRealtimeStatistics( department.oid, department.unitName )" title="实时统计" src="../map_viewer/images/realtimestatistics.png"></p>
                            <p class="level-item"><img v-on:click = "getStationfstatistics( department.oid, department.unitName )" title="覆盖率统计" src="../map_viewer/images/stationfstatistics.png"></p>
                            <p class="level-item"><img v-on:click = "getStationWeekScore( department.oid, department.unitName )" title="周成绩统计" src="../map_viewer/images/stationscore.png"></p>
                            <p class="level-item"><img v-on:click = "getUnitDayWork( department.oid, department.unitName )" title="工作统计" src="../map_viewer/images/daywork.png"></p>
                            <p class="level-item"><img v-on:click = "getDepartmentInfo( department.oid, department.unitName, department.lon, department.lat )" title="部门详细" src="../map_viewer/images/stationinfo.png"></p>
                            <p class="level-item"><img v-on:click = "locateUnit( department.oid, department.lon, department.lat, department.unitName )" title="定位" src="../map_viewer/images/locate.png"></p>
                            <p class="level-item"><img v-on:click = "getInsKeyPointByUnitHierarchy( department.oid, department.hierarchy )" title="关键点" src="../map_viewer/images/keypoint.png"></p>
                          </div>
                          </nav>
                    </section>
                    
                </section>
               </section>
			`

})

