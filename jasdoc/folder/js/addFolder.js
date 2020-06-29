	/**
	 * 修改与新增
	 * 
	 */
	function save() {
		var foldername = $('#foldername').val();
		$.ajax({
		    url : "../folder/isExistAddFolder.do?t="+new Date(),
		    type : 'POST',
		    data:{"foldername":foldername,
		    "parentid":parentid,
		    "foldertype":foldertype
		    },
		    success : function(result){
		    	if(result==true){
				    	$('#addfolderfrom').form('submit', {
							url : "../folder/createFolder.do?r="+new Date().getTime()+"&token="+localStorage.getItem("token"),
							onSubmit : function() {
								return $(this).form('validate');
							},
							success : function(data) {
//								alert(JSON.stringify(data));
								var result = eval('(' + data + ')');
								if (result.error) {
									top.showAlert('提示',result.msg , 'info');	
								} else {
									if(result.data){
										
										folderLocationName += "/"+foldername;
										result.data.attributes.url=result.data.attributes.url+"?id="+result.data.id+"&hierarchy="+result.data.attributes.hierarchy+"&foldertype="+result.data.attributes.foldertype+"&folderLocationName="+folderLocationName;
										result.data.attributes.folderLocationName=folderLocationName;
										//刷新父页面，参数：返回值，操作类型（1：新增，2：修改）
										parent.reloadDataTree(result.data,1);
										closeFolder();
									}
								}
						}
					});
		    	}else{
		           top.showAlert('提示', '文件夹名称已存在', 'info');	
		    	}
		    },
		    dataType:"json",
		    error : function(result) {
		    }
	    });
	}
	/**
	 * 方法描述： 关闭界面
	 */	
	function closeFolder(){
		parent.closeDlg('addfolder');
	}	