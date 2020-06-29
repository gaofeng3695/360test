"use strict";

/**
 * 预警列表
 */
var protectcompany = Vue.component('protectcompany', {
    props: {
        /* 查询的是那个部门 */
        departmentOidProp: String,

        /* 部门的层级 */
        hierarchyProp: String,
        riskratingProp: String,
        parentIdProp: String
    },
    data: function data() {
        return {
            card: '',
            // ID 创建一个随机值
            token: '',
            vm: '',

            /* 所有的分公司和站 */
            departmentList: '',

            /* 第三方施工总数，红色，黄色，蓝色。*/
            constructTotal: 0,
            constructRCount: 0,
            constructYCount: 0,
            constructBCount: 0,

            /*  巡检事件  */
            gpsEventCount: 0,

            /* 本部门所有的父级。 */
            parentList: [{
                "oid": 1,
                "hierarchy": 0,
                "unitName": "-"
            }],
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
            departmentOid: '',
            departmentName: '',
            departmentHierarchy: '',
            user: '',
            rootPath: ''
        };
    },
    mounted: function mounted() {
        protectcompany.vm = this;
        /* 获取到token */

        protectcompany.vm.token = localStorage.getItem("token");
        protectcompany.vm.user = localStorage.getItem("user");
        protectcompany.vm.rootPath = protectcompany.vm.$options.methods.getRootPath();
        /* 字符串转JSON */

        protectcompany.vm.user = JSON.parse(protectcompany.vm.user);
        /* 获取其他页面写的js公共方法 */

        var fra = parent.$("iframe");

        for (var i = 0; i < fra.length; i++) {
            if (fra[i].id == 'frm2d') {
                protectcompany.vm.otherJs = fra[i].contentWindow;
                protectcompany.vm.jasMapApi = fra[i].contentWindow.jasMapApi;
                protectcompany.vm.mapWindow = fra[i].contentWindow;
            }
        }

        if (protectcompany.vm.departmentOidProp != null && protectcompany.vm.departmentOidProp != '' && protectcompany.vm.hierarchyProp != null && protectcompany.vm.hierarchyProp != '') {
            protectcompany.vm.departmentOid = protectcompany.vm.departmentOidProp;
            protectcompany.vm.departmentHierarchy = protectcompany.vm.hierarchyProp;
        } else {
            protectcompany.vm.departmentOid = '5ab981e0-9598-11e1-b20e-e61f13e462af';
            protectcompany.vm.departmentHierarchy = 'Unit.0003';
        }
        /* 设置导航栏。 */


        protectcompany.vm.$options.methods.getParentDeparement(protectcompany.vm.departmentOid, protectcompany.vm.parentIdProp);
        /* 创建之初，请求得到所有的公司。 */

        protectcompany.vm.$options.methods.getStationOrPerson(protectcompany.vm.departmentOid, protectcompany.vm.departmentHierarchy);
        /* 获取第三方施工等级对应数量*/

        protectcompany.vm.$options.methods.getConstructionStatistics(protectcompany.vm.departmentHierarchy);
        protectcompany.vm.$options.methods.getEventStatistics(protectcompany.vm.departmentHierarchy);
        /* 接收广播，判断应该是刷新的是公司，站还是人员。 */

        protectcompany.vm.$root.eventHub.$on('clicktop', function (unitId, hierarchy, clickType) {
            /* 监听广播，如果不是自己的数据包，直接丢弃，如果是自己的广播，接收后，终止广播。 */
            if (clickType == 0 || clickType == 1) {
                protectcompany.vm.$options.methods.handleClickTop(unitId, hierarchy, clickType);
            }
        });
    },
    methods: {
        /**
         * 处理首部点击事件
         */
        handleClickTop: function handleClickTop(unitId, hierarchy) {
            console.log("分公司点击事件");
        },

        /**
         * 获取到父部门数据
         * @param departmentOid
         */
        getParentDeparement: function getParentDeparement(departmentOid, parentId) {
            Vue.prototype.$http.post(protectcompany.vm.rootPath + '/realtimemonitor/realtimemonitor/getParentUnitList.do?unitId=' + departmentOid + '&token=' + protectcompany.vm.token + '&parentId=' + parentId).then(function (response) {
                /* 设置列表部门。 */
                protectcompany.vm.parentList = response.data.data;
                /* 设置当前部门 */

                protectcompany.vm.department = protectcompany.vm.parentList[protectcompany.vm.parentList.length - 1];
            }).catch(function (error) {
                // handle error
                console.log(error);
            }).then(function () {// always executed
            });
        },

        /**
         * 点击部门名称获取站
         * @param departmentOid 分公司的OID或者站的OID
         */
        getStationOrPerson: function getStationOrPerson(departmentOid, hierarchy) {
            /* 更新数量 */
            protectcompany.vm.$options.methods.getConstructionStatistics(hierarchy);
            protectcompany.vm.$options.methods.getEventStatistics(hierarchy);
            /* 清空地图上的所有标注。 */

            protectcompany.vm.$options.methods.clearAllLayer();
            /* 如果是站，子组件就要通知父组件更换内容组件。 */

            if (protectcompany.vm.departmentList != '' && hierarchy.split(".").length - 1 > 2) {
                this.$emit("childupdateconsevent", departmentOid, hierarchy, '');
            } else {
                /* 设置导航栏。 */
                protectcompany.vm.$options.methods.getParentDeparement(departmentOid, protectcompany.vm.parentIdProp);
                /* 得到所有的人员数量 Unit.0003 */
                // protectcompany.vm.$options.methods.getAllPersonOnlineOrOff(departmentOid, hierarchy );

                /* 获取部门下的所有部门。 */

                Vue.prototype.$http.post(protectcompany.vm.rootPath + '/gpsConstructionStatistics/getPartrolUnitByParentid.do?unitid=' + departmentOid + '&token=' + protectcompany.vm.token).then(function (response) {
                    /* 设置当前部门 */
                    protectcompany.vm.departmentOid = departmentOid;
                    protectcompany.vm.departmentHierarchy = hierarchy;
                    /* 设置列表部门。 */

                    protectcompany.vm.departmentList = response.data.data;
                    /* 分公司为零，场站为1。*/

                    if (protectcompany.vm.departmentList != null && protectcompany.vm.departmentList.length > 0) {
                        /* 分公司 */
                        if (protectcompany.vm.departmentList[0].hierarchy.split(".").length - 1 == 2) {
                            protectcompany.vm.flag = 0;
                            protectcompany.vm.layer = 'COMPANY';
                        } else {
                            protectcompany.vm.flag = 1;
                            protectcompany.vm.layer = 'STATION';
                        }
                    }
                    /* 定位所有的场站和公司。 */


                    protectcompany.vm.$options.methods.positionDepartment();
                }).catch(function (error) {
                    // handle error
                    console.log(error);
                }).then(function () {// always executed
                });
            }
        },
        getConstructionStatistics: function getConstructionStatistics(departmentHierarchy) {
            Vue.prototype.$http.post(protectcompany.vm.rootPath + '/gpsConstructionStatistics/getConstructCount.do?departmentHierarchy=' + departmentHierarchy + '&token=' + protectcompany.vm.token).then(function (response) {
                /* 第三方施工各等级数量 */
                if (response.data != null && response.data.data != null) {
                    protectcompany.vm.constructTotal = response.data.data.total;
                    protectcompany.vm.constructRCount = response.data.data.red;
                    protectcompany.vm.constructYCount = response.data.data.yellow;
                    protectcompany.vm.constructBCount = response.data.data.blue;
                } else {
                    protectcompany.vm.constructTotal = 0;
                    protectcompany.vm.constructRCount = 0;
                    protectcompany.vm.constructYCount = 0;
                    protectcompany.vm.constructBCount = 0;
                }
            }).catch(function (error) {
                // handle error
                console.log(error);
            }).then(function () {});
        },
        getEventStatistics: function getEventStatistics(departmentHierarchy) {
            Vue.prototype.$http.post(protectcompany.vm.rootPath + '/gpseventstatistics/getEventCount.do?departmentHierarchy=' + departmentHierarchy + '&token=' + protectcompany.vm.token).then(function (response) {
                /* 第三方施工各等级数量 */
                if (response.data != null && response.data.data != null) {
                    protectcompany.vm.gpsEventCount = response.data.data.total;
                } else {
                    protectcompany.vm.gpsEventCount = 0;
                }
            }).catch(function (error) {
                // handle error
                console.log(error);
            }).then(function () {});
        },

        /**
         * 定位所有场站或者公司 getDepartmentInfo
         */
        positionDepartment: function positionDepartment() {
            /* 先清理所有地图上已经展示的图层。 */
            protectcompany.vm.$options.methods.clearAllLayer();

            for (var i = 0; i < protectcompany.vm.departmentList.length; i++) {
                var array = [];
                var position = {};
                position.lon = protectcompany.vm.departmentList[i].lon;
                position.lat = protectcompany.vm.departmentList[i].lat;
                position.oid = protectcompany.vm.departmentList[i].oid;
                position.unitName = protectcompany.vm.departmentList[i].unitName;
                array.push(position);
                var option = {};

                if (protectcompany.vm.flag == 0) {
                    option.url = "images/subdeptonmap.png";
                    option.layerId = "COMPANY";
                } else {
                    option.url = "images/stationonmap.png";
                    option.layerId = "STATION";
                }

                option.width = 30;
                option.height = 45;
                option.attributes = {
                    "oid": position.oid,
                    "lon": position.lon,
                    "lat": position.lat,
                    "unitName": position.unitName
                };
                protectcompany.vm.mapWindow.doPosition(array, JSON.stringify(option));
                var options = {};
                options.fontSize = 12;
                options.fontFamily = "微软雅黑";
                /*options.haloColor = [0,0,0, 130];
                options.haloSize= 6;*/
                // options.color= [255,255,255,255];

                options.color = [41, 52, 94, 255];
                options.background = [0, 0, 0, 130];
                options.angle = 0; //options.border="1px solid #d3d3d3";

                options.haloColor = [255, 255, 255, 130];
                options.haloSize = 1;
                options.backgroundColor = [0, 0, 0, 130];
                options.fontWeight = "bold";
                options.angle = 0;
                options.xOffset = -40;
                options.yOffset = -45;
                options.center = false;
                options.layerId = "COMPANY_TEXT";
                protectcompany.vm.jasMapApi.addTextGraphic(protectcompany.vm.departmentList[i].lon, protectcompany.vm.departmentList[i].lat, protectcompany.vm.departmentList[i].unitName, options);
                var weatherFlag = protectcompany.vm.departmentList[i].ext_field1;
                var weatherUrl = '';

                if (weatherFlag == "00") {
                    weatherUrl = '';
                } else if (weatherFlag == "01") {
                    weatherUrl = 'images/sun.png';
                } else if (weatherFlag == "02") {
                    weatherUrl = 'images/overcast.png';
                } else if (weatherFlag == "03") {
                    weatherUrl = 'images/rain.png';
                } else if (weatherFlag == "04") {
                    weatherUrl = 'images/snow.png';
                }

                var optionsWeather = {
                    url: weatherUrl,
                    //图标地址
                    width: 24,
                    //图标大小
                    height: 24,
                    xoffset: 25,
                    yoffset: 25,
                    //attributes:{"OBJECTID":data[i].pointid, "LINELOOPPOINTNAME":data[i].lineloopoidname+': '+data[i].pointidname,"type": data[i].keypointtype},//图标属性
                    attributes: {
                        "oid": position.oid,
                        "lon": position.lon,
                        "lat": position.lat,
                        "unitName": position.unitName
                    },
                    layerId: "WEATHER"
                };
                protectcompany.vm.jasMapApi.addPictureGraphic(protectcompany.vm.departmentList[i].lon, protectcompany.vm.departmentList[i].lat, optionsWeather);
            }

            if (protectcompany.vm.flag == 0) {
                //添加点击事件
                protectcompany.vm.jasMapApi.addLayerClickEventListener("COMPANY", function (e) {
                    protectcompany.vm.$options.methods.getDepartmentInfo(e.graphic.attributes.oid, e.graphic.attributes.unitName, e.graphic.attributes.lon, e.graphic.attributes.lat);
                });
            } else {
                //添加点击事件
                protectcompany.vm.jasMapApi.addLayerClickEventListener("STATION", function (e) {
                    protectcompany.vm.$options.methods.getDepartmentInfo(e.graphic.attributes.oid, e.graphic.attributes.unitName, e.graphic.attributes.lon, e.graphic.attributes.lat);
                });
            } //天气详情展示


            protectcompany.vm.jasMapApi.addLayerClickEventListener("WEATHER", function (e) {
                protectcompany.vm.$options.methods.getWeatherInfo(e.graphic.attributes.oid, e.graphic.attributes.unitName, e.graphic.attributes.lon, e.graphic.attributes.lat);
            });
            /* 展示完毕后，将已经加载的图层加入到 allLayer 中 */

            protectcompany.vm.allLayer.push(protectcompany.vm.layer);
            protectcompany.vm.allLayer.push("COMPANY_TEXT");
            protectcompany.vm.allLayer.push("WEATHER");
        },

        /**
         * 分公司、站定位
         * @returns
         */
        locateUnit: function locateUnit(unitoid, lon, lat, name) {
            if (unitoid == 'undefined') {
                return;
            }

            if (lon == 'null' || lat == 'null') {
                $.messager.alert("提示", name + '没有定位坐标！', 'info');
                return;
            }

            var scale;

            if (protectcompany.vm.layer == "COMPANY") {
                scale = 10000000;
            } else if (protectcompany.vm.layer == "STATION") {
                scale = 200000;
            }

            var options = {
                "repeatCount": 3,
                "delay": 500,
                // ms
                "fieldName": "oid",
                "center": true,
                "scale": scale,
                "expand": 1.5,
                "effect": "shine",
                //  flash or shine
                "shineCurve": function shineCurve(v) {
                    return 0.001 * v * v * v * v;
                }
            };
            protectcompany.vm.jasMapApi.flashGraphic(unitoid, protectcompany.vm.layer, options);
        },

        /**
         * 清理掉地图上所有的图层
         */
        clearAllLayer: function clearAllLayer() {
            for (var i = 0; i < protectcompany.vm.allLayer.length; i++) {
                protectcompany.vm.jasMapApi.clearGraphicsLayer(protectcompany.vm.allLayer[i]);
            }

            protectcompany.vm.allLayer = [];
        },

        /**
         * 第三方施工柱状图 月份
         */
        getConsMonth: function getConsMonth(unitid, unitname) {
            protectcompany.vm.otherJs.showDialog2('consMonth', '第三方施工预警统计图', '../../pipeprotect/gps_construction/mapstatistics/statistics.html?unitid=' + unitid + "&unitname=" + encodeURI(unitname), 950, 380, false);
        },
        getEventMonth: function getEventMonth(unitid, unitname) {
            protectcompany.vm.otherJs.showDialog2('eventMonth', '巡检事件统计图', '../../pipeprotect/gps_construction/mapstatistics/event_statistics.html?unitid=' + unitid + "&unitname=" + encodeURI(unitname), 950, 380, false);
        },

        /*
        function eventFun(id){
         var e = window.event || arguments.callee.caller.arguments[0];
            e.stopPropagation();
            parent.showDialog2('construction','施工预警统计图', rootPath + 'pipeprotect/gps_construction/mapstatistics/event_statistics.html?unitid='+id, 800, 500,false);
        }*/

        /**
         * 获取第三方施工列表
         * @param riskrating 紅 01， 黃 02 藍03 ，不区分不传值
         * @param hierarchy 当前部门层级
         */
        getConsByUnitId: function getConsByUnitId(departmentOid, hierarchy, riskrating) {
            /*先清理所有地图上已经展示的图层。*/
            protectcompany.vm.$options.methods.clearAllLayer();
            /* 切换到第三方 施工列表页面 */

            this.$emit("childupdateconsevent", departmentOid, hierarchy, riskrating);
        },

        /**
         * 获取施工事件列表
         * @param hierarchy 当前部门层级
         */
        getEventByUnitId: function getEventByUnitId(departmentOid, hierarchy) {
            /*先清理所有地图上已经展示的图层。*/
            protectcompany.vm.$options.methods.clearAllLayer();
            /* 切换到第三方 施工列表页面 */

            this.$emit("childupdateeventevent", departmentOid, hierarchy);
        },

        /**
         * 获取部门信息。
         */
        getDepartmentInfo: function getDepartmentInfo(unitId, unitName, lon, lat) {
            Vue.prototype.$http.post(protectcompany.vm.rootPath + '/realtimemonitor/realtimemonitor/getUnitInfo.do?unitid=' + unitId + '&token=' + protectcompany.vm.token).then(function (response) {
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
                if (result.sublength == null) content += "0Km";else content += result.sublength + "Km";
                content += "</div>";
                content += "<div class=\"column  is-two-fifths\">";
                content += "部门地址：";
                content += "</div>";
                content += "<div class=\"column  is-three-fifths\">";

                if (result.address != null) {
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

                if (result.username != null) {
                    if (result.phone != null) {
                        content += result.username + "  " + result.phone;
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
                content1 += "</span></td>";
                content1 += "</tr>";
                content1 += "</span></td>";
                content1 += "</tr>";
                content1 += "</table>";
                var options = {
                    width:400,
                    height:260
                };
                jasMapApi.showInfoWindow(lon, lat, unitName + '详情', content1, options);
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


                if (target == "") {
                    return;
                }
                /* 给目标赋予点击事件 */


                target.firstElementChild.onmousedown = function () {
                    protectcompany.vm.$options.methods.move(document.getElementsByTagName("body")[0], target, false);
                };
            }).catch(function (error) {
                // handle error
                console.log(error);
            }).then(function () {// always executed
            });
        },

        /**
         * 获取天气信息
         */
        getWeatherInfo: function getWeatherInfo(unitId, unitName, lon, lat) {
            Vue.prototype.$http.post(protectcompany.vm.rootPath + '/meteorologicalinformation/getThroughCountiesByUnitId.do?unitId=' + unitId + '&token=' + protectcompany.vm.token).then(function (response) {
                var result = response.data.data;
                var content1 = "<table class=\'detail-table\'>";
                content1 += "<tr>";
                content1 += "<th width='20%'>县市</th>";
                content1 += "<th width='20%'>气温</th>";
                content1 += "<th width='20%'>天气</th>";
                content1 += "<th width='40%'>小时降水量</th>";
                content1 += "</tr>";

                if (result.length > 0) {
                    for (var _i = 0; _i < result.length; _i++) {
                        content1 += "<tr>";
                        content1 += "<td width='20%'>";
                        content1 += result[_i].siteCity == undefined ? "--" : result[_i].siteCity;
                        content1 += "</td>";
                        content1 += "<td width='20%'>";
                        content1 += result[_i].temperatureSituation == undefined ? "--" : result[_i].temperatureSituation;
                        content1 += "</td>";
                        content1 += "<td width='20%'>";
                        content1 += result[_i].weatherCondition == undefined ? "--" : result[_i].weatherCondition.replace("今天", "").replace("晚上", "");
                        content1 += "</td>";
                        content1 += "<td width='40%'>"; //content1 += "<a class=\"button\" onclick=\"getPrecipitationDetails('" + result[i].topsixIdcards + ","+ lon + "," + lat + "')\">详情</a>";
                        //content1 += "<a onclick=\"getPrecipitationDetailsEvent('" + result[i].topsixIdcards+"')\">详情</a>";
                        content1 += "<a onclick=\"getPrecipitationDetailsEvent('" + unitId + "','" + unitName + "','" + lon + "','" + lat + "','" + result[_i].topsixIdcards + "')\">详情</a>";
                        content1 += "</td>";
                        content1 += "</tr>";
                    }
                }

                var options = {
                    width: 400,
                    height: 245
                };
                jasMapApi.showInfoWindow(lon, lat, unitName + '气象信息', content1, options);
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
                        document.getElementsByClassName('esriPopupWrapper')[i].style.opacity = "0.8"
                        break;
                    }
                }
                /* 如果查询出来的target还是""，说明出问题了 */


                if (target == "") {
                    return;
                }
                /* 给目标赋予点击事件 */


                target.firstElementChild.onmousedown = function () {
                    protectcompany.vm.$options.methods.move(document.getElementsByTagName("body")[0], target, false);
                };
            }).catch(function (error) {
                // handle error
                console.log(error);
            }).then(function () {// always executed
            });
        },

        /**
         *  使用弹框可以移动
         *  @param region 在某个范围内移动
         *  @param target 被移动的对象
         */
        move: function move(region, target, status) {
            /* 点击移动头部时候的坐标X,Y */
            var initX = '';
            var initY = '';
            /* 鼠标释放之后的X，Y 坐标 */

            var nextX = '';
            var nextY = '';
            /* 记录弹框被按下之前的位置。 */

            var originalX = target.offsetLeft; // 获取对应父容器的上边距

            var originalY = target.offsetTop; // 获取对应父容器的左边距

            console.log('originalX=' + originalX + '----originalY=' + originalY);

            region.onmousemove = function (event) {
                nextX = event.clientX;
                nextY = event.clientY;

                if (status) {
                    console.log('pppppporiginalX=' + originalX + '----originalY=' + originalY);
                    /* 移动的距离 */

                    var distanceX = nextX - initX;
                    var distanceY = nextY - initY;
                    /* 如果移动的距离大于最大距离，则移动距离就是最大距离。*/

                    /* 设置移动时，弹出框的坐标位置。*/

                    target.style.left = originalX + distanceX + 'px';
                    target.style.top = originalY + distanceY + 'px';
                }
            };
            /* 鼠标按下的头部的时候才可以拖动。*/


            target.firstElementChild.onmousedown = function (e1) {
                initX = e1.clientX;
                initY = e1.clientY;
                status = true;
            };
            /* 鼠标松开  */
            // target.firstElementChild.onmouseup = function( e2 ) {


            target.firstElementChild.onmouseup = function (e2) {
                if (status == true) {
                    status = false;
                    originalX = originalX + nextX - initX;
                    originalY = originalY + nextY - initY;
                }
            };
        },
        noAuthority: function noAuthority() {
            Vue.prototype.$notify.warning({
                content: "暂无此权限"
            });
        },

        /**
         * @desc 获取系统根路径
         */
        getRootPath: function getRootPath() {
            // 获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
            var curWwwPath = window.document.location.href; // 获取主机地址之后的目录，如： uimcardprj/share/meun.jsp

            var pathName = window.document.location.pathname;
            var pos = curWwwPath.indexOf(pathName); // 获取主机地址，如： http://localhost:8083

            var localhostPaht = curWwwPath.substring(0, pos); // 获取带"/"的项目名，如：/uimcardprj

            var projectName = pathName.substring(0, pathName.substring(1).indexOf('/') + 1);
            return projectName + "/";
        }
    },
    template: "\n            <section class= \"all-department\">\n            <div class = \"department-head\">\n\t\t\t\t<nav class=\"breadcrumb\" aria-label=\"breadcrumbs\">\n                  <ul>\n                    <li v-for=\"( parent, index ) in parentList\" v-bind:key =\"parent.oid\" >\n                        <a v-on:click = \"getStationOrPerson( parent.oid, parent.hierarchy, parent.unitName )\" v-bind:title=\"parent.unitName\" href=\"#\">{{ parent.unitName.length > 16?parent.unitName.slice(0,5)+'...':parent.unitName }}</a>\n                    </li>\n                  </ul>\n                </nav>\n                \n                <!-- \u5982\u679C\u5BFC\u822A\u680F\u62B5\u8FBE\u7684\u90E8\u95E8\u5C42\u7EA7\u6BD4\u5F53\u524D\u767B\u5F55\u7528\u6237\u7684\u90E8\u95E8\u5C42\u7EA7\u5927\uFF0C\u5C31\u4E0D\u5141\u8BB8\u70B9\u51FB\u3002 -->\n                <nav class=\"level-cons\" v-if = \"departmentHierarchy.split('.').length < user.ext_field3.split('.').length\">\n                    <div class=\"level-cons-left\">\n                        <div class= \"level-cons-top\" v-on:click = \"noAuthority()\">\n                            <div class = 'cons-img'>\n                                <img src=\"../map_viewer/images/construct.png\"> \n                            </div>\n                            <div class = 'cons-count'>\n                                <span style=\"float:left;padding-right:0px ;font-size:8px;\"  class=\"heading\">\u7B2C\u4E09\u65B9\u65BD\u5DE5\u603B\u6570</span>\n                                <span class = \"count\" style=\"cursor: pointer;\">{{ constructTotal }}</span>\n                            </div>\n                        </div>\n                        <div class= \"level-cons-under\">\n                            <div class = 'cons-rby' v-on:click = \"noAuthority()\">\n                                <img src=\"../map_viewer/images/rcons.png\" style=\"margin-top:1px\"> \n                                <p class =\"rbycount\" >{{ constructRCount==null?0:constructRCount }}</p>\n                            </div>\n                            <div class = 'cons-rby' v-on:click = \"noAuthority()\">\n                                <img src=\"../map_viewer/images/ycons.png\" style=\"margin-top:1px\"> \n                                <p class =\"rbycount\">{{ constructYCount==null?0:constructYCount }}</p>\n                            </div>\n                            <div class = 'cons-rby' v-on:click = \"noAuthority()\">\n                                <img src=\"../map_viewer/images/bcons.png\" style=\"margin-top:1px\"> \n                                <p class =\"rbycount\">{{ constructBCount==null?0:constructBCount }}</p>\n                            </div>\n                        </div>\n                    </div> \n                    <div class=\"level-cons-right\" v-on:click = \"noAuthority()\">\n                        <div class = 'cons-img'>\n                            <img src=\"../map_viewer/images/event.png\"> \n                        </div>\n                        <div class = 'cons-count'>\n                          <span class = \"heading\" style=\"float:left;width:70%\">\u5DE1\u68C0\u4E8B\u4EF6</span>\n                          <span class = 'count' style=\"text-align:center;width:28%\">{{ gpsEventCount }}</span>\n                        </div>\n                    </div>\n                </nav>\n                \n                <nav class=\"level-cons\" v-else>\n                    <div class=\"level-cons-left\">\n                        <div class= \"level-cons-top\" v-on:click = \"getConsByUnitId(department.oid,department.hierarchy,'')\">\n                            <div class = 'cons-img'>\n                                <img src=\"../map_viewer/images/construct.png\"> \n                            </div>\n                            <div class = 'cons-count'>\n                                <span style=\"float:left;padding-right:0px ;font-size:8px\"  class=\"heading\">\u7B2C\u4E09\u65B9\u65BD\u5DE5\u603B\u6570</span>\n                                <span class = \"count\" style=\"cursor: pointer;\">{{ constructTotal }}</span>\n                            </div>\n                        </div>\n                        <div class= \"level-cons-under\">\n                            <div class = 'cons-rby' v-on:click = \"getConsByUnitId(department.oid,department.hierarchy,'01')\">\n                                <img src=\"../map_viewer/images/rcons.png\" style=\"margin-top:1px\"> \n                                <p class =\"rbycount\" >{{ constructRCount==null?0:constructRCount }}</p>\n                            </div>\n                            <div class = 'cons-rby' v-on:click = \"getConsByUnitId(department.oid,department.hierarchy,'02')\">\n                                <img src=\"../map_viewer/images/ycons.png\" style=\"margin-top:1px\"> \n                                <p class =\"rbycount\">{{ constructYCount==null?0:constructYCount }}</p>\n                            </div>\n                            <div class = 'cons-rby' v-on:click = \"getConsByUnitId(department.oid,department.hierarchy,'03')\">\n                                <img src=\"../map_viewer/images/bcons.png\" style=\"margin-top:1px\"> \n                                <p class =\"rbycount\">{{ constructBCount==null?0:constructBCount }}</p>\n                            </div>\n                        </div>\n                    </div> \n                    <div class=\"level-cons-right\" v-on:click = \"getEventByUnitId(department.oid,department.hierarchy)\">\n                        <div class = 'cons-img'>\n                            <img src=\"../map_viewer/images/event.png\"> \n                        </div>\n                        <div class = 'cons-count'>\n                          <span class = \"heading\" style=\"float:left;width:70%\">\u5DE1\u68C0\u4E8B\u4EF6</span>\n                          <span class = 'count' style=\"text-align:center;width:28%\">{{ gpsEventCount }}</span>\n                        </div>\n                    </div>\n                </nav>\n              </div>\n                \n                <!-- \u5206\u516C\u53F8\u8BE6\u7EC6 -->\n                <section class = \"all-company\">\n                   \n                    <section name=\"detail\" v-for=\"department in departmentList\" v-bind:key =\"department.oid\" >\n                        <nav class=\"level\">\n                          <!-- Left side -->\n                          <div class=\"level-protectleft\">\n                            <div class=\"level-protect count-detail-img\" >\n                              <img v-if = \"flag == 0\" src=\"../map_viewer/images/subdept.png\">\n                              <img v-if = \"flag == 1\" src=\"../map_viewer/images/station.png\">\n                            </div>\n                          </div>\n                       \n                          <!-- Right side -->\n                          <div class=\"level-protectright\">\n                          <div class = \"conscount-detail\" v-if = \"user.ext_field3.split('.').length == department.hierarchy.split('.').length && user.ext_field2 != department.oid\">\n                            <div class = \"level-protectright heading disable\"> <a v-on:click = \"noAuthority()\" >{{ department.unitName }}</a></div>\n                            <div class =\"group-top\" v-on:click = \"noAuthority()\">\n                                <span>\u5DE1\u68C0\u4E8B\u4EF6</span>\n                                <span style=\"cursor: pointer;\">{{ department.gpsEvent == null?0:department.gpsEvent}}</span>\n                            </div>\n                           \n                            <div class =\"group-top\" v-on:click = \"\">\n                                <span v-on:click = \"noAuthority()\">\u7B2C\u4E09\u65B9\u65BD\u5DE5</span>\n                                <span style=\"cursor: pointer;\" v-on:click = \"noAuthority()\">{{ department.consTotal == null?0:department.consTotal}}</span>\n                                <span><img v-on:click = \"noAuthority()\" src=\"../map_viewer/images/rcons.png\"></span>\n                                <span style=\"cursor: pointer;\" v-on:click = \"noAuthority()\">{{ department.consRcount == null?0:department.consRcount}}</span>\n                                <span><img v-on:click = \"noAuthority()\" src=\"../map_viewer/images/ycons.png\"></span>\n                                <span style=\"cursor: pointer;\" v-on:click = \"noAuthority()\">{{ department.consYcount == null?0:department.consYcount}}</span>\n                                <span><img v-on:click = \"noAuthority()\" src=\"../map_viewer/images/bcons.png\"></span>\n                                <span style=\"cursor: pointer;\" v-on:click = \"noAuthority()\">{{ department.consBcount == null?0:department.consBcount}}</span>\n                            </div>\n                          </div>\n                           \n                          \n                          <div v-else class = \"conscount-detail\" >\n                          \n                            <div class = \"level-protectright heading\"> <a v-on:click = \"getStationOrPerson( department.oid, department.hierarchy, department.unitName )\" >{{ department.unitName }}</a></div>\n                            <div class =\"group-top\" v-on:click = \"getEventByUnitId(department.oid,department.hierarchy)\">\n                                <span>\u5DE1\u68C0\u4E8B\u4EF6</span>\n                                <span style=\"cursor: pointer;\">{{ department.gpsEvent == null?0:department.gpsEvent}}</span>\n                            </div>\n                           \n                            <div class =\"group-top\" v-on:click = \"\">\n                                <span v-on:click = \"getConsByUnitId(department.oid,department.hierarchy,'')\">\u7B2C\u4E09\u65B9\u65BD\u5DE5</span>\n                                <span style=\"cursor: pointer;\" v-on:click = \"getConsByUnitId(department.oid,department.hierarchy,'')\">{{ department.consTotal == null?0:department.consTotal}}</span>\n                                <span><img v-on:click = \"getConsByUnitId(department.oid,department.hierarchy,'01')\" src=\"../map_viewer/images/rcons.png\"></span>\n                                <span style=\"cursor: pointer;\" v-on:click = \"getConsByUnitId(department.oid,department.hierarchy,'01')\">{{ department.consRcount == null?0:department.consRcount}}</span>\n                                <span><img v-on:click = \"getConsByUnitId(department.oid,department.hierarchy,'02')\" src=\"../map_viewer/images/ycons.png\"></span>\n                                <span style=\"cursor: pointer;\" v-on:click = \"getConsByUnitId(department.oid,department.hierarchy,'02')\">{{ department.consYcount == null?0:department.consYcount}}</span>\n                                <span><img v-on:click = \"getConsByUnitId(department.oid,department.hierarchy,'03')\" src=\"../map_viewer/images/bcons.png\"></span>\n                                <span style=\"cursor: pointer;\" v-on:click = \"getConsByUnitId(department.oid,department.hierarchy,'03')\">{{ department.consBcount == null?0:department.consBcount}}</span>\n                            </div>\n                          </div>\n                            \n                          </div> \n                          </div>\n                        </nav>\n                        \n                        <nav class=\"level-protectcompany\">\n                          <!-- Right side -->\n                          <div class=\"level-right\" style=\"background-color: #f4f4f4;\">\n                            <p class=\"level-item\"><img v-on:click = \"getConsMonth(department.oid,department.unitName)\" src=\"../map_viewer/images/construct.png\" title=\"\u7B2C\u4E09\u65B9\u65BD\u5DE5\u7EDF\u8BA1\"></p>\n                            <p class=\"level-item\"><img v-on:click = \"getEventMonth( department.oid,department.unitName)\" src=\"../map_viewer/images/event.png\" title=\"\u5DE1\u68C0\u4E8B\u4EF6\u7EDF\u8BA1\"></p>\n                            <p class=\"level-item\"><img v-on:click = \"getDepartmentInfo( department.oid, department.unitName, department.lon, department.lat )\" src=\"../map_viewer/images/stationinfo.png\" title=\"\u67E5\u770B\u90E8\u95E8\u4FE1\u606F\"></p>\n                            <p class=\"level-item\"><img v-on:click = \"locateUnit( department.oid, department.lon, department.lat, department.unitName )\" src=\"../map_viewer/images/locate.png\" title=\"\u90E8\u95E8\u5B9A\u4F4D\"></p>\n                            \n                          </div>\n                          </nav>\n                    </section>\n                    \n                </section>\n               </section>\n\t\t\t"
});