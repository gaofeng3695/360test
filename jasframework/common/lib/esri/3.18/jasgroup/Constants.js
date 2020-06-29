/**
 * Created by KC on 2017/11/27.
 * Description:字符串常量
 */
define(function(){
    return  {
        "events":{
            // 可以在项目中调用api的subscribe方法添加下列事件的监听
            "ErrorEvent":"ErrorEvent",//
            "MapLoadedEvent":"MapLoadedEvent",
            //"DrawEndEvent":"DrawEndEvent",
            //"EditEndEvent":"EditEndEvent",
            "InfoWindowShow":"InfoWindowShow",
            "InfoWindowHide":"InfoWindowHide",
            "BaseMapLayersLoaded":"BaseMapLayersLoaded",
            "OptionalLayersLoaded":"OptionalLayersLoaded",
            "ModulesLoaded":"ModulesLoaded",
            "OptionalLayerAddedEvent":"OptionalLayerAddedEvent",
            "OptionalLayersChangedEvent":"OptionalLayersChangedEvent",
            "ModuleStateChanged":"ModuleStateChanged"
        },
        "strings":{
            "apiLoading":"api初始化",
            "mapLoading":"地图初始化",
            "appNameConfigError":"appName配置错误",
            "parseConfigError":"地图配置解析失败",
            "moduleConfigError":"地图控件配置出错",
            "moduleCreateError":"地图控件配置出错",
            "moduleNotFound":"地图控件没有找到",
            "createLayerError":"图层创建失败，请检查配置！",
            "hasNoLayerTypeError":"无法创建的图层类型",
            "layerNotLoaded":"该图层未加载",
            "layerUrlNotNull":"该类型图层url不能为空",
            "layerLoadError":"图层加载出现错误，请检查网络！",
            "eventNotRegister":"事件没有注册，回调函数无法执行",
            "graphicCreateError":"图形创建出错 ，请检查数据结构",
            "getDistanceError":"计算距离出错！",
            "getAreaError":"计算面积出错！",
            "invalidFlashData":"无效的闪烁规则",
            "featureNotFound":"没有查询到目标",
            "queryError":"查询出错",
            "layerSetNotFound":"没有找到对应的layerSet",
            "repeatIdError":"重复ID",
            "hasNoIdError":"ID不存在"
        }
    }
});