/**
 * 
 * 文件描述: 选桩控件接口。
 *
 * @author zhanggf
 * @version 1.0
 * 创建时间： 2012-12-10 上午 08:45
 *********************************更新记录******************************
 * 版本：  1.0       修改日期：          修改人： 
 * 修改内容： 
 **********************************************************************
 */
//返回数据
var contolData =[];
var beginPanel;
var endPanel;
//或得当前DOM对象
var btnclick=this;
choosePileControl ={
		/**
		 * 方法描述：初始化控件
		 * @param subsystemSelectId 子系统id
		 * @param lineLoopTextId 管线id
		 * @param beginMarkerTextId 起始桩id
		 * @param endMarkerTextId 终止桩id
		 */
	init:function(subsystemSelectId,lineLoopTextId,beginMarkerTextId,endMarkerTextId){
		//加载区域下拉选
		if(subsystemSelectId!=null && !subsystemSelectId==""){
			btnclick.choosePileControl.addSubSystemTag(subsystemSelectId,lineLoopTextId,beginMarkerTextId,endMarkerTextId);
		}
		//加载管线下拉选
		if(lineLoopTextId!=null && !lineLoopTextId==""){
			btnclick.choosePileControl.addToLineLoopTag(lineLoopTextId,subsystemSelectId,beginMarkerTextId,endMarkerTextId,"");
		}
		//加载起点桩号
		if(beginMarkerTextId!=null && !beginMarkerTextId==""){
			btnclick.choosePileControl.loadBeginChoosePilePage(lineLoopTextId,subsystemSelectId,beginMarkerTextId,endMarkerTextId);
		}
		//加载终点桩号
		if(endMarkerTextId!=null && !endMarkerTextId==""){
			btnclick.choosePileControl.loadEndnChoosePilePage(lineLoopTextId,subsystemSelectId,beginMarkerTextId,endMarkerTextId);
		}
	},
	/**
	 * 方法描述：加载子系统下拉选
	 * @param subsystemSelectId 子系统id
	 * @param lineLoopTextId 管线id
	 * @param beginMarkerTextId 起始桩id
	 * @param endMarkerTextId 终止桩id
	 */
	addSubSystemTag:function(subsystemSelectId,lineLoopTextId,beginMarkerTextId,endMarkerTextId,callback){
		var subsystemSelectObj = document.getElementById(subsystemSelectId);
		if(subsystemSelectObj){
			$.ajax({
				url : rootPath +'/jasframework/choosepilecontrol/querySubsytem.do',
				type : "POST",
				dataType : "json",
				success:function(data){
					if(data.subsystem!=null){
						var length = data.subsystem.length;
						var option = new Option('-----请选择-----','');
						subsystemSelectObj.add(option);
						if(length>0){
							for(var i=0;i<data.subsystem.length;i++){//循环数组,添加子节点
								var eventid = data.subsystem[i].EVENTID;
								var name = data.subsystem[i].SUBSYSTEMNAME;
								var option = new Option(name,eventid);
								subsystemSelectObj.add(option);
							}
							subsystemSelectObj.options[0].selected=true;
							if(callback){
								callback();//调用页面传递进来的回调函数，主要用于修改页面设置分区值
							}
						}
					}
				}
			});
			$('#'+subsystemSelectId).change(function(){
				btnclick.choosePileControl.addToLineLoopTag(lineLoopTextId,subsystemSelectId,beginMarkerTextId,endMarkerTextId,$('#'+subsystemSelectId).val(),callback);
			});
		}
	},
	/**
	 * 方法描述：加载管线下拉选
	 * @param subsystemSelectId 子系统id
	 * @param lineLoopTextId 管线id
	 * @param beginMarkerTextId 起始桩id
	 * @param endMarkerTextId 终止桩id
	 */
	addToLineLoopTag: function(lineloopId,subsystemSelectId,beginMarkerTextId,endMarkerTextId,subsysid,callback){
		if(subsysid ==''){
			$('#'+lineloopId).combotree({  
				url : rootPath +'/jasframework/choosepilecontrol/queryLineLoop.do?subsystemid='+subsysid,
				valueField :'eventid',
	            textField :'lineLoopName',
	            editable :true,
	            width:$('#'+subsystemSelectId).width(),
	            onClick : function(node){
	            	//选择一条管线
					//btnclick.choosePileControl.loadBeginChoosePilePage(lineloopId,subsystemSelectId,beginMarkerTextId,endMarkerTextId,subsysid,callback);
				}
			});  
			//$('#'+lineloopId).combotree('setValue','6a1a9e2a-197f-4325-9e23-4bc809165122'); 
		}else{
			$('#'+lineloopId).combotree({  
				url : rootPath +'/jasframework/choosepilecontrol/queryLineLoopBySubsystemId.do?subsystemId='+subsysid,
				valueField :'eventid',
	            textField :'lineLoopName',
            	onClick : function(node){
            		loadMakerComboxData("beginMarkerId",rootPath +'/jasframework/choosepilecontrol/queryMarkerByLineAndSys.do?subsystemId='+subsysid+'&lineloopId='+node.id);
            	}	
			});  
		}
		if(callback){
			callback();//调用页面传递进来的回调函数，主要用于修改页面设置分区值
		}
	},
	/**
	 * 方法描述：加载起始桩
	 * @param subsystemSelectId 子系统id
	 * @param lineLoopTextId 管线id
	 * @param beginMarkerTextId 起始桩id
	 * @param endMarkerTextId 终止桩id
	 */
	loadBeginChoosePilePage : function(lineloopId,subsystemSelectId,beginMarkerTextId,endMarkerTextId,callback){
		var panel = $('<div id="chooseBeginPanel"></div>').insertAfter($("#"+beginMarkerTextId));
		beginPanel =panel;
		var position = $("#"+beginMarkerTextId).position();
		panel.dialog({
			title:"选桩",
			width : $("#"+beginMarkerTextId).width(),
			left : position.left,
			top : position.top+28,
			closed : true,
			draggables : false
		});
		$("#"+beginMarkerTextId).click(function(){
			panel.dialog('open');
			if(endPanel !='' && endPanel != undefined){
				endPanel.dialog('close');
			}
			loadMakerComboxData("endMarkerId1",rootPath +'/jasframework/choosepilecontrol/queryMarkerByLineAndSys.do?subsystemId='+$('#'+subsystemSelectId).val()+'&lineloopId='+$('#'+lineloopId).combotree('getValue'));
		});
		var table =$('<table width="100%" class="edittable"></table>').appendTo(panel);
		//查询条件
		var searchTitleTr =$('<tr></tr>').appendTo(table);
		var benginTd1=$('<td width="20%"></td>').appendTo(searchTitleTr);
		var searchA =$('<a id="search" href="#" class="easyui-linkbutton">查询条件</a>').appendTo(benginTd1);
		var endTd1=$('<td width="80%"></td>').appendTo(benginTd1);
		//查询条件（起点场站）
		var searchTr =$('<tr></tr>').appendTo(table);
		var benginTd=$('<td width="20%"></td>').appendTo(searchTr);
		var begin =$('<span>起始场站</span>').appendTo(benginTd);
		var endTd=$('<td width="80%"></td>').appendTo(searchTr);
		var end =$('<select id="beginSiteLocation" class="input_bg"><select>').appendTo(endTd);
		loadMakerComboxData("beginSiteLocation",rootPath +'/jasframework/choosepilecontrol/queryAllSiteLocation.do');
		//查询条件（终点场站）
		var searchTr1 =$('<tr></tr>').appendTo(table);
		var benginTd1=$('<td width="20%"></td>').appendTo(searchTr1);
		var begin1 =$('<span>终止场站</span>').appendTo(benginTd1);
		var endTd1=$('<td width="80%"></td>').appendTo(searchTr1);
		var end1 =$('<select id="endSiteLocation" class="input_bg"></select>').appendTo(endTd1);
		loadMakerComboxData("endSiteLocation",rootPath +'/jasframework/choosepilecontrol/queryAllSiteLocation.do');
		//查询条件（桩号类型）
		var searchTr1t =$('<tr></tr>').appendTo(table);
		var benginTd1t=$('<td width="20%"></td>').appendTo(searchTr1t);
		var begin1t =$('<span>桩类型</span>').appendTo(benginTd1t);
		var endTd1t=$('<td width="80%"></td>').appendTo(searchTr1t);
		var end1t =$("<select id=\"locationType1\" class=\"input_bg\"><option value=''>全部</option><option value='1'>里程桩</option>"+
				"	<option value='2'>转角桩</option>"+
				"	<option value='6'>垂直转角桩</option>"+
				"	<option value='4'>加密桩</option>"+
				"	<option value='8'>穿越桩</option>"+
				"	<option value='23'>临时桩</option>"+
				"	<option value='101'>磁力桩</option>"+
				"	<option value='1000'>阴保桩</option>+</select>").appendTo(endTd1t);
		var flag =true;
		$("#search").click(function(){
			//打开查询条件
			if(flag){
				searchTr.css('display','block');
				searchTr1.css('display','block');
				searchTr1t.css('display','block');
				loadMakerComboxData("beginSiteLocation",rootPath +'/jasframework/choosepilecontrol/querySiteByLineAndSys.do?subsystemId='+$('#'+subsystemSelectId).val()+'&lineloopId='+$('#'+lineloopId).combotree('getValue'));
				loadMakerComboxData("endSiteLocation",rootPath +'/jasframework/choosepilecontrol/querySiteByLineAndSys.do?subsystemId='+$('#'+subsystemSelectId).val()+'&lineloopId='+$('#'+lineloopId).combotree('getValue'));
				flag =false;
			}else{
				searchTr.css('display','none');
				searchTr1.css('display','none');
				searchTr1t.css('display','none');
				flag =true;
			}
		});
		//隐藏查询条件
		searchTr.css('display','none');
		searchTr1.css('display','none');
		searchTr1t.css('display','none');
		//桩号
		var tr =$('<tr></tr>').appendTo(table);
		var spanTd=$('<td width="20%"></td>').appendTo(tr);
		var input =$('<span>桩号</span>').appendTo(spanTd);
		var comboxTd=$('<td width="80%"></td>').appendTo(tr);
		var combox =$('<select id="beginMarkerId" class="input_bg"></select>').appendTo(comboxTd);
		//起始场站绑定事件
		$('#beginSiteLocation').change(function(){
			beginPanel.dialog('close');
			loadMakerComboxData("endSiteLocation",rootPath +'/jasframework/choosepilecontrol/queryEndSiteByBeginSite.do?beginsiteId='+$('#beginSiteLocation').val());
			//未选中结束场站
			if($('#endSiteLocation').val()=='' && $('#beginSiteLocation').val()!=""){
				loadMakerComboxData("beginMarkerId",rootPath +'/jasframework/choosepilecontrol/queryBeginMarkerByBeginSite.do?beginsiteId='+$('#beginSiteLocation').val()+'&locationType='+$('#locationType1').val());
				//未选中起始场站
			}else if($('#beginSiteLocation').val()=="" && $('#endSiteLocation').val()!=''){
				loadMakerComboxData("beginMarkerId",rootPath +'/jasframework/choosepilecontrol/queryEndMarkerByEndSite.do?endsiteId='+$('#endSiteLocation').val()+'&locationType='+$('#locationType1').val());
				//只选中类型
			}else if($('#beginSiteLocation').val()=="" && $('#endSiteLocation').val()=='' && $('#locationType1').val()!=''){
				loadMakerComboxData("beginMarkerId",rootPath +'/jasframework/choosepilecontrol/queryMarkerByType.do?locationType='+$('#locationType1').val());
			}else if($('#beginSiteLocation').val()!="" && $('#endSiteLocation').val()!=''){
				loadMakerComboxData("beginMarkerId",rootPath +'/jasframework/choosepilecontrol/queryMidMarkerByBeginAndEndSite.do?beginsiteId='+$('#beginSiteLocation').val()+'&endsiteId='+$('#endSiteLocation').val()+'&locationType='+$('#locationType1').val());
			}
			beginPanel.dialog('open');
		});
		//类型绑定事件
		$('#locationType1').change(function(){
			beginPanel.dialog('close');
			//loadMakerComboxData("endSiteLocation",rootPath +'/jasframework/choosepilecontrol/queryEndSiteByBeginSite.do?beginsiteId='+$('#beginSiteLocation').val()+'&locationType='+$('#locationType1').val());
			//未选中结束场站
			if($('#endSiteLocation').val()=='' && $('#beginSiteLocation').val()!=""){
				loadMakerComboxData("beginMarkerId",rootPath +'/jasframework/choosepilecontrol/queryBeginMarkerByBeginSite.do?beginsiteId='+$('#beginSiteLocation').val()+'&locationType='+$('#locationType1').val());
				//未选中起始场站
			}else if($('#beginSiteLocation').val()=="" && $('#endSiteLocation').val()!=''){
				loadMakerComboxData("beginMarkerId",rootPath +'/jasframework/choosepilecontrol/queryEndMarkerByEndSite.do?endsiteId='+$('#endSiteLocation').val()+'&locationType='+$('#locationType1').val());
				//只选中类型
			}else if($('#beginSiteLocation').val()=="" && $('#endSiteLocation').val()=='' && $('#locationType1').val()!=''){
				loadMakerComboxData("beginMarkerId",rootPath +'/jasframework/choosepilecontrol/queryMarkerByType.do?locationType='+$('#locationType1').val());
			}else if($('#beginSiteLocation').val()!="" && $('#endSiteLocation').val()!=''){
				loadMakerComboxData("beginMarkerId",rootPath +'/jasframework/choosepilecontrol/queryMidMarkerByBeginAndEndSite.do?beginsiteId='+$('#beginSiteLocation').val()+'&endsiteId='+$('#endSiteLocation').val()+'&locationType='+$('#locationType1').val());
			}
			beginPanel.dialog('open');
		});
		//终止场站绑定事件
		$('#endSiteLocation').change(function(){
			beginPanel.dialog('close');
			//未选中结束场站
			if($('#endSiteLocation').val()=='' && $('#beginSiteLocation').val()!=""){
				loadMakerComboxData("beginMarkerId",rootPath +'/jasframework/choosepilecontrol/queryBeginMarkerByBeginSite.do?beginsiteId='+$('#beginSiteLocation').val()+'&locationType='+$('#locationType1').val());
				//未选中起始场站
			}else if($('#beginSiteLocation').val()=="" && $('#endSiteLocation').val()!=''){
				loadMakerComboxData("beginMarkerId",rootPath +'/jasframework/choosepilecontrol/queryEndMarkerByEndSite.do?endsiteId='+$('#endSiteLocation').val()+'&locationType='+$('#locationType1').val());
				//只选中类型
			}else if($('#beginSiteLocation').val()=="" && $('#endSiteLocation').val()=='' && $('#locationType1').val()!=''){
				loadMakerComboxData("beginMarkerId",rootPath +'/jasframework/choosepilecontrol/queryMarkerByType.do?locationType='+$('#locationType1').val());
			}else if($('#beginSiteLocation').val()!="" && $('#endSiteLocation').val()!=''){
				loadMakerComboxData("beginMarkerId",rootPath +'/jasframework/choosepilecontrol/queryMidMarkerByBeginAndEndSite.do?beginsiteId='+$('#beginSiteLocation').val()+'&endsiteId='+$('#endSiteLocation').val()+'&locationType='+$('#locationType1').val());
			}
			beginPanel.dialog('open');
		});
		//里程值
		var tr1 =$('<tr></tr>').appendTo(table);
		var spanTd1=$('<td></td>').appendTo(tr1);
		var input1 =$('<span>偏移</span>').appendTo(spanTd1);
		var comboxTd1=$('<td></td>').appendTo(tr1);
		var combox1 =$('<input id="beginMarkerPostion" class="input_bg"/>').appendTo(comboxTd1);
		//按钮
		var buttonTable =$('<div width="100%" class="button_area" align="center"></div>').insertAfter(table);
		$('<a id="btnsave" href="#" class="easyui-linkbutton">保存</a>').appendTo(buttonTable);
		$('<a id="btnclear" href="#" class="easyui-linkbutton">清空</a>').appendTo(buttonTable);
		$('<a id="btnclose" href="#" class="easyui-linkbutton">关闭</a>').appendTo(buttonTable);
		$.each($('.easyui-linkbutton'), function(i, item) {$("#" + item.id).linkbutton();});
		loadMakerComboxData("beginMarkerId",rootPath +'/jasframework/choosepilecontrol/queryAllMarkerLocation.do');
		$("#btnsave").click(function(){
			$.ajax({
				url : rootPath +'/jasframework/choosepilecontrol/queryMarkerById.do?MarkerId='+$('#beginMarkerId').val(),
				type : 'POST',
				success : function(data) {
					var objJson = JSON.parse(data);
					if($('#beginMarkerPostion').val()!=''){
						$('#'+beginMarkerTextId).val(objJson[0].markername+"+"+$('#beginMarkerPostion').val()+"m");
					}else{
						$('#'+beginMarkerTextId).val(objJson[0].markername);
					}
					
				},
				error : function(data) {
					top.showAlert('错误', '查询出错', 'error');
				}
			});
			$('#'+beginMarkerTextId).val($('#beginMarkerId').val()+"+"+$('#beginMarkerPostion').val());
			//隐藏查询条件
			searchTr.css('display','none');
			searchTr1.css('display','none');
			searchTr1t.css('display','none');
			flag =true;
			panel.dialog('close');
			btnclick.choosePileControl.returnControlData();
		});
		$("#btnclear").click(function(){
			$('#'+beginMarkerTextId).val('');
			$('#beginMarkerId').val('');
			$('#beginMarkerPostion').val('');
			$('#beginSiteLocation').val('');
			$('#endSiteLocation').val('');
			$('#locationType').val('');
			//隐藏查询条件
			searchTr.css('display','none');
			searchTr1.css('display','none');
			searchTr1t.css('display','none');
			flag =true;
		});
		$("#btnclose").click(function(){
			//隐藏查询条件
			searchTr.css('display','none');
			searchTr1.css('display','none');
			searchTr1t.css('display','none');
			flag =true;
			panel.dialog('close');
		});
		
	},
	/**
	 * 方法描述：加载终止桩
	 * @param subsystemSelectId 子系统id
	 * @param lineLoopTextId 管线id
	 * @param beginMarkerTextId 起始桩id
	 * @param endMarkerTextId 终止桩id
	 */
	loadEndnChoosePilePage : function(lineloopId,subsystemSelectId,beginMarkerTextId,endMarkerTextId,callback){
		var panel = $('<div id="chooseEndPanel"></div>').insertAfter($("#"+endMarkerTextId));
		endPanel =panel;
		//文本框的位置
		var position = $("#"+endMarkerTextId).position();
		panel.dialog({
			title : "选桩",
			width : $("#"+endMarkerTextId).width(),
			left : position.left,
			top : position.top+28,
			closed : true,
			draggables : false
		});
		$("#"+endMarkerTextId).click(function(){
			panel.dialog('open');
			beginPanel.dialog('close');
		});
		var table =$('<table width="100%" class="edittable"></table>').appendTo(panel);
		//查询条件
		var searchTitleTr =$('<tr></tr>').appendTo(table);
		var benginTd1=$('<td width="20%"></td>').appendTo(searchTitleTr);
		var searchA =$('<a id="search1" href="#" class="easyui-linkbutton">查询条件</a>').appendTo(benginTd1);
		var endTd1=$('<td width="80%"></td>').appendTo(benginTd1);
		
		//查询条件（起点场站）
		var searchTr =$('<tr></tr>').appendTo(table);
		var benginTd=$('<td width="20%"></td>').appendTo(searchTr);
		var begin =$('<span>起始场站</span>').appendTo(benginTd);
		var endTd=$('<td width="80%"></td>').appendTo(searchTr);
		var end =$('<select id="beginSiteLocation1" class="input_bg"></select>').appendTo(endTd);
		loadMakerComboxData("beginSiteLocation1",rootPath +'/jasframework/choosepilecontrol/queryAllSiteLocation.do');
		//查询条件（终点场站）
		var searchTr1 =$('<tr></tr>').appendTo(table);
		var benginTd1=$('<td width="20%"></td>').appendTo(searchTr1);
		var begin1 =$('<span>终止场站</span>').appendTo(benginTd1);
		var endTd1=$('<td width="80%"></td>').appendTo(searchTr1);
		var end1 =$('<select id="endSiteLocation1" class="input_bg"></select>').appendTo(endTd1);
		loadMakerComboxData("endSiteLocation1",rootPath +'/jasframework/choosepilecontrol/queryAllSiteLocation.do');
		//起始场站绑定事件
		$('#beginSiteLocation1').change(function(){
			endPanel.dialog('close');
			loadMakerComboxData("endSiteLocation1",rootPath +'/jasframework/choosepilecontrol/queryEndSiteByBeginSite.do?beginsiteId='+$('#beginSiteLocation1').val());
			//未选中结束场站
			if($('#endSiteLocation1').val()=='' && $('#beginSiteLocation1').val()!=""){
				loadMakerComboxData("endMarkerId1",rootPath +'/jasframework/choosepilecontrol/queryBeginMarkerByBeginSite.do?beginsiteId='+$('#beginSiteLocation1').val()+'&locationType='+$('#locationType').val());
				//未选中起始场站
			}else if($('#beginSiteLocation1').val()=="" && $('#endSiteLocation1').val()!=''){
				loadMakerComboxData("endMarkerId1",rootPath +'/jasframework/choosepilecontrol/queryEndMarkerByEndSite.do?endsiteId='+$('#endSiteLocation1').val()+'&locationType='+$('#locationType').val());
				//只选中类型
			}else if($('#beginSiteLocation1').val()=="" && $('#endSiteLocation1').val()=='' && $('#locationType').val()!=''){
				loadMakerComboxData("endMarkerId1",rootPath +'/jasframework/choosepilecontrol/queryMarkerByType.do?locationType='+$('#locationType').val());
			}else{
				loadMakerComboxData("endMarkerId1",rootPath +'/jasframework/choosepilecontrol/queryMidMarkerByBeginAndEndSite.do?beginsiteId='+$('#beginSiteLocation1').val()+'&endsiteId='+$('#endSiteLocation1').val()+'&locationType='+$('#locationType').val());
			}
			endPanel.dialog('open');
		});
		//终止场站绑定事件
		$('#endSiteLocation1').change(function(){
			endPanel.dialog('close');
			//未选中结束场站
			if($('#endSiteLocation1').val()=='' && $('#beginSiteLocation1').val()!=""){
				loadMakerComboxData("endMarkerId1",rootPath +'/jasframework/choosepilecontrol/queryBeginMarkerByBeginSite.do?beginsiteId='+$('#beginSiteLocation1').val()+'&locationType='+$('#locationType').val());
				//未选中起始场站
			}else if($('#beginSiteLocation1').val()=="" && $('#endSiteLocation1').val()!=''){
				loadMakerComboxData("endMarkerId1",rootPath +'/jasframework/choosepilecontrol/queryEndMarkerByEndSite.do?endsiteId='+$('#endSiteLocation1').val()+'&locationType='+$('#locationType').val());
				//只选中类型
			}else if($('#beginSiteLocation1').val()=="" && $('#endSiteLocation1').val()=='' && $('#locationType').val()!=''){
				loadMakerComboxData("endMarkerId1",rootPath +'/jasframework/choosepilecontrol/queryMarkerByType.do?locationType='+$('#locationType').val());
			}else{
				loadMakerComboxData("endMarkerId1",rootPath +'/jasframework/choosepilecontrol/queryMidMarkerByBeginAndEndSite.do?beginsiteId='+$('#beginSiteLocation1').val()+'&endsiteId='+$('#endSiteLocation1').val()+'&locationType='+$('#locationType').val());
			}
			endPanel.dialog('open');
		});
		//查询条件（桩号类型）
		var searchTr1t =$('<tr></tr>').appendTo(table);
		var benginTd1t=$('<td width="20%"></td>').appendTo(searchTr1t);
		var begin1t =$('<span>桩类型</span>').appendTo(benginTd1t);
		var endTd1t=$('<td width="80%"></td>').appendTo(searchTr1t);
		var end1t =$("<select id=\"locationType\" class=\"input_bg\"><option value=''>全部</option><option value='1'>里程桩</option>"+
				"	<option value='2'>转角桩</option>"+
				"	<option value='6'>垂直转角桩</option>"+
				"	<option value='4'>加密桩</option>"+
				"	<option value='8'>穿越桩</option>"+
				"	<option value='23'>临时桩</option>"+
				"	<option value='101'>磁力桩</option>"+
				"	<option value='1000'>阴保桩</option>+</select>").appendTo(endTd1t);
		$('#locationType').change(function(){
			endPanel.dialog('close');
			loadMakerComboxData("endSiteLocation1",rootPath +'/jasframework/choosepilecontrol/queryEndSiteByBeginSite.do?beginsiteId='+$('#beginSiteLocation1').val()+'&locationType='+$('#locationType').val());
			//未选中结束场站
			if($('#endSiteLocation1').val()=='' && $('#beginSiteLocation1').val()!=""){
				loadMakerComboxData("endMarkerId1",rootPath +'/jasframework/choosepilecontrol/queryBeginMarkerByBeginSite.do?beginsiteId='+$('#beginSiteLocation1').val()+'&locationType='+$('#locationType').val());
				//未选中起始场站
			}else if($('#beginSiteLocation1').val()=="" && $('#endSiteLocation1').val()!=''){
				loadMakerComboxData("endMarkerId1",rootPath +'/jasframework/choosepilecontrol/queryEndMarkerByEndSite.do?endsiteId='+$('#endSiteLocation1').val()+'&locationType='+$('#locationType').val());
				//只选中类型
			}else if($('#beginSiteLocation1').val()=="" && $('#endSiteLocation1').val()=='' && $('#locationType').val()!=''){
				loadMakerComboxData("endMarkerId1",rootPath +'/jasframework/choosepilecontrol/queryMarkerByType.do?locationType='+$('#locationType').val());
			}else{
				loadMakerComboxData("endMarkerId1",rootPath +'/jasframework/choosepilecontrol/queryMidMarkerByBeginAndEndSite.do?beginsiteId='+$('#beginSiteLocation1').val()+'&endsiteId='+$('#endSiteLocation1').val()+'&locationType='+$('#locationType').val());
			}
			endPanel.dialog('open');
		});
		var flag =true;
		//打开查询条件
		$("#search1").click(function(){
			if(flag){
				searchTr.css('display','block');
				searchTr1.css('display','block');
				searchTr1t.css('display','block');
				loadMakerComboxData("beginSiteLocation1",rootPath +'/jasframework/choosepilecontrol/querySiteByLineAndSys.do?subsystemId='+$('#'+subsystemSelectId).val()+'&lineloopId='+$('#'+lineloopId).combotree('getValue'));
				loadMakerComboxData("endMarkerId1",rootPath +'/jasframework/choosepilecontrol/querySiteByLineAndSys.do?subsystemId='+$('#'+subsystemSelectId).val()+'&lineloopId='+$('#'+lineloopId).combotree('getValue'));
				flag =false;
			}else{
				searchTr.css('display','none');
				searchTr1.css('display','none');
				searchTr1t.css('display','none');
				flag =true;
			}
		});
		//隐藏查询条件
		searchTr.css('display','none');
		searchTr1.css('display','none');
		searchTr1t.css('display','none');
		//桩号
		var tr =$('<tr></tr>').appendTo(table);
		var spanTd=$('<td width="20%"></td>').appendTo(tr);
		var input =$('<span>桩号</span>').appendTo(spanTd);
		var comboxTd=$('<td width="80%"></td>').appendTo(tr);
		var combox =$('<select id="endMarkerId1" class="input_bg"></select>').appendTo(comboxTd);
		//里程值
		var tr1 =$('<tr></tr>').appendTo(table);
		var spanTd1=$('<td></td>').appendTo(tr1);
		var input1 =$('<span>偏移</span>').appendTo(spanTd1);
		var comboxTd1=$('<td></td>').appendTo(tr1);
		var combox1 =$('<input id="endMarkerPostion1" class="input_bg"/>').appendTo(comboxTd1);
		//按钮
		var buttonTable =$('<div width="100%" class="button_area" align="center"></div>').insertAfter(table);
		$('<a id="btnendsave" href="#" class="easyui-linkbutton">保存</a>').appendTo(buttonTable);
		$('<a id="btnendclear" href="#" class="easyui-linkbutton">清空</a>').appendTo(buttonTable);
		$('<a id="btnendclose" href="#" class="easyui-linkbutton">关闭</a>').appendTo(buttonTable);
		$.each($('.easyui-linkbutton'), function(i, item) {$("#" + item.id).linkbutton();});
		//加载终止桩数据
		loadMakerComboxData("endMarkerId1",rootPath +'/jasframework/choosepilecontrol/queryAllMarkerLocation.do');
		$("#btnendsave").click(function(){
			$.ajax({
				url : rootPath +'/jasframework/choosepilecontrol/queryMarkerById.do?MarkerId='+$('#endMarkerId1').val(),
				type : 'POST',
				success : function(data) {
					var objJson = JSON.parse(data);
					if($('#endMarkerPostion1').val()!=''){
						$('#'+endMarkerTextId).val(objJson[0].markername+"+"+$('#endMarkerPostion1').val()+"m");
					}else{
						$('#'+endMarkerTextId).val(objJson[0].markername);
					}
					
				},
				error : function(data) {
					top.showAlert('错误', '查询出错', 'error');
				}
			});
			searchTr.css('display','none');
			searchTr1.css('display','none');
			searchTr1t.css('display','none');
			flag =true;
			panel.dialog('close');
			btnclick.choosePileControl.returnControlData();
		});
		$("#btnclear").click(function(){
			$('#'+endMarkerTextId).val('');
			$('#endMarkerId1').val('');
			$('#endMarkerPostion1').val('');
			$('#beginSiteLocation').val('');
			$('#endSiteLocation').val('');
			$('#locationType').val('');
			//隐藏查询条件
			searchTr.css('display','none');
			searchTr1.css('display','none');
			searchTr1t.css('display','none');
			flag =true;
		});
		$("#btnendclose").click(function(){
			panel.dialog('close');
			//隐藏查询条件
			searchTr.css('display','none');
			searchTr1.css('display','none');
			searchTr1t.css('display','none');
			flag =true;
		});
	},
	/**
	 * 方法描述：返回数据(有起始终止位置的返回值)
	 */
	returnControlData : function(){
		$.ajax({
			url : rootPath +'/jasframework/choosepilecontrol/queryMarkerLocationById.do?beginMarkerId='+$('#beginMarkerId').val()+"&endMarkerId="+$('#endMarkerId1').val(),
			type : 'POST',
			success : function(data) {
				if(data !=null && data !=''){
					var objJson = JSON.parse(data);
					contolData =[];
					if(objJson.length==2){
						var returnDate={
							//子系统id
							subsystemEventid: $('#statearea').val(),
							//子系统名称
							subsystemName: objJson[0].subsystemName,
							//管线id
							lineLoopEventid : $('#lineLoopText').combotree('getValue'),
							//管线名称
							lineLoopName:$('#lineLoopText').combotree('getText'),
							beginMarkerEventid : $('#beginMarkerId').val(),
							//里程
							beginStation : objJson[0].markerstation,
							//站列
							benginSeriesEventid : objJson[0].serieseventid,
							//偏移
							beginMarkerPostion : $('#beginMarkerPostion').val(),
							endMarkerEventid : $('#endMarkerId1').val(),
							//里程
							endStation : objJson[1].markerstation,
							//站列
							endSeriesEventid : objJson[1].serieseventid,
							//偏移
							endMarkerPostion : $('#endMarkerPostion1').val() 
						};
						contolData.push(returnDate);
					}else if(objJson.length==1){
						var returnDate={
							//子系统id
							subsystemEventid: $('#statearea').val(),
							//子系统名称
							subsystemName: objJson[0].subsystemName,
							//管线id
							lineLoopEventid : $('#lineLoopText').combotree('getValue'),
							//管线名称
							lineLoopName:$('#lineLoopText').combotree('getText'),
							beginMarkerEventid : $('#beginMarkerId').val(),
							//里程
							beginStation : objJson[0].markerstation,
							//站列
							benginSeriesEventid : objJson[0].serieseventid,
							//偏移
							beginMarkerPostion : $('#beginMarkerPostion').val()
						};
						contolData.push(returnDate);
					};
				}
			},
			error : function(data) {
				top.showAlert('错误', '查询出错', 'error');
			}
		});
	}
};
/**
 * 方法描述：加载下拉列表框
 * @param htmlId 页面元素id
 * @param url 请求url
 */
function loadMakerComboxData(htmlId,url){
	$.ajax({
		url : url,
		type : 'POST',
		success : function(data) {
			$('#' + htmlId).html('');
			if(data !='' && data !=null){
				// 转为json对象
				var objJson = JSON.parse(data);
				var hasUserHtml = "<option value=\"" + "" + "\">" + "---请选择---"
						+ "</option>";
				// 动态拼写
				for ( var j = 0; j < objJson.length; j++) {
					var per = objJson[j];
					hasUserHtml += "<option value=\"" + per.id + "\">"
							+ per.text + "</option>";
				}
				$('#' + htmlId).html(hasUserHtml);
			}else{
				var hasUserHtml = "<option value=\"" + "" + "\">" + "---请选择---"
				+ "</option>";
				$('#' + htmlId).html(hasUserHtml);
			}
		},
		error : function(data) {
			top.showAlert('错误', '查询出错', 'error');
		}
	});
}

