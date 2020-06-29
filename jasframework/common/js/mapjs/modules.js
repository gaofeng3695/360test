/**
 * Created by K.C. on 2017/6/27.
 * Description:地图基础控件
 * Version:V-1.1.0
 * LastUpdateDate :2019.07.26
 * UpdateDescription:
 * 1、修复图层是否可见与控制树check节点关联的bug；
 *
 */
//浏览器检测
var BrowserClient = function(){
    var ua = navigator.userAgent.toLowerCase();
    var btypeInfo = (ua.match(/firefox|chrome|safari|opera/g) || "other")[0];
    if ((ua.match(/msie|trident/g) || [])[0]) {
        btypeInfo = "msie";
    }
    var pc = "";
    var prefix = "";
    var plat = "";
    //如果没有触摸事件 判定为PC
    var isTocuh = ("ontouchstart" in window) || (ua.indexOf("touch") !== -1) || (ua.indexOf("mobile") !== -1);
    if (isTocuh) {
        if (ua.indexOf("ipad") !== -1) {
            pc = "pad";
        } else if (ua.indexOf("mobile") !== -1) {
            pc = "mobile";
        } else if (ua.indexOf("android") !== -1) {
            pc = "androidPad";
        } else {
            pc = "pc";
        }
    } else {
        pc = "pc";
    }
    switch (btypeInfo) {
        case "chrome":
        case "safari":
        case "mobile":
            prefix = "webkit";
            break;
        case "msie":
            prefix = "ms";
            break;
        case "firefox":
            prefix = "Moz";
            break;
        case "opera":
            prefix = "O";
            break;
        default:
            prefix = "webkit";
            break
    }
    plat = (ua.indexOf("android") > 0) ? "android" : navigator.platform.toLowerCase();
    return {
        version: (ua.match(/[\s\S]+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1], //版本
        plat: plat, //系统
        type: btypeInfo, //浏览器
        pc: pc,
        prefix: prefix, //前缀
        isMobile: (pc == "pc") ? false : true //是否是移动端
    };
}();

//jquery easyui datagrid 前端分页扩展
(function($){
    function pagerFilter(data){
        if ($.isArray(data)){    // is array
            data = {
                total: data.length,
                rows: data
            }
        }
        var target = this;
        var dg = $(target);
        var state = dg.data('datagrid');
        var opts = dg.datagrid('options');
        if (!state.allRows){
            state.allRows = (data.rows);
        }
        if (!opts.remoteSort && opts.sortName){
            var names = opts.sortName.split(',');
            var orders = opts.sortOrder.split(',');
            state.allRows.sort(function(r1,r2){
                var r = 0;
                for(var i=0; i<names.length; i++){
                    var sn = names[i];
                    var so = orders[i];
                    var col = $(target).datagrid('getColumnOption', sn);
                    var sortFunc = col.sorter || function(a,b){
                            return a==b ? 0 : (a>b?1:-1);
                        };
                    r = sortFunc(r1[sn], r2[sn]) * (so=='asc'?1:-1);
                    if (r != 0){
                        return r;
                    }
                }
                return r;
            });
        }
        var start = (opts.pageNumber-1)*parseInt(opts.pageSize);
        var end = start + parseInt(opts.pageSize);
        data.rows = state.allRows.slice(start, end);
        return data;
    }

    var loadDataMethod = $.fn.datagrid.methods.loadData;
    var deleteRowMethod = $.fn.datagrid.methods.deleteRow;
    $.extend($.fn.datagrid.methods, {
        clientPaging: function(jq){
            return jq.each(function(){
                var dg = $(this);
                var state = dg.data('datagrid');
                if(!state){
                    console.info(dg);
                    return null ;
                }
                var opts = state.options;
                opts.loadFilter = pagerFilter;
                var onBeforeLoad = opts.onBeforeLoad;
                opts.onBeforeLoad = function(param){
                    //state.allRows = null;
                    return onBeforeLoad.call(this, param);
                }
                var pager = dg.datagrid('getPager');
                pager.pagination({
                    onSelectPage:function(pageNum, pageSize){
                        opts.pageNumber = pageNum;
                        opts.pageSize = pageSize;
                        pager.pagination('refresh',{
                            pageNumber:pageNum,
                            pageSize:pageSize
                        });
                        dg.datagrid('loadData',state.allRows);
                    }
                });
                $(this).datagrid('loadData', state.data);
                if (opts.url){
                    $(this).datagrid('reload');
                }
            });
        },
        loadData: function(jq, data){
            jq.each(function(){
                var dgData = $(this).data('datagrid');
                if(dgData && Array.isArray(data)){
                    dgData.allRows = [].concat(data);
                }
            });
            return loadDataMethod.call($.fn.datagrid.methods, jq, data);
        },
        deleteRow: function(jq, index){
            return jq.each(function(){
                var row = $(this).datagrid('getRows')[index];
                deleteRowMethod.call($.fn.datagrid.methods, $(this), index);
                var state = $(this).data('datagrid');
                if (state.options.loadFilter == pagerFilter){
                    for(var i=0; i<state.allRows.length; i++){
                        if (state.allRows[i] == row){
                            state.allRows.splice(i,1);
                            break;
                        }
                    }
                    $(this).datagrid('loadData', state.allRows);
                }
            });
        },
        getAllRows: function(jq){
            return jq.data('datagrid').allRows;
        }
    })
})(jQuery);

//简单的jasgis-XX解析器
var SimpleTemplateParser = function(md){
    var _class = this ;
    var context = md ;
    var mapApi = context.mapApi ;
    var jasgisModuleContainer = [];

    var parseEasyUIClass = function(dom ,options){
        var className = $(dom).attr("class") ;
        var name = $(dom).attr("name") ;
        var easyuiClasses = className.match(/easyui-[\w]+/);
        if(!easyuiClasses || easyuiClasses.length === 0){
            return ;
        }
        var _cls = easyuiClasses[0] ;
        var subIndex = _cls.indexOf("-") + 1;
        var func = _cls.substr(subIndex) ;
        var $dom = null ;
        if(func === "combobox"){
            $dom = $(dom)[func]({
                "width":110,
                "data":options.source[name],
                "onSelect":function(record){
                    options.data[name] = record.value;
                    context.change();
                }
            });
            if(options.data[name] !== undefined ){
                $dom[func]("select",options.data[name]);
            }
            context["_" + name] = $dom ;
        }
    };
    var parseJasgisClass = function(dom ,options){
        var parent = $(dom).parent()[0] ;
        var className = $(dom).attr("class");
        var name = $(dom).attr("name");
        var subIndex = className.indexOf("-") + 1;
        var jasgisClass = className.substr(subIndex);
        var JasgisClass = window[jasgisClass];
        var source = options.source[name];
        var data = options.data[name];
        var op = {
            source: source ? source : undefined,
            data: data ? data : undefined
        };
        var jasCls = new JasgisClass(op) ;//
        context["_" + name] = jasCls ;//在父模块保存对象引用
        jasgisModuleContainer.push({
            parent:parent,
            jasClass:jasCls,
            target:dom
        });

    };
    var getAttrValueByDotName = function(data,name){
        var attr = data;
        var names = name.split(".");
        for(var i=0 ; i< names.length ; i++){
            if( attr[names[i]]!== undefined){
                attr = attr[names[i]];
            }else{
                break ;
            }
        }
        return attr;
    };
    var setAttrValueByDotName = function(data,name,value){
        var attr = data;
        var names = name.split(".");
        for(var i=0 ; i< names.length ; i++){
            var v = attr[names[i]] ;
            if( typeof v !== "object" && typeof attr === "object"){
                attr[names[i]] = value;
                break ;
            }else{
                attr = v;
            }
        }
        return attr;
    };
    var parseOriginDom = function(dom,options){
        var name = $(dom).attr("name");
        if( $(dom)[0].nodeName === "INPUT"){
            var attr = getAttrValueByDotName(options.data,name);
            if(attr !== undefined){
                $(dom).val(attr);
            }
            $(dom).change(function(e){
                setAttrValueByDotName(options.data,name,this.value);
                context.change();
            });
        }
    };
    var parse = function($template,op){
        var children = $template.children();
        var options = $.extend({
            data: null,
            source: null,
            dom: null
        },op);
        for(var i = 0;i < children.size() ;i++){
            var child = children.eq(i) ;
            if(child.children().size() > 0){
                child = parse(child, options);
            }else{
                _class.build(child[0],options);
            }
        }
        return $template[0];
    };
    _class.parseTemplate = function(template ,op){
        var $template = typeof template ==="string" ? $(template) : template;
        if($template.size() > 1){
            $template = $("<div></div>").append($template);
        }
        var dom = parse($template,op);
        if(jasgisModuleContainer.length > 0){
            for(var j = 0 ; j < jasgisModuleContainer.length ;j++){
                var nd = jasgisModuleContainer[j];
                nd.jasClass.domCreate();
            }
            for(var i = 0 ; i < jasgisModuleContainer.length ;i++){
                var nd2 = jasgisModuleContainer[i];
                nd2.jasClass.startup();
                nd2.parent.replaceChild( nd2.jasClass.dom ,nd2.target);
            }
            jasgisModuleContainer.length = 0;
        }
        return dom ;
    };
    _class.build = function(dom,options){
        var $dom = $(dom);
        var className = $dom.attr("class");
        var name = $dom.attr("name");
        var hasClassName = className ? true :false ;
        var hasName = name ? true :false ;
        if(!hasName) return ;
        if(hasClassName){
            var jasgisClasses = className.match(/jasgis-[\w]+/);
            if(jasgisClasses && jasgisClasses.length > 0){
                return parseJasgisClass(dom ,options);
            }
            if(className.indexOf("easyui-") >= 0){
                return parseEasyUIClass(dom,options);
            }
        }
        if($dom[0].nodeName === "INPUT"){
            return parseOriginDom(dom ,options);
        }
        return null ;
    }
};

//=========地图控件=========
/**
 * 地图控件-地图工具条
 * @param dom
 * @param data
 * @constructor
 */
var BaseMapToolsBar = function(options){
    var _self = this;
    var defaults = {
        "iconHeight":30,
        "iconWidth":30
    };
    var params = $.extend(defaults,options);
    _self.moduleClass = "Map-Widget-BaseMapToolsBar";
    _self.template =
        "<div class='"+  _self.moduleClass +"' style='display:none;'>" +
            "<ul></ul>" +
        "</div>";
    _self.addClickListener = function(){
        $("img",_self.dom).click( function(e){
            var t = e.currentTarget;
            var type = $(t).attr("data-type");
            var target = $(t).attr("data-target");
            if(type === "module"){
                var module = _self.mapApi.getModuleById(target);
                if(module){
                    var open = module.state;
                    if(open !== "open"){
                        module.open(true);
                    }else {
                        module.open(false);
                    }
                }
            }else if(type === "api"){
                _self.mapApi[target]();
            }
        } );
    };
    _self.setCenter = function(){
        var barWidth = $(_self.dom).width();
        $(_self.dom).css("margin-left",0-barWidth/2);
    } ;
    _self.iconSelectedChanged = function($dom ,selected){
        var flg = true ;
        if(selected !== undefined){
            if(!selected)
                $dom.removeClass("selected");
            else
                $dom.addClass("selected");
        }else{
            if($dom.hasClass("selected")){
                $dom.removeClass("selected");
                flg = false ;
            }else {
                $dom.addClass("selected");
                flg = true ;
            }
        }
        return flg;
    };
    _self.open = function(flg){
        if(flg === true){
            $(_self.dom).show();
        }else{
            $(_self.dom).hide();
        }
    };
    _self.startup = function(){
        _self.addClickListener();
        _self.mapApi.subscribe(_self.mapApi.Events.ModuleStateChangedEvent ,onModuleStateChanged);
        _self.mapApi.subscribe(_self.mapApi.Events.MapStateChangedEvent ,onMapStateChanged);
        return this;
    };
    _self.domCreate = function(){
        //创建容器
        $( _self.container ).append(_self.template);
        _self.dom = $("." + _self.moduleClass  ,  _self.container )[0];
        //加载图标
        for(var i = 0;i < _self.moduleSet.length ; i++){
            var m = _self.moduleSet[i];
            var type = m.type;
            var target = m.target;
            var $li = $("<li></li>");
            if (m.type === "module") {
                var module = _self.mapApi.getModuleById(m.target);
                if (module === null) {
                    var state = {
                        message: _self.mapApi.Strings.moduleNotFound + ",id=" + m.target,
                        type: "error"
                    };
                    _self.mapApi.publish(_self.mapApi.Events.ErrorEvent, state);
                    continue;
                }
                m.label = module.label;
                m.icon = module.icon;
            }
            var $icon = $("<img data-target='"+ target +"' data-type='"+ type +"' src='"+ m.icon +"' title='" + m.label + "' />");
            $li.append($icon[0]);
            $( "ul" ,_self.dom ).append( $li[0]);
        }
        _self.setCenter();
        _self.open(true);
    };

    var onModuleStateChanged = function(e){
        var module  = e.module;
        $( "li" ,_self.dom ).each(function(v,i){
            var $icon = $("img",this);
            var tar = $icon.attr("data-target");
            var type =  $icon.attr("data-type");
            if(tar === module.id && type==="module"){
                var flg = ( module.state==="open" ? true : false );
                _self.iconSelectedChanged($(this) ,flg);
            }
        });
    };
    var onMapStateChanged = function(e){
        var target = e.target ;
        var stateType = e.type ;
        $( "li" ,_self.dom ).each(function(v,i){
            var $icon = $("img",this);
            var tar = $icon.attr("data-target");
            var type = $icon.attr("data-type");
            if(stateType){
                if(   type !== "module"  ){
                    if( tar === target && target !== "startPanMode" ){
                        _self.iconSelectedChanged($(this) , true );
                    }else{
                        _self.iconSelectedChanged($(this) , false);
                    }
                }
            }else{
                if( tar === target ){
                    var hasSelected = $(this).hasClass("selected");
                    _self.iconSelectedChanged($(this) , !hasSelected);
                }
            }

        });
    };
};
/**
 * 地图控件-图层控制器
 * @param dom
 * @param mapApi
 * @constructor
 */
var LayerListTree = function(options){
    var defaults = {
        title:"图层控制",
        right:0,
        top:30,
        width:250,
        height:300,
        excludeLayerIds:[]
    };
    var params = $.extend(defaults,options);
    var _self = this;
    _self.unGroupedId = "unGroupedId";
    _self.moduleClass = "Map-Widget-LayerList";
    _self.state = "hide";//show
    _self.$tree = null;
    _self.template = "" +
        "<div class='" + _self.moduleClass + " panel'>" +
        "    <div class='tree'>" +
        "        <ul id='layerListTree'></ul>" +
        "    </div>" +
        "</div>";

    _self.onNodeCheckedChanged = function(node,checked){
        if(node.dynamic === true  ){ //
            updateDynamicLayer(node);
        }else if(!node.children && !node.children2 ){
            _self.mapApi.layerVisibleSwitch(node.id,checked);
        }else{//图层组
            var ids = getChildNodeIds(node , $(this));
            for(var i = 0; i < ids.length ; i++){
                _self.mapApi.layerVisibleSwitch(ids[i],checked);
            }
        }
    };
    _self.onNodeClick = function(node){

    };
    var hasUnGroupedDynamicLayer = false ;
    var unGroupedDynamicLayerIds = [];//非叶子节点动态图层id数组
    var groupedLeafLayers = {} ;//分组的叶子节点 layerId(nodeid): groupedLayerId
    var onLayerVisibleChanged = function(e){
        var layerId = e.target.id;
        var visible = e.visible;
        var node = _self.$tree.tree("find",layerId);
        if(node && node.checked !== visible ){
            if(visible){
                _self.$tree.tree("check",node.target);
            }else{
                _self.$tree.tree("uncheck",node.target);
            }
        }
    };
    var onGroupLayerVisibleChanged = function(e){
        var layerSetId = e.id.toUpperCase() ;
        var visible = e.visible ;
        var node = _self.$tree.tree("find",layerSetId);
        if(node && node.checked !== visible ){
            if(visible){
                _self.$tree.tree("check",node.target);
            }else{
                _self.$tree.tree("uncheck",node.target);
            }
        }
    };
    var onLayerAdded = function(e){
        var layerId = e.layer.id.toUpperCase();
        if(groupedLeafLayers[layerId]){
            layerId = groupedLeafLayers[layerId] ;
        }
        var layerNode = _self.$tree.tree("find",layerId);
        if(layerNode && e.layer.visible === true){
            _self.$tree.tree("check",layerNode.target);
        }
        if(unGroupedDynamicLayerIds.indexOf(layerId)>=0){
            updateDynamicLayersNodeEnabled(layerId);
        }
        _self.mapApi.addLayerVisibilityChangeEventListener(layerId,onLayerVisibleChanged);
    };
    var onMapZoomChanged = function(e){
        //var scale = e.target.getScale() ;
        updateDynamicLayersNodeEnabled() ;
    };
    var onLayersConfigChanged = function(newLayers,newConfig){
        _self.$tree.tree("loadData", []);
        _self.$tree.tree("loadData", processMapConfig(newConfig));

    };
    var parseLayerConfig = function(){
        var optionalLayers = _self.mapApi.apiConfig.map.optionallayers;
        _self.$tree.tree("loadData", processMapConfig(optionalLayers));
    };
    var createDynamicTreeNodes = function(parent,layerInfos ,layerId){
        var layer = layerInfos[0] ;
        var node = createDynamicTreeNode(layer,layerId) ;
        layerInfos.shift();
        if(layer.subLayerIds){
            node.state = "closed" ;
            node.children = [];
            for(var i = 0 ; i < layer.subLayerIds.length ;i++ ){
                createDynamicTreeNodes(node ,layerInfos,layerId);
            }
        }
        if(layer.parentLayerId === -1){
            parent.push(node);
        }
        else if(layerId + "-" + layer.parentLayerId === parent.id ){
            parent.children.push(node);
        }
    };
    var createDynamicTreeNode = function(conf,layerId){
        var id = layerId + "-" + conf.id ;
        var result = null ;
        if(conf.parentLayerId !== -1){
            result = {
                "id":id,
                "text":conf.name ? conf.name : "未命名",
                "checked":conf.defaultVisibility,
                "dynamic":true
            };
        }else{
            result = {
                "id":id,
                "text":conf.name ? conf.name : "未命名",
                "checked":conf.defaultVisibility,
                "dynamic":true,
                "minScale": conf.minScale,
                "maxScale": conf.maxScale
            };
        }
        return result;
    };
    var buildDynamicLayerNodes = function(url ,layerId){
         var nodes = [] ;
        unGroupedDynamicLayerIds.push(layerId);
         _self.mapApi.ajax({
             url:url + "?f=json",
             method:"get",
             "async":false,
             "dataType":"json",
             onSuccess:function(responseText){
                 var json = JSON.parse(responseText);
                 var layerInfos = [].concat(json.layers) ;
                 while(layerInfos.length > 0){
                     createDynamicTreeNodes(nodes ,layerInfos,layerId);
                 }
             },
             onError:function(e){
                 console.error(e);
                 _self.mapApi.publish(_self.mapApi.Events.ErrorEvent, {message: "服务加载错误，请检查" + url, type: "error"});
             }
         });
        return nodes ;
    };
    var updateDynamicLayerNodeEnabled = function(layerId){
        var scale = _self.mapApi.map.getScale() ;
        var node = _self.$tree.tree("find" ,layerId);
        if(node && node.children ){
            var parent = _self.$tree.tree("getData",node.target);
            var childNodes = parent.children;
            for(var j = 0 ; j < childNodes.length ; j++){
                var child = childNodes[j];
                if(child.minScale === 0 && child.maxScale === 0){
                    _self.$tree.tree("check",child.target);
                    continue;
                }
                if(scale < child.minScale && scale > child.maxScale){
                    _self.$tree.tree("check",child.target);
                    $("span.tree-hit",child.target).css("opacity",1);
                }else{
                    _self.$tree.tree("collapse",child.target);
                    _self.$tree.tree("uncheck",child.target);
                    $("span.tree-hit",child.target).css("opacity",0);
                }
            }
        }
    };
    var updateDynamicLayersNodeEnabled = function(id){ //
        if(!id){
            for(var i = 0 ; i < unGroupedDynamicLayerIds.length ; i++){
                var layerId = unGroupedDynamicLayerIds[i] ;
                updateDynamicLayerNodeEnabled(layerId);
            }
        }else{
            updateDynamicLayerNodeEnabled(id);
        }
    };
    var updateDynamicLayer = function(nd){
        var layerId = nd.id.split("-")[0].toUpperCase();
        var layerIndexes = [];
        var node = _self.$tree.tree("find",layerId);
        if(node){
            var data =  _self.$tree.tree("getData",node.target);
            var layerArray = getDynamicLayerIndex(data);
            for(var i = 0 ; i < layerArray.length ; i++){
                var nodeId = layerArray[i] ;
                var strs = nodeId .split("-");
                layerIndexes.push(parseInt( strs[strs.length - 1] ));
            }
        }
        if(layerIndexes.length > 0){
            _self.mapApi.updateDynamicLayer(layerId ,{
                visibleLayers:layerIndexes
            });
        }
    };
    var getDynamicLayerIndex = function(node){
        var ids = [];
        if(node.checked === true){
            ids.push(node.id) ;
        }
        if(node.children){
            for(var i = 0; i < node.children.length ; i++){
                var child = node.children[i];
                ids = ids.concat(getDynamicLayerIndex(child));
            }
        };
        return ids ;
    };
    var getChildNodeIds = function(node,$tree){
        var result = [];
        var children = [];
        if(node.attributes && node.attributes.leaf === true){
            children = node["children2"];
        }else{
            children = node["children"];
        }
        if(children && children.length > 0){
            for(var i = 0; i < children.length ; i++){
                var child = children[i];
                if(typeof child === "object"){
                    result = result.concat(getChildNodeIds(child ,$tree));
                }else{
                    result.push(child);
                }
            }
        }else{
            result.push(node.id);
        }
        return result;
    };
    var processMapConfig = function(optionallayers){
        var treedata = [];
        var flag = _checkConfigs(null,optionallayers);
        if(!flag){
            console.error("配置存在错误，请检查！");
        }
        if(optionallayers && optionallayers.length > 0){//解析可选图层配置
            //树节点构建过滤函数 ，如果返回false ，当前节点不会构建到树
            var mapFunc = function(node,parent){
                if($.inArray(node.id,params.excludeLayerIds)!== -1){
                    console.info("图层控制控件已设置排除控制图层 :" + node.id);
                    return false
                }
                //针对动态服务类型单独处理，
                if(node.attributes.leaf === false && node.attributes.type === "dynamic"){
                    var url = node.attributes.url ;
                    node.children = buildDynamicLayerNodes(url ,node.id);
                    node.state = "closed";
                    hasUnGroupedDynamicLayer = true ;
                }
                //图层组
                if(node.attributes.leaf === true){
                    node.children2 = [] ;
                    //node.groupLayer =true ;
                }
                if(parent && parent.attributes.leaf === true ){
                    //图层如果分组，不创建叶子节点
                    parent.children2.push(node.id);
                    groupedLeafLayers[node.id] = parent.id;
                    return false ;//
                }
                return true ;
            };
            var layerLength = optionallayers.length;//默认解析基础地理数据
            for(var i = 0 ; i < layerLength ; i++){
                var optionallayerNode = null;
                var optionallayer = optionallayers[i];
                optionallayerNode = _processOptionallayerConfig(optionallayer,mapFunc);
                if(optionallayerNode){
                    treedata.push(optionallayerNode);
                }
            }
        }
        return treedata;
    };
    var _checkConfigs = function(baseMap,optionallayers){
        var flag = true;
        var layerIds = [];
        _processBasemapLayersConfig(baseMap,function(node){
            if($.inArray(node.id, layerIds)!== -1){
                flag = false;
                console.error("基础地图图层配置basemaps存在重复id :" + node.id);
                return false
            }
            layerIds.push(node.id);
            return true ;
        });
        for(var i=0 ; i < optionallayers.length ; i++){
            var optionallayer = optionallayers[i];
            _processOptionallayerConfig(optionallayer,function(node,parent){
                if($.inArray(node.id, layerIds)!== -1){
                    flag = false;
                    console.error("图层控制控件检测到配置optionallayers存在重复id :" + node.id);
                    return false;
                }
                layerIds.push(node.id);
                return true
            });
        }
        return flag;
    };
    var _createTreeNode = function(conf){
        var id = conf.id ? conf.id.toUpperCase(): new Date().getTime();
        return {
            "id":id,
            "text":conf.label ? conf.label : "未命名",
            "checked":false,
            "state":"open",
            "attributes":{
                "leaf":conf.leaf,
                "visible":conf.visible,
                "url":conf.url,
                "type":conf.type ? conf.type : "无",
                "layerSet":conf.layerSet ? true : false
            }
        };
    };
    var _processBasemapLayersConfig = function(conf,mapFunction){
        if(!conf) return ;
        var basemapNode = _createTreeNode(conf);
        if(mapFunction && typeof mapFunction === "function"){
            mapFunction(basemapNode);
        }
        var childs = [];
        for(var i = 0; i < conf.baseMapLayers.length ; i++){
            var l = conf.baseMapLayers[i];
            if(mapFunction && typeof mapFunction === "function"){
                mapFunction(l);
            }
            childs.push({
                "id": l.id,
                "text": l.label,
                "attributes":l
            });
        }
        if(childs.length > 0){
            basemapNode.children = childs;
        }
        return basemapNode;
    };
    //树节点遍历
    var _processOptionallayerConfig = function(conf,mapFunction,parent){
        var result = _createTreeNode(conf);
        if(mapFunction && typeof mapFunction ==="function"){
            var flg = mapFunction(result,parent);
            if(!flg){
                return;
            }
        }
        if(conf.layerSet && conf.layerSet.length > 0){
            result.children = [];
            var layerSet = conf.layerSet ;
            var children = [];
            for(var i = 0 ; i < layerSet.length ; i++){
                var c = layerSet[i];
                var node = _processOptionallayerConfig( c ,mapFunction ,result);
                node && children.push(node);
            }
            if(children.length > 0){
                result.children = children;
            }
        }
        return result;
    };
    _self.open = function(flg){
        if(flg === false ) {
            $(_self.dom).dialog('closed');
        }else{
            $(_self.dom).dialog('open');
        }
    };
    _self.refreshState = function(state){
        _self.state = state;
        _self.mapApi.publish(_self.mapApi.Events.ModuleStateChangedEvent , { "module":_self } );
    };
    _self.domCreate = function(){
        $(_self.container).append( _self.template);
        _self.dom  = $("." +_self.moduleClass , _self.container)[0];
        _self.$tree = $("#layerListTree" ,_self.dom).tree({
            checkbox:true,
            data:[{
                "id": 1, "text":"正在加载数据,请稍等。"
            }],
            onCheck:_self.onNodeCheckedChanged,
            onClick:_self.onNodeClick
        });
        var options = {
            title : params.title,
            width : params.width,
            height : params.height,
            top:params.top,
            right:params.right,
            closed : true,
            modal :false,
            onOpen:function(){
                _self.refreshState("open");
            },
            onClose:function(){
                _self.refreshState("closed");
            }
        };
        _self.mapApi.moduleDialog($(_self.dom),_self.container,options);
    };
    _self.startup = function(){
        _self.mapApi.subscribe( _self.mapApi.Events.OptionalLayerAddedEvent,onLayerAdded );//
        _self.mapApi.subscribe( _self.mapApi.Events.LayerSetVisibleChangedEvent,onGroupLayerVisibleChanged );//
        _self.mapApi.addMapEvent("zoom-end",onMapZoomChanged);
        params.excludeLayerIds.forEach(function(v,i){
            params.excludeLayerIds[i] = v.toUpperCase();
        });
        parseLayerConfig();

    };
};
/**
 * 地图控件-坐标拾取
 * @param dom
 * @param mapApi
 * @constructor
 */
var CoorsPicker = function(options){
    var defaults = {
        coorXName:"经度",
        coorYName:"纬度"
    };
    var params = $.extend(defaults ,options);
    var _self = this;
    var mouseMovingHandler = null;
    var onMouseMoving = function(e){
        var strX = params.coorXName + ":"+ e.mapPoint.x.toFixed(6) ;
        var strY = params.coorYName + ":"+ e.mapPoint.y.toFixed(6) ;
        _self.coorsX.text(strX);
        _self.coorsY.text(strY);
    };
    _self.dom = null;
    _self.moduleClass = "Map-Widget-CoorsPicker";
    _self.coorsX = null;
    _self.coorsY = null;
    _self.template = "<div class='" + _self.moduleClass +"'>" +
        "<label></label> " +
        "<label class='coordinate-x'></label><label>，</label><label class='coordinate-y'></label>" +
        "</div>";

    _self.startup = function(){
        mouseMovingHandler = _self.mapApi.addMouseMoveEventListener(onMouseMoving);
        return _self;
    };
    _self.domCreate = function(){
        $(_self.container).append(_self.template);
        _self.dom = $("." + _self.moduleClass ,_self.container);
        _self.coorsX = $("label.coordinate-x",_self.dom);
        _self.coorsY = $("label.coordinate-y",_self.dom);
    };
};
//----symbol classes----
var SimpleColor = function( options){
    var defaults = {
        source:"#ff0000",
        data:"#ff0000"
    };
    var defs = $.extend(defaults ,options) ;
    var _class = this ;
    var hasStarted = false ;
    var msie = false ;
    _class.dom = null ;
    _class.input = null ;
    _class.color = null ;
    _class.template = "<span class='simple-color'>" +
        "<input class='color-input' type='text' >" +
        "</span>";

    _class.startup = function(){
        $(_class.input).change(function(e){
            if(msie){
                $(_class.color).css( "background-color",this.value);
            }else{
                $(_class.color).val( this.value);
            }
            defs.data = this.value;
            _class.change() ;
        }).val(defs.source).change();
        if(!msie){
            $(_class.color).change(function(e){
                $(_class.input).val( this.value).change() ;
            });
        }
        hasStarted = true ;
    };
    _class.domCreate = function(){
        msie = ( "msie" === BrowserClient.type ) ;
        _class.dom = $( _class.template)[0];
        _class.input = $(".color-input",_class.dom);
        if( msie ){
            $(_class.dom ).append("<span class='color-choose'></span>");
        }else{
            $(_class.dom ).append("<input class='color-choose' type='color'>");
        }
        _class.color = $(".color-choose",_class.dom);
    };
    _class.change = function(){
        $(_class.dom).trigger("DrawSymbolParamChanged");
    };
    _class.colorToArray = function(color,opacity){
        var colorArray = _class.rgbaToArray(color);
        if( opacity !== null || opacity !== undefined){
            if(opacity > 1){
                colorArray[3] = opacity;
            }else if(opacity >=0 && opacity <= 1){
                colorArray[3] = parseInt(255 * opacity);
            }
        }
        return colorArray;
    };
    _class.setData = function(color){
        defs.data = _class.rgbaToArray(color);
        $(_class.input ).val(color).change();
    };
    _class.getData = function(opacity){
        var color = $(_class.input ).val();
        var colorArray = _class.rgbaToArray(color);
        if( opacity !== null || opacity !== undefined){
            if(opacity > 1){
                colorArray[3] = opacity;
            }else if(opacity >=0 && opacity <= 1){
                colorArray[3] = parseInt(255 * opacity);
            }
        }
        return colorArray;
    };
    _class.rgbaToArray = function(str){
        if(Array.isArray(str)){
            return str ;
        }
        var preIndex = str.indexOf("#");
        if( preIndex>= 0){
            var value = str.substring(preIndex + 1);
            var r,g,b ;
            var color = [];
            if(value.length === 3){
                r = value.substr(0,1);
                g = value.substr(1,1);
                b = value.substr(2,1);
                r += r;
                g += g;
                b += b;
            }else if(value.length === 6){
                r = value.substr(0,2);
                g = value.substr(2,2);
                b = value.substr(4,2);
            }else{
                return color ;
            }
            color.push(parseInt(parseInt(r,16).toString(10)));
            color.push(parseInt(parseInt(g,16).toString(10)));
            color.push(parseInt(parseInt(b,16).toString(10)));
            color.push(255);
            return color ;
        }
        var idx1 = str.indexOf("(") + 1 ;
        var idx2 = str.indexOf(")") ;
        var colorArray = str.substring(idx1 ,idx2).split(",") ;
        colorArray.map(function(v){
            return parseFloat(v) ;
        });
        if(colorArray.length === 3){
            colorArray.push(255);
        }
        return colorArray;
    };
};
var PolylineSymbolPicker = function(options){
    var defaults = {
        defaultStyle:'esriSLSSolid',
        source:{
            style:[{
                "value":"esriSLSSolid",
                "text":"实线—"
            },{
                "value":"esriSLSDash",
                "text":"折线-----"
            },{
                "value":"esriSLSDot",
                "text":"虚线······"
            },{
                "value":"esriSLSDashDot",
                "text":"折虚线-·-·-"
            }]
        },
        data:{
            type:"esriSLS",
            style:"esriSLSSolid",
            width:1,
            color:"#ff0",
            opacity:1
        }
    };
    var defs = $.extend(defaults ,options);
    var _class = this ;
    var hasStarted = false;
    _class.dom = null ;
    _class.domParser = new SimpleTemplateParser(_class) ;
    _class.template = "<fieldset>" +
        "<legend>边框</legend>" +
        "<table class=''>" +
            "<tr><td class='title'><label>线型：</label></td><td><select name='style' class='line-type easyui-combobox'></select></td></tr>" +
            "<tr><td class='title'><label>粗细：</label></td><td><input name='width' class='line-width' type='number' value='1' min='1' max='20' step='1'> 像素</td></tr>" +
            "<tr><td class='title'><label>颜色：</label></td><td><input name='color' class='jasgis-SimpleColor'></td></tr>" +
            "<tr><td class='title'><label>透明度：</label></td><td><input name='opacity' class='line-opacity' type='number' value='1' min='0' max='1' step='0.1'></td></tr>" +
        "</table>" +
        "</fieldset>";

    _class.startup = function(){
        hasStarted = true ;
        return _class;
    };
    _class.change = function(e){
        if(hasStarted){
            $(_class.dom).trigger("DrawSymbolParamChanged");
        }
    };
    _class.domCreate = function(){
        _class.dom = _class.domParser.parseTemplate(_class.template ,defs) ;
    };
    _class.getData = function(){
        var data = defs.data;
        var color = _class._color.getData(data.opacity);
        data.color = color ;
        return data;
    };
    _class.setData = function(data){

    };
};
var PolygonSymbolPicker = function(options){
    var defaults = {
        source: {
            style: [{
                "value": "esriSFSSolid",
                "text": "纯色填充"
            }, {
                "value": "esriSFSHorizontal",
                "text": "横线"
            }, {
                "value": "esriSFSVertical",
                "text": "竖线"
            }, {
                "value": "esriSFSForwardDiagonal",
                "text": "左斜线"
            }, {
                "value": "esriSFSBackwardDiagonal",
                "text": "右斜线"
            }, {
                "value": "esriSFSDiagonalCross",
                "text": "网格"
            }, {
                "value": "esriSFSNull",
                "text": "无填充"
            }]
        },
        data:{
            type:"esriSFS",
            style:"esriSFSSolid" ,
            width:1,
            opacity:0.3,
            color:"#f00" ,
            outline:null
        }
    };
    var _class = this ;

    var hasStarted = false ;
    var defs = $.extend(defaults ,options);

    _class.dom = null ;
    _class.domParser = new SimpleTemplateParser(_class) ;
    _class.template = '<fieldset>' +
        '<legend>填充</legend>' +
        '<table>' +
        '<tr><td class="title"><label>类型：</label></td><td><select name="style" class="fill-type easyui-combobox"></select></td></tr>' +
        '<tr><td class="title"><label>颜色：</label></td><td><input name="color" class="jasgis-SimpleColor"></td></tr>' +
        "<tr><td class='title'><label>透明度：</label></td><td><input name='opacity' type='number' value='1' min='0' max='1' step='0.1'></td></tr>" +
        '</table>' +
        '</fieldset>' +
        '<fieldset name="outline" class="jasgis-PolylineSymbolPicker"></fieldset>';

    _class.domCreate = function(){
        _class.dom = _class.domParser.parseTemplate(_class.template ,defs) ;
    };
    _class.startup = function(){
        hasStarted = true ;
        return _class ;
    };
    _class.change = function(){
        if(hasStarted){
            $(_class.dom).trigger("DrawSymbolParamChanged");
        }
    };
    _class.getData = function(){
        var data = defs.data ;
        data.color = _class._color.getData(defs.data.opacity);
        data.outline = _class._outline.getData();
        return data;
    };
};
var PointMarkSymbolPicker = function(options){
    var defaults = {
        source:{
            style:[{
                "value":"esriSMSCircle",
                "text":"圆点"
            },{
                "value":"esriSMSDiamond",
                "text":"钻石"
            },{
                "value":"esriSMSCross",
                "text":"十字"
            },{
                "value":"esriSMSSquare",
                "text":"方块"
            },{
                "value":"esriSMSX",
                "text":"X"
            },{
                "value":"esriSMSPath",
                "text":"线"
            }]
        },
        data:{
            type:'esriSMS',
            style:'esriSMSCircle',
            opacity:1,
            size:10,
            angle:0,
            xoffset:0,
            yoffset:0,
            outline:null
        }
    };
    var defs = $.extend(defaults ,options);
    var _class = this ;
    var hasStarted = false ;
    var onColorChanged = function(e){
        var color = _class._color.getData(defs.data.opacity);
        defs.data.color = color;
    };
    _class.dom = null ;
    _class.domParser = new SimpleTemplateParser(_class) ;
    _class.template = '<div><fieldset>' +
        '<legend>符号</legend>' +
        '<table>' +
            '<tr><td class="title">类型：</td><td><select name="style" class="easyui-combobox"></select></td></tr>' +
            '<tr><td class="title">大小：</td><td><input name="size" type="number" value="10" min="1" max="100" step="1"> 像素</td></tr>' +
            '<tr><td class="title">旋转：</td><td><input name="angle" type="number" value="0" min="0" max="360" step="0.5"> 度</td></tr>' +
            '<tr><td class="title">x偏移：</td><td><input name="xoffset" type="number" value="0" min="0" max="100" step="1"> 像素</td></tr>' +
            '<tr><td class="title">y偏移：</td><td><input name="yoffset" type="number" value="0" min="0" max="100" step="1"> 像素</td></tr>' +
            '<tr><td class="title">填充色：</td><td><input name="color" class="jasgis-SimpleColor"> </td></tr>' +
            '<tr><td class="title">透明度：</td><td><input name="opacity" type="number" value="1" min="0" max="1" step="0.1"> </td></tr>' +
        '</table>' +
        '</fieldset>' +
        '<fieldset name="outline" class="jasgis-PolylineSymbolPicker"></fieldset>' +
        '</div>' ;

    _class.domCreate = function(){
        _class.dom = _class.domParser.parseTemplate( _class.template,defs);

    };
    _class.startup = function(){
        $(_class.dom).on("SimpleColorChanged",onColorChanged);
        hasStarted = true ;
        onColorChanged();
        return _class ;
    };
    _class.change = function(){
        if(hasStarted){
            $(_class.dom).trigger("DrawSymbolParamChanged");
        }
    };
    _class.getData = function(){
        var data = defs.data ;
        data.color = _class._color.getData(data.opacity);
        data.outline = _class._outline.getData();
        return data;
    };
};
var PointPictureSymbolPicker = function(options){
    var defaults = {
        source:{
            url:[{
                "value":"images/location.png",
                "text":"图标"
            },{
                "value":"images/plot/pic_school.png",
                "text":"学校"
            },{
                "value":"images/plot/pic_vehicle.gif",
                "text":"汽车"
            },{
                "value":"images/plot/pic_government.png",
                "text":"政府部门"
            }]
        },
        data:{
            type:"esriPMS",
            url:"images/location.png",
            height:16,
            width:16,
            angle:0,
            xoffset:0,
            yoffset:0
        }
    };
    var defs = $.extend(defaults ,options);
    var _class = this ;
    _class.dom = null ;
    _class.domParser = new SimpleTemplateParser(_class) ;

    _class.template = '<fieldset>' +
        '<legend>符号</legend>' +
        '<table>' +
        '<tr><td class="title">图标：</td><td><select name="url" class="easyui-combobox"></select></td></tr>' +
        '<tr><td class="title">宽度：</td><td><input name="width" type="number" value="10" min="1" max="100" step="1"> 像素</td></tr>' +
        '<tr><td class="title">高度：</td><td><input name="height" type="number" value="10" min="1" max="100" step="1"> 像素</td></tr>' +
        '<tr><td class="title">旋转：</td><td><input name="angle" type="number" value="0" min="0" max="360" step="0.5"> 度</td></tr>' +
        '<tr><td class="title">x偏移：</td><td><input name="xoffset" type="number" value="0" min="0" max="100" step="1"> 像素</td></tr>' +
        '<tr><td class="title">y偏移：</td><td><input name="yoffset" type="number" value="0" min="0" max="100" step="1"> 像素</td></tr>' +
        '</table>' +
        '</fieldset>' ;

    _class.domCreate = function(){
        _class.dom = _class.domParser.parseTemplate(_class.template,defs);
    };
    _class.change = function(){
        $(_class.dom).trigger("DrawSymbolParamChanged");
    };
    _class.startup = function(){

    };
    _class.getData = function(){
        var data = defs.data ;

        return data;
    };
};
var TextSymbolPicker = function(options){
    var defaults = {
        source:{
            text:'文字标注'
        },
        data:{
            "type": "esriTS",
            text:'文字标注',
            font:{
                size : 10
            },
            borderLineSize:0,
            borderLineColor:"#000",
            backgroundColor:"#fff",
            angle:0,
            xoffset:0,
            yoffset:0,
            haloSize:1,
            haloColor:"#fff"
        }
    };
    var defs = $.extend(defaults ,options);
    var _class = this ;
    var hasStarted = false ;

    _class.dom = null ;
    _class.domParser = new SimpleTemplateParser(_class) ;
    _class.template = '<fieldset>' +
        '<legend>符号</legend>' +
        '<table>' +
        '<tr><td class="title">标注：</td><td><input name="text" ></td></tr>' +
        '<tr><td class="title">字体大小：</td><td><input name="font.size" type="number" min="1" max="100" step="1"> 像素</td></tr>' +
        '<tr><td class="title">颜色：</td><td><input name="color" class="jasgis-SimpleColor"></td></tr>' +
        '<tr><td class="title">边线粗细：</td><td><input name="borderLineSize" type="number" min="1" max="100" step="1"></td></tr>' +
        '<tr><td class="title">边线颜色：</td><td><input name="borderLineColor" class="jasgis-SimpleColor"></td></tr>' +
        '<tr><td class="title">背景色：</td><td><input name="backgroundColor" class="jasgis-SimpleColor"></td></tr>' +
        '<tr><td class="title">旋转：</td><td><input name="angle" type="number"  min="0" max="360" step="0.5"> 度</td></tr>' +
        '<tr><td class="title">x偏移：</td><td><input name="xoffset" type="number" min="0" max="100" step="1"> 像素</td></tr>' +
        '<tr><td class="title">y偏移：</td><td><input name="yoffset" type="number"min="0" max="100" step="1"> 像素</td></tr>' +
        '<tr><td class="title">光晕大小：</td><td><input name="haloSize" type="number" min="0" max="10" step="1"> 像素</td></tr>' +
        '<tr><td class="title">光晕色：</td><td><input name="haloColor" class="jasgis-SimpleColor"></td></tr>' +
        '</table>' +
        '</fieldset>' ;

    _class.domCreate = function(){
        _class.dom = _class.domParser.parseTemplate(_class.template ,defs) ;

    };
    _class.startup = function(){
        hasStarted = true ;
        return _class ;
    };
    _class.change =  function(){
        if(hasStarted){
            $(_class.dom).trigger("DrawSymbolParamChanged");
        }
    };
    _class.getData= function(){
        var data = defs.data ;
        data.color = _class._color.getData();
        data.borderLineColor = _class._borderLineColor.getData();
        data.backgroundColor = _class._backgroundColor.getData();
        data.haloColor = _class._haloColor.getData();

        data.angle = parseFloat(data .angle);
        data.xoffset= parseInt(data.xoffset) ;
        data.yoffset= parseInt(data.yoffset) ;
        data.font.size = parseInt(data.font.size );
        return data;
    };
};
//----symbol classes----
/**
 * 地图控件-地图标绘
 *
 */
var DrawBox = function(options){
    var _self = this ;
    _self.dom = null;
    _self.symbolEditTemplate = {
        "simpleMarketSymbol":"",
        "pictureMarketSymbol":"",
        "simpleLineSymbol":"",
        "simplePolylineSymbol":"",
        "simpleFillSymbol":""
    };
    _self.startup = function(){
        $("img",_self.dom).click(_self.onToolChanged);
        return _self;
    };
    _self.toggleShow = function(){
        if($(_self.dom).css("display")!=='none'){
            $(_self.dom).hide();
        }else{
            $(_self.dom).show();
        }
    };
    _self.moduleClass = 'Map-widget-DrawBox';
    _self.template =
        '<div  class="'+ _self.moduleClass +'">' +
            '<ul>'+
                '<li><img src="images/plot/delete.png" title="点击删除某个标绘" data-tool="DELETE" ></li>'+
                '<li><img src="images/plot/point.png" title="点" data-tool="POINT" ></li>' +
                '<li><img src="images/plot/line.png" title="线" data-tool="LINE"></li>'+
                '<li><img src="images/plot/polyline.png" title="折线" data-tool="POLYLINE"></li>'+
                '<li><img src="images/plot/polygon.png" title="面" data-tool="POLYGON"></li>'+
                '<li><img src="images/plot/rect.png" title="矩形" data-tool="RECTANGLE"></li>'+
                '<li><img src="images/plot/polygon.png" title="箭头" data-tool="ARROW"></li>'+
                '<li><img src="images/plot/circle.png" title="圆" data-tool="CIRCLE"></li>'+
                '<li><img src="images/plot/ellipse.png" title="椭圆" data-tool="ELLIPSE"></li>'+
                '<li><img src="images/plot/bitmap.png" title="图标" data-tool="PICTURE" ></li>'+
                '<li><img src="images/plot/text.png" title="文字" data-tool="TEXT" ></li>'+
            '</ul>' +
        '</div>';
    _self.open = function(flg){
        if(flg === true){
            $(_self.dom).show();
        }else{
            $(_self.dom).hide();
        }
    };
    _self.domCreate = function(){
        $(_self.container).append(_self.template);
        _self.dom = $("." + _self.moduleClass, _self.container)[0];
    };
};
var DrawAndEditPanel = function(options){
    var defaults = {
        title:"标绘工具箱",
        right:100,
        left:null,
        top:30,
        bottom:null,
        width:360,
        height:580,
        defaultTool :"POINT",
        dataSourceEnable:false ,
        dataSources:[{
            "value":"draw_table_01",
            "text":"标绘表1"
        },{
            "value":"draw_table_02",
            "text":"标绘表2"
        }]
    };
    var params = $.extend(defaults,options);
    var _self = this ;
    _self.dom = null;
    _self.tools = null ;
    _self.tabs = null;
    _self.symbolEditTemplate = {
        "simpleMarketSymbol":"",
        "pictureMarketSymbol":"",
        "simpleLineSymbol":"",
        "simplePolylineSymbol":"",
        "simpleFillSymbol":""
    };
    _self.moduleClass = 'Map-Widget-DrawPanel';
    _self.template =
        '<div class="'+ _self.moduleClass +'">' +
            '<div class="draw-section">' +
                '<div class="title">' +
                     '<label>工具选择：</label>' +
                '</div>'+
                '<ul class="draw-tools">'+
                    '<li><img src="images/plot/point.png" title="点" data-tool="POINT" data-tip="点击地图，添加点状符号" ></li>' +
                    '<li><img src="images/plot/bitmap.png" title="图标" data-tool="PICTURE"  data-tip="点击地图，添加图标符号"></li>'+
                    '<li><img src="images/plot/line.png" title="线" data-tool="LINE"  data-tip="点击地图，按住鼠标左键不放移动鼠标绘制直线"></li>'+
                    '<li><img src="images/plot/polyline.png" title="折线" data-tool="POLYLINE"  data-tip="点击地图，绘制直线"></li>'+
                    '<li><img src="images/plot/polygon.png" title="面" data-tool="POLYGON"  data-tip="点击地图，绘制面"></li>'+
                    '<li><img src="images/plot/rect.png" title="矩形" data-tool="RECTANGLE"  data-tip="点击地图，绘制矩形"></li>'+
                    '<li><img src="images/plot/polygon.png" title="箭头" data-tool="ARROW" data-tip="点击地图，绘制箭头"></li>'+
                    '<li><img src="images/plot/circle.png" title="圆" data-tool="CIRCLE"  data-tip="点击地图取得圆心，绘制圆"></li>'+
                    '<li><img src="images/plot/ellipse.png" title="椭圆" data-tool="ELLIPSE"  data-tip="点击地图取得圆心，绘制圆"></li>'+
                    '<li><img src="images/plot/text.png" title="文字" data-tool="TEXT"  data-tip="点击地图，添加文字标注"></li>'+
                    '<li><img src="images/plot/delete.png" title="点击进入删除状态，某个图形删除该图形" data-tool="DELETE"  data-tip="点击进入删除状态，某个图形删除该图形"></li>'+
                '</ul>' +
            '</div>' +
            '<div class="draw-section">' +
                '<div class="title">' +
                    '<label>样式设置：</label>' +
                '</div>'+
                '<div class="symbol-tabs"></div>'+
            '</div>' +
            '<div class="draw-section" id="datasource-section">' +
                '<div class="title">' +
                    '<label>数据源：</label>' +
                '</div>'+
                '<div class="form">' +
                    '<label>选择数据源：</label><input id="datasource-selector"><a href="javascript:void(0);">保存</a>' +
                '</div>'+
            '</div>' +
            '<div class="draw-section" id="tip-section" >' +
                '<table><tr><td><span id="draw-tip">操作提示</span></td></tr></table>' +
            '</div>' +
        '</div>';

    var currentTool = null;
    var pickerObjectContainer = {};
    var appendSymbolTab = function(type,id){
        var target = null ;
        switch (type){
            case 'LINE':;
            case 'POLYLINE':
                target = new PolylineSymbolPicker();
                break ;
            case 'POLYGON':;
            case 'RECTANGLE':;
            case 'ARROW':;
            case 'CIRCLE':;
            case 'ELLIPSE':
                target = new PolygonSymbolPicker();
                break ;
            case 'POINT':
                target = new PointMarkSymbolPicker();
                break;
            case 'PICTURE':
                target = new PointPictureSymbolPicker();
                break;
            case 'TEXT':
                target = new TextSymbolPicker();
                break;
            case 'DELETE':
                //target = new TextSymbolPicker();
                return ;
            default:"开发中..."
        }
        target.domCreate();
        target.startup();
        pickerObjectContainer[type] = target;
        var picker = $("<div></div>").attr("id",id).addClass("symbol-picker").append(target.dom);
        return $(_self.tabs).append(picker);
    };
    var activateSymbolTab = function(type,id){
        if(type !== "DELETE"){
            $( "#" + id ,_self.tabs.show()).show().siblings().hide();
        }else{
            $(_self.tabs).hide();
        }
        var $imgTool = $("img[data-tool=" + type + "]",_self.tools);
        $imgTool.parent().addClass("selected").siblings().removeClass("selected");
        var tip = $imgTool.attr("data-tip");
        _self.tip.text(tip);
        currentTool = type;
    };
    var onToolChanged = function(e){
        var tool = $(e.target).attr("data-tool");
        var typeId = tool + "-PICKER";
        var target = $("#" + typeId,_self.tabs);
        if(target.length === 0){
            appendSymbolTab(tool,typeId);
        }
        activateSymbolTab(tool ,typeId);
        activateDrawTool();
    };
    var activateDrawTool = function(){
        if(currentTool === "DELETE"){
            _self.mapApi.startDrawAndEditMode(currentTool);
            return
        }
        var pickObject = pickerObjectContainer[currentTool];
        var symbol = pickObject.getData();
        var param = {
            symbolObject: symbol
        };
        _self.mapApi.startDrawAndEditMode(currentTool,param);
    };
    var hasInit = false ;
    var initTool = function(){
        if(!hasInit){
            $("img[data-tool=" + params.defaultTool +"]",_self.tools).click();
        }
        hasInit = true ;
    };
    _self.startup = function(){
        $("img",_self.tools).click( onToolChanged );
        _self.$dom.on("DrawSymbolParamChanged",_self.change);
        return _self;
    };
    _self.toggleShow = function(){
        if($(_self.dom).css("display")!=='none'){
            $(_self.dom).hide();
        }else{
            $(_self.dom).show();
        }
    };
    _self.open = function(flg){
        if(flg === false ) {
            $(_self.dom).dialog('closed');
            _self.refreshState("closed");
        }else{
            $(_self.dom).dialog('open');
            _self.refreshState('open');
            initTool();
        }
    };
    _self.change = function(){
        setTimeout(activateDrawTool,10);
    };
    _self.refreshState = function(state){
        _self.state = state;
        _self.mapApi.publish(_self.mapApi.Events.ModuleStateChangedEvent , { "module":_self } );
    };
    _self.domCreate = function(){
        $(_self.container).append(_self.template);
        _self.$dom = $("." + _self.moduleClass, _self.container);
        _self.dom = _self.$dom[0];
        _self.tabs = $(".symbol-tabs",_self.dom);
        _self.tools =  $(".draw-tools",_self.dom);
        _self.tip =  $("#tip-section #draw-tip",_self.dom);
        $("#datasource-selector",  _self.dom).combobox({
            data:params.dataSources
        }).combobox('select',params.dataSources[0].value);
        var options = {
            title : params.title,
            width : params.width,
            height : params.height,
            top: params.top,
            right: params.right,
            closed : true,
            modal : false,
            onOpen: function(){
                _self.refreshState("open");
            },
            onClose:function(){
                _self.refreshState("closed");
            }
        };
        _self.mapApi.moduleDialog(_self.$dom,_self.container,options);
        //_self.dom = _self.mapApi.domFactory.parseTemplate(_self.template);
    };
};
/**
 * 地图控件-底图切换
 ***/
var BaseMapsGallary = function(options){
    var defaults = {
        "imgWidth":60,/// 图标大小
        "imgHeight":35,
        "folded":false,
        "onBaseMapChanged":function(e){

        }
    };
    var params = $.extend({},defaults,options);
    var _self = this;

    _self.dom = null;
    _self.moduleClass = "Map-Widget-Basemap";
    _self.list = null;
    _self.showIndex = 0;
    _self.state = "open";
    _self.template = "<div class='"+ _self.moduleClass + "'><div class='container'><ul></ul></div></div>" ;

    var getBaseInfo = function(config){
        return {
            "id":config.id,
            "label":config.label,
            "url":config.url,
            "thumnail":config.icon
        }
    };
    var createListItem = function(dataObj){
        return "<div class='listItem' data-layerId='"+dataObj.id+"'>" +
            "<img src='"+dataObj.thumnail+"' title='"+dataObj.url+"'>" +
            "<br>" +
            "<span>"+dataObj.label+"</span>" +
            "</div>";
    };
    var parseBaseMapConfig = function(){
        var layers = [];
        try {
            var basemaps = _self.mapApi.apiConfig.map.basemaps;
            if (basemaps && basemaps .baseMapLayers) {
                var conf = basemaps .baseMapLayers;//服务来自api的配置
                for(var i = 0 ; i < conf.length ; i++ ){
                    layers.push(getBaseInfo(conf[i]));
                }
            }
            return layers;
        }catch(e){
            console.error(e);
            console.error("解析配置出错");
        }
    };
    var toggleShow  = function(){
        if(_self.state === "hidden"){
            var showWidth = params.imgWidth *  $(".listItem",_self.dom).size() + 30;
            $('.container',_self.dom).width(showWidth);
            selectItem(_self.showIndex);
            toggleShowUnSelectedItems(true);
            _self.state = "open";
        }else{
            var showWidth = params.imgWidth  + 10;
            $('.container',_self.dom).width(showWidth);
            selectItem(-1);
            toggleShowUnSelectedItems(false);
            _self.state = "hidden";
        }
    };
    var toggleShowUnSelectedItems = function(flg){
        $("li",_self.list).each(function(index){
            if(index !== _self.showIndex){
                if(flg)
                    $(this).show();
                else
                    $(this).hide();
            }
        });
    };
    var selectItem = function(index){
        var list = $(".listItem",_self.dom);
        list.each(function(i){
            if(i===index){
                $(this).addClass("selected");
                _self.showIndex = index;
            }else{
                $(this).removeClass("selected");
            }
        });
    };
    var itemOnClick = function(){

    };
    _self.domCreate = function(){
        $(_self.container).append(_self.template);
        _self.dom = $("." + _self.moduleClass, _self.container).hide()[0];
        var imgWidth = params.imgWidth ? params.imgWidth : 100;
        var imgHeight = params.imgHeight ? params.imgHeight : 60;
        var $list = $("ul",_self.dom);
        var layers = parseBaseMapConfig();
        for(var i = 0 ; i < layers.length ; i++){
           var listItem = createListItem(layers[i]);
           $list .append("<li>" + listItem + "</li>");
        }
        $("img",$list).css({ "width":imgWidth,"height":imgHeight });
        _self.list = $list[0];
        $(_self.dom).show();
    };
    _self.startup = function(){
        if(params.folded === true){
            $(".container",_self.dom).bind({
                "mouseover":function(e){
                    toggleShow();
                },
                "mouseout":function(e){
                    toggleShow();
                }
            });
        }
        //
        $(".listItem",_self.dom).bind({
            "click":function(e){
                var index = $(this).parent().index();
                selectItem(index);
                var id = $(this).attr("data-layerId");
                _self.mapApi.switchBaseMap(id);
                if(params.onBaseMapChanged && typeof params.onBaseMapChanged){
                    params.onBaseMapChanged(index);
                }
                console.info("底图已经切换，id="+id);
            }
        });
    };
};
/**
 * 地图控件-坐标定位
 ***/
var Locate = function(options){
    var _self = this;
    var defaults = {
        "centerAtLevel":5,
        "title":"坐标定位",
        "width" : 260,
        "height" : 220
    };
    var params = $.extend(defaults,options);
    var refreshButtonStatus = function(){
        var v1 = $("#p_x",_self.dom).val();
        var v2 = $("#p_y",_self.dom).val();
        if(v1 == '' || v2 == ''){
            $('input.qbt',_self.dom).attr("disabled" ,true);
            return
        }
        var x = parseFloat(v1);
        var y = parseFloat(v2);
        if( isNaN(x) || isNaN(y)){
            $('input.qbt',_self.dom).attr("disabled" ,true);
        }else {
            $('input.qbt',_self.dom).attr("disabled" ,false);
        }
    };
    var onMouseMoving = function(e){
        _self.$currentX.text(e.mapPoint.x.toFixed(6));
        _self.$currentY.text(e.mapPoint.y.toFixed(6));
    };
    var mapMouseMoveListener = null ;
    _self.moduleClass = "Map-Widget-CoorsPositionDialog";
    _self.template = "<div class='"+ _self.moduleClass +"'>" +
        "<table style='margin: 5px auto;'>" +
        "<tr><td colspan='2'><label class='title'>鼠标当前位置</label></td></tr>" +
        "<tr><td><label>经度：</label></td><td><label id='current_p_x' class='coordinate' type='number' ></td></tr>" +
        "<tr><td><label>纬度：</label></td><td><label id='current_p_y' class='coordinate' type='number' ></td></tr>" +
        "<tr><td colspan='2'><label class='title'>输入坐标定位</label></td></tr>" +
        "<tr><td><label>经度：</label></td><td><input id='p_x' type='number' ><i>*</i></td></tr>" +
        "<tr><td><label>纬度：</label></td><td><input id='p_y' type='number' ><i>*</i></td></tr>" +
        "<tr>" +
        "<td align='center' colspan='2'>" +
            "<input class='qbt' type='button' value='定位' disabled >" +
            "<input class='cbt' type='button' value='清空'>" +
        "</td>" +
        "</tr>" +
        "</table>" +
        "</div>";

    _self.$currentX = null;
    _self.$currentY = null;

    _self.doClear = function(){
        $("#p_x",_self.dom).val('');
        $("#p_y",_self.dom).val('');
        _self.mapApi.clearMapGraphics();
        refreshButtonStatus();
    };
    _self.doPosition = function(){
        //这里的坐标一般是经纬度坐标，要转化成和底图坐标系的坐标值
        var x = parseFloat($("#p_x",_self.dom).val());
        var y = parseFloat($("#p_y",_self.dom).val());
        var coors = _self.mapApi.coorsToXY(x,y);
        if( !isNaN(x) && !isNaN(y)){
            _self.mapApi.clearMapGraphics();
            _self.mapApi.centerAt(coors[0],coors[1]);
            _self.mapApi.addPictureGraphic(coors[0],coors[1]);
        }
    };
    _self.startup = function(){

        $('input.qbt',_self.dom).click(function(e){
            _self.doPosition();
        });
        $('input.cbt',_self.dom).click(function(e){
            _self.doClear();
        });
        $('input#p_x',_self.dom).bind("input",function(e){
            refreshButtonStatus();
        });
        $('input#p_y',_self.dom).bind("input",function(e){
            refreshButtonStatus();
        });
        _self.$currentX = $('#current_p_x',_self.dom);
        _self.$currentY = $('#current_p_y',_self.dom);

    };
    //打开或关闭module
    _self.open = function(flg){
        if(flg === false ) {
            $(_self.dom).dialog('closed');
            _self.refreshState("closed");
        }else{
            $(_self.dom).dialog('open');
            _self.refreshState('open');
        }
        //_self.refreshState();

    };
    _self.refreshState = function(state){
        if(state === "open"){
            _self.mapApi.hideZoomSlider(true);
            mapMouseMoveListener = _self.mapApi.addMapEvent("mouse-move",onMouseMoving)
        }else{
            _self.mapApi.hideZoomSlider(false);
            _self.mapApi.removeEventListener(mapMouseMoveListener);
        }
        _self.state = state;
        _self.mapApi.publish(_self.mapApi.Events.ModuleStateChangedEvent , { "module":_self } );
    };
    _self.domCreate = function(){
        $(_self.container).append( _self.template);
        _self.dom = $("." + _self.moduleClass ,_self.container)[0];
        var options = {
            title : params.title,
            width : params.width,
            height : params.height,
            closed : true,
            modal :false,
            onOpen:function(){
                _self.refreshState("open");
            },
            onClose:function(){
                _self.refreshState("closed");
            }
        };
        _self.mapApi.moduleDialog($(_self.dom),_self.container,options);
    };
};
/**
 * 地图控件-鹰眼
 ***/
var OverViewMap = function(){
    var _class = this;
    _class.domCreate = function(){

    };
    _class.startup = function(){

    };
    _class.open = function(flg){
        alert("调试中...");
    };
};
/**
 * 地图控件-多边形查询
 ***/
var QueryByGeometry = function(options){
    var _self = this;
    var defaults = {
        title : "查询",
        width : 700,
        height : 500,
        mode:"panel",//"tool" | "panel"
        queryType:"circle",//"circle" | "polygon"
        drawLayerId:"drawlayer_query_by_geometry",
        defaultColumn:[{
            field:'OID',title:'编号',width:100
        }],
        layers:[{
            "id":"group01",
            "text":"未命名分组01",
            "children":[{
                "id":"sco_base_stake",
                "text":"桩",
                "outFields":"*",
                "where":"active=1"
            }]
        }],
        columns:{
            "sco_base_stake":[
                {field:'OID',title:'编号',width:100,align:'center'},
                {field:'STAKE_NUM',title:'桩号',width:100,align:'center'},
                {field:'MILEAGE',title:'里程',width:100,align:'center'},
                {field:'ACTIVE',title:'删除标记',width:100,align:'center'}
            ]
        },
        defaultId:null
    };
    var params = $.extend(defaults ,options);

    _self.moduleId = "MapWidget_" + new Date().getTime();
    _self.moduleClass = "Map-Widget-QueryByGeometry";
    _self.template = "<div class='" + _self.moduleClass + "' style='overflow: hidden; padding-bottom: 40px;'>" +
        "<div class='main'>" +
            "<div style='float: left;width: 25%;height:100%;'>" +
                "<div class='container'>" +
                    "<div class='title'><label>查询分组：</label></div>" +
                    "<div class='source-tree'></div>" +
                "</div>" +
            "</div>" +
            "<div style='float: left;width: 75%;height:100%;'>" +
                "<div class='container'>" +
                    "<div class='title'><label>查询结果：</label></div>" +
                    "<div class='source-tables'></div>" +
                "</div>" +
            "</div>" +
            "<div style='clear: both;'></div>" +
        "</div>"+
        "<div class='operation'>" +
            "<input class='query' value='点击激活标绘工具' type='button'>" +
            "<input class='clear' value='清空查询结果' type='button'>" +
        "</div>" +
    "</div>" ;

    _self.open = function(flg){
        if(flg === false ) {
            $(_self.dom).dialog('closed');
            _self.refreshState("closed");
        }else{
            if(params.mode === "tool"){
                _self.doQuery();
            }else{
                $(_self.dom).dialog('open');
                _self.refreshState("open");
            }
        }
    };
    _self.refreshState = function(state){
        _self.state = state;
        _self.mapApi.publish(_self.mapApi.Events.ModuleStateChangedEvent , { "module":_self } );
    };
    _self.domCreate = function(){
        $(_self.container).append($(_self.template).attr("id",_self.moduleId));
        _self.$dom = $("#" +_self.moduleId, _self.container);
        _self.dom = _self.$dom[0];
        _self.$tree = $(".source-tree",_self.$dom);
        _self.$tables = $(".source-tables",_self.$dom);
        _self.$queryBtn = $(".operation input.query",_self.$dom);
        _self.$clearBtn = $(".operation input.clear",_self.$dom);
        var options = {
            title : params.title,
            width : params.width,
            height : params.height,
            top: params.top,
            right: params.right,
            closed : true,
            modal : false,
            onOpen: function(){
                _self.refreshState("open");
            },
            onClose:function(){
                _self.refreshState("closed");
            }
        };
        _self.mapApi.moduleDialog(_self.$dom,_self.container,options);
    };
    _self.startup = function(){
        dataInit();
        treeInit();
        tableInit();
        toolsInit();
    };
    var treeInit = function(){
        _self.$tree.tree({
            data:params.layers,
            onSelect:onTreeNodeClicked
        });
    };
    var tableInit = function(){
        _self.activateTableTab(_self.currentId);
    };
    var toolsInit = function(){
        _self.$queryBtn.click(_self.doQuery);
        _self.$clearBtn.click(_self.doClear);
    };
    var dataInit = function(){
        initLayerParams(params.layers);
        _self.currentId = params.defaultId ;
    };
    var initLayerParams = function(nodes){
        for(var i = 0; i < nodes.length ; i++){
            var node = nodes[i] ;
            if( node.children && node.children.length > 0){
                initLayerParams(node.children );
                continue ;
            }
            if( !params.defaultId){
                params.defaultId = node.id ;
            }
            node._text = node.text ;
            var param = {
                id:node.id
            };
            var url = node.url ;
            if(url){
                param.url = url;
            }else{
                param.layerId = node.id ;
            }
            if(node.where){
                param.where = node.where ;
            }
            if(node.outFields){
                param.outFields = node.outFields ;
            }
            _self.layerQueryArray.push(param);
        };
    };
    var onTreeNodeClicked = function(node){
        if(!node.children || node.children.length === 0){
            _self.currentId = node.id ;
            _self.activateTableTab(_self.currentId ,!hasInitedTabs[_self.currentId] );
        }
    };
    var prepareQueryParams = function(geometry){
        var params = [].concat(_self.layerQueryArray);
        for(var i = 0 ; i < params.length ; i++){
            params[i].geometry = geometry;
        }
        return params;
    };
    var parseQueryResult = function(result){
        hasInitedTabs = {} ;
        if( !_self.queryResult ){
            _self.queryResult = {};
        }
        for(var idx in result){
            var features = result[idx];
            var layer = _self.layerQueryArray[idx];
            var data = [] ;
            for(var i = 0 ; i < features.length ;i++){
                var feature = features[i];
                data.push(feature);
            }
            _self.queryResult[layer.id] = data;
        }
        var activeTabId = params.defaultId;
        for(var key in _self.queryResult) {
            var data = _self.queryResult[key];
            var count = data ? data.length :0;
            if(count > 0){
                activeTabId = key ;
                break ;
            }
        }
        refreshCountQueryResult();
        _self.activateTableTab(activeTabId, !hasInitedTabs[activeTabId]);
    };
    var refreshCountQueryResult = function(){
        for(var key in _self.queryResult){
            var data = _self.queryResult[key];
            var count = data ? data.length :0;
            var node = _self.$tree.tree("find",key );
            if(node) {
                var span = "<span style='color: blue;'>(" + count + ")</span>";
                _self.$tree.tree("update",{
                    target:node.target ,
                    text: count > 0 ? node._text + span : node._text
                });
            }
        }
    };
    var clearCountQueryResult = function(){
        var nodes = _self.$tree.tree("getRoots");
        filterTreeNodes(nodes,function(node){
            _self.$tree.tree("update",{
                target:node.target ,
                text: node._text
            });
        });
    };
    var filterTreeNodes = function(nodes ,filter){
        for(var i = 0 ; i < nodes.length ; i++){
            var node = nodes[i] ;
            if(node.children && node.children.length > 0){
                filterTreeNodes(node.children,filter);
            }else{
                filter(node);
            }
        }
    };
    var clearTableData = function(){
        $(".source-table table" ,_self.$tables).datagrid({"data":[]}) ;
    };
    var clearLayerGraphics = function(){
        _self.mapApi.clearGraphicsLayer(params.drawLayerId);
    };
    var onDrawEnd = function(graphic){
        if(params.mode === "tool" && _self.state !== "open"){
            $(_self.dom).dialog('open');
            _self.refreshState('open');
        }
        var p = prepareQueryParams(graphic.geometry);
        _self.mapApi.queryFeatures(p,parseQueryResult);
    };
    var appendOperationColumn = function(cols){
        var op = {
            field:'-',
            title:'操作',
            width:100,
            align:'center',
            formatter:function(val ,row){
                return '<a href="javascript:void(0);" >定位</a>';
            }
        };
        cols.push(op) ;
    };
    var hasInitedTabs = {};
    _self.layerQueryArray = [] ;
    _self.queryResult = null ;
    _self.positioning = false ;
    _self.doQuery = function(){
        var options = {
            "layerId":params.drawLayerId,
            "onDrawEnd": onDrawEnd
        };
        if(params.queryType === "circle"){
            _self.mapApi.drawCircle(options);
        }else if(params.queryType === "polygon"){
            _self.mapApi.drawPolygon(options);
        }else{
            console.error("只支持圆查询和面查询。");
        }

    };
    _self.doClear = function(){
        _self.queryResult = null ;
        hasInitedTabs = {} ;
        clearLayerGraphics();
        clearTableData();
        clearCountQueryResult();
    };
    _self.doPosition = function(objectid){
        _self.positioning = false ;
        var id = _self.currentId ;
        _self.mapApi.flashGraphic(objectid ,id) ;
    };
    _self.getTableData = function(id){
        var data = [];
        var features = _self.queryResult[id] ;
        for(var i = 0 ; i < features .length ; i++){
            data.push(features[i].attributes);
        }
        return data ;
    };
    _self.activateTableTab = function(layerId,refresh){
        var id = ( layerId ? layerId :_self.currentId );
        var tabId = "table-" + id ;
        var target = $("#" + tabId ,_self.$tables);
        var data = _self.queryResult ? _self.getTableData( id):[];
        if(target.size() === 0){
            var cols = params.columns[id];
            _self.appendTableTab(tabId ,data,cols);
        }
        $("#" + tabId ,_self.$tables).show().siblings().hide();

        if(refresh === true){
            _self.refreshTableTab(tabId,data);
            hasInitedTabs[id] = true ;
        }
    };
    _self.refreshTableTab = function(tabId,data){
        $("#"+tabId+" table",_self.$tables).datagrid({
            "data":data
        }) .datagrid("clientPaging");
    };
    _self.appendTableTab = function(tabId ,data,cols){
        var table = $("<table style='height: 100%;width:100%;'></table>");
        var columns = cols ? cols : params.defaultColumn ;
        appendOperationColumn(columns) ;
        var tab = $("<div id='"+ tabId +"' class='source-table'></div>").append(table);
        _self.$tables.append(tab);
        $("#"+tabId+" table",_self.$tables).datagrid({
            fitColumns:true,
            pagination:true,
            singleSelect:true,
            fit:false,
            rownumbers:true,
            pageSize:10,
            columns:[columns],
            onSelect:function(index,row){
                if(_self.positioning){
                    _self.doPosition(row["OBJECTID"]);
                }
            },
            onClickCell:function(index ,field ,value){
                if(field === "-"){
                    _self.positioning = true;
                }
            }
        });
    };
};
/**
 * 地图控件-导出
 ***/
var MapExport = function(){
    var _class = this;
    _class.domCreate = function(){

    };
    _class.startup = function(){

    };
    _class.open = function(flg){
        _class.mapApi.print(function(e){
            alert("导出成功！");
        },function(e){
            alert("导出失败...");
        });
    };
};
/**
 * 地图控件-打印
 ***/
var MapPrint = function(){
    var _class = this;
    //
    _class.domCreate = function(){

    };
    _class.startup = function(){

    };
    _class.open = function(flg){
        _class.mapApi.print(function(e){
            alert("导出成功！");
        },function(e){
            alert("导出失败...");
        });
    };
};
