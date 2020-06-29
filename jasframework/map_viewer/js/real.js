/**
 * 实时监控
 */

var real = Vue.component('real', {
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
    components:{
        popup/*,
        company,
        person*/
    },
    name:'real',
    data: function () {
        return {
            card:  '',           // ID 创建一个随机值
            realVM: '',
            contentName: '',
            departmentOid: '',
            hierarchy: '',
            parentId: '',
            cardId:''

        }
    },
    created: function() {
        /* 我也不知道为什么接收属性就变成全小写了 */
        console.log(this.$attrs.contentnameprop+"--"+this.$attrs.cardidprop);
        this.contentName = this.$attrs.contentnameprop;
        this.cardId = this.$attrs.cardidprop;
        this.departmentOid = this.$attrs.departmentoidprop;
        this.hierarchy = this.$attrs.hierarchyprop;
        this.parentId = this.$attrs.parentidprop;
    },
    mounted: function() {
        real.realVM = this;

    },

    methods: {
    },

    template: `
                <section>
                        <popup v-bind:contentName = "contentName"
                               v-bind:cardId = "cardId"
                               v-bind:departmentOid = "departmentOid"
                               v-bind:parentId = "parentId"
                               v-bind:hierarchy = "hierarchy"></popup>
                </section>			
`

})

