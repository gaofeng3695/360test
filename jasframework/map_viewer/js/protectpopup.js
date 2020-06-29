/**
 * 弹框
 */
/* 创建弹出框组件 */
var protectpopup = Vue.component('protectpopup', {
    props: {
        /* 动态加载内容区域 */
        contentName: String,
        /* 每个窗口的ID */
        cardId: String,
        /* 查询的是那个部门 */
        departmentOid: String,
        /* 祖先部门 */
        parentId: String,
        /* 部门的层级 */
        hierarchy: String
    },
    data: function () {
        return {
            card:  '',           // ID 创建一个随机值
            initX: 0,
            initY: 0,
            nextX: 0,
            nextY: 0,
            statusprotectpopup: false,
            originalX: 0,
            originalY: 0,
            protectpopupVm: '',
            region: '',
            targetprotectpopup: '',

            /* 接收属性，受现代 JavaScript 的限制 (而且 Object.observe 也已经被废弃)，Vue 不能检测到对象属性的添加或删除 */
            selfContentName: '',
            selfCardId: '',
            parentIdProp: '',

            departmentOidProp: "",
            hierarchyProp: '',
            riskratingProp: ''

        }
    },
    created: function() {

    },
    mounted: function() {
        protectpopup.protectpopupVm = this;

        /* 获取到属性值 */
        protectpopup.protectpopupVm.selfContentName = protectpopup.protectpopupVm.contentName;
        protectpopup.protectpopupVm.selfCardId = protectpopup.protectpopupVm.cardId;
        protectpopup.protectpopupVm.parentIdProp = protectpopup.protectpopupVm.parentId;

        protectpopup.protectpopupVm.departmentOidProp = protectpopup.protectpopupVm.departmentOid;
        protectpopup.protectpopupVm.hierarchyProp = protectpopup.protectpopupVm.hierarchy;

        protectpopup.protectpopupVm.region = document.getElementsByTagName("body")[0];
        protectpopup.protectpopupVm.targetprotectpopup = document.getElementById( protectpopup.protectpopupVm.cardId );
        /* 记录弹框被按下之前的位置。 */
        protectpopup.protectpopupVm.originalX = protectpopup.protectpopupVm.targetprotectpopup.offsetLeft;       // 获取对应父容器的上边距
        protectpopup.protectpopupVm.originalY = protectpopup.protectpopupVm.targetprotectpopup.offsetTop;       // 获取对应父容器的左边距

        // window.onmouseup = function() {
        protectpopup.protectpopupVm.targetprotectpopup.firstElementChild.onmouseup = function() {
            if( protectpopup.protectpopupVm.statusprotectpopup == true ) {
                protectpopup.protectpopupVm.statusprotectpopup = false;
                protectpopup.protectpopupVm.originalX = protectpopup.protectpopupVm.originalX + protectpopup.protectpopupVm.nextX - protectpopup.protectpopupVm.initX ;
                protectpopup.protectpopupVm.originalY = protectpopup.protectpopupVm.originalY + protectpopup.protectpopupVm.nextY - protectpopup.protectpopupVm.initY;
                /* 设置整个窗口为可选中状态 */
               // vm.region.style.userSelect = "auto";
            }

        }
    },

    methods: {
        onmousedown( event ) {

            /* 设置整个窗口为不可选中状态 */
           // vm.region.style.userSelect = "none";

            protectpopup.protectpopupVm.initX = event.clientX;
            protectpopup.protectpopupVm.initY = event.clientY;
            protectpopup.protectpopupVm.statusprotectpopup = true;

            protectpopup.protectpopupVm.region.onmousemove = function( event ) {
                protectpopup.protectpopupVm.nextX = event.clientX;
                protectpopup.protectpopupVm.nextY = event.clientY;

                if(protectpopup.protectpopupVm.statusprotectpopup ) {
                    /* 移动的距离 */
                    let distanceX = protectpopup.protectpopupVm.nextX - protectpopup.protectpopupVm.initX ;
                    let distanceY = protectpopup.protectpopupVm.nextY - protectpopup.protectpopupVm.initY ;
                    /* 如果移动的距离大于最大距离，则移动距离就是最大距离。*/

                    /* 设置移动时，弹出框的坐标位置。*/
                    protectpopup.protectpopupVm.targetprotectpopup.style.left = (protectpopup.protectpopupVm.originalX + distanceX )+'px';
                    protectpopup.protectpopupVm.targetprotectpopup.style.top =  (protectpopup.protectpopupVm.originalY + distanceY ) + 'px';

                }
            }
        },
        close() {
            window.location.href="about:blank";
            window.close();
        },

        /**
         * 修改内容页面为部门列表
         */
        updateCompanyPage( departmentOid, hierarchy ) {
            protectpopup.protectpopupVm.selfContentName = 'protectcompany';
            protectpopup.protectpopupVm.departmentOidProp = departmentOid;
            protectpopup.protectpopupVm.hierarchyProp = hierarchy;
        },
        updateConsPage( departmentOid, hierarchy, riskrating) {
        	protectpopup.protectpopupVm.selfContentName = 'protectcons';
        	protectpopup.protectpopupVm.departmentOidProp = departmentOid;
        	protectpopup.protectpopupVm.hierarchyProp = hierarchy;
        	protectpopup.protectpopupVm.riskratingProp = riskrating;
        },
        updateEventPage( departmentOid, hierarchy) {
        	protectpopup.protectpopupVm.selfContentName = 'protectevent';
        	protectpopup.protectpopupVm.departmentOidProp = departmentOid;
        	protectpopup.protectpopupVm.hierarchyProp = hierarchy;
        },

        /**
         * 切换页面为分公司或者站或者人员列表页面
         */
        updatePage( departmentOid, hierarchy ) {
            /* 如果层级是null，则是人员详情页面，不跳转。 */
            if( hierarchy != null && hierarchy != '' ) {
                /* 如果是人员列表 */
                if( hierarchy.split(".").length-1 > 2 ) {
                    protectpopup.protectpopupVm.$options.methods.updateConsPage( departmentOid, hierarchy, '' );
                } else {
                    /* 如果是分公司或者站列表 */
                    protectpopup.protectpopupVm.$options.methods.updateCompanyPage( departmentOid, hierarchy );
                }

            }
        },

        /**
         * 关闭按钮，告诉上层页面，我要关闭了。
         */
        closeReal() {
            protectpopup.protectpopupVm.$root.eventHub.$emit( "closeevent" );
        }

    },

    template: `
            <div class="container-bulma">
				<div v-bind:id="cardId" class="card">
					<header class="card-header" >
						<p class="card-header-title" v-on:mousedown = "onmousedown( $event )">
							管道保护
						</p>
						<img v-on:click = "closeReal()" src = "images/close.png" alt = "关闭" >
						<!--<router-link to="/close">关闭</router-link>-->
					</header>

					<div class="card-content">
					    <!--动态切换模板 -->
					   <!--  bounce -->
					    <transition name="fade" mode="out-in">
                            <compoment :is="selfContentName" 
                                        @childupdateconsevent = "updateConsPage"
    									@childupdateeventevent = "updateEventPage"
                                        @childupdatecompanyevent = "updateCompanyPage"
                                        @childupdatepageevent = "updatePage"
                                        v-bind:departmentOidProp = "departmentOidProp" 
                                        v-bind:hierarchyProp = "hierarchyProp"
    									v-bind:riskratingProp = "riskratingProp"
    									v-bind:parentIdProp = "parentIdProp"
                                        >
                            </compoment>
		                </transition>
						<!--<router-view></router-view>-->
					</div>
				</div>
			</div>
			`

})

