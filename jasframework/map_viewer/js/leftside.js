/**
 * 左侧菜单
 */

var leftside = Vue.component('leftside', {
    data: function () {
        return {
            card:  '',           // ID 创建一个随机值
            vmLeft: ''

        }
    },
    created: function() {

    },
    mounted: function() {
        leftside.vmLeft = this;

    },

    methods: {
        realTimeMonitor: function( type ) {
            this.$emit( "childevent", type );
        }
    },

    template: `
            <div class="left-button">
                <img title = "实时监控" width = "37px" height = "37px" v-on:click="realTimeMonitor('real')" src="images/realtimemonitor.png" alt = "实时监控"/>
				<p v-on:click="realTimeMonitor('playback')"></p>
    			<img title = "管道保护" width = "37px" height = "37px" v-on:click="realTimeMonitor('protect')" src="images/pipeprotect.png" alt = "管道保护"/>
    			<p v-on:click="realTimeMonitor('playback')"></p>
			</div>
			`

})

