/**
 * 
 * 类描述: 根据配置信息加载datagrid网格。
 *
 * @author zhanggf
 * @version 1.0
 * 创建时间： 2012-08-30 上午17:46:07
 *********************************更新记录******************************
 * 版本：  1.0       修改日期：   2012-10-16       修改人： zhanggf
 * 修改内容： 
 **********************************************************************
 */
(function($) {
	/**
     * 方法描述：定义datagrid网格类并初始化类中的属性和方法。
     */
	$.jasfcFactory( "jasfc.Datagrid", {
		options: {
			functionName:'',
			functionData:null,
			divid:''
		},
		/**
		 * 方法描述：生成网格Html
		 * param param 网格字段配置参数
		 * param functionName 功能点id
		 * 
		 */
		loadGridfield : function(){
			var target =this.options.divid;
			var param =this.options.functionData;
			var functionName =this.options.functionName;
			var defaultDisplayFields =param.defaultDisplayFields;
			//获取主键字段
			var pkfield=""; 
			var idFieldArray = new Array();
			var pkFields = param.pkFields;
			if(pkFields!=null&&pkFields.length>0){
				//支持联合主键
				for(var i=0;i<pkFields.length;i++){
					pkfield+=pkFields[i].fieldID+",";
					idFieldArray.push(pkFields[i].fieldID);
				}
				pkfield=pkfield.substring(0,pkfield.length-1);
			}else{
				pkfield="EVENTID"; ////默认为EVENTID
			}
			var table ="<table id=\""+functionName+"\" width=\"98%\"</table>";
			$(table).appendTo($(target));
			var columns =[];
			var middle =[];
			
			for(var i=0;i<defaultDisplayFields.length;i++){
				if(defaultDisplayFields[i].gridcolumnhide==1){
					defaultDisplayFields[i].gridcolumnhide=true;
				}else{
					defaultDisplayFields[i].gridcolumnhide=false;
				}
				var fieldID=defaultDisplayFields[i].fieldID;
				if(defaultDisplayFields[i].formuitype=="combox"&&defaultDisplayFields[i].isPkfield!=null && defaultDisplayFields[i].isPkfield==1){
					fieldID+="Name";
				}
			    var column ={
		    		title:defaultDisplayFields[i].fieldName,
		    		sortable: true,
		    		field:fieldID,
		    		resizable:true,
		    		width:Number(defaultDisplayFields[i].gridcolumnwidth),
		    		hidden:defaultDisplayFields[i].gridcolumnhide
		    	};
			    middle.push(column);
			}
			//判断是否为联合主键
			if(pkFields!=null&&pkFields.length>1){
				//如果为联合主键，则新创建一列，并隐藏
				 var pkColumn ={
		    		title:"主键",
		    		sortable: false,
		    		field:pkfield,
		    		resizable:false,
		    		width:100,
		    		hidden:true,
		    		formatter:function(value,rowData,rowIndex){
		    			var fieldValue = "";
						for(var i=0;i<idFieldArray.length;i++){
							fieldValue+=rowData[idFieldArray[i]]+",";
						}
						fieldValue=fieldValue.substring(0,fieldValue.length-1);
						rowData[pkfield] = fieldValue;
						return fieldValue;
					}
		    	};
				 middle.push(pkColumn);
			}
			columns.push(middle);
			var url ="../getBusinessDataList.do";
			var queryParam ={"functionName":functionName};
			
			this.loadDataGrid(param.i18related.datalist,columns,pkfield,functionName,url,queryParam,param);
		},
		/**
		 * 方法描述：初始化网格数据
		 * param title 网格title
		 * param functionName 功能编号
		 * param url 网格数据加载请求
		 * param queryParam 网格数据加载默认查询条件
		 * param functionConfig 功能配置信息
		 */
		loadDataGrid : function(title,columns,pkfield, functionName,url,queryParam,functionConfig){
			$("#"+functionName).datagrid({
				url:url,
				title:title,
				idField:pkfield,
				pageSize:10,
				pageList:[10,15,20,50],
				striped: true,
				collapsible:true,
				autoRowHeight: false,
				singleSelect:false,
				remoteSort:true,
				frozenColumns:[[
	                {field:'ck',checkbox:true}
	    		]],
				queryParams:queryParam,
				pagination:true,
				rownumbers:true,	
				columns:columns,
				toolbar:"#toobar",
				onLoadSuccess:function(data){
				//	$(".datagrid-header-check input").attr("checked",false);
			    	$('#'+functionName).datagrid('clearSelections'); //clear selected options
			    },
			    //双击数据查看
				onDblClickRow:function(index, row){
					//按钮权限
					var comandConfig =functionConfig.commandsConfig;
					var detailtitle ='';
					for(var i=0;i<comandConfig.length;i++){
						//查看按钮国际化
						if(comandConfig[i].privilegeNumber ==4){
							detailtitle = comandConfig[i].parentName;
							break;
						}
					}
				    var detailFields =functionConfig.detailFields;
				    var pkfield = $('#' + functionName).datagrid('options').idField;
				    var  businessDataId=row[pkfield];
					var masterFieldValue=eval('row\.'+functionConfig.masterRelatedField);
					var url ="detailHtml.htm?functionName="+functionName + "&pkfield=" + pkfield+"&businessDataId="+encodeURI(encodeURI(businessDataId))+"&masterFieldValue="+masterFieldValue+"&title="+detailtitle;
					var detailsize =Math.ceil(detailFields.length/2+1)*40;
					//上传附件
					if(functionConfig.hasattachment ==1){
						detailsize +=60;
					}
					//支持空间要素
					if(functionConfig.geometrytype!='none'){
						detailsize +=100;
					}
					if(functionConfig.ishasrelated==1){
						detailsize +=65;
					}
					if(detailsize > 500)
						detailsize==500;
					top.getDlg(url,"view",detailtitle,600,detailsize+10,false);
				},
				onCheck:function(index, row){
					$('#update').prop("disabled",false);
					$('#delete').prop("disabled",false);
					$('#stateWorkFlow').prop("disabled",false);
					var rows = $('#' + functionName).datagrid('getSelections');
					var flag =false;
					if(functionConfig.hasworkflow==1){
						isExistsWorkflow(row.EVENTID,function(result){
							if(result.success){
								if(result.isExists==1){
									flag =true;
									return;
									
								}
							}
						});
					}
					for(var i=0;i<rows.length;i++){
						if(functionConfig.hasworkflow==1){
							isExistsWorkflow(rows[i].EVENTID,function(result){
								if(result.success){
									if(result.isExists==1){
										flag =true;
										return;
										
									}
								}
							});
						}
					}
					if(flag){
						$('#update').linkbutton('disable');
						$('#delete').linkbutton('disable');
						$('#stateWorkFlow').linkbutton('disable');
					}
				},
				onUncheck:function(index, row){
					$('#update').linkbutton('enable');
					$('#delete').linkbutton('enable');
					$('#stateWorkFlow').linkbutton('enable');
					var flag =false;
					var rows = $('#' + functionName).datagrid('getSelections');
					for(var i=0;i<rows.length;i++){
						if(functionConfig.hasworkflow==1 && rows[i].EVENTID!=row.EVENTID){
							isExistsWorkflow(rows[i].EVENTID,function(result){
								if(result.success){
									if(result.isExists==1){
										flag=true;
										return;
									}
								}
							});
						}
					}
					if(flag){
						$('#update').attr('disabled','disabled');
						$('#delete').attr('disabled','disabled');
						$('#stateWorkFlow').attr('disabled','disabled');
					}
				}
			});
			//列表查询页面自适应窗口大小改变
			initDatagrigHeight(functionName,'queryDiv',$('#queryDiv').height());
		}
	});
})(jQuery);


