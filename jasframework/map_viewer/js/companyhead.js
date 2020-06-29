/**
 * 头部页面,暂时没用到
 */

var companyhead = Vue.component('companyhead', {
    name:'companyhead',
    data: function () {
        return {
            headVm: '',
            /* 初始化栈顶元素 */
            topElement: {},
            /* 显示导航 */
            navigation:[]
        }
    },
    created: function() {
    },
    mounted: function() {
        headVm = this;

        /* 初始化栈 */
        headVm.topElement = headVm.$options.methods.initStack();
        headVm.$options.methods.queryStack( headVm.topElement );

        /* 接收广播，将数据加入到栈中。 */
        headVm.$root.eventHub.$on('addclicktop', ( unitId, hierarchy, clickType, unitName ) => {
            /* 先压栈。 */
            let per = {};
            per.unitId = unitId;
            per.hierarchy = hierarchy;
            per.clickType = clickType;
            per.unitName = unitName;

            /* 删除栈顶顶部元素。 */
            headVm.$options.methods.deleteStack( headVm.topElement, per.unitId );

            headVm.$options.methods.addStack( headVm.topElement, per );

            /* 刷新数据。 */
            headVm.$options.methods.showNavigation();

        } )
    },

    methods: {
        /**
         * 构建栈结构
         * @return 栈顶元素
         */
        initStack(){
            /* 部门id初始化为西南管道公司OID */
            headVm.topElement.unitId = '5ab981e0-9598-11e1-b20e-e61f13e462af';
            headVm.topElement.unitName = '西南管道公司';
            headVm.topElement.hierarchy = 'Unit.0003';
            /* 点击类型，如果是分公司为1，站为2，人员为3. */
            headVm.topElement.clickType = '0';
            /* 设置下方元素为null */
            headVm.topElement.bottom = null;
            /* 设置顶部元素为null */
            headVm.topElement.top = null;
            return headVm.topElement;
        },

        /**
         * 给栈中添加元素
         * @param top 栈顶元素
         * @param element 添加的元素
         * @returns 栈顶元素
         */
        addStack( top, element ){
            /* 如果新来的元素id和栈顶的元素id一样，对不起，不能加入 */
            if(element.unitId != top.unitId){
                top.top = element;
                element.top = null;
                element.bottom = top;
                headVm.topElement = element;
            }
            return element;
        },

        /**
         * 遍历栈中所有元素
         * @returns
         */
        queryStack( top ){
            if( top != null ){
                headVm.navigation.push( top ) ;
                headVm.$options.methods.queryStack(top.bottom);
            }
        },

        /**
         * 显示导航栏
         * @returns
         */
        showNavigation(){
            /* 清空 */
            headVm.navigation = [];
            /* 查询栈中元素 */
            headVm.$options.methods.queryStack( headVm.topElement );
        },

        /**
         * 删除元素
         * @param top 栈顶元素
         * @param elementId 需要删除的栈元素的id值
         */
        deleteStack(top ,elementId){
            if( top != null ){
                if(top.unitId == elementId ){
                    top.top = null;
                    headVm.topElement = top ;
                    return headVm.topElement;
                }else{
                    headVm.$options.methods.deleteStack(top.bottom, elementId);
                }

            }else{
                console.log('需要删除的元素，在栈中并不存在.');
            }

        },

        /**
         * 点击后将数据压入栈中
         */
        pull( unitId, hierarchy, unitName, clickType ) {

            /* 删除点击的部门的上面的所有部门。 */
            headVm.$options.methods.deleteStack( headVm.topElement, unitId );
            /* 重新显示导航栏 */
            headVm.$options.methods.showNavigation();
            /* 将部门数据告诉其他组件,发送一个广播。 */
            headVm.$root.eventHub.$emit('clicktop', unitId, hierarchy, clickType );
        }

    },

    template: `
                <section>
                    <nav class="breadcrumb" aria-label="breadcrumbs">
                      <ul>
                        <li v-for="( item, index ) in navigation" v-bind:key ="item.unitId" >
                            <a v-on:click = "pull( item.unitId, item.hierarchy, item.unitName , item.clickType)" href="#">{{ item.unitName }}</a>
                        </li>
                      </ul>
                    </nav>
                </section>			
`

})

