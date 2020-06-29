/**
 *说明 国际化配置助手
 *
 *作者：秦世飞
 *日期：2013-08-01
 *版本：
 */
/**
 * 页面初始化
 */
$(function(){
	 var oldnodename ="";
	 $('#i18ntree').tree({		
		url: '../../I18N/geti18ntree.do',
		onLoadSuccess:function(node,data) {
		},
		onClick:function(node){
			var id = node.id;
			var text = node.text;
			if(id.indexOf(".properties")!=-1){
				i18nbyname(id,text);
			}
		},onContextMenu:function(e, node){
			e.preventDefault();
			var id = node.id;
			if(!(id.indexOf(".properties")!=-1)){
				var rightbuttonobj =  $('#i18nrightclickdiv1');
				rightbuttonobj.menu('show', {
	                left: e.pageX,
	                 top: e.pageY
				});
				
				rightbuttonobj.menu({
	                 onClick:function(item){
	                	 if( item.name == '001' ){
	                		 var nodeid = appendi18n(node);
	                		 var newnode = $('#i18ntree').tree('find',nodeid);
	                			 $('#i18ntree').tree('beginEdit',newnode.target);
	                			 setCursorPos(nodeid);
	                	 }
	                 } 
             });
			}else{
				var rightbuttonobj =  $('#i18nrightclickdiv2');
				rightbuttonobj.menu('show', {
	                left: e.pageX,
	                 top: e.pageY
				});
				
				rightbuttonobj.menu({
	                 onClick:function(item){
	                	 if( item.name == '002' ){
	                		 oldnodename = node.text;
	                		 $('#i18ntree').tree('beginEdit',node.target);
	                		 var nodeid=node.id;
	                		 setCursorPos(nodeid);
	                	 }else if(item.name == '003' ){
	                		 var url = "../../I18N/deletei18n.do?t="+new Date().getTime();
	                		 $.ajax({
	           				  url: url,
	           				  cache: false,
	           				  data:{"id":node.id,"text":node.text},
	           				  success: function(data){
	           					  var parentnode=$('#i18ntree').tree('getParent',node.target);
	           					  $('#i18ntree').tree('reload');
	           				  }
	           				});
	                	 }
	                 } 
             });
			}
		},onAfterEdit:function(node){
			var newnodename = node.text;
			var oldnodeid = node.id;
			var arr = oldnodeid.split("-");
			var newnodeid = "";
			if(oldnodeid.indexOf(".properties")!=-1){
				newnodeid = arr[0]+"-"+newnodename+".properties";
			}else{
				oldnodeid = arr[0]+"/i18n-"+newnodename+".properties";
				newnodeid = arr[0]+"/i18n-"+newnodename+".properties";
			}
			node.id=newnodeid;
			var url = "../../I18N/saveandupdatei18n.do?t="+new Date().getTime();
			$.ajax({
				  url: url,
				  cache: false,
				  data:{"oldnodeid":oldnodeid,"oldnodename":oldnodename,"newnodeid":newnodeid,"newnodename":newnodename},
				  success: function(data){
					  $('#i18ntree').tree('update',node);
				  }
				});
			
		},onCancelEdit:function(node){
			//alert("onCancelEdit---");
		}

	});
	 var tds=$("td"); 
	 tds.click(tdclick);  
});
//重命名时全选文件夹名称
var setCursorPos = function(nodeid){
	var parnote=$("div[node-id='"+nodeid+"']");
	var titlespannote=$(parnote).children(".tree-title");
	var titleinput= $(titlespannote).children("input");
	var e1=titleinput[0];
	 e1.select();
}
//add i18n file
function appendi18n(node){
	var arr = node.id.split("/");
	var newid = arr[1]+"-propertiesname";
	$('#i18ntree').tree('append',{
		parent: (node?node.target:null),
		data:[{
			id:newid,
			text:'propertiesname',
			checked:true
		}]
	});
	return newid;
}

