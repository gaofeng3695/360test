
/**
 * @file
 * @author 作者
 * @desc 查看页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var pkfield=getParamter("alarmOid");	// 业务数据ID
var businessId = "";
/**
 * @desc 初始化
 */
$(document).ready(function(){
	$('#gpsAlarmInfoNotificationDatagrid').datagrid({
		height:'88%',
		width:'100%',
		idField:'oid',
		url: rootPath+"/gpsalarmnotification/getByAlarmOid.do?alarmOid="+pkfield,
		collapsible:true,
		autoRowHeight: true,
		remoteSort:true,
		columns:
			[[
				{
					field:"alarmOid",
					title:"报警序号",
					width:"100",
					resizable:true,
					sortable:true,
					align:'center'
				},
				{
					field:"receiverName",
					title:"接收人姓名",
					width:"100",
					resizable:true,
					align:'center'
				},
				{
					field:"receiverTypeName",
					title:"接收人职位",
					width:"100",
					resizable:true,
					align:'center'
				},
				{
					field:"phoneNumber",
					title:"接收人电话",
					width:"200",
					resizable:true,
					align:'center'
				},
				{
					field:"sendStatus",
					title:"短信发送状态",
					width:"100",
					resizable:true,
					align:'center',
					formatter: function(value,row,index){
						var opt ;
						if (value == '01'){
							opt = "发送成功";
						}else{
							opt = "发送失败";
						}
						return opt;
					}
				},
				{
					field:"notificationStatus",
					title:"短信通知状态",
					width:"100",
					resizable:true,
					align:'center'
				},
			]],
		onDblClickRow:function(index,indexData){
			top.getDlg("view_gps_alarm_info_notification_detail.html?oid="+indexData.oid,"viewAlarmNotificationDetail","详细",800,600,false,true,true);
		},
		onLoadSuccess:function(data){
			$('#gpsAlarmInfoNotificationDatagrid').datagrid('clearSelections'); //clear selected options
		}
	});
});


/**
 * @desc 关闭查看页面
 */
function closePanel() {
	top.closeDlg("viewGpsAlarmInfoRecord");
}

