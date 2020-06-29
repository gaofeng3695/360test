var eventids = "";
var	filenames = "";
var foldertype = "1";
//var foldertype;
var oldfolderid = "";
var url = "../doccenter/queryFolderComboTree.do";
var param = this.location.search;	
//var filenames = "";
var favoriteNodeid;

//加载树
	$(function() {
		if (param != null && "" != param) {
			var p = param.substr(1).split("&");
			$.each(p,function(i,item){
				var d = item.split("=");
				if(d[0]=='eventids'){
					 eventids=d[1];
				}
				 if(d[0]=='filenames'){
					filenames=d[1];
					$("#fordername").text(filenames);
				}
				if(d[0]=='foldertype'){
					foldertype=d[1];
				}
				if(d[0]=='folderid'){
					oldfolderid=d[1];
				}
			});
		}
		queryTree();
	}); 
/**	
 * 方法描述：加载初始化树
 */
function queryTree(){
		$('#foldreeventid').combotree({
			url:'../folder/queryFolderComboTree.do?foldertype='+foldertype,  
				onBeforeExpand:function(node){
					var foldertype=node.attributes.foldertype;
					var hierarchyid=node.attributes.hierarchy;
					var hierarchy = hierarchyid.substring(0,8);
						url="../folder/getChildren.do";
			 	$('#foldreeventid').combotree("tree").tree("options").url= url+"?id="+node.id+"&hierarchy="+hierarchy;
			 	if(foldertype==FOLDERTYPE_DOCCENTER){
					node.iconCls= 'icon-tree-center-node-open';
				}else if(foldertype==FOLDERTYPE_FAVORITE){
					if(favoriteNodeid==node.id){
					}else{
						node.iconCls= 'icon-tree-favorite-node-open';
					}
				}
			 	$('#foldreeventid').combotree("tree").tree('update', node);
			},
			onClick:function(node){
				if( node.attributes.hierarchy == docCenterRootFolderHierarchy ){
					$.messager.alert('提示',"文档中心下不允许存放文档",'info');
					$('#foldreeventid').combotree("clear",node);
				}
			},onBeforeCollapse: function(node){
				var foldertype=node.attributes.foldertype;
				if(foldertype==FOLDERTYPE_DOCCENTER){
					node.iconCls= 'icon-tree-center-node-close';
				}else if(foldertype==FOLDERTYPE_FAVORITE){
					if(favoriteNodeid==node.id){
						
					}else{
						node.iconCls="icon-tree-favorite-node-close";
					}
				}
				$('#foldreeventid').combotree("tree").tree('update', node);
			},onLoadSuccess:function(node, data){
				if(data!=null && data[0]!=null){
					var foldertype=data[0].attributes.foldertype;
					if(foldertype==FOLDERTYPE_FAVORITE){
							$.ajax({
							    url : "../favorite/queryDefaultFavoriteId.do?t="+new Date(),
							    type : 'POST',
							    success : function(data){ 
							    	favoriteNodeid=data;
							    },
							    dataType:"json",
							    error : function(result) {
							    }
						    });
					}
				}
			}
		}); 
	}
		
		
//		if( filenames != "" ){
//			$("#fordername").text(filenames);
//		}
//		
//		if(foldertype==4||foldertype==5){
//			foldertype=1;
//		}
		
		/**
		 * 方法描述：保存移动后的关系
		 */
		function save(){
			if( foldertype == 1 ){
				url = "../doccenter/moveToFolderInDocCenter.do";
			}else if( foldertype == 2 ){
				url = "../favorite/moveToFolderInFavorite.do";
			}
			var folderid = $("#foldreeventid").combotree('getValue');
			if(folderid==""||folderid==null){
				$.messager.alert('提示',"请选择文件夹",'info');
			}else{
				$.ajax({
					type: "POST",
				   	url: url,
			   		data: {"docids":eventids,
			   				"folderid":folderid,
			   				"oldfolderid":oldfolderid
			   				},
				   	success: function(result){
				   		var re = eval('(' + result + ')');
				   		if (re.success){
				   			if(foldertype == 1){
				   				parent.reloadDataTree(null,0);
				   			}else if(foldertype == 2){
				   				reloadData('queryFavorite.htm', 'dg');
				   			}
				   			//$.messager.alert('提示',re.ok,'ok');
				   			if(re.nameRepeat){
				   				$.messager.alert('提示',re.nameRepeat+"移动至文件夹已存在该文档！",'info',function(){closeUnit();});
				   			}else{
				   				closeUnit();
				   			}
				   			
						} else {
							$.messager.alert('错误',re.msg,re.error);
						}
					}
				});
			}
			
		}
		/**
		 * 方法描述： 加载数据
		 */
		function reloadData(shortUrl, elementId) {
			var fra = parent.$("iframe");
			for ( var i = 0; i < fra.length; i++) {
				if (fra[i].src.indexOf(shortUrl) != -1) {
					fra[i].contentWindow.$("#" +elementId).datagrid("reload");
				}
			}
		}
		
		/**
		 * 方法描述： 关闭界面
		 */
		function closeUnit(){
			parent.closeDlg('move');
		}	
		