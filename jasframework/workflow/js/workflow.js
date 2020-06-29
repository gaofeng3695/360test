 var Workflow = (function(window) {
    var Workflow = function() {
        return new Workflow.fn.init();
    }
    //页面配置项
    var workflowPagePath = getRootPath()+"jasframework/workflow/" //工作流页面请求路径
    var _globalPageConfig = {
		deploy:{
			allList:{
				
			},
			deploy:{
				id:"deployWorkflowsIframe",
				url:workflowPagePath+'deployWorkflows.htm',
				key:"workflow.deployUpload",
				w:600,
				h:300
			}
		},
    	task: {
			myUndoTask:{
				id:"myTaskIframe",
				url:workflowPagePath+"myundotask.htm"
			},
			approve:{
				id:"approveTaskIframe",
				url:workflowPagePath+"approveUI.htm",
				key:"workflow.approveWork",
				w:900,
				h:550
			},
			transfer:{
				id:"taskTransferIframe",
				url:workflowPagePath+"taskTransfer.htm",
				key:"workflow.taskTransfer",
				w:700,
				h:300
			}
		},
    	workflowChart:{
			id:"workflowChartIframe",
			url:workflowPagePath+"workflowChart.htm",
			key:"workflow.workflowChart",
			w:800,
			h:600
		},
		workflowHistory:{
			id:"workflowHistoryIframe",
			url:workflowPagePath+"yibaninfo.htm",
//			key:"workflow.approveHistory",
			key:"审批记录",
			w:800,
			h:440
		},
		chooseUser:{
			id:"workflowChooseUserIframe",
			url:workflowPagePath+"chooseUser.htm",
			key:"workflow.chooseUser",
			w:400,
			h:200
		},
		taskList:{
			id:"taskListIframe",
			url:workflowPagePath+"taskList.htm"
		},
		
		myunread:{
			id:"myunreadIframe",
			url:workflowPagePath+"myunread.htm"
		},
		read:{
			id:"readUIIframe",
			url:workflowPagePath+"readUI.htm"
		},
		delegate:{//工作委托页面配置项
			myList:{
				id:"myDelegateIframe",
				url:workflowPagePath+"delegate.htm"
			},
			add:{
				id:"addDelegateIframe",
				key:"workflow.addDelegate",
				url:workflowPagePath+"addDelegate.htm",
				w:700,
				h:300
			},
			update:{
				id:"updateDelegateIframe",
				url:workflowPagePath+"updateDelegate.htm",
				key:"workflow.updateDelegate",
				w:700,
				h:300
			},
			view:{
				id:"viewDelegateIframe",
				url:workflowPagePath+"viewDelegate.htm",
				key:"workflow.viewDelegate",
				w:700,
				h:400
			}
		},
		model:{ //流程模型配置页面
			add:{
				id:"addModelIframe",
				key:"workflow.addModel",
				url:workflowPagePath+"addModel.htm",
				w:750,
				h:450
			},
			update:{
				id:"updateModelIframe",
				key:"workflow.updateModel",
				url:workflowPagePath+"updateModel.htm",
				w:750,
				h:450
			},
			config:{
				id:"configModelIframe",
				key:"workflow.configModel",
				url:workflowPagePath+"modeler.html",
				w:900,
				h:600
			},
		}
    }
    //页面请求配置项
    var workflowURLPath = getRootPath()+"jasframework/workflow/";//工作流Controller请求路径
    var _globalUrlConfig = {
		deploy:{
			allList:workflowURLPath+"deploy/getAllList.do",  //获取已部署的流程定义列表
			deploy:workflowURLPath+"deploy.do",  //部署流程
			getWorkflowNameList:workflowURLPath+"deploy/getNameList.do",   //获取部署的流程名称
			getWorkflowChart:workflowURLPath+"getChart.do"  //获取流程图
		},
		instance:{
			allList:workflowURLPath+"instance/getList.do",   //获取所有流程实例列表
			myList:workflowURLPath+"instance/myList.do",  //获取我的流程实例列表
			getTraces:workflowURLPath+"/instance/getTraces.do", //获取流程每个节点的封装信息，包括办理信息
			getDetail:workflowURLPath+"/instance/get.do", //获取流程实例详情
			isExist:workflowURLPath+"/instance/isExist.do", //流程是否已经存在
			startWorkflow:workflowURLPath+"/instance/start.do", //发起流程
			remove:workflowURLPath+"/instance/delete.do" //删除流程
		},
		task:{
			allTodoList:workflowURLPath+"task/getAllTodoList.do", //获取所有待办任务列表
			myTodoList:workflowURLPath + "task/myTodoList.do", //获取我的待办任务列表
			myDoneList:workflowURLPath + "task/myDoneList.do", //获取我的已办任务列表
			isCanWithdraw:workflowURLPath + "task/isCanWithdraw.do", //任务是否允许撤回
			withdraw:workflowURLPath + "task/withdraw.do", //撤回任务
			isCanApprove:workflowURLPath + "task/isCanApprove.do", //任务是否允许当前用户审批
			approve:workflowURLPath + "task/approve.do", //审批任务
			transfer:workflowURLPath + "task/transfer.do", //转办任务
			remind:workflowURLPath+"task/remind.do", //催办任务
			getOutflows:workflowURLPath+"task/getOutflows.do", //获取任务所有的输出线路
			getDetail:workflowURLPath+"task/get.do" //获取任务详情
		},
		carbon:{
			myTodoList:workflowURLPath+'carbon/myTodoList.do',  //获取用户未读的任务传阅列表
			myDoneList:workflowURLPath+'carbon/myDoneList.do', //获取用户已读的任务传阅列表
			copyTo:workflowURLPath+'carbon/copyTo.do', //传阅任务
			read:workflowURLPath+'carbon/read.do' //阅读任务
		},
		delegate:{
			myList:workflowURLPath+"delegate/myList.do",  //查询用户的委托列表
			isExist:workflowURLPath+"delegate/isExist.do", //用户是否存在委托信息
			get:workflowURLPath+"delegate/get.do",	//查看用户委托信息
			add:workflowURLPath+"delegate/add.do",  //新增一个委托信息
			update:workflowURLPath+"delegate/update.do", //更新一个委托信息
			cancel:workflowURLPath+"delegate/cancel.do" //用户取消委托信息
		},
		model:{
			allList: workflowURLPath+"model/getList.do",  //查询模型列表
			add:  workflowURLPath+"model/create.do",  //添加模型
			update:  workflowURLPath+"model/update.do",  //更新模型
			remove:  workflowURLPath+"model/delete.do",  //删除模型
			get:  workflowURLPath+"model/get.do",  //获取一个模型
			deploy: workflowURLPath+"model/deploy.do", //部署模型
			_export: workflowURLPath+"model/export.do" //导出模型
		}
    }
    Workflow.fn = Workflow.prototype = {
        constructor: Workflow,
        init: function() {//初始化
        },
        config:{
    		contentType_json : "application/json;charset=utf-8",
    		workflowURLPath : getRootPath()+"jasframework/workflow/",//工作流Controller请求路径
    		workflowPagePath : getRootPath()+"jasframework/workflow/" //工作流页面请求路径
    	},
    	/** 页面配置项 **/
    	page:_globalPageConfig,
    	/** 请求配置项 **/
        URL:_globalUrlConfig,
    	/************************对外暴露的方法*************************/
    	// 高级搜索响应事件
    	moreQueryHandler:function(datagridID,moreQueryBtn,moreQueryTable,queryContainer,expandHeight,collapseHeight){
    		_moreQueryHandler(datagridID,moreQueryBtn,moreQueryTable,queryContainer,expandHeight,collapseHeight);
    	},
    	// 提示要选择一条数据
    	tipChooseRecored:function(){
    		top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"),'info');
    	},
    	// 打开流程图查看窗口
    	openWorkflowChart:function(paramsStr,w,h){
    		_openWorkflowChart(paramsStr,w,h);
    	},
    	// 打开流程审批查看窗口
    	openApproveHistory:function(paramsStr,w,h){
    		_openApproveHistory(paramsStr,w,h);
    	},
    	openTaskApprove:function(paramsStr,w,h){
    		_openTaskApprove(paramsStr,w,h);
    	},
    	//打开选人页面
    	openChooseUser:function(paramsStr,w,h){
    		_openChooseUser(paramsStr,w,h);
    	},
    	// 隐藏页面元素
    	hiddenBusinessPageContent:function(businessPage,hiddenElementIdOfBusinessPage){
    		/**
    		 * 隐藏业务页面的指定元素，元素id是通过流程定义文件中配置在流程节点上的页面url中指定
    		 */
    		if( businessPage && hiddenElementIdOfBusinessPage ){
				var iframeContent = businessPage;
				var hiddenElementIdArray = hiddenElementIdOfBusinessPage.split(",");
				for(var i=0;i<hiddenElementIdArray.length;i++){
					iframeContent.$("#"+hiddenElementIdArray[i]).hide();
				}
			}
    	},
    	// 获取流程名称列表
    	getWorkflowNameList:function(callback){
    		_getWorkflowNameList(callback);
    	},
    	// 加载流程名称
    	loadWorkflowName:function(targetContainerID,data){
    		data = data.sort();
			$('#'+targetContainerID).combobox({ 
				data:data, 
				valueField:'processKey',  
			    textField:'processName',
			    width:"100%",
			    panelHeight:'auto'
			});
    	},
    	deleteWorkflowInstance:function(proInstIds,callback){
    		_deleteWorkflowInstance(proInstIds,callback);
    	},
    	// 获取流程图
    	getWorkflowChart:function(businessKey,proInstId,processId,processKey,deploymentId,callback) {
    		_getWorkflowChart(businessKey,proInstId,processId,processKey,deploymentId,callback);
    	},
    	// 获取流程挂接的业务页面
    	loadBusinessPage: function(taskId,businessKey,proInstId,isGlobal,callback) {
    		_loadBusinessPage(taskId,businessKey,proInstId,isGlobal,callback);
    	},
    	// 获取流程审批记录
    	getWorkflowComments: function(businessKey,proInstId,callback){
    		_getWorkflowComments(businessKey,proInstId,callback);
    	},
    	// 加载流程审批记录
    	loadDatagridComments: function(datagridID,data){
    		_loadDatagridComments(datagridID,data);
    	},
    	// 任务传阅（抄送）
    	taskCopyToUsers: function(taskId,toUsers,remark,callback){
    		_taskCopyToUsers(taskId,toUsers,remark,callback);
    	},
    	// 任务审阅
    	taskCopyRead: function(carbonId,comment,callback){
    		_taskCopyRead(carbonId,comment,callback);
    	},
    	// 根据流程任务ID查询该任务节点的流转线路信息
    	getCurrentTaskNodeOutflows:function(taskId,callback){
    		_getCurrentTaskNodeOutflows(taskId,callback);
    	},
    	// 获取流程实例详情
    	getWorkflowInstanceDetail:function(businessKey,proInstId,callback){
    		_getWorkflowInstanceDetail(businessKey,proInstId,callback);
    	},
    	// 流程是否已经存在
    	isExistsWorkflow:function(businessKey,callback){
    		_isExistsWorkflow(businessKey,callback);
    	},
    	// 启动新流程
    	startWorkflow: function(businessKey,processKey,subject,autoPassFirstNode,auditContent,callback,flowVars,index){
    		_startWorkflow(businessKey,processKey,subject,autoPassFirstNode,auditContent,callback,flowVars,index);
    	},
    	// 任务是否可以撤回
    	taskIsCanWithdraw:function(taskId,callback){
    		_taskIsCanWithdraw(taskId,callback);
    	},
    	// 撤回任务
    	taskWithdraw:function(taskId,callback){
    		_taskWithdraw(taskId,callback);
    	},
    	// 转办任务
    	taskTransfer:function(taskIds,toUsers,remark,callback){
    		_taskTransfer(taskIds,toUsers,remark,callback);
    	},
    	// 催办任务
    	taskRemind:function(taskIds,callback){
    		_taskRemind(taskIds,callback);
    	},
    	// 用户是否可以审批任务
    	taskIsCanApprove:function(businessKey,callback){
    		_taskIsCanApprove(businessKey,callback);
    	},
    	// 审批任务
    	taskApprove:function(taskId,flowVars,callback){
    		_taskApprove(taskId,flowVars,callback);
    	},
    	// 获取任务详情
    	getTaskDetail:function(taskId,callback){
    		_getTaskDetail(taskId,callback);
    	},
    	// 用户是否存在委托
    	isExistDelegate:function(params,callback){
    		_isExistsDelegate(params,callback);
    	},
    	// 获取委托信息
    	getDelegate:function(delegateId,callback){
    		_getDelegate(delegateId,callback);
    	},
    	// 保存用户委托信息
    	addDelegate:function(params,callback){
    		_addDelegate(params,callback);
    	},
    	// 更新用户委托信息
    	updateDelegate:function(params,callback){
    		_updateDelegate(params,callback);
    	},
    	// 取消用户委托信息
    	cancelDelegate:function(delegateId,callback){
    		_cancelDelegate(delegateId,callback);
    	},
    	// 保存模型
    	addModel:function(params,result){
    		_addModel(params,result);
    	},
    	// 更新模型
    	updateModel:function(params,callback){
    		_updateModel(params,callback);
    	},
    	// 删除模型
    	deleteModel:function(modelIds,callback){
    		_deleteModel(modelIds,callback);
    	},
    	// 获取一个模型
    	getModel:function(modelId,callback){
    		_getModel(modelId,callback);
    	},
    	// 部署一个模型
    	deployModel:function(modelIds,callback){
    		_deployModel(modelIds,callback);
    	},
    }
  
    /**
	 * 高级搜索响应事件
	 * @param datagridID 数据列表ID
	 * @param moreQueryBtn 按钮，默认为moreQuery
	 * @param moreQueryTable 高级搜索区，默认为moreTable
	 * @param queryContainer 查询区域，默认为queryDiv
	 * @param expandHeight 展开高度，默认为224
	 * @param collapseHeight 收缩高度，默认为64
	 * @returns
	 */
    function _moreQueryHandler(datagridID,moreQueryBtn,moreQueryTable,queryContainer,expandHeight,collapseHeight){
    	moreQueryBtn = moreQueryBtn || "moreQuery";
		moreQueryTable = moreQueryTable || "moreTable";
		queryContainer = queryContainer || "queryDiv";
		expandHeight = expandHeight || 226;
		collapseHeight = collapseHeight || 64;
		//高级搜索
		$("#"+moreQueryBtn).click(function(){
			$(this).toggleClass("active");
			$("#"+moreQueryTable).toggleClass("active");
			var span = $(this).children().find(".l-btn-icon");
			if($(this).hasClass("active")){
				$(span).removeClass("accordion-expand").addClass("accordion-collapse");
				initDatagrigHeight(datagridID,queryContainer,expandHeight);
			}else{
				$(span).removeClass("accordion-collapse").addClass("accordion-expand");
				initDatagrigHeight(datagridID,queryContainer,collapseHeight);
			}
		});
    }
    /**
	 * 打开流程图窗口
	 * @param paramsStr url中的参数
	 * @param w 窗口宽度，默认为800
	 * @param h 窗口高度，默认为600
	 */
    function _openWorkflowChart(paramsStr,w,h){
		w = w || workflow.page.workflowChart.w;
		h = h || workflow.page.workflowChart.h;
		top.getDlg(workflow.page.workflowChart.url+"?"+paramsStr, 
				workflow.page.workflowChart.id,
				getLanguageValue(workflow.page.workflowChart.key,"流程图"),
				w , h);
	}
	/**
	 * 打开流程审批记录窗口
	 * @param paramsStr url中的参数
	 * @param w 窗口宽度，默认为800
	 * @param h 窗口高度，默认为600
	 */
    function _openApproveHistory(paramsStr,w,h){
		w = w || workflow.page.workflowHistory.w;
		h = h || workflow.page.workflowHistory.h;
		top.getDlg(workflow.page.workflowHistory.url+"?"+paramsStr, 
				workflow.page.workflowHistory.id,
				getLanguageValue(workflow.page.workflowHistory.key),
				w , h);
	}
	/**
	 * 打开流程审批窗口
	 * @param paramsStr url中的参数
	 * @param w 窗口宽度，默认为900
	 * @param h 窗口高度，默认为550
	 */
    function _openTaskApprove(paramsStr,w,h){
		w = w || workflow.page.task.approve.w;
		h = h || workflow.page.task.approve.h;
		top.getDlg(workflow.page.task.approve.url+"?"+paramsStr, 
				workflow.page.task.approve.id, 
				getLanguageValue(workflow.page.task.approve.key), 
				w , h);
	}
    /**
	 * 打开流程选人窗口
	 * @param paramsStr url中的参数
	 * @param w 窗口宽度，默认为400
	 * @param h 窗口高度，默认为200
	 */
    function _openChooseUser(paramsStr,w,h){
    	w = w || workflow.page.chooseUser.w;
		h = h || workflow.page.chooseUser.h;
		top.getDlg(workflow.page.chooseUser.url+"?"+paramsStr, 
				workflow.page.chooseUser.id, 
				getLanguageValue(workflow.page.chooseUser.key,"选人办理"), 
				w , h);
    }
    /**
     * 删除流程实例
     * @param proInstIds 流程实例ID数组
     * @returns
     */
    function _deleteWorkflowInstance(proInstIds,callback){
    	var params = {"proInstIds":proInstIds};
	  	$.ajax({
	  		type: "POST",
    		contentType:Workflow.fn.config.contentType_json,
    		url: Workflow.fn.URL.instance.remove,
    	    data:JSON.stringify(params),
    	    dataType: "json",
			success: function(result){
				if(callback != void 0 ){
					callback(result);
			   }
		   }
		});
    }
	/**
	 * 获取业务名称下拉列表数据，返回数据格式如下:
	 * 正常情况：{"status":1,"code":"200","msg":"ok","rows":[{"processKey":"流程key","processName":"流程名称","processName-Key":"流程名称(流程key)"}]} 
	 * 发生错误：{"status":-1,"code":"错误编码","msg":"错误信息"}
	 * @param callback 成功回调函数
	 **/
	function _getWorkflowNameList(callback){
		$.ajax({
		   type: "POST",
		   url: workflow.URL.deploy.getWorkflowNameList,
		   dataType:"json",
		   success: function(result){
			   if(callback != void 0 ){
					callback(result);
			   }
		   }
		});
	}
	/**获取流程图
	 * @param businessKey 业务数据ID，获取给定业务数据所对应流程实例的流程图
	 * @param proInstId 流程实例ID，获取该流程实例所对应的流程图
	 * @param processId 流程定义ID，获取给定流程ID的流程图
	 * @param processKey 流程定义Key，获取该流程Key对应的最新部署版本的流程图
	 * @param callback 回调函数
	 */
	function _getWorkflowChart(businessKey,proInstId,processId,processKey,deploymentId,callback) {
		businessKey=businessKey=="undefined"?"":(businessKey||"");
		proInstId=proInstId=="undefined"?"":(proInstId||"");
		processId=processId=="undefined"?"":(processId||"");
		processKey=processKey=="undefined"?"":(processKey||"");
		deploymentId=deploymentId=="undefined"?"":(deploymentId||"");
		if(!businessKey && !proInstId && !processId && !processKey && !deploymentId){
			return false;
		}
		
		//获取流程图
		var imageUrl = workflow.URL.deploy.getWorkflowChart+"?businessKey="+businessKey+"&proInstId="+proInstId+"&processId=" + processId +"&processKey="+processKey+"&deploymentId="+deploymentId;
		imageUrl = addTokenForUrl(imageUrl);
		$('#workflowImg').attr('src', imageUrl);
		
		//封装流程中的节点信息
		var param = {
			"businessKey":businessKey,
			"proInstId":proInstId,
			"processId":processId,
			"processKey":processKey,
			"deploymentId":deploymentId
		};
		$.ajax({
			url:workflow.URL.instance.getTraces,
			data:param,
			method: "post",
		    dataType: "json",
		    success:function(result){
		    	if(result.status == -1){
		    		return;
		    	}
		    	var datas = result.data;
		    	var positionHtml = "";
		    	var varsArray = new Array();
		    	//在流程图上标注节点信息
	    	  $.each(datas, function(i, v) {
	              var positionDiv = $('<div/>', {
	                  'class': 'activity-attr'
	              }).css({
	                  position: 'absolute',
	                  left: (v.x - 1),
	                  top: (v.y - 1),
	                  width: (v.width - 2),
	                  height: (v.height - 2),
	                  backgroundColor: 'black',
	                  opacity: 0,
	                  zIndex: $.fn.qtip.zindex - 1
	              });
	              // 节点边框
	              var border = $('<div/>', {
	                  'class': 'activity-attr-border'
	              }).css({
	                  position: 'absolute',
	                  left: (v.x ),
	                  top: (v.y - 1),
	                  width: (v.width ),
	                  height: (v.height+2 ),
	                  zIndex: $.fn.qtip.zindex - 2
	              });
	              if (v.currentActiviti) {//当前待办节点 红色边框
	                  border.addClass('ui-corner-all-12').css({
	                      border: '4px solid #FF0000'
	                  });
	              }
	              if (v.endActiviti) {//已办节点，绿色边框
	              	border.addClass('ui-corner-all-12').css({
	              		border: '4px solid #00DD00'
	              	});
	              }
	              positionHtml += outerHtml(positionDiv) + outerHtml(border);
	              varsArray[varsArray.length] = v.vars;
	          });
	      	
	      	$('#processImageBorder').append(positionHtml);
	      	 // 设置每个节点的data
	          $('.activity-attr').each(function(i, v) {
	              $(this).data('vars', varsArray[i]);
	          });
	      	// 此处用于显示每个节点的信息，如果不需要可以删除
	          $('.activity-attr').qtip({
	              content: function() {
	                  var vars = $(this).data('vars');
	                  var tipContent = "<table class='need-border' style='font-size:12px;'>";
	                  $.each(vars, function(varKey, varValue) {
	                      if (varValue) {
	                    	  tipContent += "<tr><td class='label' style='width:75px;vertical-align:top;'>" + varKey + "：</td><td style='border-bottom:1px solid;'>" + varValue + "<td/></tr>";
	                      }
	                  });
	                  tipContent += "</table>";
	                  return tipContent;
	              },
	              position: {
	                  at: 'bottom left',
	                  target: 'mouse'
	              }
	          });
		    }
		});
		/**
		 * 描述：实现标注js的InnerHtML
		 * @param obj
		 * @returns
		 */
		function outerHtml(obj){
		    $this = obj;
		    var h = $this.html();
		    var s = $this.wrap("<div></div>").parent().html();
		    $this.empty().html(h);
		    $this.unwrap();
		    return s;
		}
	}
	/**
	 * 根据流程实例ID或业务数据ID获得业务流程所配置的业务信息页面URL全局变量，或根据任务ID获取任务节点所配置的业务信息页面URL。
	 * 	当taskId不为空时：
	 * 		如果参数isGlobal的值为false，表示需要获取任务节点配置的业务数据页面URL;
	 * 		如果参数isGlobal的值为true，表示需要获取流程所配置的业务信息页面URL全局变量
	 * @param proInstId 流程实例ID
	 * @param businessKey 流程实例业务数据ID
	 * @param taskId  流程任务ID
	 * @param isGlobal 是否查询全局配置的URL，默认为false，taskId不为空时有效
	 * @return JSON对象  正常情况：{"status":1,"code":"200","msg":"ok","data":"URL"} 
	 * 			        发生错误：{"status":-1,"code":"错误编码","msg":"错误信息"}
	 */
	function _loadBusinessPage(taskId,businessKey,proInstId,isGlobal,callback) {
		if(callback == void 0 ){
			return;
	    }
		businessKey=businessKey=="undefined"?"":(businessKey||"");
		proInstId=proInstId=="undefined"?"":(proInstId||"");
		taskId=taskId=="undefined"?"":(taskId||"");
		isGlobal=isGlobal=="undefined"?false:(isGlobal||false);
		if(!businessKey && !proInstId && !taskId){
			return;
		}
		$.ajax({
			type: "POST",
			url: workflowURLPath+"instance/getBusinessPageUrl.do",
			data: {"taskId":taskId,"businessKey":businessKey,"proInstId":proInstId,"isGlobal":isGlobal},
			dataType:"json",
			success: function(result){
				if (result.status==-1) {
					callback(result);
					return;
				}
				//处理URL
				var businessPageUrl = result.data || "";
				if( businessPageUrl!="" ){
					if(!(businessPageUrl.indexOf("http://")!=-1 || businessPageUrl.indexOf("https://")!=-1)){
						businessPageUrl = getRootPath() + "/"+businessPageUrl;
					}
				}
				result.data=businessPageUrl;
				callback(result);
			}
		});
	}
	/**
	 * 查看指定流程实例的历史审批信息，历史审批信息记录按照审批时间倒序排列
	 * @param businessKey 业务数据ID
	 * @param proInstId 流程实例ID
	 * @param callback 成功回调函数
	 * 
	 * @return JSON对象  正常情况：{"success":1,"code":"200","msg:"ok",rows:[{历史审核记录}]} 
	 * 			          发生错误：{"success":-1,"code":"错误编码","msg":"错误信息",rows:[]} 
	 *  历史审核记录封装格式如下：
	 *  {
	 *  	taskId 任务ID
	 *  	taskName 任务名称		
	 * 		approveUser 审核人 
	 * 		approveUserName 审核人
	 * 		approveTime 审核时间 
	 *  	auditContent 审核内容
	 *  	remark备注
	 *  }
	 */
	function _getWorkflowComments(businessKey,proInstId,callback){
		if(callback == void 0 ){
			return;
	    }
		businessKey=businessKey=="undefined"?"":(businessKey||"");
		proInstId=proInstId=="undefined"?"":(proInstId||"");
		if(!businessKey && !proInstId){
			return;
		}
		$.ajax({
		   type: "POST",
		   url: workflowURLPath+"instance/getComments.do",
		   data: {"businessKey":businessKey,"proInstId":proInstId},
		   dataType:"json",
		   success: function(result){
			   if(callback != void 0 ){
					callback(result);
			   }
		   }
		});
	}
	/**
	 * 加载审批记录
	 * @param datagridID
	 * @param data
	 * @returns
	 */
	function _loadDatagridComments(datagridID,data){
		$("#"+datagridID).datagrid({
			rownumbers : true,
			pagination : false,
			nowrap:false,
			height : $("#businessInfo").height(),
			columns : [ [ {
				field : 'taskName',
				title : getLanguageValue('workflow.taskName'),
				width : 120
			}, {
				field : 'approveUserName',
				title : getLanguageValue('workflow.taskApproveUserName'),
				width : 80,
				align:"center"
			}, {
				field : 'approveTime',
				title : getLanguageValue('workflow.approveTime'),
				width : 200,
				align:"center"
			}, {
				field : 'auditContent',
				title : getLanguageValue('workflow.approveAuditContent'),
				width : 250,
				align:"center"
			} ] ]
		});
		$("#"+datagridID).datagrid("loadData",data);
	}

	/**
	 * 任务传阅（抄送）
	 * @param taskId 要传阅的任务ID
	 * @param toUsers 要传阅的用户ID字符数组["ID1","ID2"]
	 * @param remark 传阅备注
	 * @param callback 回调函数
	 * @returns
	 */
	function _taskCopyToUsers(taskId,toUsers,remark,callback){
		var params = {
			"taskId":taskId,
			"toUsers":toUsers,
			"remark":remark
		};
		$.ajax({
			type: "POST",
			contentType:workflow.config.contentType_json,
			url: Workflow.fn.URL.carbon.copyTo,
			data: JSON.stringify(params),
			dataType:"json",
		    success: function(result){
		    	//调用回调函数
		    	if(callback != void 0 ){
					callback(result);
					return;
			    }
		    	if(result.status==-1){
					//传阅失败，服务器返回异常：result.code异常编码 result.msg异常描述
					top.showAlert(getLanguageValue('tip'), getLanguageValue('workflow.copyToFailed')+result.msg, 'info');
					return;
				}else{
					//传阅成功
					top.showAlert(getLanguageValue('tip'), getLanguageValue('workflow.copyToSuccess'), 'info');
					return;
				}
		    }
		 });
	}
	/**
	 * 审阅任务
	 * @param carbonId 任务传阅ID
	 * @param comment 审阅内容
	 * @param callback 回调函数
	 * @returns
	 */
	function _taskCopyRead(carbonId,comment,callback){
		var params = {"carbonId":carbonId,"comment":comment};
		$.ajax({
			type: "POST",
			contentType:workflow.config.contentType_json,
			url: Workflow.fn.URL.carbon.read,
			data: JSON.stringify(params),
			dataType:"json",
		    success: function(result){
		    	//调用回调函数
		    	if(callback != void 0 ){
					callback(result);
					return;
			    }
		    }
		});
	}
	/**
	 * 方法描述：根据流程任务ID查询该任务节点的流转线路信息
	 * @param taskId  流程任务ID
	 * @param callback 成功回调函数
	 * @return JSON对象  正常情况：{"status":1,"code":"200","msg":"ok","data":{信息封装对象}} 
	 * 				    发生错误：{"status":-1,"code":"错误编码","msg":"错误信息"}
	 * data封装格式如下：
	 *   {
	 *    	"current":{节点属性JSON格式},
	 *    	"outflows":{
	 *    		"线路ID1":{"outflowId":线路ID,"outflowName":"线路名称","pass":"是否通过true/false","chooseUser":"是否需要选人true/false","target":{线路目标节点属性JSON格式}},
	 * 			"线路ID2":{"outflowId":线路ID,"outflowName":"线路名称","pass":"是否通过true/false","chooseUser":"是否需要选人true/false","target":{线路目标节点属性JSON格式}}
	 *    	}
	 *   }
	 * 节点属性JSON格式如下：
	 * 	{
	 * 		"id":"任务节点ID",
	 * 		"name":"任务节点名称",
	 * 		"documentation":{
	 *			"allowRejectToFirst":"是否允许驳回至第一个节点（即发起人节点）true/false",
	 *   		"chooseUser":"是否需要选人true/false",
	 *   		"chooseUserVariable":"选人的变量",
	 *   		"chooseUserType":"选人类型",
	 *   		其他自定义变量
	 * 		}
	 * 	}
	 */
	function _getCurrentTaskNodeOutflows(taskId,callback){
		var params = {"taskId":taskId};
		$.ajax({
		   type: "GET",
		   url: Workflow.fn.URL.task.getOutflows,
		   data: params,
		   dataType: "json",
		   success: function(result){
			   if(callback != void 0 ){
					callback(result);
			   }
		   }
		});
	}
	/**
	 * 获取流程实例详情信息,返回数据格式如下：
	 * @return JSON对象  正常情况：{"status":1,"code":"200","msg":"ok","data":"流程实例"} 
	 * 				    发生错误：{"status":-1,"code":"错误编码","msg":"错误信息"}
	 * @param businessKey 业务主键，和proInstId有一个不为空
	 * @param proInstId 流程实例ID，和businessKey有一个不为空
	 * @param callback 回调函数
	 */
	function _getWorkflowInstanceDetail(businessKey,proInstId,callback){
		$.ajax({
			type: "POST",
			url: Workflow.fn.URL.instance.getDetail,
			data: {"businessKey":businessKey,"proInstId":proInstId},
			dataType:"json",
			async: false,
			success: function(result){
				if(callback != void 0 ){
					callback(result);
				}
			}
		});
	}
	/**
	 * 根据业务主键查询流程实例是否存在，返回数据格式如下:
	 * @return JSON对象  正常情况：{"status":1,"code":"200","msg":"ok","data":true/false} 
	 * 				    发生错误：{"status":-1,"code":"错误编码","msg":"错误信息"}
	 * @param businessKey 业务主键
	 * @param callback 回调函数
	 */
	function _isExistsWorkflow(businessKey,callback){
		$.ajax({
			type: "GET",
			url: Workflow.fn.URL.instance.isExist,
			data: {"businessKey":businessKey},
			dataType:"json",
			async: false,
			success: function(result){
				if(callback != void 0 ){
					callback(result);
				}
			}
		});
	}
	/**
	 * 发起流程，返回数据格式如下：
	 * @return JSON对象  正常情况：{"status":1,"code":"200","msg":"ok","data":"流程实例ID"} 
	 * 				    发生错误：{"status":-1,"code":"错误编码","msg":"错误信息"}
	 * 		流程已存在返回值:{"status":-1,"code":"PW02020","msg":"流程实例已经存在！"}
	 * @param businessKey 业务主键 必填参数
	 * @param processKey 要启动的流程定义Key，对应工作流配置文件的ID ,默认使用最新部署版本流程，必填参数
	 * @param subject 主题 选填参数 默认为空字符
	 * @param autoPassFirstNode 是否自动审核第一个流程任务节点,false不审核,true审核 选填参数 默认false不审核
	 * @param auditContent 自动审核第一个任务节点时的流程意见 选填参数 默认为空字符
	 * @param callback 回调函数 选填参数 默认无回调函数
	 * @param flowVars 流程启动变量JSON，格式如{"param1":"","param2":""} 选填参数
	 */
	function _startWorkflow(businessKey,processKey,subject,autoPassFirstNode,auditContent,callback,flowVars){
		if( businessKey == void 0 || typeof(businessKey) == "undefined"){
			top.showAlert(getLanguageValue('tip'), "param businessKey should not be empty!", 'info');
			return;
		}
		if( processKey == void 0 || typeof(processKey) == "undefined"){
			top.showAlert(getLanguageValue('tip'), "param processKey should not be empty!", 'info');
			return;
		}
		//参数预处理
		if(true==autoPassFirstNode|| 'true'==autoPassFirstNode){
			autoPassFirstNode = true;
		}else{
			autoPassFirstNode = false;
		}
		if( subject == void 0 || typeof(subject) == "undefined"){
			subject = "";
		}
		if( auditContent == void 0 || typeof(auditContent) == "undefined"){
			auditContent = "";
		}
		flowVars = flowVars||{};
		flowVars["auditContent"] = auditContent;
		//流程启动参数 (json对象)
		var initParamsVars = {
			"businessKey": businessKey,//业务主键
			"processKey": processKey,//工作流key
			"proInstName": subject,//流程主题
			"autoPassFirstNode": autoPassFirstNode ,//是否自动审核第一个流程任务节点
			"flowVars":flowVars  //其他流程变量
		};
		$.ajax({
			type: "POST",
			contentType:workflow.config.contentType_json,
			url: Workflow.fn.URL.instance.startWorkflow,
			data: JSON.stringify(initParamsVars),
			dataType:"json",
			success: function(result){
			if(callback != void 0 ){
					callback(result);					
				}
			}
		});
	}
	function _taskIsCanWithdraw(taskId,callback){
		var params = {"taskId" : taskId};
		$.ajax({
			type : "POST",
			url : Workflow.fn.URL.task.isCanWithdraw,
			data : params,
			dataType : "json",
			success : function(result) {
				if(callback != void 0 ){
					callback(result);
					return;
				}
			}
		});
	}
	/**
	 * 撤回任务
	 * @param taskId
	 * @param callback
	 * @returns
	 */
	function _taskWithdraw(taskId,callback){
		var params = {"taskId" : taskId};
		$.ajax({
			type : "POST",
			url : Workflow.fn.URL.task.withdraw,
			data : JSON.stringify(params),
			dataType : "json",
			contentType:workflow.config.contentType_json,
			success : function(result) {
				if(callback != void 0 ){
					callback(result);
					return;
				}
				if (result.status==-1){
					top.showAlert(getLanguageValue("error"), result.msg, 'error');
				}else{
					top.showAlert(getLanguageValue("tip"), "流程撤回成功", 'info',function() {
					});
				}
			}
		});
	}
	/**
	 * 转办任务
	 * @param taskIds
	 * @param toUsers
	 * @param remark
	 * @param callback
	 * @returns
	 */
	function _taskTransfer(taskIds,toUsers,remark,callback){
		var params = {
			"taskIds":taskIds,
			"toUsers":toUsers,
			"remark":remark
		};
		$.ajax({
			type : "POST",
			url : Workflow.fn.URL.task.transfer,
			data : JSON.stringify(params),
			dataType : "json",
			contentType:workflow.config.contentType_json,
			success : function(result) {
				if(callback != void 0 ){
					callback(result);
					return;
				}
				if (result.status==-1){
					top.showAlert(getLanguageValue("error"), result.msg, 'error');
				}else{
					top.showAlert(getLanguageValue("tip"), "流程转办成功", 'info');
				}
			}
		});
	}
	/**
	 * 催办任务
	 * @param taskIds
	 * @param callback
	 * @returns
	 */
	function _taskRemind(taskIds,callback){
		var params = {"taskIds" : taskIds};
		$.ajax({
			type : "POST",
			url : Workflow.fn.URL.task.remind,
			data : JSON.stringify(params),
			dataType : "json",
			contentType:workflow.config.contentType_json,
			success : function(result) {
				if(callback != void 0 ){
					callback(result);
					return;
				}
				if (result.status==-1){
					top.showAlert(getLanguageValue("error"), result.msg, 'error');
				}else{
					top.showAlert(getLanguageValue("tip"), "流程催办成功", 'info');
				}
			}
		});
	}
	/**
	 * 用户是否可以审核指定业务的流程，返回数据格式如下：
	 * @return JSON对象  正常情况：{"status":1,"code":"200","msg":"ok","data":"-1/可审核的任务节点ID"} 
	 * 				       发生错误：{"status":-1,"code":"错误编码","msg":"错误信息"}
	 * @param businessKey 业务主键
	 * @param callback 回调函数
	 */
	function _taskIsCanApprove(businessKey,callback){
		$.ajax({
			type: "POST",
			url: Workflow.fn.URL.task.isCanApprove,
			data: {"businessKey":businessKey},
			dataType:"json",
			async: false,
			success: function(result){
				if(callback != void 0 ){
					callback(result);
				}
			}
		});
	}
	/**
	 * 审批任务
	 * @param taskId
	 * @param flowVars
	 * @param callback
	 * @returns
	 */
	function _taskApprove(taskId,flowVars,callback){
		var params = {
			"taskId":taskId,
			"flowVars" : flowVars
		}
		$.ajax({
			type : "POST",
			url : Workflow.fn.URL.task.approve,
			data : JSON.stringify(params),
			dataType : "json",
			contentType:workflow.config.contentType_json,
			success : function(result) {
				if(callback != void 0 ){
					callback(result);
					return;
				}
			}
		});
	}
	/**
	 * 获取流程任务节点信息，返回数据格式如下：
	 * @return JSON对象  正常情况：{"status":1,"code":"200","msg":"ok","data":流程任务详情信息} 
	 * 			         发生错误：{"status":-1,"code":"错误编码","msg":"错误信息"}
	 * @param taskId 流程任务ID
	 * @param callback 成功回调函数
	 */
	function _getTaskDetail(taskId,callback){
		$.ajax({
			type: "GET",
			url: Workflow.fn.URL.task.getDetail,
			data: {"taskId":taskId},
			dataType:"json",
			success: function(result){
			   if(callback != void 0 ){
					callback(result);
			   }
			}
		});
	}
	/**
	 * 查询用户是否存在委托
	 * @param params
	 * @returns
	 */
    function _isExistsDelegate(params,callback){
    	var params = params || {};
    	$.ajax({
    		type: "POST",
    		contentType:Workflow.fn.config.contentType_json,
    		url: Workflow.fn.URL.delegate.isExist,
    		dataType:"json",
    		data:JSON.stringify(params),
    		async: false,
    		success: function(result){
    			if(callback != void 0 ){
    				callback(result);
    			}
    		}
    	});
    }
    /**
	 * 获取委托信息
	 * @param params
	 * @returns
	 */
    function _getDelegate(delegateId,callback){
    	var params = {"oid":delegateId};
    	$.ajax({
    		url: Workflow.fn.URL.delegate.get,
    	    method: "post",
    	    dataType: "json",
    	    data:params,
    	    success: function(result){
    	    	if(callback != void 0 ){
    				callback(result);
    			}
    	    }
    	 });
    }
    
    /**
     * 保存委托信息
     * @param params
     * @param callback
     * @returns
     */
    function _addDelegate(params,callback){
    	$.ajax({
    		type: "POST",
    		contentType:Workflow.fn.config.contentType_json,
    		url: Workflow.fn.URL.delegate.add,
    	    data:JSON.stringify(params),
    	    dataType: "json",
    	    success: function(result){
    	    	if(callback != void 0 ){
    				callback(result);
    			}
    	    }
    	 });
    }
    /**
     * 更新用户委托信息
     * @param params
     * @param callback
     * @returns
     */
    function _updateDelegate(params,callback){
    	$.ajax({
    		type: "POST",
    		contentType:Workflow.fn.config.contentType_json,
    		url: Workflow.fn.URL.delegate.update,
    	    data:JSON.stringify(params),
    	    dataType: "json",
    	    success: function(result){
    	    	if(callback != void 0 ){
    				callback(result);
    			}
    	    }
    	 });
    }
    /**
     * 取消用户委托
     * @param delegateId
     * @param callback
     * @returns
     */
    function _cancelDelegate(delegateId,callback){
    	var params = {"oid":delegateId};
    	$.ajax({
    		type: "POST",
    		contentType:Workflow.fn.config.contentType_json,
    		url: Workflow.fn.URL.delegate.cancel,
    	    data:JSON.stringify(params),
    	    dataType: "json",
			success: function(result){
				if(callback != void 0 ){
    				callback(result);
    			}
			}
		});
    }
    /**
     * 保存流程模型信息
     * @param params
     * @param callback
     * @returns
     */
    function _addModel(params,callback){
    	$.ajax({
    		type: "POST",
    		contentType:Workflow.fn.config.contentType_json,
    		url: Workflow.fn.URL.model.add,
    	    data:JSON.stringify(params),
    	    dataType: "json",
    	    success: function(result){
    	    	if(callback != void 0 ){
    				callback(result);
    			}
    	    }
    	 });
    }
    /**
     * 更新模型信息
     * @param params
     * @param callback
     * @returns
     */
    function _updateModel(params,callback){
    	$.ajax({
    		type: "POST",
    		contentType:Workflow.fn.config.contentType_json,
    		url: Workflow.fn.URL.model.update,
    	    data:JSON.stringify(params),
    	    dataType: "json",
    	    success: function(result){
    	    	if(callback != void 0 ){
    				callback(result);
    			}
    	    }
    	 });
    }
    /**
     * 删除模型信息
     * @param modelIds 模型ID集合
     * @param callback
     * @returns
     */
    function _deleteModel(modelIds,callback){
    	var params = {"modelIds":modelIds};
    	$.ajax({
    		type: "POST",
    		contentType:Workflow.fn.config.contentType_json,
    		url: Workflow.fn.URL.model.remove,
    	    data:JSON.stringify(params),
    	    dataType: "json",
    	    success: function(result){
    	    	if(callback != void 0 ){
    				callback(result);
    			}
    	    }
    	 });
    }
    /**
     * 获取一个模型信息
     * @param modelId 模型ID
     * @param callback
     * @returns
     */
    function _getModel(modelId,callback){
    	var params = {"modelId":modelId};
    	$.ajax({
    		type: "get",
    		contentType:Workflow.fn.config.contentType_json,
    		url: Workflow.fn.URL.model.get,
    	    data:params,
    	    dataType: "json",
    	    success: function(result){
    	    	if(callback != void 0 ){
    				callback(result);
    			}
    	    }
    	 });
    }
    /**
     * 部署模型信息
     * @param modelIds 模型ID集合
     * @param callback
     * @returns
     */
    function _deployModel(modelIds,callback){
    	var params = {"modelIds":modelIds};
    	$.ajax({
    		type: "POST",
    		contentType:Workflow.fn.config.contentType_json,
    		url: Workflow.fn.URL.model.deploy,
    	    data:JSON.stringify(params),
    	    dataType: "json",
    	    success: function(result){
    	    	if(callback != void 0 ){
    				callback(result);
    			}
    	    }
    	 });
    }
    
    Workflow.fn.init.prototype = Workflow.fn;
    return Workflow;
})();

