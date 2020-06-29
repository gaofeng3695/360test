/**
 * @desc 页面初始化
 */
$(document).ready(function(){

	/* 以下初始化查询面板 */
	$('#unitid').combotree({
		panelHeight:150,
		width:"100%",
		editable:true,
		mode:'remote',
		valueField : "oid",
		textField : "unitName"
	});
	$.post(rootPath+'/xncommon/getUnitChildren.do?unitId='+user.unitId+'&unitName='+encodeURI(user.unitName),function(result){
		console.log(result);
		
		$('#unitid').combotree('loadData', result.data);
	})
	
//	initDetailList();
	loadDetailData(); // 加载数据
	

	
	$("#detailList").on("click",".detail-list .detail-item",function(){
		console.log("ddd");
		$("#detailList .detail-item").removeClass("select-item");
		$(this).addClass("select-item");
	})

	setHeight(); // 设置高度

});

/*
 * 初始化详情列表
 */
function initDetailList(){
	$('#detailList').accordion({
		animate:true,
		/*onClick:function(title,index){
			console.log(index);
			var accordion=$('#detailList').accordion('getPanel',index);
			var currentId=accordion.panel('options').id;
			
			//根据父级菜单id获取子节点数据
			var item=$('#item'+currentId).html();
			if(item==""){
				//父级菜单添加事件触发的时候添加子菜单节点
				loadItemDetail(currentId);
			}
		},
		onUnselect:function(title,index){
			
		}*/
	});
}


/*
 * 加载详情数据
 */
function loadDetailData(){
	$('#detailContent').html("");
	$('#detailContent').append('<div id="detailList" class="detail-info-list"></div>');
	$('#detailList').accordion({
		animate:true
	});
	$.ajax({
		/*url:'json/data6.json',*/
		url:rootPath + '/jasframework/privilege/privilege/menu2main.do',
		type:"POST",
		data:{
			"appId": "402894a152681ba30152681e8b320003",
			"menutype":0,
			"language":'zh_CN'
		},
		dataType:"json",
		async:false,
		success:function(data){
			/*if(data.rows.length>0){
				var nodes = data.rows;
				console.log(nodes);
				var len=data.rows.length;
				for(var i=0;i<len;i++){
					var id=nodes[i].id;
					//添加父菜单项
					$('#detailList').accordion('add',{
						title:'<table  style="width:100%">'+
									'<tr>'+
										'<td width="40%" align="left">'+nodes[i].personName+'</td>'+
										'<td width="30%" align="center">'+nodes[i].match+'</td>'+
										'<td width="30%" align="center">'+nodes[i].grade+'</td>'+
									'</tr>'+
								'</table>',
						//添加ul作为子节点的容器
						content:'<ul id='+'item'+id+' class="detail-list"></ul>',
						id:id,
						onload:function(){
							console.log("dskdkkdkd");
						}
					});
				}
			}else{
				showAlert("提示", data.msg, "info");
			}*/
				console.log(data);
				var nodes = data;
				var len=nodes.length;
				for(var i=0;i<len;i++){
					var id=nodes[i].attributes.functionid;
					var title=nodes[i].text;
					var node_number=nodes[i].id;
					
					console.log(data);
					//添加父菜单项
					$('#detailList').accordion('add',{
						title:'<table  style="width:100%" onclick="loadItemDetail(\''+ i +'\',\''+ id +'\')">'+
										'<tr>'+
										'<td width="40%" align="left">'+ title +'</td>'+
										'<td width="30%" align="center" style="white-space:nowrap">'+ node_number +'</td>'+
										'<td width="30%" align="center">'+ 10 +'</td>'+
									'</tr>'+
								'</table>',
						//添加ul作为子节点的容器
						content:'<ul id='+'item'+id+' class="detail-list"></ul>',
						// selected:false,
						id:id,
						onload:function(){
							console.log("dskdkkdkd");
						}
					});
				}
			
		}
	});
}

/*
 * 加载子节点
 */
function loadItemDetail(idx,currentId){
//	console.log(idx);
//	var accordion = $('#detailList').accordion('getPanel',idx+1);
//	
//	console.log(accordion);
//	console.log(currentId);
//	var currentId = accordion.panel('options').id;
//	console.log(currentId);
	//根据父级菜单id获取子节点数据
	var item = $('#item'+currentId).html();
	if(item==""){
		var menuId = currentId;

		$.ajax({
			/*url:'json/data7.json',*/
			url:rootPath + 'jasframework/privilege/privilege/getChildrenMenuList.do',
			type:"POST",
			data:{
				"id":menuId,
				"appId": "402894a152681ba30152681e8b320003",
				"menutype":0,
				"language":'zh_CN'
			},
			dataType:"json",
			async:false,
			success:function(data){
				if(data.length>0){
					for(var i = 0 ; i < data.length; i++){
						var str = '<li class="detail-item">'+
										'<table class="detail-item-info">'+
										  '<tr>'+
										  	'<td width="45%" align="left">'+
										  		'<h6>'+ data[i].text +'</h6>'+
												'<p>('+ data[i].id +')</p>'+
											'</td>'+
											'<td width="35%" align="center">'+
										  		'<a href="#" id="" class="easyui-linkbutton l-btn select-btn" onclick="selectTime()" >选择时段</a>'+
										  		'<div class="playing hide">'+
											  		'<p>正在回放</p>'+
													'<p>09:00~12:00</p>'+
										  		'</div>'+
											'</td>'+
											'<td width="20%" align="right">'+
												'<div class="">'+
											  		'<img  title="播放" src="image/play_en.png" height="20" width="20" style="margin:0 5px;" onclick="start();" >'+
											  		'<img  title="暂停" src="image/pause_dis.png" height="20" width="20" style="margin:0 5px;"  onclick="pause();">'+
										  		'</div>'+
										  	'</td>'+
										 '</tr>'+
										'</table>'+
									'</li>';
						$("#item"+menuId).append(str);
					}
				}else{
					var str = '<li class="detail-item">'+
								'<table class="detail-item-info">'+
								  '<tr>'+
								  	'<td width="100%" align="center" height="30px">暂无数据</td>'+
								 '</tr>'+
								'</table>'+
							'</li>';
					$("#item"+menuId).append(str);
				}
			}
		});
	}
}

/*
 * 设置下部的高度
 */
function setHeight(){
	var playbackformH = $("#playbackform").height();
	var queryTableH = $("#queryTable").outerHeight();
	var tableHeaderH =  $("#tableHeader").outerHeight();
	var tableHeaderMgT = parseInt($("#tableHeader").css("marginTop"));
	var acH = playbackformH -queryTableH -tableHeaderH - tableHeaderMgT;
	console.log(playbackformH);
	console.log(queryTableH);
	console.log(tableHeaderH);
	console.log(tableHeaderMgT);
	console.log(acH);
	
	$("#detailContent").height(acH);
}

function clearqq(){
	alert("dddd");
	loadDetailData()
}

function queryqq(){
	alert("aaa");
	loadDetailData()
}