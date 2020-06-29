"use strict";

/**
 * 左侧菜单
 */
var leftside = Vue.component('leftside', {
    data: function data() {
        return {
            card: '',
            // ID 创建一个随机值
            vmLeft: ''
        };
    },
    created: function created() {},
    mounted: function mounted() {
        leftside.vmLeft = this;
    },
    methods: {
        realTimeMonitor: function realTimeMonitor(type) {
            this.$emit("childevent", type);
        }
    },
    template: "\n            <div class=\"left-button\">\n                <img title = \"\u5B9E\u65F6\u76D1\u63A7\" width = \"37px\" height = \"37px\" v-on:click=\"realTimeMonitor('real')\" src=\"images/realtimemonitor.png\" alt = \"\u5B9E\u65F6\u76D1\u63A7\"/>\n\t\t\t\t<p v-on:click=\"realTimeMonitor('playback')\"></p>\n    \t\t\t<img title = \"\u7BA1\u9053\u4FDD\u62A4\" width = \"37px\" height = \"37px\" v-on:click=\"realTimeMonitor('protect')\" src=\"images/pipeprotect.png\" alt = \"\u7BA1\u9053\u4FDD\u62A4\"/>\n    \t\t\t<p v-on:click=\"realTimeMonitor('playback')\"></p>\n\t\t\t</div>\n\t\t\t"
});