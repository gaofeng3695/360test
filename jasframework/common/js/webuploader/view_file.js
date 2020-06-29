/** 
 * @file
 * @author  lizhenzhen
 * @desc  查看上传的文件列表与操作
 * @date  2017-10-11 
 * @last modified by lizz
 * @last modified time  2017-11-23 
 */

/**
 * @desc 文件列表信息
 * @desc getFileListInfo 参数顺序即描述 
 *  
 * @param oid  业务id
 * @param viewOrUpdate  区别是查看还是修改
 * @param moduleCode  子系统业务模块名,不传后台默认值为"default"  在修改页面调用该参数，该参数可以为一个对象，用于存放继续上传的新文件的配置处理
 * @param picAndFileSort  图片和附件的上传顺序标识
 * @param fileId		自定义附件显示位置id
 * @param businessType  附件的业务含义  可以为空
 * @param zipFileName   自定义压缩包的名字  不传为businessType的值
 * @param callbackFunn  当条数据执行完成的回调
 */

function getFileListInfo(oid,viewOrUpdate,moduleCode,picAndFileSort,fileId,businessType,zipFileName,callbackFunn){
	var bsType = businessType?businessType:"";
	//var zipName = zipFileName ? encodeURI(zipFileName):businessType;
	var zipName = zipFileName ? zipFileName:"";
	if (isNull(fileId)) {
		fileId = 'viewFileContainer';
    }
	$.ajax({
//		url: rootPath+"attachment/getInfo.do?businessId="+oid+"&businessType=file"+"&fileType=" + bsType, //业务唯一性验证
		url: rootPath+"attachment/getInfo.do?businessId="+oid+"&businessType="+ bsType+"&fileType=file" , //业务唯一性验证
	    type: "get",
	    dataType: "json",
	    async:false,
	    success:function(data){
	    	if(data.status == 1){
	    		var fileList = data.rows;
	    		var tableHTML = '<table class="file-detail-table">\
					<tr class="detail-head">\
						<th>文件名称</th><th>文件大小KB</th><th>文件描述</th><th class="opt-th">文件操作 <a class="download-all none" title="一键下载" onclick="downloadAll(\''+ oid +'\',\''+ zipName+'\',\''+ bsType +'\')"></a></th>\
					</tr>\
				</table>';
	    		if(viewOrUpdate == "update"){
	    			// $("#viewFileContainer").append('<div class="add-attachment again-add-btn"><div id="addFile" class="save-btn"></div><div id="againSaveFileBtn" style="display:none"></div></div>');
	    			againAdd(oid,moduleCode,picAndFileSort,fileId,bsType,callbackFunn); // 添加继续
	    			if(fileList.length>0){
	    				// $(tableHTML).insertBefore($("#viewFileContainer").find(".again-add-btn"));
	    				$("#"+fileId).append($(tableHTML));
	    				$(tableHTML).addClass("aa");
	    				for(var i = 0; i < fileList.length; i++){
	    					var desc = fileList[i].fileDescription?fileList[i].fileDescription:"",
	    					    size = (fileList[i].fileSize/1024).toFixed(2);
	    					var $tr = $('<tr id="'+ fileList[i].oid+'" class="items-tr update-items">\
									<td class="file-name" title="'+ fileList[i].fileName +'">'+ fileList[i].fileName +'</td>\
									<td>'+ size +'</td>\
									<td><input type="text"  class="file-description" value="'+ desc +'"/></td>\
									<td  class="file-operate">\
										<span class="delete" title="删除"></span>\
									    <a href="'+rootPath+'attachment/download.do?oid='+ fileList[i].oid +'&token='+localStorage.getItem("token")+'">\
										<span class="download" title="下载"></span></a>\
										<span class="preview" title="预览"></span>\
									</td>\
								</tr>');
	    					$("#"+fileId+" .file-detail-table").append($tr);
	    					
			    		}
	    				
	    				$("#"+fileId+" .file-detail-table .update-items").on("click",".delete",function(){
	    					var currentTr = $(this).parent("td").parent("tr");
	    					var eId = $(currentTr).prop("id");
	    					removeFileFun($(currentTr),eId);
	    				})
	    				$("#"+fileId+" .file-detail-table .update-items").on("click",".preview",function(){
	    					var currentTr = $(this).parent("td").parent("tr");
	    					var eId = $(currentTr).prop("id");
	    					previewFile(eId);
	    					
	    				})
	    			}
	    		
	    		}else{
	    			if(fileList.length>0){
	    				$("#"+fileId).empty();
						$("#"+fileId).append(tableHTML);
						$("#"+fileId+" .file-detail-table").addClass("detail-table");
						for(var i = 0; i < fileList.length; i++){
							var desc = fileList[i].fileDescription?fileList[i].fileDescription:"",
								size = (fileList[i].fileSize/1024).toFixed(2);
						
			    			var $tr = $('<tr  id="'+ fileList[i].oid+'" class="items-tr">\
											<td title="'+ fileList[i].fileName +'">'+ fileList[i].fileName +'</td>\
											<td>'+ size  +'</td>\
											<td title="'+ desc +'" >'+ desc +'</td>\
											<td  class="file-operate">\
												<span class="download" title="下载"></span>\
												<span class="preview" title="预览"></span>\
											</td>\
										</tr>')
			    			$("#"+fileId+" .file-detail-table").append($tr);
			    		}
						
	    				
	    				$(".opt-th .download-all").removeClass("none");
						$("#"+fileId+" .items-tr .file-operate").on("click",".download",function(){
							var eId = $(this).parent(".file-operate").parent(".items-tr").prop("id");
							// console.log(eId);
							downloadFile(eId);
						})
						
						$("#"+fileId+" .items-tr .file-operate").on("click",".preview",function(){
							var eId = $(this).parent(".file-operate").parent(".items-tr").prop("id");
							// console.log(eId);
							previewFile(eId);
						})
	    			}else{
	    				$("#"+fileId).append(tableHTML);
	    			}
	    		
	    		}
	    	}
	    },
	    error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
            console.log(textStatus);
            console.log(errorThrown);
        }
	});
}

