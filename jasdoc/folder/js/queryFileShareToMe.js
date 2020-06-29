		/**
		 * 方法描述：加载文档列表
		 */
		$(function(){
			var width=$('body').width();
			$('#dg').datagrid({
				width:'100%',
				nowrap: false,
				striped: true,
				collapsible:false,
				url:"../../share/getAllShareFileToMe.do",
				remoteSort: true,
				idField:'eventid',
				pagination:true,
				rownumbers:true,
				toolbar:'#toolbar',
				title:'共享文档列表',
			 	columns:[[
			           {field:'ck',title:'全选',checkbox:true}, 
			           {field:'filename',title:'文档名称',width:0.25*width}, 
			           {field:'fileno',title:'文档编号',width:0.1*width},
			           {field:'createusername',title:'上传者',width:0.07*width},
			           {field:'keyword',title:'关键词',width:0.07*width},
			           {field:'filetype',title:'文档格式',width:0.06*width},
			           {field:'filelocation',title:'文档位置',width:0.18*width} ,
			           {field:'filesizeStr',title:'文档大小(kb)',width:0.1*width},
			           {field:'createuser',title:'上传者id',width:0.07*width,hidden:true},
			           {field : 'eventid',hidden:true}, 
					   {field : 'hierarchyRole',hidden:true}, 
					   {field:'manager',title:'操作',width:0.1*width,formatter:function(value,rowData,rowIndex){
							return getManagerField(rowData,false,false);
						  }} 
			       ]],
				    
				onDblClickRow:function(index,indexData){
					var eventid=indexData.eventid;
					if( indexData.preview == 1 ){
						Preview(eventid)
					}else{
						$.messager.alert('提示','对不起，您没有预览权限！','info');
					}
					
					//top.getDlg("viewFile.htm?hidden=&eventid="+indexData.eventid+"&r="+new Date().getTime(),'',getLanguageValue("role.viewRole"),700,140);			
				},
//				onClickCell:function(rowIndex, field, value){
//				},
				onRowContextMenu:function(e, rowIndex, rowData){
					e.preventDefault();
					$('#managerdiv').menu('show', {
						left: e.pageX,
						top: e.pageY
					});
					$('#managerdiv').menu({
		                onClick:function(item){
		                	 if( item.name == '001' ){
		                		 if ('disabled'!=$('#10').attr('disabled')) {
		                			 showInfo(rowData.eventid);
		                		 }
		                	 }
		                	 else if( item.name == '003' ){
		                		 if ('disabled'!=$('#30').attr('disabled')) {
		                			 downloadDoc(rowData.eventid);
		                		 }
		                	 }else if( item.name == '002' ){
		                		 if ('disabled'!=$('#20').attr('disabled')) {
		                			 Preview(rowData.eventid);
		                		 }
		                	 }
//		                	 else if (item.name == '005') {
//			 					shareFileDetailsTab(rowData.eventid,"共享详情","../../jasdoc/folder/file/queryFileShareDetails.htm?role="+rowData.hierarchyRole+"&createuser="+rowData.createuser+"&eventid="+rowData.eventid);
//							}
		                 }
					});
					$('#10').attr('disabled',false);
					$('#20').attr('disabled',true);
					$('#30').attr('disabled',true);
//					$('#39').attr('disabled',true);
//					$('#1000').attr('disabled',true);
					var role=rowData.hierarchyRole;
					$('#managerdiv div').each(function(){
						if( role >= $(this).attr('id')){
							$(this).attr('disabled',false);
//							alert($(this).attr('id'));
//							 $('#managerdiv').menu("disableItem", $(this).attr('id'));

						}
					});
				},
				onLoadSuccess:function(data){
					//debugger
					if(data.msg){
						$.messager.alert('错误', data.msg, data.error);
					}else{
						if( foldertype == 1  ){
							var role = data.role;
							$('#toolbar a').each(function(){
								if( role >= $(this).attr('name') ){
									$(this).css("display", "");
								}
							});
							
							if( hierarchy == docCenterRootFolderHierarchy ){
								$("#40").css("display", "none");
							}
						}else if( foldertype == 4  || foldertype == 5 ){ //搜索出的数据只具有移动的权限
							$.each(data.role, function(i, item) {
								if( item==7 ){
									//控制移动 
									$("#"+item).css("display", "");
								}
							});
						}
					}
			    	$('#dg').datagrid('clearSelections'); //clear selected options
			    }
			});	
			initDatagrigHeight('dg','',0);
		});
		
		/**
		 * 方法描述：共享
		 * @param sid
		 */
		function shareFile(eventid,role,createuser){
			top.getDlg("shareFile.htm?hidden=&eventid="+eventid+"&role="+role+"&createuser="+createuser+"&r="+new Date().getTime(),'share',"文档修改",500,300);
		}