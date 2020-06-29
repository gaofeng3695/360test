	
		$(function() {
			queryClassifyTree();
		}); 
		
		/**
		 * 方法描述：保存文档分类关系
		 * 
		 */
		function save(){
			url = "../classify/updateDocClassify.do"; 
			var fileclassify=$('#fileclassify').combotree('getValues');
			var fileclassifys="";
			for(var j=0;j<fileclassify.length-1;j++){
				fileclassifys+=fileclassify[j]+",";
			}
			fileclassifys+= fileclassify[fileclassify.length-1];
			if(fileclassify==undefined||fileclassify==""){
				$.messager.alert('提示',"请选择分类",'info');
			}else{
				$.ajax({
				type: "POST",
			   	url:url,
		   		data: {"docids":eventids,
		   				"fileclassifys":fileclassifys
		   				},
			   	success: function(check){
			   		var re =  eval('('+check+')');
			   		if (re.success){
			   			$.messager.alert('提示', re.ok, 'info',function(){
			   				reloadData("queryFolder.html","dg");
			   				top.closeDlg('classify');
						});	
					} else {
						$.messager.alert('错误',re.msg,'error');
					}
				}
			});
			}
		
		}
		
		/**
		 *	方法描述：加载分类树 
		 */
		function queryClassifyTree() {
			 $('#fileclassify').combotree({
					url:'../folder/getMenuListForDocclassifyAll.do?foldertype='+3, 
					cascadeCheck:false,
						onBeforeExpand:function(node){
							var hierarchyid=node.attributes.hierarchy;
							var hierarchy = hierarchyid.substring(0,4);
								url="../folder/getChildren.do";
					 	$('#fileclassify').combotree("tree").tree("options").url= url+"?id="+node.id+"&hierarchy="+hierarchy;
						node.iconCls= 'icon-tree-classify-node-open';
						$('#fileclassify').combotree("tree").tree('update', node);
					},onBeforeCollapse: function(node){
						node.iconCls= 'icon-tree-classify-node-close';
						$('#fileclassify').combotree("tree").tree('update', node);
					},onLoadSuccess:function(){
						var eventId = new Array(); 
						eventId=eventids.split(",");
							if(eventId.length == 1){
								$.ajax({
									url:"../classify/getFolderidByFileid.do?fileid="+eventId[0],
									success:function(result){
										for(i = 0; i<result.length; i++){
											var node1 = $("#fileclassify").combotree("tree").tree('find',result[i].ID);
											if(node1){
												$("#fileclassify").combotree("tree").tree('check',node1.target);
											}
										}
									},
									async:false,
									dataType:"json"
								});
							}
						}
				}); 
			 
			 
			 

		}
		function closeUnit(){
			top.closeDlg('classify');
		}	
