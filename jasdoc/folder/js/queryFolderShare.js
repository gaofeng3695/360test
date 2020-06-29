		var url;
		var folderId = "";
		var hierarchy = "";
		var foldertype = "1";
		var queryDocUrl = "../doccenter/getAllDoc.do";		//查询的url
		var deleteDocUrl = "";		//删除的url
		
		var folderLocationName = "文档中心";
		var parentObj = self.parent;

		/**
		 * 方法描述：移动
		 * 
		 */
		function moveFile(){
			var rows = $('#dg').datagrid('getSelections');
			if (rows.length > 0){
				var eventids= "" ;
				var filenames = "";
				if( foldertype == 4 || foldertype == 5 ){
					for( var i=0;i< rows.length ;i++ ){
						if( rows[i].move == 1 ){
							eventids += rows[i].eventid+",";
							filenames += rows[i].filename+",";
						}
					}
					if( eventids != "" ){
						eventids = eventids.substr( 0,eventids.length-1 );
						filenames = filenames.substr( 0,filenames.length-1 );
					}
				}else{
					for(var i=0;i<rows.length-1;i++){
						eventids += rows[i].eventid+",";
						filenames += rows[i].filename+",";
					}
					eventids += rows[rows.length-1].eventid;
					filenames += rows[rows.length-1].filename;
				}
				if( eventids != "" ){
					top.getDlg("moveFile.htm?eventids="+eventids+"&filenames="+filenames+"&foldertype="+foldertype+"&folderid="+folderId+"&r="+new Date().getTime(),'move','移动文档',580,162);
				}else{
					$.messager.alert('提示','请选择有移动权限的记录','info');
				}
			}else{
				$.messager.alert('提示','请选择记录','info');
			}
		}
		
		/**
		 * 方法描述：添加到收藏夹
		 */
		function addToFavorite(){
			//if(foldertype==1){
				var rows = $('#dg').datagrid('getSelections');
				if (rows.length > 0){
					var eventids= "" ;
					var filenames = "";
					for(var i=0;i<rows.length-1;i++){
						eventids += rows[i].eventid+",";
						filenames += rows[i].filename+",";
					}
					eventids += rows[rows.length-1].eventid;
					filenames += rows[rows.length-1].filename;
					
					top.getDlg("../favorite/addToFavorite.htm?eventids="+eventids+"&filenames="+filenames+"&foldertype="+foldertype+"&folderid="+folderId+"&r="+new Date().getTime(),'favorite','添加收藏',580,164);
					
				}else{
					$.messager.alert('提示','请选择记录','info');
				}
			//}
		}
		
		/**
		 * 方法描述：分类
		 * 
		 */
		function addtoDocClassify(){
				var rows = $('#dg').datagrid('getSelections');
				if (rows.length > 0){
					var eventids= "" ;
					var filenames = "";
					for(var i=0;i<rows.length-1;i++){
						eventids += rows[i].eventid+",";
						filenames += rows[i].filename+",";
					}
					eventids += rows[rows.length-1].eventid;
					filenames += rows[rows.length-1].filename;
					top.getDlg("../docClassify/addtoDocClassify.htm?eventids="+eventids+"&filenames="+filenames+"&foldertype="+foldertype+"&folderid="+folderId+"&r="+new Date().getTime(),'classify','设置文档分类',580,165);
				}else{
					$.messager.alert('提示','请选择记录','info');
				}
		}
		
		
		/**
		 * 方法描述：删除文档
		 * 
		 */
		function deleteDoc(){
			if( foldertype == 1 ){
				deleteDocUrl = '../doccenter/deleteDoc.do';
			}else{
				deleteDocUrl = '../favorite/deletefileref.do';
			}
			var rows = $('#dg').datagrid('getSelections');
			if (rows.length > 0){
				var ids="";
				for(var i=0;i<rows.length-1;i++){
					ids += rows[i].eventid+",";
				}
				ids += rows[rows.length-1].eventid;
				$.messager.confirm("删除文档","您确定要删除选择的文档吗？\n\t",function(r){
					if (r){
						$.post(deleteDocUrl,{"ids":ids,"hierarchy":hierarchy,"folderId":folderId,"rd":Math.random()},function(result){
							if (result.success){
									$('#dg').datagrid('reload');	// reload the user data
									$('#dg').datagrid('clearSelections'); 	//clear selected options
							} else {
								$.messager.alert('错误',result.msg,result.error);
							}
						},'json');
					}
				});
			}else{
				$.messager.alert('提示','请选择记录','info');
			}
			
			
			
		}
		
		/**
		 * 方法描述：添加到默认收藏夹
		 * 
		 * @param eventid
		 * @param state
		 */
		function addfavorite(eventid,state){
			if(state=="2"){
				$.ajax({
					url : '../favorite/addDocToFavorite.do',
	 				type : 'POST',
	 				data:"docids="+eventid,
	 				success : function(data) {
		 				$("#"+eventid).attr("src","../../common/images/favorite_2.png");
		 				$('#dg').datagrid('reload');
					},
	 				dataType:"json",
	 				error : function(data) {
	 					$.messager.alert('提示', '添加默认收藏夹失败', 'error');	
	 				}
	 			});	
			}else{
				$.ajax({
						url : '../favorite/deleteFilerefFromFavorite.do',
		 				type : 'POST',
		 				data:"ids="+eventid,
		 				success : function(data) {
			 				$("#"+eventid).attr("src","../../common/images/favorite_1.png");
			 				$('#dg').datagrid('reload');
						},
		 				dataType:"json",
		 				error : function(data) {
		 					$.messager.alert('提示', '从默认收藏夹删除失败', 'error');	
		 				}
		 			});	
			}
 			
		}
		
		/**
		 * 方法描述：是否查看所有子文件夹的文档
		 */
		var allOrOnlyDocFileValue = false;
		function getAllDocFile(){
			if($('#checked').attr("checked")){
				allOrOnlyDocFileValue=true;
				$('#checked').removeAttr("checked");//
			}else{
				$('#checked').attr("checked",'true');//
				allOrOnlyDocFileValue=false;
			}
			if(allOrOnlyDocFileValue){
				allOrOnlyDocFileValue = false;
				$("#allOrOnlyDocInfo").text("显示当前文件夹中文档");
			}else{
				allOrOnlyDocFileValue = true;
				$("#allOrOnlyDocInfo").text("显示所有子文件夹中文档");
			}
			var query={"allOrOnlyDocFile":allOrOnlyDocFileValue}; 			//把查询条件拼接成JSON
			$("#dg").datagrid('options').queryParams=query; 				//把查询条件赋值给datagrid内部变量
			$("#dg").datagrid('load'); 										//重新加载 
		}
		function getAllDocFileData(){
			if($('#checked').attr("checked")){
				allOrOnlyDocFileValue = true;
				$("#allOrOnlyDocInfo").text("显示所有子文件夹中文档");
			}else{
				allOrOnlyDocFileValue = false;
				$("#allOrOnlyDocInfo").text("显示当前文件夹中文档");
			}
			var query={"allOrOnlyDocFile":allOrOnlyDocFileValue}; 			//把查询条件拼接成JSON
			$("#dg").datagrid('options').queryParams=query; 				//把查询条件赋值给datagrid内部变量
			$("#dg").datagrid('load'); 										//重新加载 
			
		}
		
		/**
		 * 方法描述：彻底删除
		 */
		function shiftDeleteFile(){
			var url="../doccenter/shiftDeleteFile.do";
			var rows = $('#dg').datagrid('getSelections');
				if (rows.length > 0){
					var ids="";
					for(var i=0;i<rows.length-1;i++){
						ids += rows[i].eventid+",";
					}
					ids += rows[rows.length-1].eventid;
					$.messager.confirm("彻底删除文档","您确定要彻底删除选择的文档吗？\n\t",function(r){
						if (r){
							$.post(url,{"eventids":ids,"rd":Math.random()},function(result){
								if (result.success){
										$('#dg').datagrid('reload');	// reload the user data
										$('#dg').datagrid('clearSelections'); 	//clear selected options
								} else {
									$.messager.alert('错误',result.msg,result.error);
								}
							},'json');
						}
					});
				}else{
					$.messager.alert('提示','请选择记录','info');
				}
		}
		
  /**
	* 方法描述：加载文档列表
	*/	
