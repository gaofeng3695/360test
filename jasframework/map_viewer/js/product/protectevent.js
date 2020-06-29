"use strict";

/**
 * 巡检事件列表
 */
var protectevent = Vue.component('protectevent', {
    props: {
        /* 查询的是那个部门下的巡检事件 */
        departmentOidProp: String,

        /* 部门的层级 */
        hierarchyProp: String,
        parentIdProp: String
    },
    data: function data() {
        return {
            token: '',
            protecteventVm: '',

            /* 所有巡检事件 */
            protecteventList: [],
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
            layer: 'PROTECTEVENT',

            /* 当前部门 */
            department: [],

            /* 默认是第一页，默认一页30条 */
            pageNo: 1,
            eventtype: '',
            occurrencesite: '',
            rootPath: ''
        };
    },
    created: function created() {
        protectevent.protecteventVm = this;
        /*
        protectevent.protecteventVm.$options.methods.dateFormat();*/

        protectevent.protecteventVm.rootPath = protectevent.protecteventVm.$options.methods.getRootPath();
    },
    mounted: function mounted() {
        /* 获取到token */
        protectevent.protecteventVm.token = localStorage.getItem("token");
        /* 获取其他页面写的js公共方法 */

        var fra = parent.$("iframe");

        for (var i = 0; i < fra.length; i++) {
            if (fra[i].id == 'frm2d') {
                protectevent.protecteventVm.otherJs = fra[i].contentWindow;
                protectevent.protecteventVm.jasMapApi = fra[i].contentWindow.jasMapApi;
                protectevent.protecteventVm.mapWindow = fra[i].contentWindow;
            }
        }
        /* 设置导航栏。 */


        protectevent.protecteventVm.$options.methods.getParentDeparement(protectevent.protecteventVm.departmentOidProp, protectevent.protecteventVm.parentIdProp);
        /* 创建之初，请求得到所有的巡检事件。 */

        protectevent.protecteventVm.$options.methods.getProtectevent(protectevent.protecteventVm.riskratingProp, protectevent.protecteventVm.hierarchyProp, protectevent.protecteventVm.pageNo, protectevent.protecteventVm.eventtype, protectevent.protecteventVm.occurrencesite);
        /* 得到所有的巡检事件数量 */

        protectevent.protecteventVm.$options.methods.getEventStatistics(protectevent.protecteventVm.hierarchyProp);
    },
    methods: {
        getEventStatistics: function getEventStatistics(departmentHierarchy) {
            Vue.prototype.$http.post(protectevent.protecteventVm.rootPath + '/gpseventstatistics/getEventCount.do?departmentHierarchy=' + departmentHierarchy + '&token=' + protectcompany.vm.token).then(function (response) {
                /* 巡检事件数量 */
                if (response.data != null) {
                    protectevent.protecteventVm.gpsEventCount = response.data.data.total;
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
            Vue.prototype.$http.post(protectevent.protecteventVm.rootPath + '/realtimemonitor/realtimemonitor/getParentUnitList.do?unitId=' + departmentOid + '&token=' + protectevent.protecteventVm.token + '&parentId=' + parentId).then(function (response) {
                /* 设置列表部门。 */
                protectevent.protecteventVm.parentList = response.data.data;
                /* 设置当前部门 */

                protectevent.protecteventVm.department = protectevent.protecteventVm.parentList[protectevent.protecteventVm.parentList.length - 1];
            }).catch(function (error) {
                // handle error
                console.log(error);
            }).then(function () {// always executed
            });
        },

        /**
         * 点击部门名称获取站或者站下的所有巡检事件。
         * @param departmentOid 分公司的OID或者站的OID
         * @param pageNo 获取多少页的数据
         */
        getProtectevent: function getProtectevent(riskrating, hierarchy, pageNo, eventtype, occurrencesite) {
            /* 获取部门下的巡检事件。 */
            Vue.prototype.$http.post(protectevent.protecteventVm.rootPath + '/gpseventstatistics/getEventByUnitId.do?token=' + protectevent.protecteventVm.token + '&occurrencesite=' + occurrencesite + '&eventtype=' + eventtype + '&hierarchy=' + hierarchy + "&pageNo=" + pageNo, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                /* 设置巡检事件列表。 */
                protectevent.protecteventVm.protecteventList = response.data.data;
                /* 定位所有的巡检事件。 */

                protectevent.protecteventVm.$options.methods.positionEvent();
            }).catch(function (error) {
                // handle error
                console.log(error);
            }).then(function () {// always executed
            });
        },

        /**
         * 定位所有的巡检事件
         */
        positionEvent: function positionEvent() {
            /* 先清理所有地图上已经展示的图层。 */
            protectevent.protecteventVm.$options.methods.clearAllLayer();

            for (var i = 0; i < protectevent.protecteventVm.protecteventList.length; i++) {
                var array = [];
                var position = {};
                position.lon = protectevent.protecteventVm.protecteventList[i].lon;
                position.lat = protectevent.protecteventVm.protecteventList[i].lat;
                position.oid = protectevent.protecteventVm.protecteventList[i].oid;
                position.occurrencetime = protectevent.protecteventVm.protecteventList[i].occurrencetime;
                array.push(position);
                var option = {};
                option.url = "images/map_event.png";
                option.layerId = "PROTECTEVENT";
                option.width = 24;
                option.height = 24;
                option.attributes = {
                    "oid": position.oid,
                    "lon": position.lon,
                    "lat": position.lat,
                    "occurrencetime": position.occurrencetime
                };
                protectevent.protecteventVm.mapWindow.doPosition(array, JSON.stringify(option));
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
                options.layerId = "PROTECTEVENT_TEXT";
                protectevent.protecteventVm.jasMapApi.addTextGraphic(protectevent.protecteventVm.protecteventList[i].lon, protectevent.protecteventVm.protecteventList[i].lat, protectevent.protecteventVm.protecteventList[i].occurrencetime, options);
            } //添加点击事件


            protectevent.protecteventVm.jasMapApi.addLayerClickEventListener("PROTECTEVENT", function (e) {
                protectevent.protecteventVm.$options.methods.getEventInfo(e.graphic.attributes.oid, e.graphic.attributes.lon, e.graphic.attributes.lat);
            });
            /* 展示完毕后，将已经加载的图层加入到 allLayer 中 */

            protectevent.protecteventVm.allLayer.push(protectevent.protecteventVm.layer);
            protectevent.protecteventVm.allLayer.push("PROTECTEVENT");
            protectevent.protecteventVm.allLayer.push("PROTECTEVENT_TEXT");
        },

        /**
         * 事件高闪
         * @returns
         */
        locateEvent: function locateEvent(oid, lon, lat) {
            if (oid == 'undefined') {
                return;
            }

            if (lon == 'null' || lat == 'null') {
                $.messager.alert("提示", '没有定位坐标！', 'info');
                return;
            }

            var scale;

            if (protectevent.protecteventVm.layer == "PROTECTEVENT") {
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
            protectevent.protecteventVm.jasMapApi.flashGraphic(oid, protectevent.protecteventVm.layer, options);
        },

        /**
         * 清理掉地图上所有的图层
         */
        clearAllLayer: function clearAllLayer() {
            for (var i = 0; i < protectevent.protecteventVm.allLayer.length; i++) {
                protectevent.protecteventVm.jasMapApi.clearGraphicsLayer(protectevent.protecteventVm.allLayer[i]);
            }

            protectevent.protecteventVm.allLayer = [];
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
                protectevent.protecteventVm.$options.methods.clearAllLayer();
                protectevent.protecteventVm.jasMapApi.clearGraphicsLayer("PROTECTEVENT");
                protectevent.protecteventVm.jasMapApi.clearGraphicsLayer("PROTECTEVENT_TEXT");
                protectevent.protecteventVm.$emit("childupdatecompanyevent", oid, hierarchy);
            }
        },

        /**
         * 展示巡检事件详细信息
         */

        /*showprotecteventDetail( unitId, hierarchy, inspectorOid, insname ) {
             将组件内容切换为巡检事件详情
            this.$emit( "childupdateprotecteventdetailevent",unitId, hierarchy, inspectorOid, insname );
        },*/

        /**
         * 获取事件信息。
         */
        getEventInfo: function getEventInfo(dataId, lon, lat) {
            Vue.prototype.$http.post(protectevent.protecteventVm.rootPath + '/gpsevent/getInfo.do?oid=' + dataId + '&token=' + protectevent.protecteventVm.token).then(function (response) {
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
                content += "事件发生时间：";
                content += "</div>";
                content += "<div class=\"column  is-three-fifths\">";

                if (result.occurrencetime != null) {
                    content += result.occurrencetime;
                } else {
                    content += "暂无";
                }

                content += "</div>";
                content += "<div class=\"column  is-two-fifths\">";
                content += "事件监护人：";
                content += "</div>";
                content += "<div class=\"column  is-three-fifths\">";

                if (result.guardianname != null) {
                    content += result.guardianname;
                } else {
                    content += "暂无";
                }

                content += "</div>";
                content += "<div class=\"column  is-two-fifths\">";
                content += "<a class=\"button\" onclick=\"getEventInfoView('" + result.oid + "')\">详情</a>";
                content += "</div>";
                content += "</div>";
                var content1 = "<table class=\'detail-table\'>";
                content1 += "<tr>";
                content1 += "<th width='40%'><span>部门名称</span></th>";
                content1 += "<td width='40%'><span>";
                content1 += result.unitidname;
                content1 += "</span></td>";
                content1 += "</tr>";
                content1 += "<tr>";
                content1 += "<th width='40%'><span>管线标识</span></th>";
                content1 += "<td width='40%'><span>";

                if (result.lineloopoidname != null) {
                    content1 += result.lineloopoidname;
                } else {
                    content1 += "暂无";
                }

                content1 += "</span></td>";
                content1 += "</tr>";
                content1 += "<tr>";
                content1 += "<th width='40%'><span>事件发生时间</span></th>";
                content1 += "<td width='40%'><span>";

                if (result.occurrencetime != null) {
                    content1 += result.occurrencetime;
                } else {
                    content1 += "暂无";
                }

                content1 += "</span></td>";
                content1 += "</tr>";
                content1 += "<tr>";
                content1 += "<th width='40%'><span>事件监护人</span></th>";
                content1 += "<td width='40%'><span>";

                if (result.guardianname != null) {
                    content += result.guardianname;
                } else {
                    content += "暂无";
                }

                content1 += "</span></td>";
                content1 += "</tr>";
                content1 += "<tr>";
                content1 += "<td width='35%'  colspan=\"2\"><span>";
                content1 += "<a class=\"button\" onclick=\"getEventInfoView('" + dataId + "')\">详情</a>";
                content1 += "</span></td>";
                content1 += "</tr>";
                content1 += "</table>";
                var options = {
                    width: 300,
                    height: 245
                };
                jasMapApi.showInfoWindow(lon, lat, '巡检事件详情', content1, options);
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
            });
        },
        getEventInfoView: function getEventInfoView(dataId) {
            //protectcons.protectconsVm.otherJs.showDialog2('viewInfoGpsConstruction','第三方施工详细', "../../pipeprotect/gps_construction/gpsconstructionInfo/view_info_gps_construction.html?oid="+dataId, 950, 650,false);
            protectevent.protecteventVm.otherJs.top.getDlg("../../pipeprotect/gps_event/gpseventInfo/view_info_gps_event.html?eventoid=" + dataId, "viewInfoGpsEvent", "详细", 900, 650, false, true, true);
        },
        loadMore: function loadMore() {
            protectevent.protecteventVm.pageNo++;
            protectevent.protecteventVm.$options.methods.getProtectevent(protectevent.protecteventVm.riskratingProp, protectevent.protecteventVm.hierarchyProp, protectevent.protecteventVm.pageNo, protectevent.protecteventVm.eventtype, protectevent.protecteventVm.occurrencesite);
        },

        /**
         * 点击查询按钮
         */
        searchEvent: function searchEvent() {
            /* 清除地图上所有图标以及定时器 */
            protectevent.protecteventVm.$options.methods.clearAllLayer();
            /* 获取事件列表 */

            protectevent.protecteventVm.$options.methods.getProtectevent(protectevent.protecteventVm.riskratingProp, protectevent.protecteventVm.hierarchyProp, protectevent.protecteventVm.pageNo, protectevent.protecteventVm.eventtype, protectevent.protecteventVm.occurrencesite);
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
    template: "\n            <section class= \"all-department\">\n            <div class = \"department-head\">\n\t\t\t\t<nav class=\"breadcrumb\" aria-label=\"breadcrumbs\">\n                  <ul>\n                    <li v-for=\"( parent, index ) in parentList\" v-bind:key =\"parent.oid\" >\n                        <a v-if = \"parentList.length > 3\" v-on:click = \"getStation( parent.oid, parent.hierarchy )\" v-bind:title=\"parent.unitName\" href=\"#\">{{ parent.unitName.length > 6?parent.unitName.slice(0,5)+'...':parent.unitName }}</a>\n                        <a v-else-if = \"parentList.length == 2\" v-on:click = \"getStation( parent.oid, parent.hierarchy )\" v-bind:title=\"parent.unitName\" href=\"#\">{{ parent.unitName.length > 14?parent.unitName.slice(0,13)+'...':parent.unitName }}</a>\n                        <a v-else-if = \"parentList.length == 3\" v-on:click = \"getStation( parent.oid, parent.hierarchy )\" v-bind:title=\"parent.unitName\" href=\"#\">{{ parent.unitName.length > 8?parent.unitName.slice(0,7)+'...':parent.unitName }}</a>\n                        <a v-else v-on:click = \"getStation( parent.oid, parent.hierarchy )\" v-bind:title=\"parent.unitName\" href=\"#\">{{parent.unitName }}</a>\n                    </li>\n                  </ul>\n                </nav>\n                \n                <nav class=\"level protectevent\">\n                  <div class=\"level-item\" v-on:click = \"getProtectevent('', department.hierarchy,pageNo,eventtype,occurrencesite)\">\n                    <div class = 'level-item'>\n                        <img src=\"../map_viewer/images/event.png\"> \n                    </div>\n                    <div class=\"level-item-cons\" style=\"margin-top:3px\">\n                        <p>\u5DE1\u68C0\u4E8B\u4EF6\u603B\u6570</p>\n                     </div>\n                     <div class=\"level-item-cons\" style=\"margin-top:3px;margin-left:5px\">\n                        <p>{{ gpsEventCount }}</p>\n                    </div>\n                  </div>\n                  \n                  \n                </nav>\n                </div>\n                \n                \n                <!-- \u5DE1\u68C0\u4E8B\u4EF6\u5217\u8868 -->\n                <section class = \"all-company\" id = \"allDetail\">\n                    <!-- \u67E5\u8BE2\u9875\u9762 -->\n                    <nav class=\"level\">\n                        <div class=\"level-left form-person\">\n                            <div class=\"field is-grouped\">\n                                <select v-model=\"eventtype\" style=\"width:110px;padding: 0 0 0 5px; border:1px solid #dcd8d8; appearance:none;\" >\n\t\t\t\t\t\t\t       \n    \t\t\t\t\t\t\t\t<option value=\"\">\u8BF7\u9009\u62E9\u4E8B\u4EF6\u7C7B\u578B</option>\t\t\t\t\t\t\t        \n    \t\t\t\t\t\t\t\t<option value=\"01\">\u7BA1\u9053\u5360\u538B</option>\n\t\t\t\t\t\t\t        <option value=\"02\">\u53CD\u6253\u5B54\u76D7\u6CB9</option>\n\t\t\t\t\t\t\t    \t<option value=\"03\">\u5730\u8D28\u707E\u5BB3</option>\n\t\t\t\t\t\t\t    \t<option value=\"04\">\u7EBF\u8DEF\u8BBE\u65BD\u635F\u574F</option>\n\t\t\t\t\t\t\t    \t<option value=\"05\">\u7AD9\u573A\u9600\u5BA4\u8BBE\u65BD\u635F\u574F</option>\n    \t\t\t\t\t\t\t\t<option value=\"06\">\u7B2C\u4E09\u65B9\u65BD\u5DE5</option>\n    \t\t\t\t\t\t\t\t<option value=\"07\">\u5176\u4ED6</option>\n    \t\t\t\t\t\t\t</select> \n    \t\t\t\t\t\t\t<input v-model=\"occurrencesite\" class=\"input person-name\" type=\"text\" placeholder=\"\u65BD\u5DE5\u5730\u70B9\">\n                              \n                                <a class=\"button is-info\" v-on:click = \"searchEvent()\">\n                                  \u67E5\u8BE2\n                                </a>\n                              \n                            </div>\n                        </div>\n                        \n                    </nav>\n                    <div v-infinite-scroll=\"loadMore\" infinite-scroll-disabled=\"busy\" infinite-scroll-distance=\"0\">\n                    <section name=\"detail\" class = \"detail protectevent\" v-for=\"protectevent in protecteventList\" v-bind:key =\"protectevent.oid\" >\n                       \n                        <nav class=\"level\" style=\"margin:0\">\n                        \n                        <div class=\"level-item-conslist\">\n                        \t<div style=\"padding:1px 10px;\">\n\t    \t\t\t\t\t\t<div class=\"level-item-conslist-row\" v-on:click = \"getEventInfoView(protectevent.oid)\">\n\t    \t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t                          \t<span>\u4E8B\u4EF6\u7C7B\u578B:</span>\n\t\t\t                          \t<span  style=\"cursor: pointer;white-space:nowrap; text-overflow:ellipsis; overflow:hidden;\">{{protectevent.eventtypeCodeName}}</span>\n\t\t                        </div>\n\t                          \t<div class=\"level-item-conslist-row\">\n\t\t\t\t\t\t\t    \t<span>\u65BD\u5DE5\u65F6\u95F4:</span>\n\t\t\t\t\t\t\t    \t<span style=\"white-space:nowrap; text-overflow:ellipsis; overflow:hidden;\">{{protectevent.occurrencetime}}</span>\n\t\t\t\t\t\t    \t</div>\n\t\t\t\t\t\t    \t<div class=\"level-item-conslist-row\">\n\t\t\t\t\t\t\t    \t<span>\u65BD\u5DE5\u5730\u70B9:</span>\n\t\t\t\t\t\t\t    \t<span>{{protectevent.occurrencesite}}</span>\n\t\t\t\t\t\t    \t</div>\n\t\t\t\t\t    \t</div>\n                         </div>\n                        \n                        \n                        \n                        \n                        \n                         </nav>\n                          <nav class=\"level-protectcompany\">\n                          <!-- Right side -->\n\t\t\t\t    \t<hr color=\"blue\">\n\t\t\t\t    \t</nav>        \n                    </section>\n                    </div>\n                    <section name=\"detail\" class = \"detail protectevent none\" v-if = \"protecteventList.length == 0 \" >\n                        \u6CA1\u6709\u5DE1\u68C0\u4E8B\u4EF6\n                    </section>\n                    \n                </section>\n                \n                \n               </section>\n\t\t\t"
});