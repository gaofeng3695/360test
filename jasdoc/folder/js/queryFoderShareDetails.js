//		var url;
//		var parentObj = self.parent;
		var roleforShare = "";
		var eventidforShare = "";
		var createuserforShare = "";
		 /**
		 * 方法描述：增加共享
		 * @param sid
		 */
		function addShare(){
			top.getDlg("shareFolder.htm?hidden=&eventid="+eventidforShare+"&role="+roleforShare+"&createuser="+createuserforShare+"&r="+new Date().getTime(),'share',"新增文件夹共享",500,300);
		}
		/**
		 * 方法描述：修改共享
		 * 
		 */
		function updateShare(){
			var rows = $('#dg').datagrid('getSelections');
			if (rows.length == 1){
				var shareid = rows[0].id;
				top.getDlg("shareFolder.htm?hidden=&eventid="+eventidforShare+"&role="+roleforShare+"&shareid="+shareid+"&createuser="+createuserforShare+"&r="+new Date().getTime(),'share',"修改文件夹共享",500,300);
			}else{
				$.messager.alert('提示','请选择一条记录','info');
			}
		}
		/**
		 * 方法描述：删除共享
		 * 
		 */
		function deleteShare(){
			var rows = $('#dg').datagrid('getSelections');
			if (rows.length > 0){
				var ids="";
				for(var i=0;i<rows.length-1;i++){
					ids += rows[i].id+",";
				}
				ids += rows[rows.length-1].id;
				$.messager.confirm("删除文件夹分享","您确定要删除选择的共享记录吗？\n\t",function(r){
					if (r){
						$.post("../../share/deleteFolderShareById.do",
							{"ids":ids,"rd":Math.random()},
							function(result){
							if (result.success){
									$('#dg').datagrid('reload');	// reload the user data
									$('#dg').datagrid('clearSelections'); 	//clear selected options
									try{
										top.reloadMyShareFolder();
									}catch(e){
										alert("刷新我共享的文件夹数据错误");
									}
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
			eventidforShare = getParamter("eventid");
			createuserforShare = getParamter("createuser");
//			var datagridTitle='文档共享详细列表';
//			url = "../../share/getAllShareFolderDetails.do?eventid="+eventidforShare;
			var width=$('body').width();
			$('#dg').datagrid({
				width:'100%',
				nowrap: false,
//				striped: true,
				collapsible:false,
				url:"../../share/getAllShareFolderDetails.do?eventid="+eventidforShare,
				remoteSort: true,
				idField:'id',
//				pagination:true,
				rownumbers:true,
//				toolbar:'#toolbar',
				title:'文档共享详细列表',
			 	columns:[[
			           {field:'ck',title:'全选',checkbox:true}, 
			           {field:'id',title:'文件夹分享ID',width:0.25*width,hidden:true}, 
			           {field:'foldername',title:'文件夹名称',width:0.15*width}, 
			           {field:'folderlocation',title:'文件夹位置',width:0.18*width} ,
			           {field:'sharedate',title:'共享时间',width:0.11*width} ,
			           {field:'overdate',title:'过期时间',width:0.11*width,
			        	   styler:function(value,row,index){
									var nowTime= getNowTime();
									if(value!=null){
										var str = value.replace(/-/g,"/");
									}
									var date = new Date(str); 
								        if (nowTime>date){ 
//								            return 'color:red';    
								            return 'background-color:#50a9d5';    
								        }    
								    }
			           },
			           {field:'shareprivilegetype',title:'共享权限',width:0.14*width,
			        	 	formatter:function(value,row,index){  
			        	   		var str = "";
			        	   		if(value == 20){
			        	   			str = "预览";
			        	   		}else if(value == 30){
			        	   			str = "预览，下载";
			        	   		}else if(value == 40){
			        	   			str = "预览，下载，上传和修改";
			        	   		}else if(value == 50){
			        	   			str = "预览，下载，上传和修改，删除";
			        	   		}else if(value == 60){
			        	   			str = "预览，下载，上传和修改，删除，移动";
			        	   		}
			        	   		
			        	   		return str;
			        	 	}
			           },
			           {field:'sharescrop',title:'共享范围',width:0.1*width},
			           {field:'remark',title:'共享说明',width:0.08*width}
			       ]]
//			,
				  
//				onDblClickRow:function(index,indexData){
//				alert(indexData.shareprivilegetype)
//				},
//				onClickCell:function(rowIndex, field, value){
//				},
//				onRowContextMenu:function(e, rowIndex, rowData){
//				}
//				,
//				onLoadSuccess:function(data){
//			    	$('#dg').datagrid('clearSelections'); //clear selected options
//			    	
//			    },
//				onHeaderContextMenu: function(e, field){
//				}
			});	
			initDatagrigHeight('dg','',0);
		});
		
		function getNowTime(){
			var myDate = new Date();
			return myDate;
		}