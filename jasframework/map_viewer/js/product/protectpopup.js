"use strict";

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
    data: function data() {
        return {
            card: '',
            // ID 创建一个随机值
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
        };
    },
    created: function created() {},
    mounted: function mounted() {
        protectpopup.protectpopupVm = this;
        /* 获取到属性值 */

        protectpopup.protectpopupVm.selfContentName = protectpopup.protectpopupVm.contentName;
        protectpopup.protectpopupVm.selfCardId = protectpopup.protectpopupVm.cardId;
        protectpopup.protectpopupVm.parentIdProp = protectpopup.protectpopupVm.parentId;
        protectpopup.protectpopupVm.departmentOidProp = protectpopup.protectpopupVm.departmentOid;
        protectpopup.protectpopupVm.hierarchyProp = protectpopup.protectpopupVm.hierarchy;
        protectpopup.protectpopupVm.region = document.getElementsByTagName("body")[0];
        protectpopup.protectpopupVm.targetprotectpopup = document.getElementById(protectpopup.protectpopupVm.cardId);
        /* 记录弹框被按下之前的位置。 */

        protectpopup.protectpopupVm.originalX = protectpopup.protectpopupVm.targetprotectpopup.offsetLeft; // 获取对应父容器的上边距

        protectpopup.protectpopupVm.originalY = protectpopup.protectpopupVm.targetprotectpopup.offsetTop; // 获取对应父容器的左边距
        // window.onmouseup = function() {

        protectpopup.protectpopupVm.targetprotectpopup.firstElementChild.onmouseup = function () {
            if (protectpopup.protectpopupVm.statusprotectpopup == true) {
                protectpopup.protectpopupVm.statusprotectpopup = false;
                protectpopup.protectpopupVm.originalX = protectpopup.protectpopupVm.originalX + protectpopup.protectpopupVm.nextX - protectpopup.protectpopupVm.initX;
                protectpopup.protectpopupVm.originalY = protectpopup.protectpopupVm.originalY + protectpopup.protectpopupVm.nextY - protectpopup.protectpopupVm.initY;
                /* 设置整个窗口为可选中状态 */
                // vm.region.style.userSelect = "auto";
            }
        };
    },
    methods: {
        onmousedown: function onmousedown(event) {
            /* 设置整个窗口为不可选中状态 */
            // vm.region.style.userSelect = "none";
            protectpopup.protectpopupVm.initX = event.clientX;
            protectpopup.protectpopupVm.initY = event.clientY;
            protectpopup.protectpopupVm.statusprotectpopup = true;

            protectpopup.protectpopupVm.region.onmousemove = function (event) {
                protectpopup.protectpopupVm.nextX = event.clientX;
                protectpopup.protectpopupVm.nextY = event.clientY;

                if (protectpopup.protectpopupVm.statusprotectpopup) {
                    /* 移动的距离 */
                    var distanceX = protectpopup.protectpopupVm.nextX - protectpopup.protectpopupVm.initX;
                    var distanceY = protectpopup.protectpopupVm.nextY - protectpopup.protectpopupVm.initY;
                    /* 如果移动的距离大于最大距离，则移动距离就是最大距离。*/

                    /* 设置移动时，弹出框的坐标位置。*/

                    protectpopup.protectpopupVm.targetprotectpopup.style.left = protectpopup.protectpopupVm.originalX + distanceX + 'px';
                    protectpopup.protectpopupVm.targetprotectpopup.style.top = protectpopup.protectpopupVm.originalY + distanceY + 'px';
                }
            };
        },
        close: function close() {
            window.location.href = "about:blank";
            window.close();
        },

        /**
         * 修改内容页面为部门列表
         */
        updateCompanyPage: function updateCompanyPage(departmentOid, hierarchy) {
            protectpopup.protectpopupVm.selfContentName = 'protectcompany';
            protectpopup.protectpopupVm.departmentOidProp = departmentOid;
            protectpopup.protectpopupVm.hierarchyProp = hierarchy;
        },
        updateConsPage: function updateConsPage(departmentOid, hierarchy, riskrating) {
            protectpopup.protectpopupVm.selfContentName = 'protectcons';
            protectpopup.protectpopupVm.departmentOidProp = departmentOid;
            protectpopup.protectpopupVm.hierarchyProp = hierarchy;
            protectpopup.protectpopupVm.riskratingProp = riskrating;
        },
        updateEventPage: function updateEventPage(departmentOid, hierarchy) {
            protectpopup.protectpopupVm.selfContentName = 'protectevent';
            protectpopup.protectpopupVm.departmentOidProp = departmentOid;
            protectpopup.protectpopupVm.hierarchyProp = hierarchy;
        },

        /**
         * 切换页面为分公司或者站或者人员列表页面
         */
        updatePage: function updatePage(departmentOid, hierarchy) {
            /* 如果层级是null，则是人员详情页面，不跳转。 */
            if (hierarchy != null && hierarchy != '') {
                /* 如果是人员列表 */
                if (hierarchy.split(".").length - 1 > 2) {
                    protectpopup.protectpopupVm.$options.methods.updateConsPage(departmentOid, hierarchy, '');
                } else {
                    /* 如果是分公司或者站列表 */
                    protectpopup.protectpopupVm.$options.methods.updateCompanyPage(departmentOid, hierarchy);
                }
            }
        },

        /**
         * 关闭按钮，告诉上层页面，我要关闭了。
         */
        closeReal: function closeReal() {
            protectpopup.protectpopupVm.$root.eventHub.$emit("closeevent");
        }
    },
    template: "\n            <div class=\"container-bulma\">\n\t\t\t\t<div v-bind:id=\"cardId\" class=\"card\">\n\t\t\t\t\t<header class=\"card-header\" >\n\t\t\t\t\t\t<p class=\"card-header-title\" v-on:mousedown = \"onmousedown( $event )\">\n\t\t\t\t\t\t\t\u7BA1\u9053\u4FDD\u62A4\n\t\t\t\t\t\t</p>\n\t\t\t\t\t\t<img v-on:click = \"closeReal()\" src = \"images/close.png\" alt = \"\u5173\u95ED\" >\n\t\t\t\t\t\t<!--<router-link to=\"/close\">\u5173\u95ED</router-link>-->\n\t\t\t\t\t</header>\n\n\t\t\t\t\t<div class=\"card-content\">\n\t\t\t\t\t    <!--\u52A8\u6001\u5207\u6362\u6A21\u677F -->\n\t\t\t\t\t   <!--  bounce -->\n\t\t\t\t\t    <transition name=\"fade\" mode=\"out-in\">\n                            <compoment :is=\"selfContentName\" \n                                        @childupdateconsevent = \"updateConsPage\"\n    \t\t\t\t\t\t\t\t\t@childupdateeventevent = \"updateEventPage\"\n                                        @childupdatecompanyevent = \"updateCompanyPage\"\n                                        @childupdatepageevent = \"updatePage\"\n                                        v-bind:departmentOidProp = \"departmentOidProp\" \n                                        v-bind:hierarchyProp = \"hierarchyProp\"\n    \t\t\t\t\t\t\t\t\tv-bind:riskratingProp = \"riskratingProp\"\n    \t\t\t\t\t\t\t\t\tv-bind:parentIdProp = \"parentIdProp\"\n                                        >\n                            </compoment>\n\t\t                </transition>\n\t\t\t\t\t\t<!--<router-view></router-view>-->\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t"
});