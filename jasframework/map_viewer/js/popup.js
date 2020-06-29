/**
 * 弹框
 */

/* 创建弹出框组件 */
var popup = Vue.component('popup', {
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
            statusPopup: false,
            originalX: 0,
            originalY: 0,
            popupVm: '',
            region: '',
            targetPopup: '',

            /* 接收属性，受现代 JavaScript 的限制 (而且 Object.observe 也已经被废弃)，Vue 不能检测到对象属性的添加或删除 */
            selfContentName: '',
            selfCardId: '',

            /* 内容页面需要传入的属性。 */
            inspectorOidProp: '',
            insnameProp: '',

            departmentOidProp: "",
            hierarchyProp: '',
            parentIdProp: '',
            inspectorTypeProp: '',
            onlineProp: ''

        }
    },
    created: function() {

    },
    mounted: function() {
        popup.popupVm = this;

        /* 获取到属性值 */
        popup.popupVm.selfContentName = popup.popupVm.contentName;
        popup.popupVm.selfCardId = popup.popupVm.cardId;
        popup.popupVm.parentIdProp = popup.popupVm.parentId;

        popup.popupVm.departmentOidProp = popup.popupVm.departmentOid;
        popup.popupVm.hierarchyProp = popup.popupVm.hierarchy;

        popup.popupVm.region = document.getElementsByTagName("body")[0];
        popup.popupVm.targetPopup = document.getElementById( popup.popupVm.cardId );
        /* 记录弹框被按下之前的位置。 */
        popup.popupVm.originalX = popup.popupVm.targetPopup.offsetLeft;       // 获取对应父容器的上边距
        popup.popupVm.originalY = popup.popupVm.targetPopup.offsetTop;       // 获取对应父容器的左边距

        // window.onmouseup = function() {
        popup.popupVm.targetPopup.firstElementChild.onmouseup = function() {
            if( popup.popupVm.statusPopup == true ) {
                popup.popupVm.statusPopup = false;
                popup.popupVm.originalX = popup.popupVm.originalX + popup.popupVm.nextX - popup.popupVm.initX ;
                popup.popupVm.originalY = popup.popupVm.originalY + popup.popupVm.nextY - popup.popupVm.initY;
                /* 设置整个窗口为可选中状态 */
               // vm.region.style.userSelect = "auto";
            }

        }
    },

    methods: {
        onmousedown( event ) {

            /* 设置整个窗口为不可选中状态 */
           // vm.region.style.userSelect = "none";

            popup.popupVm.initX = event.clientX;
            popup.popupVm.initY = event.clientY;
            popup.popupVm.statusPopup = true;

            popup.popupVm.region.onmousemove = function( event ) {
                popup.popupVm.nextX = event.clientX;
                popup.popupVm.nextY = event.clientY;

                if(popup.popupVm.statusPopup ) {
                    /* 移动的距离 */
                    let distanceX = popup.popupVm.nextX - popup.popupVm.initX ;
                    let distanceY = popup.popupVm.nextY - popup.popupVm.initY ;
                    /* 如果移动的距离大于最大距离，则移动距离就是最大距离。*/

                    /* 设置移动时，弹出框的坐标位置。*/
                    popup.popupVm.targetPopup.style.left = (popup.popupVm.originalX + distanceX )+'px';
                    popup.popupVm.targetPopup.style.top =  (popup.popupVm.originalY + distanceY ) + 'px';

                }
            }
        },
        close() {
            window.location.href="about:blank";
            window.close();
        },
        /**
         * 修改内容页面为人员列表
         */
        updatePersonPage( departmentOid, hierarchy, online, inspectorType ) {
            popup.popupVm.selfContentName = 'person';
            popup.popupVm.departmentOidProp = departmentOid;
            popup.popupVm.hierarchyProp = hierarchy;
            popup.popupVm.onlineProp = online;
            popup.popupVm.inspectorTypeProp = inspectorType;
        },

        /**
         * 修改内容页面为部门列表
         */
        updateCompanyPage( departmentOid, hierarchy ) {
            popup.popupVm.selfContentName = 'company';
            popup.popupVm.departmentOidProp = departmentOid;
            popup.popupVm.hierarchyProp = hierarchy;
        },

        /**
         * 切换页面为分公司或者站或者人员列表页面
         */
        updatePage( departmentOid, hierarchy ) {
            /* 如果层级是null，则是人员详情页面，不跳转。 */
            if( hierarchy != null && hierarchy != '' ) {
                /* 如果是人员列表 */
                if( hierarchy.split(".").length-1 > 2 ) {
                    popup.popupVm.$options.methods.updatePersonPage( departmentOid, hierarchy, '', '' );
                } else {
                    /* 如果是分公司或者站列表 */
                    popup.popupVm.$options.methods.updateCompanyPage( departmentOid, hierarchy );
                }

            }
        },

        /**
         * 修改内容页面为人员详情
         */
        updatePersonDetailPage( departmentOid, hierarchy, inspectorOid, insname ) {
            popup.popupVm.selfContentName = 'detail';
            popup.popupVm.departmentOidProp = departmentOid;
            popup.popupVm.hierarchyProp = hierarchy;
            popup.popupVm.inspectorOidProp = inspectorOid;
            popup.popupVm.insnameProp = insname;

        },
        /**
         * 关闭按钮，告诉上层页面，我要关闭了。
         */
        closeReal() {
            popup.popupVm.$root.eventHub.$emit( "closeevent" );
        }

    },

    template: `
            <div class="container-bulma">
				<div v-bind:id="cardId" class="card">
					<header class="card-header" >
						<p class="card-header-title" v-on:mousedown = "onmousedown( $event )">
							实时监控
						</p>
						<img v-on:click = "closeReal()" src = "images/close.png" alt = "关闭" >
						<!--<router-link to="/close">关闭</router-link>-->
					</header>

					<div class="card-content">
					    <!--动态切换模板 -->
					   <!--  bounce -->
					    <transition name="fade" mode="out-in">
                            <compoment :is="selfContentName" 
                                        @childupdatepersonevent = "updatePersonPage"
                                        @childupdatecompanyevent = "updateCompanyPage"
                                        @childupdatepersondetailevent = "updatePersonDetailPage"
                                        @childupdatepageevent = "updatePage"
                                        v-bind:departmentOidProp = "departmentOidProp" 
                                        v-bind:hierarchyProp = "hierarchyProp"
                                        v-bind:onlineProp = "onlineProp"
                                        v-bind:inspectorTypeProp = "inspectorTypeProp"
                                        v-bind:inspectorOidProp = "inspectorOidProp"
                                        v-bind:insnameProp = "insnameProp"
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

