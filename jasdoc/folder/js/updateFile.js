/**
 * 方法描述：修改文档基本信息
 */
function updateFile(){
		var url = '../doccenter/updateDoc.do';
 		var filename = $("#filename").val();
 		var fileno = $("#fileno").val();
 		var fileclassifys = $("#fileclassify").combotree('getValues');
 		var fileclassify = "";
 		if( fileclassifys != null && fileclassifys.length > 0 ){
 			for( var  j = 0 ; j < fileclassifys.length ; j ++ ){
 				if( j != fileclassifys.length-1 ){
 					fileclassify+=fileclassifys[j]+",";
 				}else{
 					fileclassify+=fileclassifys[j];
 				}
 			}
 		}
 		var keyword = $("#keyword").val();
 		var summary = $("#summary").val();
 		var remark = $("#remark").val();
 		var eventid = $("#eventid").val();
 		$('#editfilefrom').form('submit', {
		   	url: url+"?token="+localStorage.getItem("token"),
	   		data: {"eventid":eventid,
	   				"filename":filename,
	   				"fileno":fileno,
	   				"fileclassify":fileclassify,
	   				"keyword":keyword,
	   				"summary":summary,
	   				"remark":remark
	   				},
 			onSubmit: function(){
				return $(this).form('validate');
 			},
		   	success: function(check){
	     		if (check.error=='-1'){
					$.messager.alert('错误',check.msg,'error');
				} else{
					$.messager.alert('提示',check.ok,'ok');
					parent.reloadDataTree(null,0);
					closeFile();
				}
			},
		   	dataType:"json"
		});
		
	}
	function closeFile(){
		parent.closeDlg('update');
	}
	function reloadData(shortUrl, elementId) {
		var fra = parent.$("iframe");
		for ( var i = 0; i < fra.length; i++) {
			if (fra[i].src.indexOf(shortUrl) != -1) {
				fra[i].contentWindow.$(elementId).datagrid("reload");
			}
		}
	}	
	
	var id1;
	var parenteventid = "";
	var param = this.location.search;
	if (param != null && "" != param) {
		var p = param.substr(1).split("&");
		$.each(p,function(i,item){
			var d = item.split("=");
			 if(d[0]=='eventid'){
				id1=d[1];
			}
		});
	}
	
	/**
	 *  方法描述：回显文档基本信息
	 */
	$(function(){
		$.getJSON('../doccenter/getDocBySid.do?random='+new Date(), 
		{'eventid':id1},function(obj){	
				$("#eventid").attr("value",obj.eventid);
				$("#filename").attr("value",obj.filename);
				$("#filename1").attr("value",obj.filename);
				$("#fileno").attr("value",obj.fileno);
				$("#keyword").attr("value",obj.keyword);
				$("#summary").attr("value",obj.summary);
				$("#remark").attr("value",obj.remark);
			
			var fileclassify = obj.fileclassify;
			 $('#fileclassify').combotree({
					url:'../folder/queryFolderComboTree.do?foldertype='+3, 
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
						$.ajax({
							url:"../classify/getFolderidByFileid.do?fileid="+obj.eventid,
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
				});  
		});
	});