function downloadAll(businessId,zipFileName,businessType){
	if(isNull(zipFileName)){
		zipFileName = "文件"
	}
	zipFileName = encodeURI(zipFileName);
	const a = document.createElement('a');
    a.href = rootPath+"attachment/downLoadMultiFile.do?businessId="+businessId+"&businessType="+businessType+"&fileType=file&token="+localStorage.getItem("token")+"&zipFileName="+zipFileName;
    document.body.appendChild(a);
    a.click(); 
    setTimeout(function(){
    	document.body.removeChild(a);
    },1000)
}
/**
 * @desc 预览文件
 * @param eId  需要查看文件的id
 */

function previewFile(eId){
	top.getDlg(rootPath+'jasframework/common/js/webuploader/preview/pdfjs_1.10.88/web/viewer.html?oid='+ eId,"preview","预览",900,600,false,true,true);
}


/**
 * @desc 下载文件
 * @param eId  需要下载文件的id
 */
function downloadFile(eId){

	const a = document.createElement('a');
	a.href = rootPath+"attachment/download.do?oid="+eId+'&token='+localStorage.getItem("token");
    document.body.appendChild(a);
    a.click(); 
    setTimeout(function(){
    	document.body.removeChild(a);
    },1000)

}

/**
 * @desc 修改文件
 * @param callback  修改成功之后执行的回调函数
 * @param uploadBtn  触发上传的按钮
 */
