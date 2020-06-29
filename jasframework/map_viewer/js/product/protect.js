"use strict";

/**
 * 管道保护
 */
var protect = Vue.component('protect', {
    props: {
        /* 动态加载内容区域 */
        contentNameProp: String,

        /* 每个窗口的ID */
        cardIdProp: String,

        /* 部门 */
        departmentOidProp: String,

        /* 祖先部门 */
        parentIdProp: String,

        /* 部门层级 */
        hierarchyProp: String
    },
    components: {
        protectpopup: protectpopup
    },
    name: 'protect',
    data: function data() {
        return {
            card: '',
            // ID 创建一个随机值
            protectVM: '',
            contentName: '',
            departmentOid: '',
            hierarchy: '',
            parentId: '',
            cardId: ''
        };
    },
    created: function created() {
        /* 我也不知道为什么接收属性就变成全小写了 */
        console.log(this.$attrs.contentnameprop + "--" + this.$attrs.cardidprop);
        this.contentName = this.$attrs.contentnameprop;
        this.cardId = this.$attrs.cardidprop;
        this.departmentOid = this.$attrs.departmentoidprop;
        this.hierarchy = this.$attrs.hierarchyprop;
        this.parentId = this.$attrs.parentidprop;
    },
    mounted: function mounted() {
        protect.protectVM = this;
    },
    methods: {},
    template: "\n                <section>\n                <!-- contentName=\"protectcompany\" cardId=\"2\"  -->\n                        <protectpopup \n                               v-bind:contentName = \"contentName\"\n                               v-bind:cardId = \"cardId\"\n                               v-bind:departmentOid = \"departmentOid\"\n                               v-bind:parentId = \"parentId\"\n                               v-bind:hierarchy = \"hierarchy\"></protectpopup>\n                </section>\t\t\t\n"
});