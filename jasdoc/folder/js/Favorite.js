	/**
	 * 方法描述：移动文档
	 */
	function moveFile() {
		if (foldertype != 3) {
			var rows = $('#dg').datagrid('getSelections');
			if (rows.length > 0) {
				var eventids = "";
				var filenames = "";
				for ( var i = 0; i < rows.length - 1; i++) {
					eventids += rows[i].eventid + ",";
					filenames += rows[i].filename + ",";
				}
				eventids += rows[rows.length - 1].eventid;
				filenames += rows[rows.length - 1].filename;
				top.getDlg("moveFile.htm?eventids=" + eventids + "&filenames="
						+ filenames + "&foldertype=" + foldertype + "&folderid="
						+ folderId + "&r=" + new Date().getTime(), '', '移动文档', 700,
						210);
	
			} else {
				$.messager.alert('提示', '请选择记录', 'info');
			}
		}
	}

		/**
		 * 方法描述： 删除文档
		 */
		function deleteDoc(){
			if( foldertype == 1 ){
				deleteDocUrl = '../doccenter/deleteDoc.do';
			}else if( foldertype == 2 ){
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
								$.messager.alert('成功',result.ok,'ok',function(){
									$('#dg').datagrid('reload');	// reload the user data
									//reloaddate();		
									$('#dg').datagrid('clearSelections'); 	//clear selected options
								});
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