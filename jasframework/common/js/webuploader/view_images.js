/** 
 * @file
 * @author  lizhenzhen
 * @desc  查看上传的图片列表与操作
 * @date  2017-10-11 
 * @last modified by lizz
 * @last modified time  2017-11-23
 */


/**
 * @desc 图片列表
 * @param oid  业务id
 * @param viewOrUpdate  区别是查看还是修改
 * @param addDesc  判断是否是带描述信息的
 * @param moduleCode  子系统业务模块名,用于上传到KASS系统中的目录分类,不传后台默认值为"default"
 * @param picAndFileSort  图片和附件的上传顺序标识
 * @param picId		自定义图片显示位置id
 * @param businessType 图片的业务含义
 * @param callbackFunn  当条数据执行完成的回调  查看页面用不着
 */

function getPicListInfo(oid,viewOrUpdate,addDesc,moduleCode,picAndFileSort,picId,businessType,callbackFunn){
	var bsType = businessType?businessType:"";
	var uploadBtn = "againSavePicBtn";
	var pickId = "addPicBtn";
    if (isNull(picId)) {
        picId = 'viewPicContainer';
    }
	$.ajax({
		url: rootPath+"attachment/getInfo.do?businessId="+oid+"&businessType="+ bsType +"&fileType=pic", //业务唯一性验证
	    type: "get",
	    async:false,
	    dataType: "json",
	    success:function(data){
	    	if(data.status == 1){
	    		var fileList = data.rows;
	    		if(viewOrUpdate == "update"){
	    			if(!isNull(moduleCode) && moduleCode.constructor == Object){  // 如果参数是一个对象  
	    				uploadBtn = moduleCode.uploadBtn?moduleCode.uploadBtn:uploadBtn;
	    				pickId = moduleCode.pickId?moduleCode.pickId:pickId
	    			}
	    			
	    			if(addDesc == "addDesc"){
	    				// $("#viewPicContainer").addClass("add-attachment again-add-btn");
	    				// $("#viewPicContainer").append('<div class="save-btn" id="addPicBtn"></div><div id="againSavePicBtn" style="display:none"></div>');
	    				againAddDescFun(oid,moduleCode,picAndFileSort,picId,bsType,callbackFunn); // 添加继续
	    			}else{
	    				$("#" + picId).addClass("add-list-container");
		    			$("#" + picId).append('<ul class="pic-list" id="picList'+pickId+'">\
		    											<li class="pic-btn" id="'+ pickId +'"></li>\
		    										   </ul>\
		    										   <div id="'+ uploadBtn +'" style="display:none"></div>');
		    			againAddFun(oid,moduleCode,picAndFileSort,picId,bsType,callbackFunn); // 添加继续
	    			}
	    		}else{
	    			$("#" + picId).empty();
	    			$("#" + picId).append("<ul class='pic-list' id='picList"+pickId+"'></ul>");
	    		}	
	    		
	    		if(fileList.length>0){
		    		for(var i = 0; i < fileList.length; i++){
		    			var eventid = fileList[i].oid,
		    				fileName = fileList[i].fileName,
		    				fileDescription = fileList[i].fileDescription;
		    			getImageItemsInfo(eventid,fileName,fileDescription,viewOrUpdate,addDesc,moduleCode,picId);
		    		}
	   
		    		// 绑定点击全图预览
		    		$("#" + picId+" .pic-list .list-items").on("click",".items-img",function(e){
	                    viewPicObj.viewPic(this);
		    			/*var eid = $(this).attr("data-eid");
		    			previewPic(eid);*/
	                })
		    		
	                // 绑定删除事件
				    $("#" + picId+" .pic-list .update-items").on("click",".delete",function(e){
						var lis = $(this).parent(".list-operate").parent(".list-items");
						var eId = $(lis).prop("id");
						removeImagesFun($(lis),eId);
			        })
			        
					// 删除队列中的文件
		            $("#" + picId+" .pic-desc-items").on('click', '.delete-btn', function() {
		            	var currentItems = $(this).parent(".file-operate").parent(".file-other").parent(".pic-desc-items");
		            	var dlId = $(currentItems).prop("id");
		            	removeImagesFun($(currentItems),dlId);
		            });
		            
		            // 上移
		    		$("#" + picId+" .pic-desc-items").on('click', '.up-btn', function() {
		            	var dlId = $(this).parent(".file-operate").parent(".file-other").parent(".pic-desc-items").prop("id");
		            	var objParentTR = $('#'+ dlId);
		    	        var prevTR = objParentTR.prev();
		    	        if (prevTR.length > 0) {
		    	            prevTR.insertAfter(objParentTR);
		    	        }	
		            });
		            
		            // 下移
		    		$("#" + picId+" .pic-desc-items").on('click', '.down-btn', function() {
		            	var dlId = $(this).parent(".file-operate").parent(".file-other").parent(".pic-desc-items").prop("id");
		            	var objParentTR = $('#'+ dlId);
		    		    var nextTR = objParentTR.next();
		    		    if (nextTR.length > 0) {
		    		        nextTR.insertBefore(objParentTR);
		    		    }
		            });
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


/**
 * @desc 预览文件
 * @param eId  需要查看文件的id
 */

function previewPic(eId){
	/*window.open(rootPath+'attachment/getPreviewFile.do?eventid='+ eId);*/
	top.getDlg(rootPath+'common/js/webuploader/preview/pdfjs_1.10.88/web/viewer.html?eventid='+ eId,"preview","预览",800,600,false,true,true);
}

/**
 * @desc 单张图片信息
 * @param eventid  id
 * @param fileName  文件名
 * @param fileDescription  描述信息
 * @param viewOrUpdate  区别是查看还是修改
 * @param addDesc  判断是否是带描述信息的
 * @param picId		自定义图片显示位置id
 */

function getImageItemsInfo(eventid,fileName,fileDescription,viewOrUpdate,addDesc,moduleCode,picId){
	// var itemsUrl = rootPath+"attachment/getImageBySize.do?eventid="+eventid+"&width=400&height=340&rate=0"; //业务唯一性验证
	var itemsUrl = rootPath+"attachment/getImageBySize.do?eventid="+eventid+"&token="+localStorage.getItem("token");
	var desc = fileDescription?fileDescription:"";
	var descNum = 200;

	var uploadBtn = "againSavePicBtn";
	var pickId = "addPicBtn";
	if(!isNull(moduleCode) && moduleCode.constructor == Object){  // 如果参数是一个对象  
		descNum = moduleCode.descNum?moduleCode.descNum:descNum;
	}

	var lisView = $('<li class="list-items">\
		<a class="opt-btn" href="'+rootPath+'attachment/download.do?oid='+ eventid +'&token='+localStorage.getItem("token")+'">\
			<span class="download" title="下载"></span></a>\
		<div class="items-img" data-eid="'+ eventid +'"\
		data-original="'+ itemsUrl +'" \
		style="background:url('+ itemsUrl +') no-repeat center;background-size:contain;"></div>\
		<div class="list-info" style="display: block; bottom: 0px; color: rgb(102, 102, 102); background: rgb(241, 241, 241);">\
			<p class="pic-name">'+ fileName +'</p>\
		</div>\
	</li>');
	var lisViewDesc =  $('<li class="list-items  list-items-desc list-items-view">\
			<a class="opt-btn" href="'+rootPath+'attachment/download.do?oid='+ eventid +'&token='+localStorage.getItem("token")+'">\
			<span class="download" title="下载"></span></a>\
			<div class="items-img" data-eid="'+ eventid +'"\
			data-original="'+ itemsUrl +'" \
			style="background:url('+ itemsUrl +') no-repeat center;background-size:contain;"></div>\
			<div class="list-info" style="display: block; bottom: 0px; color: rgb(102, 102, 102); background: rgb(241, 241, 241);">\
				<p class="pic-name" title="'+ fileName +'">'+ fileName +'</p>\
				<p class="pic-desc" title="'+ fileDescription +'">'+ fileDescription +'</p>\
			</div>\
		</li>');
	var lisUpdate = $('<li class="list-items update-items" id="'+eventid+'">\
			<div class="items-img" data-eid="'+ eventid +'"\
			data-original="'+ itemsUrl +'" \
			style="background:url('+ itemsUrl +') no-repeat center;background-size:contain;"></div>\
			<div class="list-info" style="display: block; bottom: 0px; color: rgb(102, 102, 102); background: rgb(241, 241, 241);">\
				<input type="text" value="'+ fileName +'" class="pic-name-input"/>\
			</div>\
			<div class="list-operate">\
				<a href="'+rootPath+'attachment/download.do?oid='+ eventid +'">\
				<span class="download" title="下载"></span></a>\
				<span class="delete"></span>\
			</div>\
		</li>'); 

	// var lisUpdateDesc = $('<dl class="pic-desc-items update-items" id="'+ eventid +'">\
   	// 		<dt>\
	// 			<img class="img items-img"  src="'+ itemsUrl +'"/>\
	// 			<input class="file-name pic-name-input" value="'+ fileName +'" />\
	// 		</dt>\
	// 		<dd class="file-other">\
	// 			<div class="file-operate">\
	// 				<span class="file-operate-btn up-btn">上移</span>\
	// 				<span class="file-operate-btn down-btn">下移</span>\
	// 				<span class="file-operate-btn delete-btn">删除</span>\
	// 			</div>\
	// 		</dd>\
	// 		<dd class="file-description">\
	// 			<textarea class="file-desc pic-description-input" placeholder="图片描述">'+ desc +'</textarea>\
	// 		</dd>\
	// 	</dl>'); 

	// 不允许修改文件名
	var lisUpdateDesc = $('<dl class="pic-desc-items update-items" id="'+ eventid +'">\
   			<dt>\
				<a class="opt-btn" href="'+rootPath+'attachment/download.do?oid='+ eventid +'">\
					<span class="download" title="下载"></span></a>\
				<img class="img items-img"  src="'+ itemsUrl +'"/>\
				<p class="file-name pic-name-input" title="'+ fileName +'">'+ fileName +'</p>\
			</dt>\
			<dd class="file-other">\
				<div class="file-operate">\
					<span class="file-operate-btn up-btn">上移</span>\
					<span class="file-operate-btn down-btn">下移</span>\
					<span class="file-operate-btn delete-btn">删除</span>\
				</div>\
			</dd>\
			<dd class="file-description">\
				<textarea class="file-desc pic-description-input"  maxlength="'+ descNum +'" placeholder="图片描述">'+ desc +'</textarea>\
				<div class="word-count">\
					<span class="currentNum">'+ desc.length +'</span>/<span>'+ descNum +'</span>\
				</div>\
			</dd>\
		</dl>'); 
	
	if(viewOrUpdate == "update"){
		if(!isNull(moduleCode) && moduleCode.constructor == Object){  // 如果参数是一个对象  
			pickId = moduleCode.pickId?moduleCode.pickId:pickId
		}
		if(addDesc == "addDesc"){
			$("#"+picId).append(lisUpdateDesc);
			// (lisUpdateDesc).insertBefore($("#addPicBtn"))
			    lisUpdateDesc.on('keyup', '.file-desc', function() {
					var maxlength = $(this).attr("maxlength");
					var curLength=$(this).val().length;
					// console.log(maxlength);
					// console.log(curLength);
					if(curLength>maxlength){
					$(this).next(".word-count").find(".currentNum").html(maxlength);
				}else{
					$(this).next(".word-count").find(".currentNum").html(curLength);
				}
			});
		}else{

//			(lisUpdate).insertBefore($("#addPicBtn"))
			(lisUpdate).insertBefore($("#"+pickId));
			
			
		}
	}else{
		if(addDesc == "addDesc"){
			$("#" + picId + " .pic-list").append(lisViewDesc);
		}else{
			$("#" + picId + " .pic-list").append(lisView);
		}
	}
}


/**
 * @desc 修改图片信息
 * @param callback  修改成功之后执行的回调函数
 * @param uploadBtn  触发上传的按钮
 */

function updatePicFun(callback,uploadBtn){
	if(uploadBtn){
	}else{
		uploadBtn = "#againSavePicBtn"
	}
	var itemsLi = $(".pic-list-container").find(".update-items");
	if(itemsLi.length > 0){
		for(var i = 0; i < itemsLi.length; i++ ){
			var oid = $(itemsLi[i]).prop("id"),
				fileName = $(itemsLi[i]).find(".pic-name-input").val();
			var descContainer = $(itemsLi[i]).find(".pic-description-input");
				
			var data;
			if(!isNull(descContainer)){
				var	fileDescription =  $(itemsLi[i]).find(".pic-description-input").val();
				data = {
				    	  "oid":oid,
				    	// "fileName":fileName,
				    	  "fileDescription":fileDescription
				    	}
			}else{
				data = {
				    	  "oid":oid,
				    	  "fileName":fileName
				        }
			};

			$.ajax({
				url: rootPath+"attachment/updateInfo.do", //业务唯一性验证
				type: "post",
				contentType: "application/json;charset=utf-8",
				dataType: "json",
				async:false,
			    data:JSON.stringify(data),
			    success:function(data){
			    	if(data.status == 1){
			    		if(i == itemsLi.length-1){
			    			console.log("修改图片成功 开始准备继续上传图片");
			    			getAgainPicLength(callback,uploadBtn)
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
		// console.log("没有已上传要修改的图片  开始准备继续上传图片");
		getAgainPicLength(callback,uploadBtn)
	}
}


/**
 * @desc 根据修改页面新添加的文件数量进行相应的操作
 * @param callback  新增成功之后执行的回调函数
 * @param uploadBtn  触发上传的按钮
 */

function getAgainPicLength(callback,uploadBtn){
	var newFile =  $(".pic-list-container").find(".again-add-items");
	if(newFile.length>0){ // 如果队列里面有待上传的文件，则上传
		// console.log("开始上传图片----------");
		
		$(uploadBtn).trigger("click"); 
	}else{  // 执行回调函数
		// console.log("修改图片执行完成----------");
//		callback();	
		var newAddFileLength =  $(".pic-list-container").find(".again-add-items");
		if(newAddFileLength.length>0){
			$(uploadBtn).trigger("click"); 
		}else{
			callback();	
		}
	}
}


/**
 * @desc 修改页面添加按钮 不带描述
 * @param oid  业务id
 * @param FileObj 附件上传其它配置项的对象
 * @param moduleCode  子系统业务模块名,用于上传到KASS系统中的目录分类,不传后台默认值为"default"
 * @param picAndFileSort  图片和附件的上传顺序标识
 * @param picId		自定义附件显示位置id
 * @param businessType  图片的业务含义  可以为空
 * @param callbackFunn  当条数据执行完成的回调
 */

function againAddFun(oid,FileObj,picAndFileSort,picId,businessType,callbackFunn){
	var baseurl = rootPath+"/attachment/upload.do",
	    fileNumLimit = 200,
	    extensions = "gif,jpg,jpeg,bmp,png",
	    moduleCode = "default",
	    uploadBtn = "againSavePicBtn",
	    pickId = "addPicBtn",
	    folderId = "47a293b6-f60d-4163-bebb-6cbd0deae811";  // 默认的folderId
	var obj = FileObj;
	
	if(!isNull(obj) && obj.constructor == Object){
		baseurl = obj.url?obj.url:baseurl,
	    fileNumLimit = obj.fileNumLimit?obj.fileNumLimit:fileNumLimit,
	    extensions = obj.extensions?obj.extensions:extensions,
	    moduleCode = obj.moduleCode?obj.moduleCode:moduleCode,
	    uploadBtn = obj.uploadBtn?obj.uploadBtn:uploadBtn,
	    pickId = obj.pickId?obj.pickId:pickId,	
	    folderId = obj.folderId?obj.folderId:folderId;
	}else if(!isNull(obj)){
		 moduleCode = obj;
		 if(obj.length>20){  // 后期不要moduleCode参数时，如若传folderId，只需把folderId放在原始moduleCode的位置即可
			 folderId = obj
		 }
	}

	if(!isNull(picAndFileSort) && picAndFileSort == "1"){
		console.log("图片和附件同时存在 并且 先上传      图片");
		// 图片和附件同时存在 并且先上传图片
		$("#"+picId).initializeWebUploader({
			fileType:"pic",
			businessType:businessType,
			pickId:pickId,
			addDesc:"false",
			picAndFile:"all",
			uploadBtn:"#"+uploadBtn,
			url : baseurl,
			moduleCode:moduleCode,
			folderId:folderId,
			isUpdate:"true",
			fileNumLimit:fileNumLimit,  // 上传文件的个数不传有默认值200
			extensions:extensions, // 上传文件的后缀 不传有默认值
			uploadBeforeFun:function(){
				return oid;
			},
			uploadSuccessFun:function(errorNumObj){
				// 文件上传成功之后执行的
				updateFileFun(function(errorNumObj){
					// 使用匿名函数解决 高价函数传参立即执行的问题    
					updateSuccessFun(errorNumObj)
				});
			}
		})
	}else if(!isNull(picAndFileSort)) {
		console.log("图片和附件同时存在    先上传附件");
		// 图片和附件同时存在    先上传附件
		$("#"+picId).initializeWebUploader({
			fileType:"pic",
			businessType:businessType,
			pickId:pickId,
			addDesc:"false",
			picAndFile:"all",
			uploadBtn:"#"+uploadBtn,
			url : baseurl,
			moduleCode:moduleCode,
			folderId:folderId,
			isUpdate:"true",
			fileNumLimit:fileNumLimit,  // 上传文件的个数不传有默认值200
			extensions:extensions, // 上传文件的后缀 不传有默认值
			uploadBeforeFun:function(){
				return oid;
			},
			uploadSuccessFun:function(errorNumObj){
				// 文件上传成功之后执行的
				updateSuccessFun(errorNumObj);
			}
		})
	}else {
		$("#"+picId).initializeWebUploader({
			fileType:"pic",
			businessType:businessType,
			pickId:pickId,
			addDesc:"false",
			uploadBtn:"#"+uploadBtn,
			url : baseurl,
			moduleCode:moduleCode,
			folderId:folderId,
			isUpdate:"true",
			fileNumLimit:fileNumLimit,  // 上传文件的个数不传有默认值200
			extensions:extensions, // 上传文件的后缀 不传有默认值
			uploadBeforeFun:function(){
				return oid;
			},
			uploadSuccessFun:function(errorNumObj){
				// 文件上传成功之后执行的
//				updateSuccessFun();
				if(callbackFunn){
					callbackFunn(errorNumObj);
				}else{
					updateSuccessFun(errorNumObj);
				}
			}
		})
	}
	
}


/**
 * @desc 修改页面添加按钮  带描述
 * @param oid  业务id
 * @param FileObj 附件上传其它配置项的对象
 * @param moduleCode  子系统业务模块名,用于上传到KASS系统中的目录分类,不传后台默认值为"default"
 * @param picAndFileSort  图片和附件的上传顺序标识
 * @param picId		自定义附件显示位置id
 * @param businessType  图片的业务含义  可以为空
 * @param callbackFunn  当条数据执行完成的回调
 */

function againAddDescFun(oid,FileObj,picAndFileSort,picId,businessType,callbackFunn){
	var baseurl = rootPath+"/attachment/upload.do",
	    fileNumLimit = 200,
	    extensions = "gif,jpg,jpeg,bmp,png",
	    moduleCode = "default",
	    uploadBtn = "againSavePicBtn",
	    pickId = "addPicBtn",
	    folderId = "47a293b6-f60d-4163-bebb-6cbd0deae811";  // 默认的folderId
	var obj = FileObj;
	
	if(!isNull(obj) && obj.constructor == Object){
		baseurl = obj.url?obj.url:baseurl,
	    fileNumLimit = obj.fileNumLimit?obj.fileNumLimit:fileNumLimit,
	    extensions = obj.extensions?obj.extensions:extensions,
	    moduleCode = obj.moduleCode?obj.moduleCode:moduleCode,
	    uploadBtn = obj.uploadBtn?obj.uploadBtn:uploadBtn,
	    pickId = obj.pickId?obj.pickId:pickId,	
	    folderId = obj.folderId?obj.folderId:folderId;
	}else if(!isNull(obj)){
		 moduleCode = obj;
		 if(obj.length>20){  // 后期不要moduleCode参数时，如若传folderId，只需把folderId放在原始moduleCode的位置即可
			 folderId = obj
		 }
	}
	if(!isNull(picAndFileSort) && picAndFileSort == "1"){
		$("#"+picId).initializeWebUploader({
			fileType:"pic",
			businessType:businessType,
			pickId:pickId,
			uploadBtn:"#"+uploadBtn,
			addDesc:"true",
			picAndFile:"all",
			url : rootPath+"/attachment/upload.do",
			moduleCode:moduleCode, // 子系统业务模块名,用于上传到KASS系统中的目录分类，不传默认default
			folderId:folderId,
			fileNumLimit:fileNumLimit,  // 上传文件的个数不传有默认值200
			extensions:extensions, // 上传文件的后缀 不传有默认值
			isUpdate:"true",
			uploadBeforeFun:function(){
				return oid;
			},
			uploadSuccessFun:function(errorNumObj){
				// 文件上传成功之后执行的
				updateFileFun(function(errorNumObj){
					// 使用匿名函数解决 高价函数传参立即执行的问题    
					updateSuccessFun(errorNumObj)
				});
			}
		})
	}else if(!isNull(picAndFileSort)){
		$("#"+picId).initializeWebUploader({
			fileType:"pic",
			businessType:businessType,
			pickId:pickId,
			uploadBtn:"#"+uploadBtn,
			addDesc:"true",
			picAndFile:"all",
			url : rootPath+"/attachment/upload.do",
			moduleCode:moduleCode, // 子系统业务模块名,用于上传到KASS系统中的目录分类，不传默认default
			folderId:folderId,
			fileNumLimit:fileNumLimit,  // 上传文件的个数不传有默认值200
			extensions:extensions, // 上传文件的后缀 不传有默认值
			isUpdate:"true",
			uploadBeforeFun:function(){
				return oid;
			},
			uploadSuccessFun:function(errorNumObj){
				// 文件上传成功之后执行的
				updateSuccessFun(errorNumObj);
			}
		})
	}else{
		$("#"+picId).initializeWebUploader({
			fileType:"pic",
			businessType:businessType,
			pickId:pickId,
			uploadBtn:"#"+uploadBtn,
			addDesc:"true",
			picAndFile:"all",
			url : rootPath+"/attachment/upload.do",
			moduleCode:moduleCode, // 子系统业务模块名,用于上传到KASS系统中的目录分类，不传默认default
			folderId:folderId,
			fileNumLimit:fileNumLimit,  // 上传文件的个数不传有默认值200
			extensions:extensions, // 上传文件的后缀 不传有默认值
			isUpdate:"true",
			uploadBeforeFun:function(){
				return oid;
			},
			uploadSuccessFun:function(errorNumObj){
				// 文件上传成功之后执行的
				if(callbackFunn){
					callbackFunn(errorNumObj);
				}else{
					updateSuccessFun(errorNumObj);
				}
			}
		})
	}
}


/**
 * @desc 删除图片信息
 * @param ele 要删除的dom节点
 * @param eId  要删除的元素对应的id
 */

function removeImagesFun(ele,eId){
	$.messager.confirm("提示","您确定要删除该图片吗？",function(r){
		if (r){
			$.ajax({
				url: rootPath+"attachment/delete.do?oids="+eId+"&isShiftDelFile=true&token="+localStorage.getItem("token"), //业务唯一性验证
			    type: "get",
			    dataType: "json",
			    success:function(data){
			    	if(data.status == 1){
			    		$(ele).remove();
			    	}
			    },
			    error: function (XMLHttpRequest, textStatus, errorThrown) {
		            console.log(XMLHttpRequest);
		            console.log(textStatus);
		            console.log(errorThrown);
		        }
			})
		}
	})
}
