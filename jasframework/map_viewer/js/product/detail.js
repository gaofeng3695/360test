"use strict";

/**
 * 人员详细页面
 */
var detail = Vue.component('detail', {
    name: 'detail',
    props: {
        /* 人员OID */
        inspectorOidProp: String,
        departmentOidProp: String,
        hierarchyProp: String,
        insnameProp: String,
        parentIdProp: String
    },
    data: function data() {
        return {
            inspectorOid: '',
            departmentOid: '',
            hierarchy: '',
            insname: '',
            parentId: '',
            value1: '',
            token: '',

            /* 本站的总人数，在线人数，离线人数。*/
            totalCount: 0,
            onlineCount: 0,
            offlineCount: 0,

            /* 本部门所有的父级。 */
            parentList: [{
                "oid": 1,
                "hierarchy": 0,
                "unitName": "-"
            }],
            otherJs: '',
            jasMapApi: '',
            mapWindow: '',
            detailVm: '',

            /* 地图上展示的图层。 */
            allLayer: ["trajectory"],
            layer: 'PERSONDETAIL',

            /* 滚动条的值 */
            slideVal: 0,

            /* 人员基本信息 */
            personInfo: {
                insname: '',
                online: '',
                inspectortype: '',
                phone: '',
                deviceCode: '',
                sim: '',
                score: '',
                matching: '',
                insnamePlumber: ''
            },

            /* 输入框的时间 */
            date: '',

            /* 获取的人员区段集合 */
            rangeList: [],

            /* 人员区段的总长度 */
            rangeLength: 0,

            /* 获取的人员标准轨迹线集合 */
            standardLineList: [],

            /* 任务时间集合 */
            taskTimeList: [],

            /* 日期控件显示中文 */

            /*localeOption: {
                locale: Flatpickr.l10ns.zh,
                onChange: function onChange(selectedDates, dateStr, instance) {
                    detail.detailVm.date = dateStr;
                }
            },*/

            /* 任务时间关键点，根据任务时间OID获取。 */
            taskTimePointList: [],

            /* 所有的打点数据 */
            dotDataList: [],

            /* 当前倍速。 */
            speed: 1,

            /* 速度集合 */
            speeds: [{
                "id": "speed-1",
                "name": "1x",
                "speed": 2
            }, {
                "id": "speed-2",
                "name": "2x",
                "speed": 4
            }, {
                "id": "speed-3",
                "name": "3x",
                "speed": 6
            }],

            /* 速度选择索引 */
            speedIndex: 1,

            /* 当前轨迹点位置，也就是数组下标。 */
            currentDot: 0,

            /* 当前轨迹点的上一个点的位置，也就是数组下标。 */
            previousPoint: 0,

            /* 定时器 */
            timer: {},

            /* 开始巡检或者暂停,默认是暂停 */
            startOrPause: 1,

            /* 巡检开始时间 */
            startTime: '00:00',

            /* 巡检结束时间 */
            endTime: '00:00',

            /* 巡检时间段内已经巡检的关键点数量 */
            havePatrolKeyPointCount: 0,

            /* 巡检时间段内巡检的关键点总数量 */
            PatrolKeyPointCount: 0,

            /* 当前巡线工，当前时间，所有的任务关键点数量和临时关键点数量 */
            taskPointCount: 0,
            tempTaskPointCount: 0,

            /* 时间段选择索引 */
            timeIndex: 0,

            /* 进度条时间框 */
            timeBoxDisplay: true,
            // 控制时间框的显隐
            timeBoxPositionX: 0,
            // 控制时间框的位置
            timeBoxPositionY: 0,
            slidePosition: 0,

            /* 每个任务时间的最大速度 */
            maxSpeed: 0,
            rootPath: ''
        };
    },
    created: function created() {
        detail.detailVm = this;
        detail.detailVm.inspectorOid = detail.detailVm.inspectorOidProp;
        detail.detailVm.departmentOid = detail.detailVm.departmentOidProp;
        detail.detailVm.hierarchy = detail.detailVm.hierarchyProp;
        detail.detailVm.insname = detail.detailVm.insnameProp;
        detail.detailVm.parentId = detail.detailVm.parentIdProp;
        detail.detailVm.rootPath = detail.detailVm.$options.methods.getRootPath();
    },
    computed: {
        progressVal: function progressVal() {
            if (this.slideVal == 0) return 0 + "px";
            return (180 - 8) * (this.slideVal / 100) + "px";
        },

        /**
         * 打点数据的长度
         */
        dotDataListLength: function dotDataListLength() {
            return detail.detailVm.dotDataList.length;
        },

        /**
         * 每次走多少个点。根据倍速和所有点数计算
         * 默认每次走一个点，所以多少倍就是走多少个点
         */
        walkingDotCount: function walkingDotCount() {
            /* 如果总数不为零。 */
            if (detail.detailVm.dotDataListLength != 0) {
                /* 总数除以倍速就是每秒要走的点数量。 */
                return Math.ceil(detail.detailVm.speed);
            } else {
                return 0;
            }
        },
        startOrPauseImg: function startOrPauseImg() {
            if (detail.detailVm.startOrPause == 1) {
                /* 修改页面图标 */
                return "../map_viewer/images/pause.png";
            } else {
                /* 修改页面图标 */
                return "../map_viewer/images/play.png";
            }
        }
    },
    watch: {
        /**
         * 监听任务关键点集合
         */
        taskTimePointList: function taskTimePointList() {
            /* 首先先清空 */
            detail.detailVm.havePatrolKeyPointCount = 0;
            /* 找到所有的任务关键点数量和已经巡检的任务关键点数量 */

            detail.detailVm.PatrolKeyPointCount = detail.detailVm.taskTimePointList.length;

            if (detail.detailVm.taskTimePointList != null && detail.detailVm.taskTimePointList != undefined) {
                for (var i = 0; i < detail.detailVm.taskTimePointList.length; i++) {
                    /* 如果在线，在线数量加一 */
                    if (detail.detailVm.taskTimePointList[i].pointstatus == 1) {
                        detail.detailVm.havePatrolKeyPointCount++;
                    }

                    var item = detail.detailVm.taskTimePointList[i];
                    detail.detailVm.$options.methods.clickTaskPoint(item.lon, item.lat, item.pointid, item.flag, item.pointstatus, item.buffer, item.pointname);
                }
            }
        },

        /**
         * 监听任务时间列表，只要改变，清除掉所有地图图层
         */
        taskTimeList: function taskTimeList() {
            /* 清除掉所有图层数据 */
            detail.detailVm.$options.methods.clearAllLayer();

            if (detail.detailVm.taskTimeList != null && detail.detailVm.taskTimeList.length > 0) {
                /* 获取任务时间后，初始化任务时间关键点表。*/
                detail.detailVm.$options.methods.getTaskPointByTimeOid(detail.detailVm.taskTimeList[0].oid, detail.detailVm.taskTimeList[0].flag);
                /* 获取该任务时间下的所有打点数据。 */

                detail.detailVm.$options.methods.getDotData(detail.detailVm.taskTimeList[0].beginDateStr + " " + detail.detailVm.taskTimeList[0].beginTimeStr + ":00", detail.detailVm.taskTimeList[0].endDateStr + " " + detail.detailVm.taskTimeList[0].endTimeStr + ":00", detail.detailVm.inspectorOid);
                /* 默认获取第一条数据的开始时间和结束时间。*/

                detail.detailVm.startTime = detail.detailVm.taskTimeList[0].beginTimeStr;
                detail.detailVm.endTime = detail.detailVm.taskTimeList[0].endTimeStr;
            } else {
                /* 如果获取到的任务时间为null ,清除掉任务关键点*/
                detail.detailVm.taskTimePointList = [];
                detail.detailVm.dotDataList = [];
            }
        }
    },
    mounted: function mounted() {
        /* 获取到token */
        detail.detailVm.token = localStorage.getItem("token");
        /* 获取其他页面写的js公共方法 */

        var fra = parent.$("iframe");

        for (var i = 0; i < fra.length; i++) {
            if (fra[i].id == 'frm2d') {
                detail.detailVm.otherJs = fra[i].contentWindow;
                detail.detailVm.jasMapApi = fra[i].contentWindow.jasMapApi;
                detail.detailVm.mapWindow = fra[i].contentWindow;
            }
        }

        detail.detailVm.$options.methods.dateFormat();
        detail.detailVm.date = new Date().format('yyyy-MM-dd');
        detail.detailVm.$options.methods.initDetail(detail.detailVm.departmentOid, detail.detailVm.parentId, detail.detailVm.hierarchy);
    },
    methods: {
        dateFormat: function dateFormat() {
            /**
             * @desc JS日期格式化转换方法
             * @param fmt 日期时间的格式
             *
             * 调用方法
             * 	  获取当前时间  var time1 = new Date().format("yyyy-MM-dd hh:mm:ss");  console.log(time1);  // 2017-12-08  11:55:30
             *    将指定的日期转换为"年月日"的格式
             var oldTime = (new Date("2012/12/25 20:11:11")).getTime();
             var curTime = new Date(oldTime).format("yyyy-MM-dd");
             console.log(curTime);  // 2012-12-25
             *    将 "时间戳" 转换为 "年月日" 的格式
             var da = 1402233166999;
             da = new Date(da);
             var year = da.getFullYear()+'年';
             var month = da.getMonth()+1+'月';
             var date = da.getDate()+'日';
             console.log([year,month,date].join('-'));  // 2014年-6月-8日
             * 详情参考  https://www.cnblogs.com/tugenhua0707/p/3776808.html
             */
            Date.prototype.format = function (fmt) {
                var o = {
                    "M+": this.getMonth() + 1,
                    //月份
                    "d+": this.getDate(),
                    //日
                    "h+": this.getHours(),
                    //小时
                    "m+": this.getMinutes(),
                    //分
                    "s+": this.getSeconds(),
                    //秒
                    "q+": Math.floor((this.getMonth() + 3) / 3),
                    //季度
                    "S": this.getMilliseconds() //毫秒

                };

                if (/(y+)/.test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                }

                for (var k in o) {
                    if (new RegExp("(" + k + ")").test(fmt)) {
                        fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
                    }
                }

                return fmt;
            };
        },
        initDetail: function initDetail(_departmentOidProp, _parentIdProp, _hierarchyProp) {
            /* 设置导航栏。 */
            detail.detailVm.$options.methods.getParentDeparement(_departmentOidProp, _parentIdProp);
            /* 得到所有的人员数量 */

            detail.detailVm.$options.methods.getAllPersonOnlineOrOff(_departmentOidProp, _hierarchyProp);
            /* 获取人员基本信息 */

            detail.detailVm.$options.methods.getPeopleDetailInfo();
            /* 获取人员标准轨迹线信息 */

            detail.detailVm.$options.methods.getStandardLineList();
            /* 获取人员任务时间 */

            detail.detailVm.$options.methods.getTaskTimeList(function () {
                /* 获取到该人员当日的轨迹线，并渲染到地图上。 */
                detail.detailVm.$options.methods.renderToday();
            }); // 添加缓冲区图层

            var keyPointBuffer = {
                "id": "KEY_POINT_BUFFER",
                "type": "graphic"
            };
            detail.detailVm.jasMapApi.addLayer(keyPointBuffer);
            detail.detailVm.allLayer.push("KEY_POINT_BUFFER");
            /* 获取滑动条位置 */
            // detail.detailVm.slidePosition = document.getElementById('slide').offsetLeft;
        },
        initDetailProp: function initDetailProp(_inspectorOidProp, _departmentOidProp, _hierarchyProp, _insnameProp, _parentIdProp) {
            detail.detailVm.inspectorOid = _inspectorOidProp;
            detail.detailVm.departmentOid = _departmentOidProp;
            detail.detailVm.hierarchy = _hierarchyProp;
            detail.detailVm.insname = _insnameProp;
            detail.detailVm.parentId = _parentIdProp;
            detail.detailVm.$options.methods.initDetail(_departmentOidProp, _parentIdProp, _hierarchyProp);
        },

        /**
         * 通过任务时间OID获取到任务下的所有任务关键点（ 区分日常任务和临时任务 ）
         */
        getTaskPointByTimeOid: function getTaskPointByTimeOid(taskTimeOid, flag) {
            var methodName = "getTaskPointBo";

            if (flag == 1) {
                methodName = "getTempTaskPointBo";
            }

            Vue.prototype.$http.post(detail.detailVm.rootPath + '/realtimemonitor/realtimemonitor/' + methodName + '.do?token=' + detail.detailVm.token + "&tasktimeid=" + taskTimeOid).then(function (response) {
                if (response.data != null) {
                    /* 任务时间关键点 */
                    detail.detailVm.taskTimePointList = response.data.data;
                }
            }).catch(function (error) {
                console.log(error);
            }).then(function () {});
        },

        /**
         * 获取人员的基本信息
         */
        getPeopleDetailInfo: function getPeopleDetailInfo() {
            /* 获取选中的时间，如果时间为null或者空字符串就获取当前时间。 */
            console.log(detail.detailVm.date);
            Vue.prototype.$http.post(detail.detailVm.rootPath + '/gpsinspector/getPersonInfoBo.do?token=' + detail.detailVm.token + "&inspectorOid=" + detail.detailVm.inspectorOid + "&date=" + detail.detailVm.date).then(function (response) {
                if (response.data != null) {
                    /* 人员详情 */
                    detail.detailVm.personInfo = response.data;
                    /* 获取人员区段信息 */

                    detail.detailVm.$options.methods.getRange();
                    /* 获取所有的人员任务关键点数量 */

                    detail.detailVm.$options.methods.getAllKeyPointCount();
                }
            }).catch(function (error) {
                console.log(error);
            }).then(function () {});
        },

        /**
         * 获取本部门总人数，在线人数和离线人数。
         */
        getAllPersonOnlineOrOff: function getAllPersonOnlineOrOff(unitId, hierarchy) {
            /* 获取本部门的总人数，在线人数，离线人数。 */
            Vue.prototype.$http.post(detail.detailVm.rootPath + '/realtimemonitor/realtimemonitor/getInspectorCountByUnitid.do?unitid=' + unitId + '&token=' + detail.detailVm.token + '&hierarchy=' + hierarchy).then(function (response) {
                if (response.data.data != null && response.data.data.length > 0) {
                    detail.detailVm.totalCount = response.data.data[0].total;
                    detail.detailVm.onlineCount = response.data.data[0].insonline + response.data.data[0].inspipeonline;
                    detail.detailVm.offlineCount = response.data.data[0].insoffline + response.data.data[0].inspipeoffline;
                }
            }).catch(function (error) {
                // handle error
                console.log(error);
            }).then(function () {// always executed
            });
        },

        /**
         * 获取此人的巡检区段
         */
        getRange: function getRange() {
            Vue.prototype.$http.post(detail.detailVm.rootPath + '/gpsinsrange/getPage.do?token=' + detail.detailVm.token + "&inspectorid=" + detail.detailVm.inspectorOid + "&inspectorType=" + detail.detailVm.personInfo.inspectortype).then(function (response) {
                if (response.data.status == 1) {
                    if (response.data.status == 1 && response.data.rows.length > 0) {
                        detail.detailVm.rangeLength = 0;
                        /* 区段列表 */

                        detail.detailVm.rangeList = response.data.rows;
                        /* 算出来区段的总长度 */

                        for (var i = 0; i < detail.detailVm.rangeList.length; i++) {
                            detail.detailVm.rangeLength += detail.detailVm.rangeList[i].insRangeLength;
                        }
                    }
                } else {
                    detail.detailVm.$options.methods.successNotify("巡检区段获取失败");
                }
            }).catch(function (error) {
                console.log(error);
            }).then(function () {});
        },

        /**
         * 获取此人当天的所有任务的所有日常关键点数量和临时关键点数量
         */
        getAllKeyPointCount: function getAllKeyPointCount() {
            Vue.prototype.$http.post(detail.detailVm.rootPath + '/patrolxy/getPatrolxyKeyPointCount.do?token=' + detail.detailVm.token + "&inspectorOid=" + detail.detailVm.inspectorOid + "&date=" + detail.detailVm.date).then(function (response) {
                if (response.data.status == 1) {
                    if (response.data.status == 1) {
                        detail.detailVm.taskPointCount = response.data.data.task;
                        detail.detailVm.tempTaskPointCount = response.data.data.temp;
                    }
                } else {
                    detail.detailVm.$options.methods.successNotify("关键点数量获取失败");
                }
            }).catch(function (error) {
                console.log(error);
            }).then(function () {});
        },

        /**
         * 获取到此人的标准轨迹线
         */
        getStandardLineList: function getStandardLineList() {
            Vue.prototype.$http.post(detail.detailVm.rootPath + '/pathlinemain/getPage.do?token=' + detail.detailVm.token + "&inspectorid=" + detail.detailVm.inspectorOid).then(function (response) {
                if (response.data.status == 1) {
                    if (response.data.status == 1 && response.data.rows.length > 0) {
                        /* 区段列表 */
                        detail.detailVm.standardLineList = response.data.rows;
                    }
                } else {
                    detail.detailVm.$options.methods.successNotify("获取标准轨迹线失败");
                }
            }).catch(function (error) {
                console.log(error);
            }).then(function () {});
        },

        /**
         * 获取到此人的日常任务时间和临时任务时间
         */
        getTaskTimeList: function getTaskTimeList(callback) {
            Vue.prototype.$http.post(detail.detailVm.rootPath + '/gpsinspector/getCurrentDateTaskTime.do?token=' + detail.detailVm.token + "&inspectorOid=" + detail.detailVm.inspectorOid + "&date=" + detail.detailVm.date).then(function (response) {
                /* 任务时间列表 */
                detail.detailVm.taskTimeList = response.data;

                if (detail.detailVm.taskTimeList != null && detail.detailVm.taskTimeList.length != 0) {
                    detail.detailVm.maxSpeed = detail.detailVm.taskTimeList[0].speedMax;
                }

                if (callback) {
                    callback();
                }
            }).catch(function (error) {
                console.log(error);
            }).then(function () {});
        },

        /**
         * 根据开始时间结束时间和人员OID获取打点数据
         */
        getDotData: function getDotData(beginTime, endTime, inspectorOid) {
            detail.detailVm.$options.methods.loadingNotify("正在获取轨迹点数据...");
            Vue.prototype.$http.post(detail.detailVm.rootPath + '/patrolxy/getPatrolxyBybeginTimeAndEndTime.do?token=' + detail.detailVm.token + "&inspectorOid=" + inspectorOid + "&beginTime=" + beginTime + "&endTime=" + endTime).then(function (response) {
                if (response.data != null && response.data.data.length > 0) {
                    detail.detailVm.$options.methods.successNotify("轨迹点数据获取完成。");
                    /* 打点列表 */

                    detail.detailVm.dotDataList = response.data.data;
                    /* 删除掉之前的起始点。 */

                    detail.detailVm.jasMapApi.clearGraphicsLayer("starting");
                    /* 起点加上标志 */

                    detail.detailVm.allLayer.push("starting");
                    var startingOption = {};
                    startingOption.url = "images/starting-point.png";
                    startingOption.layerId = "starting";
                    startingOption.width = 24;
                    startingOption.height = 33;
                    startingOption.scale = 700;
                    detail.detailVm.$options.methods.positionPersonTrajectory(detail.detailVm.dotDataList[0].lon, detail.detailVm.dotDataList[0].lat, 'starting', null, startingOption);
                    detail.detailVm.$options.methods.ligature(detail.detailVm.dotDataList, 0, detail.detailVm.dotDataList.length);
                    var endOption = {};
                    endOption.url = "images/end-point.png";
                    endOption.layerId = "starting";
                    endOption.width = 24;
                    endOption.height = 33;
                    endOption.scale = 1000;
                    detail.detailVm.$options.methods.positionPersonTrajectory(detail.detailVm.dotDataList[detail.detailVm.dotDataList.length - 1].lon, detail.detailVm.dotDataList[detail.detailVm.dotDataList.length - 1].lat, 'end', null, endOption);
                } else {
                    detail.detailVm.dotDataList = [];
                    detail.detailVm.$options.methods.successNotify("任务时间内无轨迹点数据。");
                }
            }).catch(function (error) {
                console.log(error);
            }).then(function () {});
        },

        /**
         * 导航栏点击切换成分公司或者站
         * @param oid   部门OID
         * @param hierarchy 部门层级
         */
        getStation: function getStation(oid, hierarchy) {
            clearInterval(detail.detailVm.timer);
            /* 清除所有的地图图层。 */

            detail.detailVm.$options.methods.clearAllLayer();
            detail.detailVm.$emit("childupdatepageevent", oid, hierarchy);
        },

        /**
         * 获取到父部门数据
         * @param departmentOid
         */
        getParentDeparement: function getParentDeparement(departmentOid, parentId) {
            Vue.prototype.$http.post(detail.detailVm.rootPath + '/realtimemonitor/realtimemonitor/getParentUnitList.do?unitId=' + departmentOid + '&token=' + detail.detailVm.token + '&parentId=' + parentId).then(function (response) {
                /* 设置列表部门。 */
                detail.detailVm.parentList = response.data.data;
                /* 设置当前部门 */

                detail.detailVm.department = detail.detailVm.parentList[detail.detailVm.parentList.length - 1];
                /* 将人员信息加到导航栏。 */

                var personInfo = {};
                personInfo.oid = detail.detailVm.inspectorOid, personInfo.hierarchy = '', personInfo.unitName = detail.detailVm.insname, detail.detailVm.parentList.push(personInfo);
            }).catch(function (error) {
                // handle error
                console.log(error);
            }).then(function () {// always executed
            });
        },

        /**
         * 清理掉地图上所有的图层
         */
        clearAllLayer: function clearAllLayer() {
            /* 清楚定时器 */
            clearInterval(detail.detailVm.timer);

            for (var i = 0; i < detail.detailVm.allLayer.length; i++) {
                detail.detailVm.jasMapApi.clearGraphicsLayer(detail.detailVm.allLayer[i]);
            }

            detail.detailVm.allLayer = ["trajectory"];
        },

        /**
         * 拖动进度条的时候，需要根据进度改变当前人的位置
         */
        drag: function drag() {
            /* 改变巡线工的当前位置。 */
            detail.detailVm.currentDot = Math.ceil(detail.detailVm.slideVal * detail.detailVm.dotDataListLength / 100);
            /* 清除所有人员的轨迹线数据 */

            detail.detailVm.jasMapApi.clearGraphicsLayer("REAL_LINE");
            detail.detailVm.jasMapApi.clearGraphicsLayer("PERSON_DETAIL_TEXT");
            detail.detailVm.previousPoint = detail.detailVm.currentDot;
            /* 重新绘制原点到当前点的线路 */

            detail.detailVm.$options.methods.ligature(detail.detailVm.dotDataList, 0, detail.detailVm.currentDot);
            /* 清除人员图层 */

            detail.detailVm.jasMapApi.clearGraphicsLayer("trajectory");
            /* 定位当前位置 */

            if (detail.detailVm.startOrPause == 1) {
                /* 如果是暂停，画静止小人 */
                var option = {};
                option.url = "images/stand-1.png";
                option.layerId = "trajectory";
                option.width = 24;
                option.height = 24;
                option.scale = 1000;
                option.attributes = {
                    "oid": detail.detailVm.dotDataList[0].oid
                };
                detail.detailVm.jasMapApi.centerAt(detail.detailVm.dotDataList[detail.detailVm.currentDot].lon, detail.detailVm.dotDataList[detail.detailVm.currentDot].lat);
                detail.detailVm.$options.methods.positionPersonTrajectory(detail.detailVm.dotDataList[detail.detailVm.currentDot].lon, detail.detailVm.dotDataList[detail.detailVm.currentDot].lat, detail.detailVm.dotDataList[detail.detailVm.currentDot].oid, detail.detailVm.dotDataList[detail.detailVm.currentDot].locationDate, option);
            } else {
                detail.detailVm.jasMapApi.centerAt(detail.detailVm.dotDataList[detail.detailVm.currentDot].lon, detail.detailVm.dotDataList[detail.detailVm.currentDot].lat);
                detail.detailVm.$options.methods.positionPersonTrajectory(detail.detailVm.dotDataList[detail.detailVm.currentDot].lon, detail.detailVm.dotDataList[detail.detailVm.currentDot].lat, detail.detailVm.dotDataList[detail.detailVm.currentDot].oid, detail.detailVm.dotDataList[detail.detailVm.currentDot].locationDate);
            }
        },

        /**
         * 开始播放
         */
        start: function start() {
            if (detail.detailVm.dotDataListLength != null && detail.detailVm.dotDataListLength != 0) {
                /* 删除掉之前的起始点。 */
                detail.detailVm.jasMapApi.clearGraphicsLayer("starting");
                detail.detailVm.jasMapApi.clearGraphicsLayer("end");
                /* 清除所有人员的轨迹线数据 */

                detail.detailVm.jasMapApi.clearGraphicsLayer("REAL_LINE");
                detail.detailVm.jasMapApi.clearGraphicsLayer("PERSON_DETAIL_TEXT");
                /* 起点和终点加上标志 */

                detail.detailVm.allLayer.push("starting");
                detail.detailVm.allLayer.push("end");
                var startingOption = {};
                startingOption.url = "images/starting-point.png";
                startingOption.layerId = "starting";
                startingOption.width = 24;
                startingOption.height = 33;
                startingOption.scale = 1000;
                detail.detailVm.$options.methods.positionPersonTrajectory(detail.detailVm.dotDataList[0].lon, detail.detailVm.dotDataList[0].lat, 'starting', null, startingOption);
                var endOption = {};
                endOption.url = "images/end-point.png";
                endOption.layerId = "starting";
                endOption.width = 24;
                endOption.height = 33;
                endOption.scale = 1000;
                detail.detailVm.$options.methods.positionPersonTrajectory(detail.detailVm.dotDataList[detail.detailVm.dotDataList.length - 1].lon, detail.detailVm.dotDataList[detail.detailVm.dotDataList.length - 1].lat, 'end', null, endOption);
                /* 放大地图比例尺 */

                detail.detailVm.jasMapApi.setLevel(13);
                /* 切换标志 运行态 */

                detail.detailVm.startOrPause = 0;
                /* 位置移动到第一个点 */

                detail.detailVm.jasMapApi.centerAt(detail.detailVm.dotDataList[detail.detailVm.currentDot].lon, detail.detailVm.dotDataList[detail.detailVm.currentDot].lat);
                detail.detailVm.timer = setInterval(function () {
                    /* 记录当前点为上一个点 */
                    detail.detailVm.previousPoint = detail.detailVm.currentDot;
                    /* 当前点+每次走的点数就是下一个画点的地方，画点 */

                    detail.detailVm.currentDot += detail.detailVm.walkingDotCount;

                    if (detail.detailVm.currentDot < detail.detailVm.dotDataListLength) {
                        /* 先清理所有地图上已经展示的巡线工图层。 */
                        detail.detailVm.jasMapApi.clearGraphicsLayer("trajectory");
                        detail.detailVm.jasMapApi.clearGraphicsLayer("PERSON_DETAIL_TEXT");
                        /* 画上一个点与当前点的连线。 */

                        detail.detailVm.$options.methods.ligature(detail.detailVm.dotDataList, detail.detailVm.previousPoint, detail.detailVm.currentDot);
                        /* 画下一个点 */

                        detail.detailVm.$options.methods.positionPersonTrajectory(detail.detailVm.dotDataList[detail.detailVm.currentDot].lon, detail.detailVm.dotDataList[detail.detailVm.currentDot].lat, detail.detailVm.dotDataList[detail.detailVm.currentDot].oid, detail.detailVm.dotDataList[detail.detailVm.currentDot].locationDate);
                        /**
                         * 进度条加速度
                         * 100 / 当前点坐标 = 点数量总数 / 当前已经走的步数
                         */

                        detail.detailVm.slideVal = 100 * detail.detailVm.currentDot / detail.detailVm.dotDataListLength;
                    } else {
                        clearInterval(detail.detailVm.timer);
                        /* 删除掉之前的动态点，变更为静态人物。 */

                        detail.detailVm.jasMapApi.clearGraphicsLayer("trajectory");
                        detail.detailVm.jasMapApi.clearGraphicsLayer("PERSON_DETAIL_TEXT");
                        var option = {};
                        option.url = "images/stand-1.png";
                        option.layerId = "trajectory";
                        option.width = 24;
                        option.height = 24;
                        option.scale = 1000;
                        option.attributes = {
                            "oid": detail.detailVm.dotDataList[0].oid
                        };
                        /* 位置移动到第一个点 */

                        detail.detailVm.jasMapApi.centerAt(detail.detailVm.dotDataList[detail.detailVm.dotDataListLength - 1].lon, detail.detailVm.dotDataList[detail.detailVm.dotDataListLength - 1].lat);
                        detail.detailVm.$options.methods.positionPersonTrajectory(detail.detailVm.dotDataList[detail.detailVm.dotDataListLength - 1].lon, detail.detailVm.dotDataList[detail.detailVm.dotDataListLength - 1].lat, detail.detailVm.dotDataList[detail.detailVm.dotDataListLength - 1].oid, detail.detailVm.dotDataList[detail.detailVm.dotDataListLength - 1].locationDate, option);
                        detail.detailVm.slideVal = 100;
                        detail.detailVm.$options.methods.successNotify("轨迹回放结束");
                        /* 切换标志 */

                        detail.detailVm.startOrPause = 1;
                    }
                }, 1000);
            } else {
                detail.detailVm.$options.methods.successNotify("巡检坐标暂未获取");
            }
        },

        /**
         * 暂停
         */
        pause: function pause() {
            /* 暂停后，清除掉定时器，并且换掉图标。 */
            clearInterval(detail.detailVm.timer);
            /* 切换标志 */

            detail.detailVm.startOrPause = 1;
            /* 先清理所有地图上已经展示的巡线工图层。 */

            detail.detailVm.jasMapApi.clearGraphicsLayer("trajectory");
            var option = {};
            option.url = "images/stand-1.png";
            option.layerId = "trajectory";
            option.width = 24;
            option.scale = 1000;
            option.height = 24;
            option.attributes = {
                "oid": detail.detailVm.dotDataList[detail.detailVm.currentDot].oid
            };
            /* 位置移动到第一个点 */

            detail.detailVm.jasMapApi.centerAt(detail.detailVm.dotDataList[detail.detailVm.currentDot].lon, detail.detailVm.dotDataList[detail.detailVm.currentDot].lat);
            detail.detailVm.$options.methods.positionPersonTrajectory(detail.detailVm.dotDataList[detail.detailVm.currentDot].lon, detail.detailVm.dotDataList[detail.detailVm.currentDot].lat, detail.detailVm.dotDataList[detail.detailVm.currentDot].oid, detail.detailVm.dotDataList[detail.detailVm.currentDot].locationDate, option);
        },

        /**
         * 重置
         */
        reset: function reset() {
            /* 首先清除定时器 */
            clearInterval(detail.detailVm.timer);
            /* 当前点和当前滑动条值为零 */

            detail.detailVm.slideVal = 0;
            detail.detailVm.currentDot = 0;
            detail.detailVm.previousPoint = 0;
            /* 更换图标为暂停 */

            detail.detailVm.startOrPause = 1;
            /* 清除地图上的小人，并且定位到第一个点的位置 */

            /* 先清理所有地图上已经展示的巡线工图层。 */

            detail.detailVm.jasMapApi.clearGraphicsLayer("trajectory");
            detail.detailVm.jasMapApi.clearGraphicsLayer("PERSON_DETAIL_TEXT");
            /* 清除所有人员的轨迹线数据 */

            detail.detailVm.jasMapApi.clearGraphicsLayer("REAL_LINE");
            /* 将静止的小人定位在最初的位置上。 */

            if (detail.detailVm.dotDataList != null && detail.detailVm.dotDataList.length > 0) {
                var option = {};
                option.url = "images/stand-1.png";
                option.layerId = "trajectory";
                option.width = 24;
                option.height = 24;
                option.scale = 1000;
                option.attributes = {
                    "oid": detail.detailVm.dotDataList[0].oid
                };
                /* 位置移动到第一个点 */

                detail.detailVm.jasMapApi.centerAt(detail.detailVm.dotDataList[0].lon, detail.detailVm.dotDataList[0].lat);
                detail.detailVm.$options.methods.positionPersonTrajectory(detail.detailVm.dotDataList[0].lon, detail.detailVm.dotDataList[0].lat, detail.detailVm.dotDataList[0].oid, detail.detailVm.dotDataList[0].locationDate, option);
            }
        },

        /**
         * 开始或者暂停
         */
        startOrPauseMethod: function startOrPauseMethod() {
            /* 如果是开始 */
            if (detail.detailVm.startOrPause == 0) {
                detail.detailVm.$options.methods.pause();
            } else {
                /* 清除之前的轨迹线，人员和标注 */
                detail.detailVm.jasMapApi.clearGraphicsLayer("PERSON_DETAIL_TEXT");
                detail.detailVm.jasMapApi.clearGraphicsLayer("PERSON_DETAIL");
                detail.detailVm.jasMapApi.clearGraphicsLayer("REAL_TIME_LINE");
                detail.detailVm.$options.methods.start();
            }
        },

        /**
         * 定位
         */
        positionPersonTrajectory: function positionPersonTrajectory(lon, lat, oid, date, option, sign) {
            /* 经纬度不为NULL才能定位。 */
            if (lon != null && lon != '' && lat != null && lat != '') {
                var array = [];
                var position = {};
                position.lon = lon;
                position.lat = lat;
                position.oid = oid;
                array.push(position);

                if (option == undefined || option == null || option == '') {
                    detail.detailVm.jasMapApi.clearGraphicsLayer("trajectory");
                    detail.detailVm.jasMapApi.clearGraphicsLayer("PERSON_DETAIL_TEXT");
                    detail.detailVm.jasMapApi.clearGraphicsLayer("PERSON_DETAIL");
                    option = {};
                    option.url = "images/inspector.gif";
                    option.layerId = "trajectory";
                    option.width = 24;
                    option.height = 24;
                    option.scale = 700;
                    option.attributes = {
                        "oid": position.oid
                    };
                } // detail.detailVm.jasMapApi.setLevel(13);
                // detail.detailVm.jasMapApi.addPictureGraphic( array, JSON.stringify(option) );


                if (sign == undefined || sign == null || sign == '') detail.detailVm.mapWindow.doPosition(array, JSON.stringify(option), 100);else detail.detailVm.mapWindow.doPosition(array, JSON.stringify(option), 99);

                if (date != null && date != '') {
                    /* 新增时间标注 。*/
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
                    options.xOffset = -55;
                    options.yOffset = -30;
                    options.center = false;
                    options.layerId = "PERSON_DETAIL_TEXT";
                    detail.detailVm.jasMapApi.addTextGraphic(lon, lat, detail.detailVm.insname + date, options);
                }
            }

            detail.detailVm.allLayer.push("PERSON_DETAIL_TEXT");
        },

        /**
         *  转化xy坐标
         * @returns
         */
        translateXY: function translateXY(x, y) {
            //这里的坐标一般是经纬度坐标，要转化成和底图坐标系的坐标值
            x = parseFloat(x);
            y = parseFloat(y);
            var coors = detail.detailVm.jasMapApi.coorsToXY(x, y);
            return coors;
        },

        /**
         * 成功提示信息
         * @param content
         */
        successNotify: function successNotify(content) {
            detail.detailVm.$notify({
                title: '成功',
                message: content,
                type: 'success'
            });
        },

        /**
         * 等待提示信息
         * @param content
         */
        loadingNotify: function loadingNotify(content) {
            detail.detailVm.$notify.info({
                title: '消息',
                message: content
            });
        },

        /**
         * 定位区段，巡检长度，标准轨迹线。暂时只提示无坐标。
         */
        position: function position() {
            detail.detailVm.$options.methods.successNotify("定位坐标暂未获取");
        },

        /**
         * 定位标准轨迹线。
         */
        positionStandard: function positionStandard(oid, bufferwidth) {
            var query = {
                layerId: "gps_pathline",
                where: "PATHLINEMAINOID = '" + oid + "'",
                outFields: ["*"]
            };
            var queryArray = [query];
            var paramp = {
                "fieldName": "PATHLINEMAINOID"
            };
            var where = {
                "where": "PATHLINEMAINOID = '" + oid + "'",
                "show": true
            };
            detail.detailVm.jasMapApi.updateLayer('gps_pathline', where);
            detail.detailVm.jasMapApi.flashGraphic(oid, "gps_pathline", paramp);
            detail.detailVm.jasMapApi.queryFeatures(queryArray, function (features) {
                detail.detailVm.jasMapApi.queryBufferGraphic(features[0][0].geometry, bufferwidth, {
                    layerId: "STANDARD_LINE_BUFFER",
                    draw: true,
                    color: [37, 232, 65, 120],
                    layerIndex: 0
                });
            });
        },

        /**
         * 点击查询按钮
         */
        searchTime: function searchTime() {
            /* 获取人员基本信息 */
            detail.detailVm.$options.methods.getPeopleDetailInfo();
            /* 获取人员任务时间 */

            detail.detailVm.$options.methods.getTaskTimeList();
            /* 清除地图上所有图标以及定时器 */

            detail.detailVm.$options.methods.clearAllLayer();
        },

        /**
         * 加速
         */
        accelerate: function accelerate(speed, speedIndex) {
            detail.detailVm.speed = speed;
            detail.detailVm.speedIndex = speedIndex;
        },

        /**
         * 时间段选择索引
         * @param flag 0 表示日常任务，1表示临时任务
         */
        selectTimeRange: function selectTimeRange(timeIndex, beginDate, endDate, beginTime, endTime, timeOid, flag, speedMax) {
            detail.detailVm.maxSpeed = speedMax;
            detail.detailVm.timeIndex = timeIndex;
            /* 清除所有打点数据 */

            detail.detailVm.dotDataList = [];
            /* 清除地图上所有图标,以及定时器 */

            detail.detailVm.$options.methods.clearAllLayer();
            /* 重新获取开始时间，结束时间 */

            detail.detailVm.startTime = beginTime;
            detail.detailVm.endTime = endTime;
            /* 进度条归零 */

            detail.detailVm.slideVal = 0;
            /* 切换标志 */

            detail.detailVm.startOrPause = 1;
            /* 当前位置归零 */

            detail.detailVm.currentDot = 0;
            /* 当前的上一个位置位置归零 */

            detail.detailVm.previousPoint = 0;
            /* 获取所有的任务关键点 */

            detail.detailVm.$options.methods.getTaskPointByTimeOid(timeOid, flag);
            /* 获取该任务时间下的所有打点数据。 */

            detail.detailVm.$options.methods.getDotData(beginDate + " " + beginTime + ":00", endDate + " " + endTime + ":00", detail.detailVm.inspectorOid);
        },

        /**
         * 点击任务关键点后定位
         * @param lon 经度
         * @param lat 纬度
         * @param flag 0 表示是常规关键点，1 是临时关键点
         */
        clickTaskPoint: function clickTaskPoint(lon, lat, oid, flag, pointstatus, buffer, pointName) {
            /* 放大地图比例尺 */
            detail.detailVm.jasMapApi.setLevel(13);
            var option = {};
            var geomJson = {
                "x": lon,
                "y": lat,
                "spatialReference": {
                    "wkid": 4490
                }
            };
            var options = {};
            /* 如果是常规关键点就显示常规关键点的坐标和缓冲区 。*/

            if (flag == 0) {
                /* 关键点是否到达 */
                if (pointstatus == 0) {
                    /* 没到达 */
                    option = {
                        url: "images/keypoint_flag_red.png",
                        // 图标地址
                        width: 24,
                        // 图标大小
                        height: 24,
                        attributes: {
                            "oid": oid,
                            "flag": 0
                        },
                        // 图标属性
                        layerId: "TASK_KEY_POINT",
                        layerIndex: 300
                    }; // 关键点缓冲区

                    options = {
                        "draw": true,
                        //是否将结果绘制到图层上
                        "layerId": "KEY_POINT_BUFFER",
                        //绘制到图层id
                        "layerIndex": 100,
                        "attributes": null,
                        //绘制的样式
                        "width": 1,
                        "color": [255, 0, 0, 120],
                        //填充色
                        "style": "solid",
                        "outlineColor": [255, 0, 0, 0.35],
                        "outlineWidth": 1,
                        "outlineStyle": "solid",
                        "callback": null,
                        "fieldName": oid
                    };
                } else {
                    /* 已经到达*/
                    option = {
                        url: "images/keypoint_flag_green.png",
                        // 图标地址
                        width: 24,
                        // 图标大小
                        height: 24,
                        attributes: {
                            "oid": oid,
                            "flag": 0
                        },
                        // 图标属性
                        layerId: "TASK_KEY_POINT",
                        layerIndex: 300
                    }; // 关键点缓冲区

                    options = {
                        "draw": true,
                        //是否将结果绘制到图层上
                        "layerId": "KEY_POINT_BUFFER",
                        //绘制到图层id
                        "layerIndex": 100,
                        "attributes": null,
                        //绘制的样式
                        "width": 1,
                        "color": [37, 232, 65, 120],
                        //填充色
                        "style": "solid",
                        "outlineColor": [131, 201, 124, 0.35],
                        "outlineWidth": 1,
                        "outlineStyle": "solid",
                        "callback": null,
                        "fieldName": oid
                    };
                }
            } else {
                /* 关键点是否到达 */
                if (pointstatus == 0) {
                    /* 没到达 */
                    option = {
                        url: "images/temp-key-point-1.png",
                        // 图标地址
                        width: 24,
                        // 图标大小
                        height: 24,
                        attributes: {
                            "oid": oid,
                            "flag": 1
                        },
                        // 图标属性
                        layerId: "TASK_KEY_POINT",
                        layerIndex: 300
                    }; // 关键点缓冲区

                    options = {
                        "draw": true,
                        //是否将结果绘制到图层上
                        "layerId": "KEY_POINT_BUFFER",
                        //绘制到图层id
                        "layerIndex": 100,
                        "attributes": null,
                        //绘制的样式
                        "width": 1,
                        "color": [255, 0, 0, 120],
                        //填充色
                        "style": "solid",
                        "outlineColor": [255, 0, 0, 0.35],
                        "outlineWidth": 1,
                        "outlineStyle": "solid",
                        "callback": null,
                        "fieldName": oid
                    };
                } else {
                    /* 已经到达*/
                    option = {
                        url: "images/temp-key-point-2.png",
                        // 图标地址
                        width: 24,
                        // 图标大小
                        height: 24,
                        attributes: {
                            "oid": oid,
                            "flag": 1
                        },
                        // 图标属性
                        layerId: "TASK_KEY_POINT",
                        layerIndex: 300
                    }; // 关键点缓冲区

                    options = {
                        "unitType": "m",
                        "draw": true,
                        // 是否将结果绘制到图层上
                        "layerId": "KEY_POINT_BUFFER",
                        // 绘制到图层id
                        "layerIndex": 12,
                        "attributes": null,
                        //绘制的样式
                        "width": 1,
                        "color": [37, 232, 65, 120],
                        //填充色
                        "style": "solid",
                        "outlineColor": [131, 201, 124, 0.35],
                        "outlineWidth": 1,
                        "outlineStyle": "solid",
                        "callback": null,
                        "fieldName": oid
                    };
                }
            }
            /* 定位关键点 */


            detail.detailVm.jasMapApi.clearMapGraphics();
            detail.detailVm.jasMapApi.centerAt(lon, lat);
            detail.detailVm.jasMapApi.queryBufferGraphic(geomJson, buffer, options);
            detail.detailVm.jasMapApi.addPictureGraphic(lon, lat, option);
            /* 添加点击事件 */

            detail.detailVm.jasMapApi.addLayerClickEventListener("TASK_KEY_POINT", function (e) {
                var attributes = e.graphic.attributes;
                var oid = attributes.oid;
                var flag = attributes.flag;

                if (flag == 0) {
                    detail.detailVm.otherJs.showDialog2('viewGpsKeypoint', '关键点详细', '../../realtimemonitor/realtimemonitor/gpskeypoint.html?oid=' + oid, 800, 600, false, ''); //queryTop(oid,"GPS_KEYPOINT","../../linePatrolManage/pathLine/keypoint/view_gps_keypoint.html?oid=","viewGpsKeypoint","详细");
                } else if (flag == 1) {
                    detail.detailVm.otherJs.showDialog2('viewGpsTemporaryKeypoint', '关键点详细', '../../realtimemonitor/realtimemonitor/gpstemporarykeypoint.html?oid=' + oid, 800, 600, false, ''); //queryTop(oid,"gps_temporary_keypoint","../../linePatrolManage/insTask/temporaryKeypoint/view_gps_temporary_keypoint.html?oid=","viewGpsTemporaryKeypoint","详细");
                }
            });
            /* 文字标注 */

            options = {};
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
            options.xOffset = -20;
            options.yOffset = -30;
            options.center = false;
            options.layerId = "COMPANY_TEXT";
            person.personVm.jasMapApi.addTextGraphic(lon, lat, pointName, options);
            /* 如果地图上已经标绘，就不在重新画了。 */

            if (detail.detailVm.allLayer.indexOf("KEY_POINT_BUFFER") == -1) {
                /* 将关键点图层ID和缓冲区图层ID加入到图层列表中。 */
                detail.detailVm.allLayer.push("KEY_POINT_BUFFER");
            }
            /* 如果地图上已经标绘，就不在重新画了。 */


            if (detail.detailVm.allLayer.indexOf("TASK_KEY_POINT") == -1) {
                /* 将关键点图层ID和缓冲区图层ID加入到图层列表中。 */
                detail.detailVm.allLayer.push("TASK_KEY_POINT");
            }

            if (detail.detailVm.allLayer.indexOf("COMPANY_TEXT") == -1) {
                /* 将关键点图层ID和缓冲区图层ID加入到图层列表中。 */
                detail.detailVm.allLayer.push("COMPANY_TEXT");
            }
        },

        /**
         * 点击闪烁
         * @param lon 经度
         * @param lat   纬度
         * @param oid   oid
         * @param flag  日常任务还是临时任务
         * @param pointstatus   关键点状态
         * @param buffer    关键点缓冲区
         */
        clickTaskPointFlash: function clickTaskPointFlash(lon, lat, oid, flag, pointstatus, buffer) {
            var flashOptions = {
                "repeatCount": 5,
                "delay": 500,
                // ms
                "fieldName": "oid",
                "center": true,
                // 是否居中
                "flash": true,
                // 是否闪烁
                "scale": 3000,
                "expand": 1.5,
                "shineCurve": function shineCurve(v) {
                    return 0.001 * v * v * v * v;
                }
            };
            detail.detailVm.jasMapApi.flashGraphic(oid, "TASK_KEY_POINT", flashOptions);
        },

        /**
         * 给定一个数组，指定需要连线的开始位置和结束位置，将中间连成线。
         * @param pointArray        点数组
         * @param beginSubscript    开始连线下标
         * @param endSubscript      结束连线坐标
         */
        ligature: function ligature(pointArray, beginSubscript, endSubscript, layerId) {
            var layer = 'REAL_LINE';

            if (layerId != undefined && layerId != null && layerId != '') {
                layer = layerId;
            }
            /* 线属性 */


            var lineOptions = {
                "layerId": layer,
                // 回放时加载的动态轨迹
                "attributes": null,
                "center": false,
                "width": 3,
                "color": [16, 102, 181, 255],
                // 蓝色
                "style": "solid"
            };
            /* 如果结束节点超出了范围，就把结束节点设置为数组的最后一个节点。 */

            if (endSubscript >= pointArray.length) {
                endSubscript = pointArray.length - 1;
            }
            /* 得到要循环的次数 */


            var count = endSubscript - beginSubscript;
            /* 开始循环划线 */

            for (var i = 0; i < count; i++) {
                var point = [];
                var line = [];
                var paths = [];
                point.push(pointArray[beginSubscript + i].lon);
                point.push(pointArray[beginSubscript + i].lat);
                line.push(point);
                point = [];
                point.push(pointArray[beginSubscript + (i + 1)].lon);
                point.push(pointArray[beginSubscript + (i + 1)].lat);
                line.push(point);
                /* 如果终点的点超速，就画红线。 */

                if (pointArray[beginSubscript + (i + 1)].speed > detail.detailVm.maxSpeed) {
                    lineOptions.color = [255, 0, 0, 255];
                }

                paths.push(line);
                detail.detailVm.jasMapApi.addPolylineGraphic(paths, lineOptions, false);
            }
            /* 如果地图上已经标绘，就不在重新画了。 */


            if (detail.detailVm.allLayer.indexOf("REAL_LINE") == -1) {
                /* 将关键点图层ID和缓冲区图层ID加入到图层列表中。 */
                detail.detailVm.allLayer.push("REAL_LINE");
            }
        },

        /**
         * 实现时间框
         * @param event
         */
        showVideoTime: function showVideoTime(event) {
            /* 时间框应该显示的位置 */
            detail.detailVm.timeBoxDisplay = false;
            detail.detailVm.timeBoxPositionX = event.clientX - 115;
            detail.detailVm.timeBoxPositionY = event.clientY - 80;
            /* 获取鼠标的位置与进度条位置的相对值 layerX */

            /* var distance = event.layerX - detail.detailVm.slidePosition;
             var proportion = 1;*/
        },

        /**
         * 隐藏时间框
         * @param event
         */
        hideVideoTime: function hideVideoTime(event) {
            /* 时间框应该显示的位置 */
            detail.detailVm.timeBoxDisplay = true;
            detail.detailVm.timeBoxPositionX = 0;
            detail.detailVm.timeBoxPositionY = 0;
        },

        /**
         * 获取人员列表
         * @param online 在线 1， 离线 0 ，不区分不传值
         * @param hierarchy 当前部门层级
         */
        getEmployeeByUnitId: function getEmployeeByUnitId(departmentOid, hierarchy, online, inspectorType) {
            clearInterval(detail.detailVm.timer);
            detail.detailVm.$options.methods.clearAllLayer();
            /* 切换到人员列表页面 */

            this.$emit("childupdatepersonevent", departmentOid, hierarchy, online, inspectorType);
        },

        /**
         * 显示人员详情
         */
        showDetail: function showDetail(inspectorType, personOid) {
            if (inspectorType == '01') {
                detail.detailVm.otherJs.showDialog2('patrolman', '详情', '../../resourcemanage/insmanage/viewAll_gps_inspector.html?oid=' + personOid, 800, 600, false, '');
            } else {
                detail.detailVm.otherJs.showDialog2('patrolman', '详情', '../../resourcemanage/insmanage/viewAll_gps_inspector.html?oid=' + personOid, 800, 600, false, '');
            }
        },

        /**
         * 渲染第一此任务时间所有的轨迹
         */
        renderToday: function renderToday() {
            /* */
        },

        /**
         * 渲染当日轨迹,这里的渲染当日轨迹就是真正的当天所有线路，但是因为当天所有轨迹太乱了，所有改为默认第一个任务的轨迹。
         */
        renderTodayBackup: function renderTodayBackup() {
            var beginTime = detail.detailVm.date + " 00:00:00";
            var endTime = detail.detailVm.date + " 23:59:59";
            var inspectorOid = detail.detailVm.inspectorOid;
            /* 清除之前的点，画下一个点 */

            Vue.prototype.$http.post(detail.detailVm.rootPath + '/patrolxy/getPatrolxyBybeginTimeAndEndTime.do?token=' + detail.detailVm.token + "&inspectorOid=" + inspectorOid + "&beginTime=" + beginTime + "&endTime=" + endTime).then(function (response) {
                if (response.data != null && response.data.data.length > 0) {
                    /* 打点列表 */
                    var dataList = response.data.data;
                    var length = dataList.length;
                    /* 删除掉之前的起始点。 */

                    detail.detailVm.jasMapApi.clearGraphicsLayer("starting");
                    /* 起点加上标志 */

                    detail.detailVm.allLayer.push("starting");
                    var startingOption = {};
                    startingOption.url = "images/starting-point.png";
                    startingOption.layerId = "starting";
                    startingOption.width = 24;
                    startingOption.height = 33;
                    startingOption.scale = 700;
                    detail.detailVm.$options.methods.positionPersonTrajectory(dataList[0].lon, dataList[0].lat, 'starting', null, startingOption);
                    detail.detailVm.$options.methods.ligature(dataList, 0, length - 1, 'REAL_TIME_LINE');
                    detail.detailVm.allLayer.push("REAL_TIME_LINE");
                    /* 定位到这个人的当前位置 */

                    detail.detailVm.jasMapApi.centerAt(dataList[length - 1].lon, dataList[length - 1].lat); // detail.detailVm.$options.methods.positionPersonTrajectory( dataList[length-1].lon, dataList[length-1].lat, dataList[length-1].oid,dataList[length-1].locationDate );
                }
            }).catch(function (error) {
                console.log(error);
            }).then(function () {});
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
    template: "\n                <section>\n                    <nav class=\"breadcrumb\" aria-label=\"breadcrumbs\">\n                      <ul>\n                        <li v-for=\"( parent, index ) in parentList\" v-bind:key =\"parent.oid\" >\n                            <a v-if = \"parentList.length <= 2\" v-on:click = \"getStation( parent.oid, parent.hierarchy )\" v-bind:title=\"parent.unitName\" href=\"#\">{{ parent.unitName }}</a>\n                            <a v-else-if = \"parentList.length == 3\" v-on:click = \"getStation( parent.oid, parent.hierarchy )\" v-bind:title=\"parent.unitName\" href=\"#\">{{ parent.unitName.length > 5?parent.unitName.slice(0,6)+'..':parent.unitName }}</a>\n                            <a v-else v-on:click = \"getStation( parent.oid, parent.hierarchy )\" v-bind:title=\"parent.unitName\" href=\"#\">{{ parent.unitName.length > 4?parent.unitName.slice(0,4)+'.':parent.unitName }}</a>\n                        </li>\n                      </ul>\n                    </nav>\n                    \n                    <nav class=\"level person\">\n                      <div class=\"level-item has-text-centered\" v-on:click = \"getEmployeeByUnitId( department.oid, department.hierarchy, '', '' )\">\n                        <div class = \"ins-img\">\n                            <img src=\"../map_viewer/images/allIns.png\"> \n                        </div>\n                        <div class = \"ins-count\">\n                            <p class=\"heading\">\u5168\u90E8</p>\n                            <p>{{ totalCount }}</p>\n                        </div>\n                      </div>\n                      \n                      <div class=\"level-item has-text-centered\" v-on:click = \"getEmployeeByUnitId( department.oid, department.hierarchy, '1', '' )\">\n                        <div class = \"ins-img\">\n                            <img src=\"../map_viewer/images/allonIns.png\"> \n                        </div>\n                        <div class = \"ins-count\">\n                          <p class=\"heading\">\u5728\u7EBF</p>\n                          <p>{{ onlineCount }}</p>\n                        </div>\n                      </div>\n                      <div class=\"level-item has-text-centered last\" v-on:click = \"getEmployeeByUnitId( department.oid, department.hierarchy, '0', '' )\">\n                        <div class = \"ins-img\">\n                            <img src=\"../map_viewer/images/alloffIns.png\"> \n                        </div>\n                        <div class = \"ins-count\">\n                          <p class=\"heading\">\u79BB\u7EBF</p>\n                          <p>{{ offlineCount }}</p>\n                        </div>\n                      </div>\n                    </nav>\n                    \n                    <section class = \"person-detail\">\n                       <!-- \u4EBA\u5458\u8BE6\u60C5\u641C\u7D22 -->\n                       <nav class=\"level search\">\n                         <!-- Left side -->\n                         <div class=\"level-left\">\n                           <div class=\"level-item\">\n                           <el-date-picker\n                              v-model=\"date\"\n                              value-format=\"yyyy-MM-dd\"\n                              type=\"date\"\n                              v-bind:placeholder=\"date\"\n                              placeholder=\"\u9009\u62E9\u65E5\u671F\">\n                            </el-date-picker>\n                              <a class=\"button is-info\" v-on:click = \"searchTime()\">\n                                  \u67E5\u8BE2\n                              </a>\n                           </div>\n                         </div>\n                         <!-- Right side -->\n                         <div class=\"level-right\">\n                         </div>\n                       </nav>\n                       <!-- \u4EBA\u5458\u8BE6\u60C5\u4FE1\u606F -->\n                       <div class=\"content\">\n                          <div class = \"info\">\n                              <div class=\"columns is-gapless is-multiline\">\n                                  <div class=\"column is-full\">\n                                      <div class=\"columns is-gapless is-multiline\">\n                                          <div class=\"column is-four-seven\">\n                                            <span class = \"type\" v-if = \"personInfo.inspectortype == '01'\" ><img title = \"\u5DE1\u7EBF\u5DE5\" src = \"../map_viewer/images/insall.png\"/></span>\n                                            <span class = \"type\" v-else ><img title = \"\u7BA1\u9053\u5DE5\" src = \"../map_viewer/images/inspipeall.png\"/></span>\n                                            <a href=\"#\" v-on:click = \"showDetail('01',personInfo.oid)\" v-if = \"personInfo.inspectortype == '01'\" v-bind:title = \"personInfo.insname\"><b class = \"name\">{{ personInfo.insname.length > 3?personInfo.insname.slice(0,3)+'.':personInfo.insname}}</b></a>\n                                            <a href=\"#\" v-on:click = \"showDetail('02',personInfo.oid)\" v-else v-bind:title = \"personInfo.insnamePlumber\"><b class = \"name\">{{ personInfo.insnamePlumber.length > 3?personInfo.insnamePlumber.slice(0,3)+'.':personInfo.insnamePlumber}}</b></a>\n                                          </div>\n                                          \n                                          <div style = \"right: -5px;\" class=\"column is-three-seven status\" v-if = \"personInfo.online == '1'\">\n                                            [\u5728\u7EBF<img class = \"person-location\" v-on:click = \"positionPersonTrajectory( personInfo.lon, personInfo.lat, personInfo.phone, personInfo.createDatetime,'',99)\" src=\"../map_viewer/images/person_location.png\"/>]\n                                          </div>\n                                          <div style = \"right: 32px;top: 9px;\" class=\"column is-one-quarter status\" v-else >\n                                            [\u79BB\u7EBF]\n                                          </div>\n                                      </div>\n                                  </div>\n                                  <div class=\"column is-full\">\n                                    <span class = \"tel\">\u8054\u7CFB\u7535\u8BDD</span>\n                                    <span v-if = \"personInfo.phone != null \">{{ personInfo.phone }}</span>\n                                    <span v-else >\u6682\u65E0</span>\n                                  </div>\n                                  <div class=\"column is-full\">\n                                    <span class = \"tel\">\u8BBE\u5907\u7F16\u53F7</span>\n                                    <span v-if = \"personInfo.deviceCode != null \">{{ personInfo.deviceCode }}</span>\n                                    <span v-else >\u6682\u672A\u7ED1\u5B9A\u8BBE\u5907</span>\n                                  </div>\n                                  <div class=\"column is-full\">\n                                    <span class = \"tel\">SIM\u5361\u53F7</span>\n                                    <span v-if = \"personInfo.sim != null \" >{{ personInfo.sim }}</span>\n                                    <span v-else >\u6682\u65E0</span>\n                                  </div>\n                              </div>\n                          </div>\n                          \n                          <!-- \u4EBA\u5458\u4FE1\u606F\u53F3\u8FB9\u7684\u5206\u6570\u548C\u5339\u914D\u5EA6\u3002 -->\n                          <div class = \"score-img\">\n                              <div class=\"columns is-gapless is-multiline is-centered\">\n                              \n                                <div class=\"column is-half is-centered\">\n                                    <span class = \"day-score\">\u5F53\u65E5\u5206\u6570</span>\n                                </div>\n                                <div class=\"column is-half is-centered\">\n                                    <span class = \"day-matching\">\u5339\u914D</span>\n                                </div>\n                                \n                                <div class=\"column is-half score-val-group\">\n                                    <span class = \"day-score-val\" v-if = \"personInfo.score != null \" >{{ Math.round(personInfo.score*10000)/100 }}</span>\n                                    <span class = \"day-score-val\" v-else>--</span> \n                                </div>\n                                <div class=\"column is-half matching-val-group\">\n                                    <span class= \"day-matching-val\" v-if = \"personInfo.matching != null \" >{{ Math.round(personInfo.matching*10000)/100 }}</span>\n                                    <span class= \"day-matching-val\" v-else>--</span> \n                                </div>\n                                \n                                <div class=\"column is-half is-centered\">\n                                    <img class = \"day-score-img\" src=\"../map_viewer/images/day-matching-img.png\" />\n                                </div>\n                                <div class=\"column is-half is-centered\">\n                                    <img class = \"day-matching-img\" src=\"../map_viewer/images/day-score-img.png\" />\n                                </div>\n                                \n                              </div>  \n                          </div>\n                       </div>\n                    </section>\n                    \n                    <!-- \u4EFB\u52A1\u8BE6\u7EC6 -->\n                    <section class = \"task-detail\">\n                        <!-- \u5DE1\u68C0\u533A\u6BB5\u9875\u9762 -->\n                        <section class = \"task-section\">\n                            <div class=\"columns is-gapless is-multiline\">\n                                <div class=\"column is-full\">\n                                   <img src = \"../map_viewer/images/patrol-section.png\" >\n                                   <span class = \"subTitle\"><strong>\u5DE1\u68C0\u533A\u6BB5</strong></span>\n                                </div>\n                            </div>\n                            \n                            <div v-if = \"rangeList.length == 0 \" class=\"columns is-gapless is-multiline\">\n                                <div class=\"column is-11\">\n                                    <p>\u6682\u65E0</p>\n                                </div>\n                                <div class=\"column is-1\">\n                                </div>\n                            </div>\n                            \n                            <div v-for = \"range in rangeList\" :key = \"range.oid\" class=\"columns is-gapless is-multiline\">\n                                <div class=\"column is-11\">\n                                    <p>{{ range.beginlocation}} &nbsp;&nbsp; \u81F3&nbsp;&nbsp; {{ range.endlocation }} </p>\n                                </div>\n                                <div class=\"column is-1\">\n                                   <!-- /*<img v-on:click = \"position()\" src=\"../map_viewer/images/position.png\">*/ -->\n                                </div>\n                            </div>\n                            \n                        </section>\n                        \n                        \n                        <!-- \u5DE1\u68C0\u957F\u5EA6\u9875\u9762 -->\n                        <section class = \"task-section-length\">\n                            <div class=\"columns is-gapless is-multiline\">\n                                <div class=\"column is-full\">\n                                   <img src = \"../map_viewer/images/patrol-length.png\" >\n                                   <span class = \"subTitle\"><strong>\u5DE1\u68C0\u957F\u5EA6</strong></span>\n                                   <span class = \"subTitle length\">{{ Math.round((rangeLength/1000)*100)/100 }}  KM</span>\n                                </div>\n                            </div>\n                        </section>\n                        <!-- \u6807\u51C6\u8F68\u8FF9\u7EBF\u9875\u9762 -->\n                        <section class = \"task-standard\">\n                            <div class=\"columns is-gapless is-multiline\">\n                                <div class=\"column is-full\">\n                                   <img src = \"../map_viewer/images/task-standard.png\" >\n                                   <span class = \"subTitle\"><strong>\u6807\u51C6\u8F68\u8FF9\u7EBF</strong></span>\n                                </div>\n                            </div>\n                            \n                            <div v-if = \"standardLineList.length == 0 \" class=\"columns is-gapless is-multiline\" >\n                                <div class=\"column is-11\">\n                                    <p>\u6682\u65E0</p>\n                                </div>\n                                <div class=\"column is-1\">\n                                    \n                                </div>\n                            </div>\n                            \n                            <div class=\"columns is-gapless is-multiline\" v-for = \"standard in standardLineList\" :key = \"standard.oid\" >\n                                <div class=\"column is-11\">\n                                    <p>{{ standard.beginlocation }} &nbsp;\u81F3&nbsp; {{ standard.endlocation }}</p>\n                                </div>\n                                <div class=\"column is-1\">\n                                    <img v-on:click = \"positionStandard(standard.oid,standard.bufferwidth)\" src=\"../map_viewer/images/position.png\">\n                                </div>\n                            </div>\n                            \n                        </section>\n                        <!-- \u5173\u952E\u70B9\u6570\u9875\u9762,\u5E94\u8BE5\u662F\u6240\u6709\u7684\u5F53\u5929\u4EFB\u52A1\uFF0C\u8FD9\u4E2A\u4EBA\u7684\u6240\u6709\u5173\u952E\u70B9\u6570\u91CF -->\n                        <section class = \"task-point-count\">\n                            <div class=\"columns is-gapless is-multiline\">\n                                <div class=\"column is-full\">\n                                   <img src = \"../map_viewer/images/task-point-count.png\" >\n                                   <span class = \"subTitle\"><strong>\u5173\u952E\u70B9\u6570</strong></span>\n                                   <span class = \"subTitle count\">{{ taskPointCount + tempTaskPointCount }}\u4E2A</span>\n                                </div>\n                            </div>\n                            \n                            <div class=\"columns is-gapless is-multiline\">\n                                <div class=\"column is-4\">\n                                    <p>\u4EFB\u52A1\u5173\u952E\u70B9\u6570</p>\n                                </div>\n                                <div class=\"column is-8\">\n                                    {{taskPointCount}}\u4E2A\n                                </div>\n                            </div>\n                            \n                            <div class=\"columns is-gapless is-multiline\">\n                                <div class=\"column is-4\">\n                                    <p>\u4E34\u65F6\u5173\u952E\u70B9\u6570</p>\n                                </div>\n                                <div class=\"column is-8\">\n                                    {{tempTaskPointCount}}\u4E2A\n                                </div>\n                            </div>\n                        </section>\n                        \n                        <!-- \u4EFB\u52A1\u65F6\u95F4 -->\n                        <section class = \"task-time\">\n                            <div class=\"columns is-gapless is-multiline\">\n                                <div class=\"column is-full\">\n                                   <img src = \"../map_viewer/images/title-img.png\" >\n                                   <span class = \"subTitle\"><strong>\u4EFB\u52A1\u65F6\u95F4</strong></span>\n                                </div>\n                            </div>\n                            \n                            <div class=\"columns is-gapless is-multiline time\">\n                                <div class=\"column is-half\" v-for = \"(time, index) in taskTimeList\" :key = \"time.oid\" >\n                                    <!-- \u5982\u679C\u65E5\u671F\u662F\u76F8\u7B49\u7684\uFF0C\u65E5\u671F\u5408\u5E76\u6210\u4E00\u4E2A\u3002 -->\n                                    <div class = \"box\" v-if = \"time.beginDateStr != time.endDateStr\" v-bind:class = \"{'timeBackground':index == timeIndex}\" v-on:click = \"selectTimeRange(index, time.beginDateStr, time.endDateStr, time.beginTimeStr, time.endTimeStr, time.oid, time.flag, time.speedMax)\" >\n                                        \n                                            <span class = \"begin-date\">{{ time.beginDateStr }} &nbsp; {{ time.beginTimeStr }}</span> \n                                            <span class = \"middle\">-</span> \n                                            <span class = \"end-date\">{{ time.endDateStr }} &nbsp; {{ time.endTimeStr }}</span>\n   \n                                    </div>\n                                    <div class = \"box\" v-else v-bind:class = \"{'timeBackground':index == timeIndex}\" v-on:click = \"selectTimeRange(index, time.beginDateStr, time.endDateStr, time.beginTimeStr, time.endTimeStr, time.oid, time.flag, time.speedMax)\" >\n                                        <span class = \"begin-end-date\">{{ time.beginDateStr }}  {{ time.beginEndAndendTimeStr }}</span> \n                                    </div>\n                                </div>\n                                \n                                <div class=\"column is-half\" v-if = \"taskTimeList.length == 0\" >\n                                   \u5F53\u524D\u65F6\u95F4\u5185\u6682\u65E0\u4EFB\u52A1\n                                </div>\n                               \n                            </div>\n                            \n                            <div class = \"time-content\" >\n                                <div class=\"columns is-gapless is-multiline progress-title\">\n                                    <div class=\"column is-2\">\n                                       <span>\u500D\u901F</span>\n                                    </div>\n                                    <div class=\"column is-1\" v-for = \"item in speeds\" :key = \"item.id\">\n                                      <span v-bind:id = \"item.id\" class = \"speeds\" v-bind:class = \"{'speedBackground':item.id == speedIndex}\"  v-on:click = \"accelerate(item.speed, item.id)\">{{ item.name }}</span>\n                                    </div>\n                                    <div class=\"column is-5\">\n                                       <span></span>\n                                    </div>\n                                    \n                                    <div class=\"column is-1\">\n                                       <span>\n                                            <img v-on:click = \"startOrPauseMethod()\" v-bind:src = \"startOrPauseImg\" />\n                                       </span>\n                                    </div>\n                                    <div class=\"column is-1\">\n                                       <span>\n                                            <img v-on:click = \"reset()\" src = \"../map_viewer/images/reset.png\" />\n                                       </span>\n                                    </div>\n                                </div>\n                                \n                                <div class=\"columns is-gapless is-multiline progress-title\">\n                                    <span class = \"start\">{{ startTime }}</span>\n                                    <!-- \u8FDB\u5EA6\u6761 -->\n                                    <!-- v-on:mouseleave = \"hideVideoTime\" v-on:mousemove = \"showVideoTime\" -->\n                                    <input id = \"slide\" v-model = \"slideVal\"  v-on:mouseup = \"drag()\" class = \"slide\" min=\"0\" max=\"100\" step=\"1\" value=\"0\" type = \"range\" ></input>\n                                    \n                                    <span class = \"end\">{{ endTime }}</span>\n                                </div>\n                                <!-- \u663E\u793A\u8FDB\u5EA6\u6761\u7684\u7EBF -->\n                                <span v-bind:style = \"{ width: progressVal }\" class = \"hide-line\"></span>\n                                \n                                <!-- \u5173\u952E\u70B9\u5DE1\u68C0\u72B6\u6001\u9875\u9762 -->\n                                <section class = \"keypoint\">\n                                    <div class=\"columns is-gapless is-multiline title\">\n                                        <div class=\"column is-1\">\n                                           <span>\n                                                <img src = \"../map_viewer/images/keypoint-head.png\" />\n                                           </span>\n                                        </div>\n                                        <div class=\"column is-11\">\n                                           <span class = \"subTitle\">\n                                               <strong>\u5173\u952E\u70B9\u5DE1\u68C0\u72B6\u6001( <span class = \"havePatrolKeyPointCount\">{{havePatrolKeyPointCount}}</span>/{{PatrolKeyPointCount}})</strong>\n                                           </span>\n                                        </div>\n                                    </div>\n                                    \n                                    <div class = \"keypoint-content\">\n                                        <div class=\"columns is-gapless is-multiline\" v-for = \"( item, index ) in taskTimePointList\" :key = \"item.pointid\">\n                                            <div class=\"column is-11\">\n                                               <span class = \"point-index\">{{ index+1 }}</span>\n                                               <span class = \"point-name\" v-on:click = \"clickTaskPointFlash(item.lon, item.lat, item.pointid, item.flag, item.pointstatus, item.buffer )\" >({{ item.flag == 0?\"\u5E38\u89C4\u5173\u952E\u70B9\":\"\u4E34\u65F6\u5173\u952E\u70B9\"}})  {{ item.pointname }}</span>\n                                            </div>\n                                            <div class=\"column is-1\">\n                                               <span>\n                                                   <img v-if = \"item.pointstatus >= 1\" src = \"../map_viewer/images/keypoint-complete.png\" />\n                                                   <img v-else src = \"../map_viewer/images/keypoint-nocomplete.png\" />\n                                               </span>\n                                            </div>\n                                        </div>\n                                        \n                                        <div class=\"column is-full\" v-if = \"taskTimePointList.length == 0\" >\n                                           \u5F53\u524D\u65F6\u95F4\u5185\u6682\u65E0\u53EF\u5DE1\u5173\u952E\u70B9\n                                        </div>\n                                    \n                                    </div>\n                                </section>\n                            </div>\n                        </section>\n                    </section>\n                    \n                    \n                    <!-- \u8FDB\u5EA6\u6761\u4E2D\u663E\u793A\u7684\u65F6\u95F4\u6846 -->\n                    <div class=\"popover-self\" v-bind:style = \"{left:timeBoxPositionX+'px',top:timeBoxPositionY+'px'}\" v-bind:class = \"{'timeBoxDisplayStyle':timeBoxDisplay}\" >\n                        <div class=\"popover-content\">\n                            <div>2019-03-29 15:51:03</div>\n                        </div> \n                        <div x-arrow=\"\" class=\"popover-arrow\"></div>\n                    </div>\t\n                \n                </section>\t\n                \n                \n                \t\n"
});