function updateFileFun(callback,uploadBtn){
	if(uploadBtn){
	}else{
		uploadBtn = "#againSaveFileBtn"
	}
	var itemsTr = $(".file-detail-table").find(".update-items");
	if(itemsTr.length > 0){
		for(var i = 0; i < itemsTr.length; i++ ){
			var oid = $(itemsTr[i]).prop("id"),
				// fileName = $(itemsTr[i]).find(".file-name").val(),  // 文件名称不允许修改
				fileDescription = $(itemsTr[i]).find(".file-description").val();
			$.ajax({
				url: rootPath+"attachment/updateInfo.do", //业务唯一性验证
				type: "post",
				async:false,
				contentType: "application/json;charset=utf-8",
				dataType: "json",
			    data:JSON.stringify({
			    	  "oid":oid,
			    	// "fileName":fileName, // 文件名称不允许修改
			    	  "fileDescription":fileDescription
			    	}),
			    success:function(data){
			    	if(data.status == 1){
			    		if(i == itemsTr.length-1){
			    			//  console.log("修改文件成功");
			    			 getAgainFileLength(callback,uploadBtn)
			    		}
			    	}else{
			    		top.showAlert("提示", "保存失败", 'error');
			    	}
			    },
			    error: function (XMLHttpRequest, textStatus, errorThrown) {
		            console.log(XMLHttpRequest);
		            console.log(textStatus);
		            console.log(errorThrown);
		        }
			})
		}
	}else{
		// console.log("没有需要修改的文件信息  开始继续上传文件");
		getAgainFileLength(callback,uploadBtn)
	}
}


/**
 * @desc 根据修改页面新添加的文件数量进行相应的操作
 * @param callback  新增成功之后执行的回调函数
 * @param uploadBtn  触发上传的按钮
 */

function getAgainFileLength(callback,uploadBtn){
	var newFile = $(".file-detail-table").find(".again-add-items");
	if(newFile.length>0){ // 如果队列里面有待上传的文件，则上传
		// console.log("开始继续上传文件-----");
		$(uploadBtn).trigger("click"); 
	}else{  // 执行回调函数
		// console.log("文件修改成功--------");
//		callback();	
		var newAddPicLength = $("#picList").find(".again-add-items");
		if(newAddPicLength.length>0){
			$(uploadBtn).trigger("click"); 
		}else{
			callback();	
		}
	}
}



/**
 * @desc 继续添加文件和图片按钮，并初始化绑定事件
 * @param oid  业务id
 * @param FileObj 附件上传其它配置项的对象
 * @param moduleCode  子系统业务模块名,用于上传到KASS系统中的目录分类,不传后台默认值为"default"
 * @param picAndFileSort  图片和附件的上传顺序标识
 * @param fileId		自定义附件显示位置id
 * @param businessType  附件的业务含义  可以为空
 * @param callbackFunn  当条数据执行完成的回调
 */
