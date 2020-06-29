var objId="";

$(function(){
	var objList=parent.getObjectList();
	var type=objList[0].recycleobjtype;
	var location=objList[0].location;
	var objname=objList[0].objname;
	objId=objList[0].eventid;
	if(type==1){
		fileType=objname.split('.')[1];
		$('#file').show();
		$('#folder').hide();
		$('#file_imge1').attr('src','image/'+fileType+'.png');
		$('#file_imge2').attr('src','image/'+fileType+'.png');
		$('#file1').append(objname+'</br>'+objname+'（回收站中文件）</br>');
		$('#file2').append(objname+'</br>'+objname+'（'+location+'/'+objname+'');
		$('#file_isMode').text('之后的'+objList.length+'个冲突执行同样的操作');
	}else{
		$('#folder').show();
		$('#file').hide();
		$('#title').text("目标目录‘"+location+"’已存在名为：‘"+objname+"’的文件夹");
		$('#folder1').text("回收站中文件夹："+objname);
		$('#folder2').text('‘'+location+'’目录下文件件：'+objname);
		$('#folder_isMode').text('之后的'+objList.length+'个冲突执行同样的操作');
	}
});
function mouseOver(obj){
	$("#"+obj).attr('class','detail-table');
}
function mouseLeave(obj){
	$("#"+obj).removeClass('detail-table');
}
/**
 * 文件还原操作
 * @param mode 1表示替换，2表示不移动，3表示重命名文件
 */
function chooseMode(mode){
	restoreRecycleObj(objId,mode);
}
function closeWindow(){
	parent.closeWindow('chooseRestoreMode');
}
/**
 * 合并文件夹
 */
function combination(){
	restoreRecycleObj(objId,4);
}
/**
 * 文件夹或文件跳过
 */
function stepover(){
	restoreRecycleObj(objId,2);
}
/***
 * 
 */
function restoreRecycleObj(objId,modeType){
	var fileAllOperation=($('#file_checked').attr("checked") == 'checked');
	var folderAllOperation=($('#folder_checked').attr("checked") == 'checked');
	$.ajax({
		url:"../recyclebin/restoreRecycleObj.do",
		type: "POST",
		data:{'objId':objId,"modeType":modeType,'fileAllOperation':fileAllOperation,'folderAllOperation':folderAllOperation},
		dataType:'json',
		success:function(result){
			if(result.success) {
				repeatlist = result.success;
				parent.reloadDataGrid();//刷新父页面
				if(repeatlist.length>0){
					parent.folderAndDocRepeatName(repeatlist);
				}else{
					closeWindow(); //关闭当前页面
				}
			}
		}
	});
}