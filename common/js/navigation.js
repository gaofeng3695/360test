
/* 初始化栈底元素 */
var topElement = {};
/* 显示导航 */
var navigation = "";

var user = JSON.parse(sessionStorage.user);

/**
 * 鼠标移入变绿色
 * @returns
 */
function changeColorGreen(target){
    target.style.color = 'green';
}
/**
 * 鼠标移入变黑色
 * @returns
 */
function changeColorBlack(target){
    target.style.color = '#1b9af7';
}

/**
 * 构建栈结构
 * @return 栈顶元素
 */
function initStack(){
    /* 部门id初始化为登陆人的部门id */
    topElement.unitId = user.unitId;
    topElement.hierarchy = user.hierarchy;
    topElement.unitName = '<span class = \'nav-unit\' hierarchy = \''+user.hierarchy+'\' id = \''+user.unitId+'\'>'+user.unitName+'</span>';
    /* 设置下方元素为null */
    topElement.bottom = null;
    /* 设置顶部元素为null */
    topElement.top = null;
    return topElement;
}

/**
 * 给栈中添加元素
 * @param top 栈顶元素
 * @param element 添加的元素
 * @returns 栈顶元素
 */
function addStack( top, element ){
    /* 如果新来的元素id和栈顶的元素id一样，对不起，不能加入 */
    if(element.unitId != top.unitId){
        top.top = element;
        element.top = null;
        element.bottom = top;
        topElement = element;
    }
    return element;
}

/**
 * 遍历栈中所有元素
 * @returns
 */
function queryStack(top){
    if(top!= null){
        if ( top.top == null ) {
            navigation = top.unitName ;
        } else { <!--class = 'span-title'-->
            navigation ='<span class = \'nav-unit\'  style=\'color:#1b9af7;\' > '+top.unitName+'</span>'+' > '+navigation;
        }
        queryStack(top.bottom);
    }

}

/**
 * 显示导航栏
 * @returns
 */
function showNavigation(target){
    /* 清空 */
    navigation = '';
    /* 查询栈中元素 */
    queryStack(topElement );
    console.log('导航栏：'+navigation.substring(0,navigation.lastIndexOf('>')));
    $('#localHost').html(navigation);

    addNavigationClick(target);
}

/**
 * 删除元素
 * @param top 栈顶元素
 * @param elementId 需要删除的栈元素的id值
 */
function deleteStack(top ,elementId){
    if(top != null){
        if(top.unitId == elementId ){
            top.top = null;
            topElement = top ;
            return topElement;
        }else{
            deleteStack(top.bottom, elementId);
        }

    }else{
        console.log('error,需要删除的元素，在栈中并不存在.');
    }

}

function addNavigationClick( target ){
    /* 导航栏点击事件，删除栈内元素 */
    $('.nav-unit').on('click',function(){
        /* 获取导航中点击的id */
        let id = $(this).attr('id');

        /* 给部门标志赋值，触发查询 */
        $('#unitId').combotree('setValue', id);
        target.trigger('click');  // $('#queryDevice')

        deleteStack(topElement, id);
        /* 显示导航栏 */
        showNavigation(target);


    })
}

/**
 * 显示下级部门统计列表《其实就是给部门标志赋值，然后触发查询事件》
 * @returns
 */
function viewChildrenUnit(unitId ,unitName, target ){
    /* 点击部门，部门名称和部门id入栈 */
    let element = {};
    element.unitId = unitId;
    element.hierarchy = unitId;
    element.unitName = '<span class = \'nav-unit\'  id = \''+unitId+'\'>'+unitName+'</span>';
    addStack(topElement, element);
    /* 给部门标志赋值，触发查询 */
    $('#unitId').combotree('setValue', unitId);
    target.trigger('click');

    showNavigation(target);

}

/**
 * 返回栈顶元素
 * @returns {{}}
 */
function getTop() {
    return topElement;
}