function againAdd(oid,FileObj,picAndFileSort,fileId,businessType,callbackFunn){
	var baseurl = rootPath+"/attachment/upload.do",
	    fileNumLimit = 200,
	    // extensions = "doc,docx,xlsx,xls,pdf,zip,ppt,pptx",
	    extensions = "",  // 放宽文件类型
	    moduleCode = "default",
	    pickId = "addFile",
	    uploadBtn = "#againSaveFileBtn",
		folderId = "47a293b6-f60d-4163-bebb-6cbd0deae811";  // 默认的folderId
	var obj = FileObj;
	
	if(!isNull(obj) && obj.constructor == Object){  // 如果参数是一个对象  
		baseurl = obj.url?obj.url:baseurl,
	    fileNumLimit = obj.fileNumLimit?obj.fileNumLimit:fileNumLimit,
	    extensions = obj.extensions?obj.extensions:extensions,
	    moduleCode = obj.moduleCode?obj.moduleCode:moduleCode,
	    pickId = obj.pickId?obj.pickId:pickId,
	    uploadBtn = obj.uploadBtn?obj.uploadBtn:uploadBtn,
	    folderId = obj.folderId?obj.folderId:folderId;
	}else if(!isNull(obj)){  // 参数不是对象 
		 moduleCode = obj;
		 if(obj.length>20){  // 后期不要moduleCode参数时，如若传folderId，只需把folderId放在原始moduleCode的位置即可
			 folderId = obj
		 }
	}

	if(!isNull(picAndFileSort) && picAndFileSort == "1"){
		console.log("图片和附件同时存在  并且先上传附件");
		// 图片和附件同时存在  并且先上传附件
		$("#"+fileId).initializeWebUploader({
			fileType:"file",
			businessType:businessType,
			addDesc:"true",
			picAndFile:"all",
			uploadBtn:"#againSaveFileBtn",
			isUpdate:"true",
			url : baseurl,
			moduleCode:moduleCode, // 子系统业务模块名,用于上传到KASS系统中的目录分类，不传默认default
			folderId:folderId,
			fileNumLimit:fileNumLimit,  // 上传文件的个数 不传默认值为200
			extensions:extensions, // 上传文件的后缀 不传默认值为'doc,docx,xlsx,xls,pdf,zip,ppt,pptx'
			uploadBeforeFun:function(){
		    	 return oid;
			},
			uploadSuccessFun:function(){
				// 文件上传成功之后执行的
				// 开始上传图片
				updatePicFun(updateSuccessFun);
			}
		})
	}else if(!isNull(picAndFileSort)){
		console.log("图片和附件同时存在   先上传图片");
		// 图片和附件同时存在   先上传图片
		$("#"+fileId).initializeWebUploader({
			fileType:"file",
			businessType:businessType,
			addDesc:"true",
			picAndFile:"all",
			uploadBtn:"#againSaveFileBtn",
			isUpdate:"true",
			url : baseurl,
			moduleCode:moduleCode, // 子系统业务模块名,用于上传到KASS系统中的目录分类，不传默认default
			folderId:folderId,
			fileNumLimit:fileNumLimit, // 上传文件的个数 不传默认值为200
			extensions:extensions, // 上传文件的后缀 不传默认值为'doc,docx,xlsx,xls,pdf,zip,ppt,pptx'
			uploadBeforeFun:function(){
		    	 return oid;
			},
			uploadSuccessFun:function(){
				// 文件上传成功之后执行的
				if(callbackFunn){
					callbackFunn();
				}else{
					updateSuccessFun();
				}
				
			}
		})
	}else{
		$("#"+fileId).initializeWebUploader({
			fileType:"file",
			businessType:businessType,
			addDesc:"true",
//			uploadBtn:"#againSaveFileBtn",
			uploadBtn:uploadBtn,
			pickId:pickId,
			isUpdate:"true",
			url : baseurl,
			moduleCode:moduleCode, // 子系统业务模块名,用于上传到KASS系统中的目录分类，不传默认default
			folderId:folderId,
			fileNumLimit:fileNumLimit,  // 上传文件的个数 不传默认值为200
			extensions:extensions, // 上传文件的后缀 不传默认值为'doc,docx,xlsx,xls,pdf,zip,ppt,pptx'
			uploadBeforeFun:function(){
		    	 return oid;
			},
			uploadSuccessFun:function(){
				// 文件上传成功之后执行的
				if(callbackFunn){
					callbackFunn();
				}else{
					updateSuccessFun();
				}
				
			}
		})
	}
	
	
}


/**
 * @desc 删除文件 
 * @param ele 要删除的dom节点
 * @param eId  要删除的元素对应的id
 */

function removeFileFun(ele,eId){
	$.messager.confirm("提示","您确定要删除该文件吗？",function(r){
		if (r){
			$.ajax({
				url: rootPath+"attachment/delete.do?oids="+eId+"&isShiftDelFile=true&token="+localStorage.getItem("token"), //业务唯一性验证
			    type: "get",
			    dataType: "json",
			    success:function(data){
			    	if(data.status == 1){
			    		
			    		var trLength = $(ele).parent("tbody").children("tr").length;
	            		
	            		if(trLength == 2){
	            			$(ele).parent("tbody").parent("table").remove();
	            		}else{
	            			$(ele).remove(); 	
	            		}
			    		
			    	}
			    },
			    error: function (XMLHttpRequest, textStatus, errorThrown) {
		            console.log(XMLHttpRequest);
		            console.log(textStatus);
		            console.log(errorThrown);
		        }
			})
		}
	});
}