//显示国际化文件信息
function i18nbyname(id,text){
	var table = $("#i18ntable");
	if(table){
		table.remove();
	}
	var url = "../../I18N/geti18nbyname.do?id="+id+"&text="+text;
	$.ajax({
		  url: url,
		  cache: false,
		  success: function(data){
			 var datajson =  $.parseJSON(data); 
			
			 var i18ntablediv = $("#i18ntablediv");
			 var i18ntable = $("<table id='i18ntable' border='1px' width='100%'><tr><th width='45%' height='20px'>key</th><th width='45%' height='20px'>value</th><th width='5%' height='20px'>delete</th></table> ");
			 i18ntablediv.append(i18ntable);
			 for(var i=0;i<datajson.length;i++){
				var traaa= $("<tr><td height='20px' onclick='tdclick(this)'>"+datajson[i].key+"</td><td height='20px' onclick='tdclick(this)'>"+datajson[i].value+"</td>"+"</td><td height='20px' align='center' onclick='deletetr(this)'><font size='2' color='red'>"+getLanguageValue("delete")+"</font></td>"+"</tr>");
				i18ntable.append(traaa);
			 }
		  }
		});
}
//保存国际化文件
function savei18ninfo(){
	var node = $('#i18ntree').tree('getSelected');
	var i18ninfo = geti18ninfo();
	if(i18ninfo==null||i18ninfo==""){
		top.showAlert(getLanguageValue("tip"),getLanguageValue("notnull"),'info');
		return false;
	}else{
		var url = "../../I18N/savei18ninfo.do?t="+new Date().getTime();
		$.ajax({
			  type: "POST",
			  url: url,
			  cache: false,
			  data:{"i18ninfo":i18ninfo,"id":node.id,"text":node.text},
			  success: function(data){
				  var data=	eval('('+data+')');
				  top.showAlert(getLanguageValue("tip"),getLanguageValue("savesuccess"),'info',function(){i18nbyname(node.id,node.text)});
			  }
			});
	}
	
}
//获取i18n值
function geti18ninfo(){
	var key = "";  
	var value = "";  
	var i18ndata = "";
	var table = $("#i18ntable");
	var tbody = table.children();  
	var trs = tbody.children();  
	for(var i=1;i<trs.length;i++){ 
		var tds = trs.eq(i).children();  
		for(var j=0;j<tds.length;j++){ 
			if(j==0){
				if(tds.eq(j).text()==null||tds.eq(j).text()==""){
					return null;
				}
				key = "key\":\""+tds.eq(j).text();
			}
			if(j==1){
				if(tds.eq(j).text()==null||tds.eq(j).text()==""){
					return null;
				}
				value = "value\":\""+tds.eq(j).text();
			}
		} 
		if(i==trs.length-1){
			i18ndata += "{\""+key+"\",\""+value+"\"}";
		}else{
			i18ndata += "{\""+key+"\",\""+value+"\"},";
		}
	}  
	i18ndata = "["+i18ndata+"]";
	return i18ndata;
}
	var clientWidth = document.documentElement.clientWidth;
	var clientHeight = document.documentElement.clientHeight;
	var div_left_width = 200;
	var tempWidth = 0;
 	/**
 	 * 描述：页面自适应
 	 */	
$(window).bind("resize",function(){
		resizeLayout();
	});
function resizeLayout(){
		try{
			clientWidth = document.documentElement.clientWidth;
			var div_left_width = $("#left").width()+11;
			$("#cc").layout("resize");
			$('#userquery').panel('resize',{width:clientWidth-div_left_width}); 
			$('#10100801').datagrid('resize',{width:clientWidth-div_left_width});
			
			$('#userrange').combobox({
				width :  $('#right').width() * 0.35
			});
		}catch(e){			
		}
	}
function initResize(){
 		//自动适应页面大小
		$(".layout-button-left").bind("click",function(){
			$('#userquery').panel('resize',{width:clientWidth-28});
			$('#10100801').datagrid('resize',{width:clientWidth-28});
			$(".layout-button-right").bind("click",function(){
				$('#userquery').panel('resize',{width:tempWidth}); 
				$('#10100801').datagrid('resize',{width:tempWidth});
			});
		});
 	}  
function tdclick(tdobject){  
			 var td=$(tdobject);  
			 td.attr("onclick", "");
			 //1,取出当前td中的文本内容保存起来  
			var text=td.text(); 
			//2,清空td里面的内容  
			td.html(""); //也可以用td.empty();  
			//3，建立一个文本框，也就是input的元素节点  
			var input=$("<input>");  
			//4，设置文本框的值是保存起来的文本内容  
			input.attr("value",text);  
			input.bind("blur",function(){
				var inputnode=$(this);  
				var inputtext=inputnode.val();  
				var tdNode=inputnode.parent();  
				tdNode.html(inputtext);  
				tdNode.click(tdclick);  
				td.attr("onclick", "tdclick(this)");
			});
			input.keyup(function(event){  
				 var myEvent =event||window.event;  
				 var kcode=myEvent.keyCode;  
				if(kcode==13){  
					var inputnode=$(this);  
					var inputtext=inputnode.val();  
					var tdNode=inputnode.parent();  
					tdNode.html(inputtext);  
					tdNode.click(tdclick);  
				}  
			});  
			
			//5，将文本框加入到td中  
			td.append(input); 
			var t =input.val();
			input.val("").focus().val(t);
//				input.focus();
			
		   //6,清除点击事件  
			td.unbind("click");  
	}  
function addtr(){
	var table = $("#i18ntable");
	var tr= $("<tr><td height='20px' onclick='tdclick(this)'>"+"</td><td height='20px' onclick='tdclick(this)'>"+"</td><td height='20px' align='center' onclick='deletetr(this)'><font size='2' color='red'>"+"删除"+"</font></td></tr>");
	table.append(tr);
}
function deletetr(tdobject){
	var td=$(tdobject);
	td.parents("tr").remove();
}




