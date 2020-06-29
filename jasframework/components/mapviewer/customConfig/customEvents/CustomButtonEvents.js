/***************系统工具栏按钮 事件处理方法   Start 【请勿删除】*************************/

/**
 * 方法描述：工具条中【面查询】按钮点击事件对应回调函数 【请勿删除】
 * @param obj	所绘制的面坐标		
 */
function drawPolygonHandler(obj){
	alert(obj);
	//编写业务处理方法
}

/**
 * 方法描述：工具条中【圆查询】按钮点击事件对应回调函数 【请勿删除】
 * @param obj	所绘制的圆坐标		
 */
function drawCircleHandler(obj){
	alert(obj);
	//编写业务处理方法
}

/**
 * 方法描述：工具条中【选点】按钮点击事件对应回调函数 【请勿删除】
 * @param obj	所选点坐标		
 */
function identifyClickHandler(obj){
	alert(obj);
	//编写业务处理方法
}
/**
 * 方法描述：标绘工具栏中【加载】按钮点击事件对应回调函数 【请勿删除】
 */
 function addLoadPlotHandler(){
	//编写业务处理方法
}
/**
 * 方法描述：标绘工具栏中【保存】按钮点击事件对应回调函数 【请勿删除】
 * @param obj 地图标绘图形JSON字符串	
 */
function savePlotGraphicHandler(obj){
	alert(obj);
	//编写业务处理方法
}
/***************系统工具栏按钮 事件处理方法   End 【请勿删除】*************************/




/********************自定义工具栏按钮 事件  Start***************************/
/**
 * 方法描述：【导出shape文件】按钮回调函数
 */           
function shapeEvent(){
	//编写业务处理方法
	alert("shapeEvent");
}

/**
 * 方法描述：【打印地图】按钮回调函数
 */ 
function switchMap(){
	//编写业务处理方法
	alert("switchMap");
}
/**
 * 方法描述：标绘工具条中【附件添加】按钮响应事件
 *
 */
 function attachmentEvent(){
	//编写业务处理方法
	alert("attachment");
}
/********************自定义工具栏按钮 事件  End***************************/

/*******************地图加载完成事件处理   Start *******************************/
function mapLoadedHandler(){
	//创建菜单
	createMenu(); 
	//地图放到最大给出提示
	mapMaxLevelTip();
}
/*******************地图加载完成事件处理   End *******************************/
/**
  * 方法描述：创建菜单
  */
 function createMenu(){
 	//定义菜单基本属性
 		//label:菜单显示名称
 		//name:标识菜单项，必须唯一
 		//iconName:图标，图片存放于assets/icon/下
	var data = [
 		{"label":"菜单一","name":"menu1","iconName":"menu1.png"},   
 		{"label":"菜单二","name":"menu2","iconName":"menu2.png"},
 		{"label":"菜单三","name":"menu3","iconName":"menu3.png"}];
 	var attribute = new Object();
 	attribute.data=data;
 	attribute.width=150;  //菜单栏宽度
 	attribute.height=200; //菜单栏高度
 	//定义菜单样式
 	var style = new Object();
 	style.selectionColor = "#3DDDDB"; //选中菜单颜色
 	style.focusColor = "#50BBC8";   //焦点菜单颜色
 	//如果为list菜单，则还需定义以下参数
 	style.backgroundColor ="#eeeeee" ; //菜单背景颜色
	style.color = "#212DC9";   //字体颜色，默认0xffffff
 	style.fontSize = 14; //字体大小，默认18
 	style.fontFamily = "黑体"; //字体样式，默认“微软雅黑”
 	style.fontWeight = "bold"; //字体粗细，，默认normal（取值bold||normal）
 	attribute.style = style;
 	createMenuList("firstMenu",40,30,attribute,true,"list",menuItemClickEvent);
 }
 
/**
* 方法描述：菜单列表单击监听回调函数
* @param data 所选菜单名，由name属性指定
*/
	
function menuItemClickEvent(data){
	//编写业务处理方法
	if(data=="menu2"){
		var data = [
	             		{"label":"子菜单一","name":"menu21","iconName":"menu1.png"},
	             		{"label":"子菜单二","name":"menu22","iconName":"menu2.png"}
	              ];
	 	var attribute = new Object();
	 	attribute.data=data;
	 	attribute.width=100;
	 	attribute.height=300;
	 	var style = new Object();
	 //	style.color = "#212DC9";   //字体颜色
	 	style.backgroundColor ="#ffffff" ; //菜单背景颜色
	 	style.selectionColor = "#3DDDDB"; //选中菜单颜色
	 	style.focusColor = "#50BBC8";   //焦点菜单颜色
	 	attribute.style = style;
	 	top.createMenuList("secondMenu",100,40,attribute,false,"list",menuItemClickEvent);
 	}
 	if(data=="menu21"){
 		top.removeMenuList("secondMenu");
 	}
}
/**************地图最大级别闪烁提示   start*************************/
 //创建时间：2014-9-22 15:25 Shenjie
 /**
 *
 *方法描述：地图级别达到最大时给出闪烁提示
 *
 */
 function mapMaxLevelTip(){
	 top.addZoomEventListener(maxLevelEventCallback);
  }
 	//定义变量
 	var maxLevel=0;   //地图最大级别
 	var tipLayer=document.createElement("div");  //创建弹出层
	tipLayer.id="tipLayer";
	var tip="";
	//设置div样式
	var style={
        background:"#87CEEB",
        position:"absolute",
        zIndex:10,
        width:"200px",
        height:"40px",
        left:"400px",
        top:"100px",
		font:"bold 18px arial,serif"
    };
    var speed=600;  //闪烁间隔
  
 function maxLevelEventCallback(level){
   //获取地图最大级数
	if(maxLevel==0){
	   maxLevel=top.getMapMaxLevel();
	 }
    if(level>=maxLevel){
      top.getMapMaxLevelTip("已放大到最大");
    }
 }	
     
function getMapMaxLevelTip(title)
{
    tipLayer.innerText=title;
    for(var i in style)
        tipLayer.style[i]=style[i];   
    if(document.getElementById("tipLayer")==null)
    {
        document.body.appendChild(tipLayer);
        setTimeout("document.body.removeChild(tipLayer)",4000);
    }
	tip=title;
	showTipLayer();
 }
	
function showTipLayer()
{
    $("#tipLayer").show();
	setTimeout("hideTipLayer()",speed);
}
function hideTipLayer(title)
{
	$("#tipLayer").hide();
	setTimeout("showTipLayer()",speed);
}
/****************地图最大级别闪烁提示   end**************************/


/*********************其他自定义方法  Start******************************/
  

/*********************其他自定义方法  End******************************/