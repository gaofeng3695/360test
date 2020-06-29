/**
 * 关闭
 */

/* 创建弹出框组件 */
var close = Vue.component('close', {
    data: function () {
        return {
            card:  '',           // ID 创建一个随机值
            vmClose: ''

        }
    },
    created: function() {

    },
    mounted: function() {
        close.vmClose = this;

    },

    methods: {
    },

    template: `
                <div> </div>
			`

})

