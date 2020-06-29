
/**
 * @file
 * @author 作者
 * @desc 网格化查询页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var querySerialize=null;	//查询条件

/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	$('#loginLockdatagrid').datagrid({
		idField:'oid',
		url: rootPath+"priLoginLock/getPage.do",
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
		frozenColumns:[[
            {field:'ck',checkbox:true}
		]],
		columns: 
		[[
			{	
				field:"loginName",
	    		title:"登录账号",
	    		width:"170",
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"status",
	    		title:"锁定状态",
	    		width:"170",
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"lockDatetime",
	    		title:"锁定开始时间",
	    		width:"170",
	    		resizable:true,
	    		align:'center'
	    	},

			{	
				field:"endDatetime",
	    		title:"锁定结束时间",
	    		width:"170",
	    		resizable:true,
	    		align:'center'
	    	}
		]],
		onDblClickRow:function(index,indexData){
		},
		onLoadSuccess:function(data){
	    	$('#loginLockdatagrid').datagrid('clearSelections'); //clear selected options
	    }
	});
	//页面自适应
	initDatagrigHeight('loginLockdatagrid','queryDiv','100');
});

/**
 * 解锁方法
 */
function openLock(oid){
	var rows = $('#loginLockdatagrid').datagrid('getSelections');
	var idArray=[];
	if(!isNull(oid)){
		idArray.push(oid);
	}else if (rows.length > 0){
		$(rows).each(function(i,obj){
			idArray.push(obj.oid);
		});
	}else{
		top.showAlert("提示","请选择记录",'info');
		return ;
	}
	if(!isNull(idArray)){
		$.messager.confirm('解锁', '您确定要解锁这些信息吗？\n\t',function(r){
			if (r){
				$.ajax({
					// url: rootPath+"/serviceMvc/loginLock/unLock.do?rd="+new Date().getTime(),
					url: rootPath+"/xncommon/unLock.do?rd="+new Date().getTime(),
					contentType: 'application/json;charset=utf-8',
					data: JSON.stringify({"idList" : idArray}),
					type: "POST",
					dataType:"json",
					async:false,
					success: function(data){
						if(data.status==1){
							top.showAlert("提示","解锁成功","info",function(){
								$('#loginLockdatagrid').datagrid('reload');	// reload the user data
								$('#loginLockdatagrid').datagrid('clearSelections'); //clear selected options
							});
						}else if(data.code == "400") {
							top.showAlert("提示", "解锁失败", 'error');
							enableButtion("saveButton");
						}else{
							top.showAlert("提示", data.msg, 'info');
							enableButtion("saveButton");
						}
					},
					error : function(data) {
						top.showAlert('错误', '解锁出错', 'info');
					}
				});
			}
		});
	}
}