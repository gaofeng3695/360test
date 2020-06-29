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
    data: function () {
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
            parentList: [{"oid":1, "hierarchy":0, "unitName":"-"}],
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
            location:'',
            projectname:'',

            rootPath: ''
        }
    },
    created: function() {
        protectcons.protectconsVm = this;/*
        protectcons.protectconsVm.$options.methods.dateFormat();*/
        protectcons.protectconsVm.rootPath = protectcons.protectconsVm.$options.methods.getRootPath();
    },
    mounted: function() {
        /* 获取到token */
        protectcons.protectconsVm.token = localStorage.getItem("token")
        /* 获取其他页面写的js公共方法 */
        let fra = parent.$("iframe");
        for ( let i = 0; i < fra.length; i++) {
            if (fra[i].id == 'frm2d') {
                protectcons.protectconsVm.otherJs = fra[i].contentWindow;
                protectcons.protectconsVm.jasMapApi = fra[i].contentWindow.jasMapApi;
                protectcons.protectconsVm.mapWindow = fra[i].contentWindow;
            }
        }

        /* 设置导航栏。 */
        protectcons.protectconsVm.$options.methods.getParentDeparement( protectcons.protectconsVm.departmentOidProp,protectcons.protectconsVm.parentIdProp );
        
        /* 创建之初，请求得到所有的第三方施工。 */
        protectcons.protectconsVm.$options.methods.getProtectcons( protectcons.protectconsVm.riskratingProp, protectcons.protectconsVm.hierarchyProp, protectcons.protectconsVm.pageNo,protectcons.protectconsVm.projectname,protectcons.protectconsVm.location);


        /* 得到所有的第三方施工数量 */
        protectcons.protectconsVm.$options.methods.getConstructionStatistics(protectcons.protectconsVm.hierarchyProp);


    },

    methods: {

    	getConstructionStatistics( departmentHierarchy ) {
        	Vue.prototype.$http.post(protectcons.protectconsVm.rootPath+'/gpsConstructionStatistics/getConstructCount.do?departmentHierarchy=' + departmentHierarchy + '&token=' + protectcompany.vm.token)
            .then(function (response) {
                /* 第三方施工各等级数量 */
                if( response.data != null ) {
                	protectcons.protectconsVm.constructTotal = response.data.data.total;
                	protectcons.protectconsVm.constructRCount = response.data.data.red ;
                	protectcons.protectconsVm.constructYCount = response.data.data.yellow;
                	protectcons.protectconsVm.constructBCount = response.data.data.blue;
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
            });
        },
        /**
         * 获取到父部门数据
         * @param departmentOid
         */
        getParentDeparement( departmentOid, parentId ) {
            Vue.prototype.$http.post(protectcons.protectconsVm.rootPath+'/realtimemonitor/realtimemonitor/getParentUnitList.do?unitId=' + departmentOid + '&token=' + protectcons.protectconsVm.token+'&parentId='+parentId)
                .then(function (response) {
                    /* 设置列表部门。 */
                    protectcons.protectconsVm.parentList = response.data.data;
                    /* 设置当前部门 */
                    protectcons.protectconsVm.department =  protectcons.protectconsVm.parentList[protectcons.protectconsVm.parentList.length - 1];
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
         * 点击部门名称获取站或者站下的所有第三方施工数据
         * @param departmentOid 分公司的OID或者站的OID
         * @param 
         */
        getAllCons(hierarchy) {

            /* 获取部门下的第三方事件。 */
            Vue.prototype.$http.post(protectcons.protectconsVm.rootPath+'/gpsConstructionStatistics/getAllConsByUnitId.do?token=' + protectcons.protectconsVm.token + '&hierarchy=' + hierarchy ,{
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                    /* 设置第三方列表。 */
            		protectcons.protectconsVm.protectconsList = response.data.data;

            		for(var i = 0 ; i < protectcons.protectconsVm.protectconsList.length ; i++ ) {
                        if( protectcons.protectconsVm.protectconsList[i].riskratingreal != null ) {
                            protectcons.protectconsVm.protectconsList[i].riskrating = protectcons.protectconsVm.protectconsList[i].riskratingreal;
                        }
                    }
                    /* 定位所有的第三方事件。 */
            		protectcons.protectconsVm.$options.methods.positionCons();

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
         * 定位所有的第三方信息 
         */
        positionCons() {
            /* 先清理所有地图上已经展示的图层。 */
        	protectcons.protectconsVm.$options.methods.clearAllLayer();

            for( let i = 0 ; i < protectcons.protectconsVm.protectconsList.length ; i++ ) {
                let array = [];
                let position = {};
                position.lon = protectcons.protectconsVm.protectconsList[i].lon;
                position.lat = protectcons.protectconsVm.protectconsList[i].lat;
                position.oid = protectcons.protectconsVm.protectconsList[i].oid;
                position.riskrating = protectcons.protectconsVm.protectconsList[i].riskrating;
                position.projectname = protectcons.protectconsVm.protectconsList[i].projectname;
                array.push(position);

                let option = {};
                if( position.riskrating == '01' ){
                    option.url = "images/map_rwarn.png";
                }else if( position.riskrating == '02' ){
                    option.url = "images/map_ywarn.png";
                }else if( position.riskrating == '03' ){
	            	option.url = "images/map_bwarn.png";
                }
                option.layerId = "PROTECTCONS";

                option.width = 24;
                option.height = 24;
                option.attributes = {"oid": position.oid,"lon": position.lon, "lat":position.lat, "projectname":position.projectname};

                protectcons.protectconsVm.mapWindow.doPosition( array, JSON.stringify(option) );

                let options = {};
                options.fontSize = 10 ;
                options.fontFamily = "Arial";
                options.haloColor = [255,255,255,255];
                options.haloSize= 2;
                options.color= [78,78,78,255];
                options.backgroundColor= [222,222,222,255];
                options.angle=0;
                options.xOffset= -10;
                options.yOffset= -30;
                options.center= false;
                options.layerId= "PROTECTCONS_TEXT";
                var projectname;//项目名称过长 
                if(protectcons.protectconsVm.protectconsList[i].projectname.length>8){
                	projectname = protectcons.protectconsVm.protectconsList[i].projectname.substring(0,8)+"...";
                }else{
                	projectname = protectcons.protectconsVm.protectconsList[i].projectname;
                }
                protectcons.protectconsVm.jasMapApi.addTextGraphic(protectcons.protectconsVm.protectconsList[i].lon, protectcons.protectconsVm.protectconsList[i].lat, projectname, options);

            }

           
                //添加点击事件
            protectcons.protectconsVm.jasMapApi.addLayerClickEventListener( "PROTECTCONS" ,function(e){
            	protectcons.protectconsVm.$options.methods.getConsInfo( e.graphic.attributes.oid,e.graphic.attributes.lon, e.graphic.attributes.lat);
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
        getProtectcons(riskrating, hierarchy,  pageNo,projectname,location) {

            /* 获取部门下的第三方施工。 */
            Vue.prototype.$http.post(protectcons.protectconsVm.rootPath+'/gpsConstructionStatistics/getConsByUnitId.do?token=' + protectcons.protectconsVm.token + '&hierarchy=' + hierarchy + "&riskrating=" + riskrating + "&projectname=" + projectname + "&location=" + location + "&pageNo=" + pageNo,{
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                    /* 设置第三方施工列表。 */
                    protectcons.protectconsVm.protectconsList = response.data.data;

                    for(var i = 0 ; i < protectcons.protectconsVm.protectconsList.length ; i++ ) {
                        if( protectcons.protectconsVm.protectconsList[i].riskratingreal != null ) {
                            protectcons.protectconsVm.protectconsList[i].riskrating = protectcons.protectconsVm.protectconsList[i].riskratingreal;
                        }
                    }
                    /* 定位所有的第三方施工。 */
            		protectcons.protectconsVm.$options.methods.positionCons();
            		protectcons.protectconsVm.riskratingProp = riskrating;
            		

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
         * 事件高闪
         * @returns
         */
        locateCons(oid, lon, lat ){
            if(oid=='undefined'){
                return;
            }
            if(lon=='null' || lat=='null'){
                $.messager.alert("提示", '没有定位坐标！', 'info');
                return;
            }
            let scale;
            if(protectcons.protectconsVm.layer == "PROTECTCONS"){
                scale = 1000000;
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
            protectcons.protectconsVm.jasMapApi.flashGraphic(oid, protectcons.protectconsVm.layer, options);
        },
        /**
         * 清理掉地图上所有的图层
         */
        clearAllLayer() {
            for( let i = 0 ; i < protectcons.protectconsVm.allLayer.length ; i++ ) {
                protectcons.protectconsVm.jasMapApi.clearGraphicsLayer( protectcons.protectconsVm.allLayer[i] );
            }
            protectcons.protectconsVm.allLayer = [];

        },

        /**
         * 成功提示信息
         * @param content
         */
        successNotify( content ) {
            Vue.prototype.$notify.success({content: content});
        },
        /**
         * 等待提示信息
         * @param content
         */
        loadingNotify( content ) {
            Vue.prototype.$notify.open({content: content, type: 'loading'});
        },
        /**
         * 导航栏点击切换成分公司或者站
         * @param oid   部门OID
         * @param hierarchy 部门层级
         */
        getStation( oid, hierarchy) {
            if( hierarchy.split(".").length <= 3 ) {
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
        
        getConsInfo(dataId,lon, lat){
        	Vue.prototype.$http.post(protectcons.protectconsVm.rootPath+'/gpsconstruction/getInfo.do?oid=' + dataId + '&token=' + protectcons.protectconsVm.token)
            .then(function (response) {
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
                if( result.lineloopoidname != null ) {
                    content += result.lineloopoidname;
                } else {
                    content += "暂无";
                }
                content += "</div>";

                content += "<div class=\"column  is-two-fifths\">";
                content += "桩号：";
                content += "</div>";
                content += "<div class=\"column  is-three-fifths\">";
                if( result.stakenumname != null ) {
                    content += result.stakenumname;
                } else {
                    content += "暂无";
                }
                content += "</div>";

                content += "<div class=\"column  is-two-fifths\">";
                content += "现场监护人员：";
                content += "</div>";
                content += "<div class=\"column  is-three-fifths\">";
                if( result.inspectoroidname != null ) {
                    if( result.inspectorphone != null ) {
                        content += result.inspectoroidname+"  "+ result.inspectorphone;
                    } else {
                        content += result.inspectoroidname;
                    }

                } else {
                    content += "暂无";
                }

                content += "</div>";
                
                content += "<div class=\"column  is-two-fifths\">";
                content += "<a class=\"button\" onclick=\"getConsInfoView('"+dataId +"')\">详情</a>";
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
                content1 += "<th width='40%'><span>桩号</span></th>";
                content1 += "<td width='40%'><span>";

                if (result.stakenumname != null) {
                    content1 += result.stakenumname;
                } else {
                    content1 += "暂无";
                }

                content1 += "</span></td>";
                content1 += "</tr>";
                content1 += "<tr>";
                content1 += "<th width='40%'><span>现场监护人员</span></th>";
                content1 += "<td width='40%'><span>";

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
                    width:224,
                    height:245
                };
                jasMapApi.showInfoWindow(lon, lat, '第三方施工详情', content1, options);
                jasMapApi.centerAt(lon, lat);

                /* 被移动的对象 */
                var target = "";
                /* 获取到所有的标注的内容。 */
                var targetList = document.getElementsByClassName('esriPopupWrapper');
                /* 获取到这些标注集合中的，刚刚我添加的标注。 */
                for(  var i = 0 ; i < targetList.length ; i++ ) {
                    /* 如果标注中的表头的内容和我查询的部门名称相同，就表明是我需要的对象。 */
                    if( document.getElementsByClassName('esriPopupWrapper')[i].firstElementChild.innerText == '详情' ) {
                        target = document.getElementsByClassName('esriPopupWrapper')[i];
                        break;
                    }
                }

                /* 如果查询出来的target还是""，说明出问题了 */
                if(target == "" ) {
                    return;
                }

                /* 给目标赋予点击事件 */
                target.firstElementChild.onmousedown = function() {
                    protectcompany.vm.$options.methods.move( document.getElementsByTagName("body")[0], target, false );
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
        getConsInfoView(dataId){
        	//protectcons.protectconsVm.otherJs.showDialog2('viewInfoGpsConstruction','第三方施工详细', "../../pipeprotect/gps_construction/gpsconstructionInfo/view_info_gps_construction.html?oid="+dataId, 950, 650,false);
        	protectcons.protectconsVm.otherJs.top.getDlg("../../pipeprotect/gps_construction/gpsconstructionInfo/view_info_gps_construction.html?oid="+dataId,"viewInfoGpsConstruction","第三方施工详细",900,650,false,true,true);
        },
        
        loadMore: function() {
            protectcons.protectconsVm.pageNo++;
            protectcons.protectconsVm.$options.methods.getProtectcons( protectcons.protectconsVm.riskratingProp, protectcons.protectconsVm.hierarchyProp,  protectcons.protectconsVm.pageNo,protectcons.protectconsVm.projectname,protectcons.protectconsVm.location);
        },
        /**
         * 点击查询按钮
         */
        searchCons() {
            /* 清除地图上所有图标以及定时器 */
        	protectcons.protectconsVm.$options.methods.clearAllLayer();
            /* 获取第三方施工列表 */
        	protectcons.protectconsVm.$options.methods.getProtectcons( protectcons.protectconsVm.riskratingProp, protectcons.protectconsVm.hierarchyProp,  protectcons.protectconsVm.pageNo,protectcons.protectconsVm.projectname,protectcons.protectconsVm.location);
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
                        <a v-else-if = "parentList.length == 3" v-on:click = "getStation( parent.oid, parent.hierarchy )" v-bind:title="parent.unitName" href="#">{{ parent.unitName.length > 8?parent.unitName.slice(0,7)+'...':parent.unitName }}</a>
                        <a v-else v-on:click = "getStation( parent.oid, parent.hierarchy )" v-bind:title="parent.unitName" href="#">{{parent.unitName }}</a>
                    </li>
                  </ul>
                </nav>
                
                <nav class="level protectcons" style="height:40px">
                  <div class="level-item" >
                    <div class = 'ins-img' v-on:click = "getProtectcons('', department.hierarchy,pageNo,projectname,location)">
                        <img src="../map_viewer/images/construct.png"> 
                    </div>
                    <div class = 'level-item-cons' v-on:click = "getProtectcons('', department.hierarchy,pageNo,projectname,location)" >
                        <p>第三方施工总数</p>
                    </div>
                    <div class="level-item-cons" style="margin-left:5px;cursor: pointer;" v-on:click = "getProtectcons('', department.hierarchy,pageNo,projectname,location)">
                        <p>{{ constructTotal }}</p>
                    </div>
                  </div>
                  
                  <div class="level-item" >
                    <div class = 'ins-img'  style="margin-top: 1px;" v-on:click = "getProtectcons('01', department.hierarchy, pageNo,projectname,location )">
                        <img src="../map_viewer/images/rcons.png">  
                    </div>
                    <div class = 'cons-rby' style="margin-left:5px" v-on:click = "getProtectcons('01', department.hierarchy, pageNo,projectname,location )">
                        <p class ="rbycount">{{ constructRCount }}</p>
                    </div>
                  </div>
    			  <div class="level-item" >
			      	<div class = 'ins-img' style="margin-top: 1px;" v-on:click = "getProtectcons('02', department.hierarchy, pageNo,projectname,location )">
                        <img src="../map_viewer/images/ycons.png">  
                    </div>
                    <div class = 'cons-rby' style="margin-left:5px" v-on:click = "getProtectcons('02', department.hierarchy, pageNo,projectname,location)">
                        <p class ="rbycount">{{ constructYCount }}</p>
                    </div>
                  </div>
                  <div class="level-item" >
                    <div class = 'ins-img' style="margin-top: 1px;" v-on:click = "getProtectcons('03', department.hierarchy,pageNo,projectname,location)">
                        <img src="../map_viewer/images/bcons.png">  
                    </div>
                    <div class = 'cons-rby' style="margin-left:5px" v-on:click = "getProtectcons('03', department.hierarchy,pageNo,projectname,location)" >
                        <p class ="rbycount">{{ constructBCount }}</p>
                    </div>
                  </div>
                   <div class="level-item last" >
                   </div>
                </nav>
         	</div>
                
                
                <!-- 第三方施工列表 -->
                <section class = "all-company" id = "allDetail">
                      
                      <!-- 查询页面 -->
                    <nav class="level">
                        <div class="level-left form-cons">
                            <div class="field is-grouped">
                             
                              
                                <input v-model="projectname" class="input person-name" type="text" placeholder="项目名称">
    							<input v-model="location" class="input person-name" type="text" placeholder="施工地点" style="float:right">
                              
                                <a class="button is-info" v-on:click = "searchCons()">
                                  查询
                                </a>
                              
                            </div>
                        </div>
                        
                    </nav>
                    
                    <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="0">
                    <section name="detail" class = "detail protectcons" v-for="protectcons in protectconsList" v-bind:key ="protectcons.oid" >
                       
                        <nav class="level" style="margin:0">
                        <div class="level-item-conslist">
                        	<div style="padding:1px 10px;">
	    						<div class="level-item-conslist-row" v-on:click = "getConsInfoView(protectcons.oid)">
	    						<span  v-if = " protectcons.riskrating == '01' " style="color:#FFFFFF;background-color:#FF0000;font-size:11px;font-weight:bold; border-radius:5px;">红色预警</span>
					    	<span v-else-if = " protectcons.riskrating == '02'" style="color:#FFFFFF;background-color:#FFD700;font-size:11px;font-weight:bold; border-radius:5px;">黄色预警</span>
					    	<span  v-else-if = " protectcons.riskrating == '03' " style="color:#FFFFFF;background-color:#4876FF;font-size:11px;font-weight:bold; border-radius:5px;">蓝色预警</span>
							
			                          	<span>项目名称:</span>
			                          	<span  style="cursor: pointer;white-space:nowrap; text-overflow:ellipsis; overflow:hidden;">{{protectcons.projectname}}</span>
		                        </div>
	                          	<div class="level-item-conslist-row">
							    	<span>施工地点:</span>
							    	<span style="white-space:nowrap; text-overflow:ellipsis; overflow:hidden;">{{protectcons.location}}</span>
						    	</div>
						    	<div class="level-item-conslist-row">
							    	<span>施工原因:</span>
							    	<span>{{protectcons.constructreasonname}}</span>
						    	</div>
					    	</div>
                         </div>        
                         </nav>
                         <nav class="level-protectcompany" style="background-color: #f4f4f4;">
                          <!-- Right side -->
                          <hr color="blue">
				    	</nav>
                    </section>
                    </div>
                    <section name="detail" class = "detail protectcons none" v-if = "protectconsList.length == 0 " >
                        没有第三方施工
                    </section>
                    
                </section>
                
                
               </section>
			`

})