$(function() {
	folderId = getParamter("id");
	hierarchy = getParamter("chy");
	var sharerole = getParamter("sharerole");
	$('#toolbar a').each(function() {
		if (sharerole >= $(this).attr('name')) {
			$(this).css("display", "");
		}
	});
	var datagridTitle = '文档列表';
	queryDocUrl = "../../share/getShareFile.do?folderid=" + folderId
			+ "&hierarchy=" + hierarchy + "&sharerole=" + sharerole;
	var menuUrl = this.location.search;
	if (menuUrl != null && "" != menuUrl) {
		var p = menuUrl.substr(1).split("&");
		$.each(p, function(i, item) {
			var d = item.split("=");
			if (d[0] == 'folderLocationName') {
				folderLocationName = d[1];
				if(folderLocationName=="/我共享的文件夹"){
					datagridTitle ="当前位置：" + "我共享的文件夹";
				}else{
					datagridTitle = "当前位置：" + "我共享的文件夹"+folderLocationName.substr(5,folderLocationName.length);
				}
			}
			if (d[0] == 'id') {
				folderId = d[1];
			}
			if (d[0] == 'hierarchy') {
				hierarchy = d[1];
			}
			if (d[0] == 'foldertype') {
				foldertype = d[1];
			}
			if (d[0] == 'filename') {
				filename = d[1];
			}
			if (d[0] == 'fileno') {
				fileno = d[1];
			}
			if (d[0] == 'keyword') {
				keyword = d[1];
			}
			if (d[0] == 'summary') {
				summary = d[1];
			}
			if (d[0] == 'remark') {
				remark = d[1];
			}
			if (d[0] == 'fileclassifys') {
				fileclassifys = d[1];
			}
			if (d[0] == 'uploadtimeStart') {
				uploadtimeStart = d[1];
			}
			if (d[0] == 'uploadtimeEnd') {
				uploadtimeEnd = d[1];
			}
			if (d[0] == 'searchstring') {
				searchEventid = d[1];
			}
		});
	}
	
	if (hierarchy == "mysharefolder" || hierarchy=='foldersharetome') {
		queryDocUrl+="&allOrOnlyDocFile=true";
	}
	var width = $('body').width();
	$('#dg').datagrid({
		width : '100%',
		nowrap : false,
		striped : true,
		collapsible : false,
		url : queryDocUrl,
		remoteSort : true,
		idField : 'eventid',
		pagination : true,
		rownumbers : true,
		toolbar : '#toolbar',
		title : datagridTitle,
		columns : [ [ {
			field : 'ck',
			title : '全选',
			checkbox : true
		}, 
		{field : 'favorite',title : '',width : 0.02 * width,formatter:function(value,rowData,rowIndex){
			return getFavoriteField(rowData);
		}}, 
		{
			field : 'filename',
			title : '文档名称',
			width : 0.25 * width
		},  {
			field : 'fileno',
			title : '文档编号',
			width : 0.1 * width
		},  {field:'createusername',title:'上传者',width:0.07*width}, {
			field : 'keyword',
			title : '关键词',
			width : 0.07 * width
		}, {
			field : 'filetype',
			title : '文档格式',
			width : 0.06 * width
		},{
			field : 'docactualLocation',
			title : '文档位置',
			width : 0.18 * width
		},{
			field : 'filesizeStr',
			title : '文档大小(kb)',
			width : 0.07 * width
		},{
			field:'createuser',
			title:'上传者id',
			width:0.07*width,
			hidden:true},
			{field : 'eventid',hidden:true}, 
			{field : 'hierarchyRole',hidden:true}, 			
			{field : 'manager',title : '操作',width : 0.1 * width,formatter:function(value,rowData,rowIndex){
				return getManagerField(rowData,false,true);
			 }}]],

		onDblClickRow : function(index, indexData) {
			var eventid = indexData.eventid;
			if (indexData.preview == 1) {
				Preview(eventid)
			} else {
				$.messager.alert('提示', '对不起，您没有预览权限！', 'info');
			}

		},
		onClickCell : function(rowIndex, field, value) {
		},
		onRowContextMenu : function(e, rowIndex, rowData) {
			e.preventDefault();
			$('#managerdiv').menu('show', {
				left : e.pageX,
				top : e.pageY
			});
			$('#managerdiv').menu({
				onClick : function(item) {
					if (item.name == '001') {
						showInfo(rowData.eventid);
					} else if (item.name == '004' && 'disabled'!=$('#39').attr('disabled')) {
							updateInfo(rowData.eventid);
					} else if (item.name == '003'  && 'disabled'!=$('#30').attr('disabled')) {
						downloadDoc(rowData.eventid);
					} else if (item.name == '002' && 'disabled'!=$('#20').attr('disabled')) {
						Preview(rowData.eventid);
					} else if (item.name == '005' && 'disabled'!=$('#1000').attr('disabled')) {
						shareFileDetailsTab(rowData.eventid,"共享详情","../../jasdoc/folder/file/queryFileShareDetails.htm?role="+rowData.hierarchyRole+"&createuser="+rowData.createuser+"&eventid="+rowData.eventid);
					}
				}
			});
			$('#10').attr('disabled', false);
			$('#20').attr('disabled', true);
			$('#30').attr('disabled', true);
			$('#39').attr('disabled', true);
			$('#1000').attr('disabled', true);
			var role = rowData.hierarchyRole;
			$('#managerdiv div').each(function() {
				if (role >= $(this).attr('id')) {
					$(this).attr('disabled', false);
				}
			});
			if(rowData.createuser == top.loginUser.eventid){
				$('#1000').attr('disabled',false);
			}
		},
		onLoadSuccess : function(data) {
			$('#dg').datagrid('clearSelections'); //clear selected options
			if (hierarchy == "mysharefolder" || hierarchy=='foldersharetome') {
				$("#allOrOnlyDocFilediv").css("display", "none");
				$("#checked").css("display", "none");
				$("#allOrOnlyDocInfo").css("display", "none");
			}
		}
	});
	initDatagrigHeight('dg', '', 0);
});