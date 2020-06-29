
$(function(){
	
	// 初始化加载  一级菜单
	initMain();
	// 加载一级菜单的数据
	loadMainData(); 
	
	$("#left-container").accordion('getSelected').panel('collapse')
})

/*
 * 初始化加载  一级菜单
 */
function initMain(){
	$('#left-container').accordion({
		animate:false,
		 fit:false,
		onSelect:function(title,index){
			var accordion=$('#left-container').accordion('getPanel',index);
			var menuId=accordion.panel('options').id;
			//根据父级菜单id获取子节点数据创建树
			var node_number=$('#left-container').find('.panel').eq(index).find('ul').attr('node_num');
			
			var item=$('#item'+menuId).html();
			if(item==""){
				//父级菜单添加事件触发的时候添加子菜单节点
				loadItems(menuId);
			}
			
		},
		onUnselect:function(title,index){
			
		}
	});
	
	
}


function loadMainData(){
	$.ajax({
		url:rootPath + '/mappipeprotect/getOneUnit.do',
		type:"POST",
		data:{
		},
		async:false,
		cache:false,
		dataType:"json",
		success:function(data){
			if(data.msg=="undefined" || data.msg==undefined){
				var nodes = data;
				var len=nodes.length;
				for(var i=0;i<len;i++){
					var id=nodes[i].id;
					var title=nodes[i].text;
					var node_number=nodes[i].id;
					//添加父菜单项
					$('#left-container').accordion('add',{
						title:title + '<span class="title-right icon-warning" onclick="eventFun(\''+id+'\')"></span><span class="title-right icon-mark"  onclick="construction(\''+id+'\')"></span>',
						//添加ul作为子节点的容器
						content:'<ul id='+'item'+id+' node_num='+node_number+'></ul>',
						// selected:false,
						id:id,
						iconCls:'icon-one',
						onload:function(){
							console.log("dskdkkdkd");
						}
					});
				}
			}else{
				showAlert("提示", data.msg, "info");
			}
		}
	});
}

function loadItems(menuId){
	$.ajax({
		url:rootPath + '/mappipeprotect/getTwoUnit.do',
		type:"POST",
		data:{
			"unitid":menuId
		},
		async:false,
		cache:false,
		dataType:"json",
		success:function(data){
			$('#item'+menuId).tree({
				animate:false,
				data:data,
				select:false,
				formatter:function(node){
					console.log(node);
					var titleHtml = node.text + '<span class="title-right icon-warning" onclick="eventFun(\''+node.id+'\')"></span><span class="title-right icon-mark"  onclick="construction(\''+node.id+'\')"></span>'
					return titleHtml;
				}, 
				onClick:function(node){
					
				}
			});
		}
	});
}

/**
 * 第三方施工
 * @param id 部门id
 * @returns
 */
function construction(id){
	var e = window.event || arguments.callee.caller.arguments[0];
    e.stopPropagation();
	parent.showDialog2('construction','施工预警统计图', rootPath + 'pipeprotect/gps_construction/mapstatistics/statistics.html?unitid='+id, 800, 500,false);
}

function eventFun(id){
	 var e = window.event || arguments.callee.caller.arguments[0];
     e.stopPropagation();
     parent.showDialog2('construction','施工预警统计图', rootPath + 'pipeprotect/gps_construction/mapstatistics/event_statistics.html?unitid='+id, 800, 500,false);
}