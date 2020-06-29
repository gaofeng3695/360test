/**
 * 
 * 类描述: 基础开发平台前台全局变量定义及常量配置，用于定义平台前台页面的全局变量及常量配置
 * 		  分为“基础开发平台配置区域”和“业务系统配置区域”。“基础开发平台配置区域”定义的变量
 *        和常量不允许删除。基于基础开发平台开发的业务系统，可以根据实际情况修改平台的常量
 *        配置值，也可以在“业务系统配置区域”添加业务系统需要的变量定义和常量配置。
 *
 * @author yanght
 * @version 1.0
 * 创建时间： 2012-10-30 上午8:46:07
 *********************************更新记录******************************
 * 版本：  1.0       修改日期：         修改人：
 * 修改内容： 
 **********************************************************************
 */

/** *********************基础开发平台配置区域--开始*********************** */

var toShow2d = false;// 是否显示地图，true为显示，false为不显示

var toShow3d = false;// 是否显示三维，true为显示，false为不显示

var defaultPageLayout = 1;// 系统默认布局，1为上下布局，2为左右布局

// 默认打开的tab标签数组，格式为[{id:'1010',title:'待办工作',url:'../../platform/workflow/myundotask.htm',closeable:'false'},{}]
var defaultOpenTabArray = [];

var hasUserPreferenceConfig = false; // 是否开启用户个性化设置功能，即系统里面是否允许用户进行个性化设置，true为开启，false为不开启

// 允许打开的tab页签个数
var TAB_COUNT = 12;

// 地图对象
var mapViewer = null;

// 二三维是否联动
var isLinkage = false;

// 二三维联动是否正在进行
var inLinkage = false;

// 定位二维级数与三维相机高度的关联Json
var mapLevelToZ = {
	1 : 320000,
	2 : 140000,
	3 : 50000,
	4 : 25000,
	5 : 12500,
	6 : 6000,
	7 : 3000,
	8 : 1500,
	9 : 750,
	10 : 350,
	11 : 200
};

// 用户图层权限集合
var verifiedLayer = "";

// 客户端语言，登录和语言切换时要更新该变量值
var language = "zh_CN";	//当前语言

// 应用系统ID 
var defaultAppId = "402894a152681ba30152681e8b320003";
//var defaultAppId = "90af4dc8ef4a47d4968865101907fe2e";

//登录用户的userBo对象
var loginUser;

//功能导航菜单类型 取值为 accordion || menuBar
var navigatorMenuType = "accordion";

//是否是集成平台，false表示不是，true表示是集成平台
var isIntegrationExist=false;
//文档中心是否受权限控制
var isPrivilege=true;
//是否真的删除业务数据的附件，false表示假删除（修改数据字段），true表示真删除，同时删除文件
var isShiftDeleteAttachementFile=true;
/** *********************基础开发平台配置区域--结束*********************** */
/* ====================================================================== */
/* ====================================================================== */
/* ====================================================================== */
/** *********************业务系统配置区域-开始**************************** */

/** *********************业务系统配置区域-结束**************************** */
//定位二维级数与三维相机高度的关联Json
var ipScopeOfArea = {
	DB: "192.168.10;192.168.20",
	YLK: "192.168.30;192.168.40"
};

var ylkMap = [{id:'1010',url:'../../platform/workflow/myundotask.htm'}];
var dbMap = [{id:'1010',url:'../../platform/workflow/myundotask.htm'}];

/*****	文档管理系统-开始	*****/
//获取文档中心时是否受文档权限的控制
var isPrivilege=true;
//文档管理系统权限编号
var jasdocRootFunctionNo="1018";
//文档中心功能菜单权限ID,对应于系统权限定义表中的权限ID字段数据
var docCenterFunctionId="4028947d47326e170147327643e30007";
//文档收藏功能菜单权限ID,对应于系统权限定义表中的权限ID字段数据
var docFavoriteFunctionId="4862571b-31211-44ec-8904322fcddf32s21";
//文档共享功能菜单权限ID,对应于系统权限定义表中的权限ID字段数据
var docShareFunctionId="4862571b-31211-44ec-8904322fcddf32s22";
//文档分类功能菜单权限ID,对应于系统权限定义表中的权限ID字段数据
var docCategorizeFunctionId="4028947d4733435c0147334489c30002";
//文档中心folderId
var docCenterFolderId="ca60e123-d25e-4e93-8274-7be9912048ec";
//分类管理folderId
var classifyFolderId="6b55a993-5c9d-4f2b-9729-c9814e08a8ca";

//文件夹根目录层次编号的长度
var rootFolderHierarchylength = 8;
//文档中心根目录层次编号
var docCenterRootFolderHierarchy = "80001151";
//文档收藏根目录层次编号
var docFavoriteRootFolderHierarchy = "80001150";
//文档分类根目录层次编号
var docCategorizeRootFolderHierarchy = "80001152";

//文档中心对应的文件夹类型常量，值为1
var FOLDERTYPE_DOCCENTER=1;
//收藏夹对应的文件夹类型常量，值为2
var FOLDERTYPE_FAVORITE=2;
//文档分类对应的文件夹类型常量，值为3
var FOLDERTYPE_DOCCATEGORY=3;

var folderAllRoleValue = [20,30,40,50,60,90];
var folderAllRoleText = ['查看','下载', '上传和修改','删除','移动','文件夹管理'];
var folderRoleValue = 90;

//合并后的权限
var folderAllRoleValueAfter = [20,30,60,90];
var folderAllRoleTextAfter = ['查看','下载','修改','完全控制'];

//收藏夹树ID
var docFavoriteTreeId="docFavoriteTree";
//文档中心树ID
var docCenterTreeId="docCenterTree";
//文档分类树ID
var docCategoryTreeId="docCategoryTree";
//文档共享树ID
var docShareTreeId="docShareTree";

//上传文件大小上限
var uploadMaxsize = 1024*1024*30;
//支持的文件类型，多个使用逗号隔开。
var uploadFileTypes="*.bmp,*.png,*.jpeg,*.jpg,*.gif,*.xlsx,*.xls,*.pptx,*.ppt,*.docx,*.doc,*.txt,*.pdf,*.dwg,*.zip";
//一次上传文件数量限制
var uploadFileCount=10;

var defaultOpenTabArray = [{id:"docCenter",title:"文档中心",url:"../../jasdoc/folder/docCenter/queryTreeDocCenter.htm",closeable:false}];

//支持预览的文档格式
var previewFileType = "doc,docx,txt,xls,xlsx,ppt,pptx,gif,png,jpeg,jpg,bpm,pdf";
/*****	文档管理系统-结束	*****/