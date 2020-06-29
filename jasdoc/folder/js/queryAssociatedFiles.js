		var url;
		var parentObj = self.parent;
		var roleforShare = "";
		var eventidforAssociated = "";
		 /**
		 * 方法描述：增加共享
		 * @param sid
		 */
		function addAssociatedFiles(){
			top.getDlg("associatedFile.htm?hidden=&eventid="+eventidforAssociated+"&role="+roleforShare+"&r="+new Date().getTime(),'share',"新增文档关联",700,500);
		}
		/**
		 * 方法描述：删除共享
		 * 
		 */
		function deleteAssociatedFiles(){
			var rows = $('#AssociatedDocument').datagrid('getSelections');
			if (rows.length > 0){
				var ids="";
				for(var i=0;i<rows.length-1;i++){
					ids += rows[i].associatedeventid+",";
				}
				ids += rows[rows.length-1].associatedeventid;
				$.messager.confirm("删除文档关联","您确定要删除选择的关联文档吗？\n\t",function(r){
					if (r){
						$.post("../../folder/associated/deleteAssociatedDocument.do",
							{"ids":ids,"rd":Math.random()},
							function(result){
							if (result.success){
									$('#AssociatedDocument').datagrid('reload');	// reload the user data
									$('#AssociatedDocument').datagrid('clearSelections'); 	//clear selected options
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
		$(function(){
			roleforShare = getParamter("role");
			eventidforAssociated = getParamter("eventid");
			var datagridTitle='关联文档列表';
			url = "../../folder/associated/queryAssociatedDocument.do?eventid="+eventidforAssociated;
			var width=$('body').width();
			$('#AssociatedDocument').datagrid({
				width:'100%',
				nowrap: false,
				striped: true,
				collapsible:false,
				url:url,
				remoteSort: true,
				idField:'associatedeventid',
				pagination:true,
				rownumbers:true,
				toolbar:'#toolbar',
				title:datagridTitle,
			 	columns:[[
			           {field:'ck',title:'全选',checkbox:true}, 
			           {field:'sid',title:'文档id',width:0.25*width,hidden:true}, 
			           {field:'associatedeventid',title:'关联eventid',width:0.25*width,hidden:true}, 
			           {field:'fileid',title:'文档id',width:0.25*width,hidden:true}, 
			           {field:'filename',title:'文档名称',width:0.25*width}, 
			           {field:'filelocation',title:'文档位置',width:0.25*width}, 
			           {field:'createusername',title:'上传人',width:0.06*width} ,
			           {field:'versionnumber',title:'版本号',width:0.06*width} ,
			           {field:'associateddate',title:'关联日期',width:0.08*width} ,
			           {field:'associateduserid',title:'关联人id',width:0.18*width,hidden:true} ,
			           {field:'associatedusername',title:'关联人',width:0.06*width} ,
			           {field : 'eventid',hidden:true}, 
			           {field:'associatedprivilegetype',title:'关联权限',width:0.09*width,
			        	 	formatter:function(value,row,index){  
			        	   		var str = "";
			        	   		if(value == 30){
			        	   			str ="<img src='../../common/images/tip.png' title='查看'style='cursor:hand' onclick='showInfo(\""+row.fileid+ "\")'> "
			        	   			+"<img src='../../common/images/preview.png' title='预览' style='cursor:hand'onclick='Preview(\""+row.fileid+ "\")'> "
			        	   			+"<img src='../../common/images/download.png' title='下载'style='cursor:hand' onclick='downloadDoc(\""+row.fileid+ "\")'> ";
			        	   		}else if(value == 60||value == 90){
			        	   			str ="<img src='../../common/images/tip.png' title='查看'style='cursor:hand' onclick='showInfo(\""+row.fileid+ "\")'> "
			        	   			    +"<img src='../../common/images/preview.png' title='预览' style='cursor:hand'onclick='Preview(\""+row.fileid+ "\")'> "
			        	   			    +"<img src='../../common/images/download.png' title='下载'style='cursor:hand' onclick='downloadDoc(\""+row.fileid+ "\")'> "
			        	   			    +"<img src='../../common/images/pencil.png' title='修改'style='cursor:hand'  onclick='updateInfo(\""+row.fileid+ "\")'> ";
			        	   		}
			        	   		return str;
			        	 	}
			           },
			           {field:'description',title:'关联说明',width:0.18*width}
			       ]],
				
				onLoadSuccess:function(data){
			    	$('#AssociatedDocument').datagrid('clearSelections'); //clear selected options
			    	
			    }				
			});	
			initDatagrigHeight('AssociatedDocument','',0);
		});
		/**
		 * 方法描述：查看
		 * @param sid
		 */		
		function getNowTime(){
			var myDate = new Date();
			return myDate;
		}