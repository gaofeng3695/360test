"use strict";

/**
 * 关闭
 */

/* 创建弹出框组件 */
var close = Vue.component('close', {
    data: function data() {
        return {
            card: '',
            // ID 创建一个随机值
            vmClose: ''
        };
    },
    created: function created() {},
    mounted: function mounted() {
        close.vmClose = this;
    },
    methods: {},
    template: "\n                <div> </div>\n\t\t\t"
});