"use strict";

/**
 * 第三方施工列表
 */
var protectcons = Vue.component('protectcons', {
    props: {
        /* 查询的是那个部门下的第三方施工 */
        departmentOidProp: String,

        /* 部门的层级 */
        hierarchyProp: String,

        /* 红01 黄02 蓝03 ， 不区分 不写 */
        riskratingProp: String,
        parentIdProp: String
    },
    data: function data() {
        return {
            token: '',
            protectconsVm: '',

            /* 所有第三方施工 */
            protectconsList: [],

            /* 本站的总数，红，黄 蓝。*/
            constructTotal: 0,
            constructRCount: 0,
            constructYCount: 0,
            constructBCount: 0,

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
            layer: 'PROTECTCONS',

            /* 当前部门 */
            department: [],

            /* 默认是第一页，默认一页30条 */
            pageNo: 1,
            location: '',
            projectname: '',
            rootPath: ''
        };
    },
    created: function created() {
        protectcons.protectconsVm = this;
        /*
        protectcons.protectconsVm.$options.methods.dateFormat();*/

        protectcons.protectconsVm.rootPath = protectcons.protectconsVm.$options.methods.getRootPath();
    },
    mounted: function mounted() {
        /* 获取到token */
        protectcons.protectconsVm.token = localStorage.getItem("token");
        /* 获取其他页面写的js公共方法 */

        var fra = parent.$("iframe");

        for (var i = 0; i < fra.length; i++) {
            if (fra[i].id == 'frm2d') {
                protectcons.protectconsVm.otherJs = fra[i].contentWindow;
                protectcons.protectconsVm.jasMapApi = fra[i].contentWindow.jasMapApi;
                protectcons.protectconsVm.mapWindow = fra[i].contentWindow;
            }
        }
        /* 设置导航栏。 */


        protectcons.protectconsVm.$options.methods.getParentDeparement(protectcons.protectconsVm.departmentOidProp, protectcons.protectconsVm.parentIdProp);
        /* 创建之初，请求得到所有的第三方施工。 */

        protectcons.protectconsVm.$options.methods.getProtectcons(protectcons.protectconsVm.riskratingProp, protectcons.protectconsVm.hierarchyProp, protectcons.protectconsVm.pageNo, protectcons.protectconsVm.projectname, protectcons.protectconsVm.location);
        /* 得到所有的第三方施工数量 */

        protectcons.protectconsVm.$options.methods.getConstructionStatistics(protectcons.protectconsVm.hierarchyProp);
    },
    methods: {
        getConstructionStatistics: function getConstructionStatistics(departmentHierarchy) {
            Vue.prototype.$http.post(protectcons.protectconsVm.rootPath + '/gpsConstructionStatistics/getConstructCount.do?departmentHierarchy=' + departmentHierarchy + '&token=' + protectcompany.vm.token).then(function (response) {
                /* 第三方施工各等级数量 */
                if (response.data != null) {
                    protectcons.protectconsVm.constructTotal = response.data.data.total;
                    protectcons.protectconsVm.constructRCount = response.data.data.red;
                    protectcons.protectconsVm.constructYCount = response.data.data.yellow;
                    protectcons.protectconsVm.constructBCount = response.data.data.blue;
                }
            }).catch(function (error) {
                // handle error
                console.log(error);
            }).then(function () {});
        },

        /**
         * 获取到父部门数据
         * @param departmentOid
         */
        getParentDeparement: function getParentDeparement(departmentOid, parentId) {
            Vue.prototype.$http.post(protectcons.protectconsVm.rootPath + '/realtimemonitor/realtimemonitor/getParentUnitList.do?unitId=' + departmentOid + '&token=' + protectcons.protectconsVm.token + '&parentId=' + parentId).then(function (response) {
                /* 设置列表部门。 */
                protectcons.protectconsVm.parentList = response.data.data;
                /* 设置当前部门 */

                protectcons.protectconsVm.department = protectcons.protectconsVm.parentList[protectcons.protectconsVm.parentList.length - 1];
            }).catch(function (error) {
                // handle error
                console.log(error);
            }).then(function () {// always executed
            });
        },

        /**
         * 点击部门名称获取站或者站下的所有第三方施工数据
         * @param departmentOid 分公司的OID或者站的OID
         * @param
         */
        getAllCons: function getAllCons(hierarchy) {
            /* 获取部门下的第三方事件。 */
            Vue.prototype.$http.post(protectcons.protectconsVm.rootPath + '/gpsConstructionStatistics/getAllConsByUnitId.do?token=' + protectcons.protectconsVm.token + '&hierarchy=' + hierarchy, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                /* 设置第三方列表。 */
                protectcons.protectconsVm.protectconsList = response.data.data;

                for (var i = 0; i < protectcons.protectconsVm.protectconsList.length; i++) {
                    if (protectcons.protectconsVm.protectconsList[i].riskratingreal != null) {
                        protectcons.protectconsVm.protectconsList[i].riskrating = protectcons.protectconsVm.protectconsList[i].riskratingreal;
                    }
                }
                /* 定位所有的第三方事件。 */


                protectcons.protectconsVm.$options.methods.positionCons();
            }).catch(function (error) {
                // handle error
                console.log(error);
            }).then(function () {// always executed
            });
        },

        /**
         * 定位所有的第三方信息
         */
        positionCons: function positionCons() {
            /* 先清理所有地图上已经展示的图层。 */
            protectcons.protectconsVm.$options.methods.clearAllLayer();

            for (var i = 0; i < protectcons.protectconsVm.protectconsList.length; i++) {
                var array = [];
                var position = {};
                position.lon = protectcons.protectconsVm.protectconsList[i].lon;
                position.lat = protectcons.protectconsVm.protectconsList[i].lat;
                position.oid = protectcons.protectconsVm.protectconsList[i].oid;
                position.riskrating = protectcons.protectconsVm.protectconsList[i].riskrating;
                position.projectname = protectcons.protectconsVm.protectconsList[i].projectname;
                array.push(position);
                var option = {};

                if (position.riskrating == '01') {
                    option.url = "images/map_rwarn.png";
                } else if (position.riskrating == '02') {
                    option.url = "images/map_ywarn.png";
                } else if (position.riskrating == '03') {
                    option.url = "images/map_bwarn.png";
                }

                option.layerId = "PROTECTCONS";
                option.width = 24;
                option.height = 24;
                option.attributes = {
                    "oid": position.oid,
                    "lon": position.lon,
                    "lat": position.lat,
                    "projectname": position.projectname
                };
                protectcons.protectconsVm.mapWindow.doPosition(array, JSON.stringify(option));
                var options = {};
                options.fontSize = 10;
                options.fontFamily = "Arial";
                options.haloColor = [255, 255, 255, 255];
                options.haloSize = 2;
                options.color = [78, 78, 78, 255];
                options.backgroundColor = [222, 222, 222, 255];
                options.angle = 0;
                options.xOffset = -10;
                options.yOffset = -30;
                options.center = false;
                options.layerId = "PROTECTCONS_TEXT";
                var projectname; //项目名称过长

                if (protectcons.protectconsVm.protectconsList[i].projectname.length > 8) {
                    projectname = protectcons.protectconsVm.protectconsList[i].projectname.substring(0, 8) + "...";
                } else {
                    projectname = protectcons.protectconsVm.protectconsList[i].projectname;
                }

                protectcons.protectconsVm.jasMapApi.addTextGraphic(protectcons.protectconsVm.protectconsList[i].lon, protectcons.protectconsVm.protectconsList[i].lat, projectname, options);
            } //添加点击事件


            protectcons.protectconsVm.jasMapApi.addLayerClickEventListener("PROTECTCONS", function (e) {
                protectcons.protectconsVm.$options.methods.getConsInfo(e.graphic.attributes.oid, e.graphic.attributes.lon, e.graphic.attributes.lat);
            });
            /* 展示完毕后，将已经加载的图层加入到 allLayer 中 */

            protectcons.protectconsVm.allLayer.push(protectcons.protectconsVm.layer);
            protectcons.protectconsVm.allLayer.push("PROTECTCONS");
            protectcons.protectconsVm.allLayer.push("PROTECTCONS_TEXT");
        },

        /**
         * 点击部门名称获取站或者站下的所有第三方施工。
         * @param departmentOid 分公司的OID或者站的OID
         * @param pageNo 获取多少页的数据
         */
        getProtectcons: function getProtectcons(riskrating, hierarchy, pageNo, projectname, location) {
            /* 获取部门下的第三方施工。 */
            Vue.prototype.$http.post(protectcons.protectconsVm.rootPath + '/gpsConstructionStatistics/getConsByUnitId.do?token=' + protectcons.protectconsVm.token + '&hierarchy=' + hierarchy + "&riskrating=" + riskrating + "&projectname=" + projectname + "&location=" + location + "&pageNo=" + pageNo, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                /* 设置第三方施工列表。 */
                protectcons.protectconsVm.protectconsList = response.data.data;

                for (var i = 0; i < protectcons.protectconsVm.protectconsList.length; i++) {
                    if (protectcons.protectconsVm.protectconsList[i].riskratingreal != null) {
                        protectcons.protectconsVm.protectconsList[i].riskrating = protectcons.protectconsVm.protectconsList[i].riskratingreal;
                    }
                }
                /* 定位所有的第三方施工。 */


                protectcons.protectconsVm.$options.methods.positionCons();
                protectcons.protectconsVm.riskratingProp = riskrating;
            }).catch(function (error) {
                // handle error
                console.log(error);
            }).then(function () {// always executed
            });
        },

        /**
         * 事件高闪
         * @returns
         */
        locateCons: function locateCons(oid, lon, lat) {
            if (oid == 'undefined') {
                return;
            }

            if (lon == 'null' || lat == 'null') {
                $.messager.alert("提示", '没有定位坐标！', 'info');
                return;
            }

            var scale;

            if (protectcons.protectconsVm.layer == "PROTECTCONS") {
                scale = 1000000;
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
            protectcons.protectconsVm.jasMapApi.flashGraphic(oid, protectcons.protectconsVm.layer, options);
        },

        /**
         * 清理掉地图上所有的图层
         */
        clearAllLayer: function clearAllLayer() {
            for (var i = 0; i < protectcons.protectconsVm.allLayer.length; i++) {
                protectcons.protectconsVm.jasMapApi.clearGraphicsLayer(protectcons.protectconsVm.allLayer[i]);
            }

            protectcons.protectconsVm.allLayer = [];
        },

        /**
         * 成功提示信息
         * @param content
         */
        successNotify: function successNotify(content) {
            Vue.prototype.$notify.success({
                content: content
            });
        },

        /**
         * 等待提示信息
         * @param content
         */
        loadingNotify: function loadingNotify(content) {
            Vue.prototype.$notify.open({
                content: content,
                type: 'loading'
            });
        },

        /**
         * 导航栏点击切换成分公司或者站
         * @param oid   部门OID
         * @param hierarchy 部门层级
         */
        getStation: function getStation(oid, hierarchy) {
            if (hierarchy.split(".").length <= 3) {
                /* 清除所有的地图图层。 */
                protectcons.protectconsVm.$options.methods.clearAllLayer();
                protectcons.protectconsVm.jasMapApi.clearGraphicsLayer("PROTECTCONS");
                protectcons.protectconsVm.jasMapApi.clearGraphicsLayer("PROTECTCONS_TEXT");
                protectcons.protectconsVm.$emit("childupdatecompanyevent", oid, hierarchy);
            }
        },

        /**
         * 展示第三方施工详细信息
         */

        /*  showprotectconsDetail( unitId, hierarchy, inspectorOid, insname ) {
               将组件内容切换为第三方施工详情
              this.$emit( "childupdateprotectconsdetailevent",unitId, hierarchy, inspectorOid, insname );
          },*/
        getConsInfo: function getConsInfo(dataId, lon, lat) {
            Vue.prototype.$http.post(protectcons.protectconsVm.rootPath + '/gpsconstruction/getInfo.do?oid=' + dataId + '&token=' + protectcons.protectconsVm.token).then(function (response) {
                var result = response.data.data;
                var content = "<div class=\"columns is-gapless is-multiline is-mobile department-detail-info\">";
                content += "<div class=\"column  is-two-fifths\">";
                content += "部门名称：";
                content += "</div>";
                content += "<div class=\"column is-left  is-three-fifths\">";
                content += result.unitidname;
                content += "</div>";
                content += "<div class=\"column  is-two-fifths\">";
                content += "管线标识：";
                content += "</div>";
                content += "<div class=\"column  is-three-fifths\">";

                if (result.lineloopoidname != null) {
                    content += result.lineloopoidname;
                } else {
                    content += "暂无";
                }

                content += "</div>";
                content += "<div class=\"column  is-two-fifths\">";
                content += "桩号：";
                content += "</div>";
                content += "<div class=\"column  is-three-fifths\">";

                if (result.stakenumname != null) {
                    content += result.stakenumname;
                } else {
                    content += "暂无";
                }

                content += "</div>";
                content += "<div class=\"column  is-two-fifths\">";
                content += "现场监护人员：";
                content += "</div>";
                content += "<div class=\"column  is-three-fifths\">";

                if (result.inspectoroidname != null) {
                    if (result.inspectorphone != null) {
                        content += result.inspectoroidname + "  " + result.inspectorphone;
                    } else {
                        content += result.inspectoroidname;
                    }
                } else {
                    content += "暂无";
                }

                content += "</div>";
                content += "<div class=\"column  is-two-fifths\">";
                content += "<a class=\"button\" onclick=\"getConsInfoView('" + dataId + "')\">详情</a>";
                content += "</div>";






                var content1 = "<table class=\'detail-table\'>";
                content1 += "<tr>";
                content1 += "<th width='15%'><span>部门名称</span></th>";
                content1 += "<td width='35%'><span>";
                content1 += result.unitidname;
                content1 += "</span></td>";
                content1 += "</tr>";
                content1 += "<tr>";
                content1 += "<th width='15%'><span>管线标识</span></th>";
                content1 += "<td width='35%'><span>";

                if (result.lineloopoidname != null) {
                    content1 += result.lineloopoidname;
                } else {
                    content1 += "暂无";
                }

                content1 += "</span></td>";
                content1 += "</tr>";
                content1 += "<tr>";
                content1 += "<th width='15%'><span>桩号</span></th>";
                content1 += "<td width='35%'><span>";

                if (result.stakenumname != null) {
                    content1 += result.stakenumname;
                } else {
                    content1 += "暂无";
                }

                content1 += "</span></td>";
                content1 += "</tr>";
                content1 += "<tr>";
                content1 += "<th width='15%'><span>现场监护人员</span></th>";
                content1 += "<td width='35%'><span>";

                if (result.inspectoroidname != null) {
                    if (result.inspectorphone != null) {
                        content1 += result.inspectoroidname + "  " + result.inspectorphone;
                    } else {
                        content1 += result.inspectoroidname;
                    }
                } else {
                    content1 += "暂无";
                }

                content1 += "</span></td>";
                content1 += "</tr>";
                content1 += "<tr>";
                content1 += "<td width='35%'  colspan=\"2\"><span>";
                content1 += "<a class=\"button\" onclick=\"getConsInfoView('"+dataId +"')\">详情</a>";
                content1 += "</span></td>";
                content1 += "</tr>";
                content1 += "</table>";




                var options = {
                    width: 300,
                    height: 245
                };
                jasMapApi.showInfoWindow(lon, lat, '第三方施工详情', content1, options);
                jasMapApi.centerAt(lon, lat);
                /* 被移动的对象 */

                var target = "";
                /* 获取到所有的标注的内容。 */

                var targetList = document.getElementsByClassName('esriPopupWrapper');
                /* 获取到这些标注集合中的，刚刚我添加的标注。 */

                for (var i = 0; i < targetList.length; i++) {
                    /* 如果标注中的表头的内容和我查询的部门名称相同，就表明是我需要的对象。 */
                    if (document.getElementsByClassName('esriPopupWrapper')[i].firstElementChild.innerText == '详情') {
                        target = document.getElementsByClassName('esriPopupWrapper')[i];
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
        getConsInfoView: function getConsInfoView(dataId) {
            //protectcons.protectconsVm.otherJs.showDialog2('viewInfoGpsConstruction','第三方施工详细', "../../pipeprotect/gps_construction/gpsconstructionInfo/view_info_gps_construction.html?oid="+dataId, 950, 650,false);
            protectcons.protectconsVm.otherJs.top.getDlg("../../pipeprotect/gps_construction/gpsconstructionInfo/view_info_gps_construction.html?oid=" + dataId, "viewInfoGpsConstruction", "第三方施工详细", 900, 650, false, true, true);
        },
        loadMore: function loadMore() {
            protectcons.protectconsVm.pageNo++;
            protectcons.protectconsVm.$options.methods.getProtectcons(protectcons.protectconsVm.riskratingProp, protectcons.protectconsVm.hierarchyProp, protectcons.protectconsVm.pageNo, protectcons.protectconsVm.projectname, protectcons.protectconsVm.location);
        },

        /**
         * 点击查询按钮
         */
        searchCons: function searchCons() {
            /* 清除地图上所有图标以及定时器 */
            protectcons.protectconsVm.$options.methods.clearAllLayer();
            /* 获取第三方施工列表 */

            protectcons.protectconsVm.$options.methods.getProtectcons(protectcons.protectconsVm.riskratingProp, protectcons.protectconsVm.hierarchyProp, protectcons.protectconsVm.pageNo, protectcons.protectconsVm.projectname, protectcons.protectconsVm.location);
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
    template: "\n            <section class= \"all-department\">\n            <div class = \"department-head\">\n\t\t\t\t<nav class=\"breadcrumb\" aria-label=\"breadcrumbs\">\n                  <ul>\n                    <li v-for=\"( parent, index ) in parentList\" v-bind:key =\"parent.oid\" >\n                        <a v-if = \"parentList.length > 3\" v-on:click = \"getStation( parent.oid, parent.hierarchy )\" v-bind:title=\"parent.unitName\" href=\"#\">{{ parent.unitName.length > 6?parent.unitName.slice(0,5)+'...':parent.unitName }}</a>\n                        <a v-else-if = \"parentList.length == 2\" v-on:click = \"getStation( parent.oid, parent.hierarchy )\" v-bind:title=\"parent.unitName\" href=\"#\">{{ parent.unitName.length > 14?parent.unitName.slice(0,13)+'...':parent.unitName }}</a>\n                        <a v-else-if = \"parentList.length == 3\" v-on:click = \"getStation( parent.oid, parent.hierarchy )\" v-bind:title=\"parent.unitName\" href=\"#\">{{ parent.unitName.length > 8?parent.unitName.slice(0,7)+'...':parent.unitName }}</a>\n                        <a v-else v-on:click = \"getStation( parent.oid, parent.hierarchy )\" v-bind:title=\"parent.unitName\" href=\"#\">{{parent.unitName }}</a>\n                    </li>\n                  </ul>\n                </nav>\n                \n                <nav class=\"level protectcons\" style=\"height:40px\">\n                  <div class=\"level-item\" >\n                    <div class = 'ins-img' v-on:click = \"getProtectcons('', department.hierarchy,pageNo,projectname,location)\">\n                        <img src=\"../map_viewer/images/construct.png\"> \n                    </div>\n                    <div class = 'level-item-cons' v-on:click = \"getProtectcons('', department.hierarchy,pageNo,projectname,location)\" >\n                        <p>\u7B2C\u4E09\u65B9\u65BD\u5DE5\u603B\u6570</p>\n                    </div>\n                    <div class=\"level-item-cons\" style=\"margin-left:5px;cursor: pointer;\" v-on:click = \"getProtectcons('', department.hierarchy,pageNo,projectname,location)\">\n                        <p>{{ constructTotal }}</p>\n                    </div>\n                  </div>\n                  \n                  <div class=\"level-item\" >\n                    <div class = 'ins-img'  style=\"margin-top: 1px;\" v-on:click = \"getProtectcons('01', department.hierarchy, pageNo,projectname,location )\">\n                        <img src=\"../map_viewer/images/rcons.png\">  \n                    </div>\n                    <div class = 'cons-rby' style=\"margin-left:5px\" v-on:click = \"getProtectcons('01', department.hierarchy, pageNo,projectname,location )\">\n                        <p class =\"rbycount\">{{ constructRCount }}</p>\n                    </div>\n                  </div>\n    \t\t\t  <div class=\"level-item\" >\n\t\t\t      \t<div class = 'ins-img' style=\"margin-top: 1px;\" v-on:click = \"getProtectcons('02', department.hierarchy, pageNo,projectname,location )\">\n                        <img src=\"../map_viewer/images/ycons.png\">  \n                    </div>\n                    <div class = 'cons-rby' style=\"margin-left:5px\" v-on:click = \"getProtectcons('02', department.hierarchy, pageNo,projectname,location)\">\n                        <p class =\"rbycount\">{{ constructYCount }}</p>\n                    </div>\n                  </div>\n                  <div class=\"level-item\" >\n                    <div class = 'ins-img' style=\"margin-top: 1px;\" v-on:click = \"getProtectcons('03', department.hierarchy,pageNo,projectname,location)\">\n                        <img src=\"../map_viewer/images/bcons.png\">  \n                    </div>\n                    <div class = 'cons-rby' style=\"margin-left:5px\" v-on:click = \"getProtectcons('03', department.hierarchy,pageNo,projectname,location)\" >\n                        <p class =\"rbycount\">{{ constructBCount }}</p>\n                    </div>\n                  </div>\n                   <div class=\"level-item last\" >\n                   </div>\n                </nav>\n         \t</div>\n                \n                \n                <!-- \u7B2C\u4E09\u65B9\u65BD\u5DE5\u5217\u8868 -->\n                <section class = \"all-company\" id = \"allDetail\">\n                      \n                      <!-- \u67E5\u8BE2\u9875\u9762 -->\n                    <nav class=\"level\">\n                        <div class=\"level-left form-cons\">\n                            <div class=\"field is-grouped\">\n                             \n                              \n                                <input v-model=\"projectname\" class=\"input person-name\" type=\"text\" placeholder=\"\u9879\u76EE\u540D\u79F0\">\n    \t\t\t\t\t\t\t<input v-model=\"location\" class=\"input person-name\" type=\"text\" placeholder=\"\u65BD\u5DE5\u5730\u70B9\" style=\"float:right\">\n                              \n                                <a class=\"button is-info\" v-on:click = \"searchCons()\">\n                                  \u67E5\u8BE2\n                                </a>\n                              \n                            </div>\n                        </div>\n                        \n                    </nav>\n                    \n                    <div v-infinite-scroll=\"loadMore\" infinite-scroll-disabled=\"busy\" infinite-scroll-distance=\"0\">\n                    <section name=\"detail\" class = \"detail protectcons\" v-for=\"protectcons in protectconsList\" v-bind:key =\"protectcons.oid\" >\n                       \n                        <nav class=\"level\" style=\"margin:0\">\n                        <div class=\"level-item-conslist\">\n                        \t<div style=\"padding:1px 10px;\">\n\t    \t\t\t\t\t\t<div class=\"level-item-conslist-row\" v-on:click = \"getConsInfoView(protectcons.oid)\">\n\t    \t\t\t\t\t\t<span  v-if = \" protectcons.riskrating == '01' \" style=\"color:#FFFFFF;background-color:#FF0000;font-size:11px;font-weight:bold; border-radius:5px;\">\u7EA2\u8272\u9884\u8B66</span>\n\t\t\t\t\t    \t<span v-else-if = \" protectcons.riskrating == '02'\" style=\"color:#FFFFFF;background-color:#FFD700;font-size:11px;font-weight:bold; border-radius:5px;\">\u9EC4\u8272\u9884\u8B66</span>\n\t\t\t\t\t    \t<span  v-else-if = \" protectcons.riskrating == '03' \" style=\"color:#FFFFFF;background-color:#4876FF;font-size:11px;font-weight:bold; border-radius:5px;\">\u84DD\u8272\u9884\u8B66</span>\n\t\t\t\t\t\t\t\n\t\t\t                          \t<span>\u9879\u76EE\u540D\u79F0:</span>\n\t\t\t                          \t<span  style=\"cursor: pointer;white-space:nowrap; text-overflow:ellipsis; overflow:hidden;\">{{protectcons.projectname}}</span>\n\t\t                        </div>\n\t                          \t<div class=\"level-item-conslist-row\">\n\t\t\t\t\t\t\t    \t<span>\u65BD\u5DE5\u5730\u70B9:</span>\n\t\t\t\t\t\t\t    \t<span style=\"white-space:nowrap; text-overflow:ellipsis; overflow:hidden;\">{{protectcons.location}}</span>\n\t\t\t\t\t\t    \t</div>\n\t\t\t\t\t\t    \t<div class=\"level-item-conslist-row\">\n\t\t\t\t\t\t\t    \t<span>\u65BD\u5DE5\u539F\u56E0:</span>\n\t\t\t\t\t\t\t    \t<span>{{protectcons.constructreasonname}}</span>\n\t\t\t\t\t\t    \t</div>\n\t\t\t\t\t    \t</div>\n                         </div>        \n                         </nav>\n                         <nav class=\"level-protectcompany\" style=\"background-color: #f4f4f4;\">\n                          <!-- Right side -->\n                          <hr color=\"blue\">\n\t\t\t\t    \t</nav>\n                    </section>\n                    </div>\n                    <section name=\"detail\" class = \"detail protectcons none\" v-if = \"protectconsList.length == 0 \" >\n                        \u6CA1\u6709\u7B2C\u4E09\u65B9\u65BD\u5DE5\n                    </section>\n                    \n                </section>\n                \n                \n               </section>\n\t\t\t"
});