var workflow = Workflow();



/**
 * 返回根据正则表达式进行所有文字替换后的字符串的复制
 * @param string 字符串表达式包含要替代的子字符串
 * @param reallyDo 被搜索的子字符串
 * @param replaceWith 用于替换的子字符串
 */
String.prototype.replaceAll = function(reallyDo, replaceWith, ignoreCase){
    if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
        return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi": "g")), replaceWith);
     } else {
        return this.replace(reallyDo, replaceWith);
     }
};


/**
 * 隐藏业务页面的业务相关元素
 */
function disableBusinessPageContent(){
	var iframeContent = $("#businessInfoFrame")[0].contentWindow;
	//将easyui-combobox元素置为不可用状态
	var comboxObj ;
	try{
		comboxObj= iframeContent.$(".easyui-combobox");
	}catch(e){}
	if(comboxObj){
		comboxObj.each(function(i){
			iframeContent.$(this).combobox('disable');
		});
	}
	//将easyui-combotree元素置为不可用状态
	var combotreeObj;
	try{
		combotreeObj = iframeContent.$(".easyui-combotree");
	}catch(e){}
	if(combotreeObj){
		combotreeObj.each(function(i){
			iframeContent.$(this).combotree('disable');
		});
	}
	//将input元素置为不可用状态
	var inputAndSelect;
	try{
		inputAndSelect = iframeContent.$(":input");
	}catch(e){}
	if(inputAndSelect){
		inputAndSelect.each(function(i){
			iframeContent.$(this).attr("disabled", "disabled");
		});
	}
	disableBusinessPageButton(1);
}
/**
 * 隐藏业务页面的业务相关按钮
 */
function disableBusinessPageButton(i){
	if(i<10){
		var iframeContent = $("#businessInfoFrame")[0].contentWindow;
		//将button元素置为不可用状态
		var buttonObj;
		try{
			buttonObj = iframeContent.$(":button");
		}catch(e){}
		if(buttonObj){
			buttonObj.each(function(i){
				iframeContent.$(this).attr("disabled", "disabled");
			});
		}
		//将easyui-linkbutton元素置为不可用状态
		try{
			buttonObj = iframeContent.$(".easyui-linkbutton");
		}catch(e){}
		if(buttonObj){
			buttonObj.each(function(i){
				if($(this).attr("iconcls")!='icon-download'){
					$(this).attr("disabled", "disabled");
				}
			});
		}
		i++;
		setTimeout("disableBusinessPageButton("+i+")",200);
	}
}

/**
 * 关闭弹出页面
 */
function closePanel(dialogid) {
	top.closeDlg(dialogid);
}
