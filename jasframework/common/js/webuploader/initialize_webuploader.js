/** 
 * @file
 * @author  lizhenzhen
 * @desc  webuploader文件上传二次封装
 * @date  2017-10-11 
 * @last modified by lizz
 * @last modified time  2017-11-23
 */

;(function($){
    "use strict";
     $.ajaxSetup({ cache:false });
     
     $.fn.initializeWebUploader = function (opt){
    	 var uploaderPic,
    	 	 uploaderFile;
  
    	 var self = this;
    	 var busId = null;
    
         var fileType = opt.fileType || "file",
             addDesc = opt.addDesc || "false",
             moduleCode = opt.moduleCode || "default",
             isUpdate = opt.isUpdate || "false",
             folderId = opt.folderId || "47a293b6-f60d-4163-bebb-6cbd0deae811",
             businessType = opt.businessType || "";
         var pickId = opt.pickId,
             uploadBtn = opt.uploadBtn;
         
         var defaultServer = rootPath+"/attachment/upload.do";
         
         var itemsTr = '<tr>\
							<td>\
							<div class="file-select"></div>\
						</td>\
						<td><input type="text" class="file-desc" /></td>\
						<td class="file-progress">\
							<div class="file-progress-bar"></div>\
							<div class="file-progress-value"></div>\
						</td>\
						<td class="file-operate">\
							<span class="add" title="添加"></span>\
							<span class="delete" title="删除"></span>\
						</td>\
					</tr>';
         
    	 var extendWebUploader = {
    		init:function(){
    			var that = this;
    			$(self).addClass("pic-list-container");
    			
                if(fileType == "pic"){
                	// 图片
                	pickId = opt.pickId || "addPicBtn";
                	if(isUpdate == "true"){
                		if(addDesc == "true"){
                             console.log("继续添加带描述图片上传");
                             this.againAddDescPicLoad();
                        }else{
                             console.log("继续添加不带描述图片上传");
                             this.againAddPicLoad()
                        }
                	}else{
                	   if(addDesc == "true"){
                            console.log("带描述的图片上传");
                            this.initializeDescPicLoad();
                       }else{
//                    	    $(self).append('<ul class="pic-list" id="picList_'+pickId+'">\
//												<li class="pic-btn" id="'+pickId+'"></li>\
//											</ul>');
                    	   $(self).append('<ul class="pic-list" id="picList'+pickId+'">\
									<li class="pic-btn" id="'+pickId+'"></li>\
								</ul>');
                            console.log("不带描述的图片上传");
                            this.initializePicLoad();
                       }
                	}
                   
                }else{         
                  // 文件
                  pickId = opt.pickId || "addFile";

            	  if(isUpdate == "true"){
                        console.log("继续添加带描述的文件上传");
                        this.againAddFileDescFileLoad()
                  }else{
                	  if(addDesc == "true"){
                        console.log("带描述文件上传");
                        this.initializeDescFileLoad()
                      }else{
                        console.log("不带描述文件上传");
                    	this.initializeFileLoad();
                      }
                  }
                }
            },
            initializePicLoad:function(){
               // console.log("初始化图片加载，不带描述");
                var thumbnailWidth = opt.thumbnailWidth || 120,  // 缩略图宽
                	thumbnailHeight = opt.thumbnailHeight;  120// 缩略图高
                var that = this;
  
				var opts = {
    	            auto: false,
    	            swf: rootPath+'common/lib/webuploader/Uploader.swf',
    	            server: opt.url || defaultServer,
    	            fileNumLimit : opt.fileNumLimit || 200,// 验证文件总数量, 超出则不允许加入队列
    	            
    	            //dnd:$(".pic-list-container"),  
    	            // 禁掉整个页面的拖拽功能  如果不禁用，图片拖进来的时候会默认被浏览器打开。
    	            //disableGlobalDnd:true, 
    	            // 选择文件的按钮。可选。
    	            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
    	            
    	            pick: {
    	                id:"#"+pickId,
   	                    multiple :true,
    	                innerHTML: '添加图片'
    	            },
    	            accept: {
    	                title: 'Images',
    	                extensions: opt.extensions || 'gif,jpg,jpeg,bmp,png',
    	                mimeTypes: 'image/*'
    	            }
    	        };

                // 初始化图片加载，无描述信息
                uploaderPic = WebUploader.create(opts);

                //当文件被加入队列以后触发
                uploaderPic.on( 'fileQueued', function(file) {
					// 	console.log("文件加入队列");
                    var $li = $('<li class="list-items" id="' + file.id + '">\
                                <img class="img">\
                                <p class="pic-info" title="'+ file.name +'">' + file.name + '</p>\
                                <div class="pic-operate">\
                                    <span class="delete" title="删除" ></span>\
                                </div>\
                                <div class="pic-progress">\
                                    <div class="progress-bar"></div>\
                                    <div class="progress-value"></div>\
                                </div>\
                            </li>');
//                    ($li).insertBefore($(self).find("#addPicBtn"));
                    
                    ($li).insertBefore($("#picList"+pickId+" #"+pickId));                   
					var $img = $li.find('.img');

                    // 删除队列中的文件
                    $li.on('click', '.delete', function() {
                    	that.removeQueuedFiled($li,file);
                    })
                    
                    // 创建缩略图
                    // 如果为非图片文件，可以不用调用此方法。
                    // thumbnailWidth x thumbnailHeight 为 100 x 100
                    uploaderPic.makeThumb( file, function( error, src ) {
                        if ( error ) {
                            $img.replaceWith('<span>不能预览</span>');
                            return;
                        }
                        $img.attr( 'src', src );
                    }, thumbnailWidth, thumbnailHeight );

                });

                that.uploadSaveFun();
				/**
				   	if(that.tools.isIE()){
						// 解决ie8，ie9走uploadError 并且reason 为http的问题
						var setHeader = function(object, data, headers) {
							console.log(object);
							console.log(data);

							headers['Access-Control-Allow-Origin'] = '*';
							headers['Access-Control-Request-Headers'] = 'content-type';
							headers['Access-Control-Request-Method'] = 'POST';
						}
						uploaderPic.on('uploadBeforeSend ', setHeader);
					};
				*/
    	        
    	        // 当某个文件的分块在发送前触发，主要用来询问是否要添加附带参数，大文件在开起分片上传的前提下此事件可能会触发多次。
    	        uploaderPic.on('uploadBeforeSend ', function(object, data, headers) {
					// console.log("文件加入队列之前");
	            	if(that.tools.isIE()){
	            		// 解决ie8，ie9走uploadError 并且reason 为http的问题
	            		headers['Access-Control-Allow-Origin'] = '*';
    	                headers['Access-Control-Request-Headers'] = 'content-type';
    	                headers['Access-Control-Request-Method'] = 'POST';
	            	}
	            	
	            	//添加附加信息
	            	var desc = "";
	            	data.fileDescription = desc;
    	        });

				/**
				   	// 当开始上传流程时触发
					uploaderPic.on( 'uploadStart', function( file, percentage ) {
						console.log("开始上传");
					});
						
					
					// 当开始上传流程暂停时触发
					uploaderPic.on( 'stopUpload', function( file, percentage ) {
							console.log("停止上传");
					});
					
					// 当所有文件上传结束时触发。
					uploaderPic.on( 'uploadFinished', function( file, percentage ) {
						console.log("开始完成");
					});
				*/
    	        
    	        // 上传过程中触发，携带上传进度。
    	        uploaderPic.on( 'uploadProgress', function( file, percentage ) {
					//  console.log("上传进度展示");
    	            var $li = $( '#'+file.id );
    	            	$li.find('.pic-progress').show();
    	            var $percent = $li.find('.progress-value');
    	            
    	            $percent.css( 'width', percentage * 100 + '%' );
    	        });

    	        // 文件上传成功，给item添加成功class, 用样式标记上传成功。
    	        uploaderPic.on( 'uploadSuccess', function(file) {
   	            	// console.log("上传成功");
    	            var successHtml = '<span class="success" title="上传成功"></span>'
    	            $( '#'+file.id ).find(".pic-operate").append(successHtml);
    	            $( '#'+file.id ).addClass('upload-state-done');
    	        });
    	        
    	        // 当所有文件上传结束时触发。
    	        uploaderPic.on( 'uploadFinished', function(file) {
   	            	// console.log("所有文件上传结束时触发");
    	            if(opt.uploadSuccessFun){
    	            	opt.uploadSuccessFun();
    	            }else{
						var hideBtn = $("#newSaveBtnHide");
						if(!that.tools.isNull(hideBtn)  &&  opt.picAndFile == "all"){
							console.log("开始上传文件");
							$("#newSaveBtnHide").trigger("click");
						}
					}
    	        });
    	        
    	        // 文件上传失败，显示上传出错。
    	        uploaderPic.on( 'uploadError', function( file , reason) {
    	            console.log("上传失败");
    	            console.log(file);
    	            console.log(reason);
    	            
    	            var errorHtml = '<span class="error"  title="上传失败" ></span>'
    	            $( '#'+file.id ).find(".pic-operate").append(errorHtml);
    	            $( '#'+file.id ).find(".progress-value").css("background","red");
    	        });

				/**
				 	// 不管成功或者失败，文件上传完成时触发
					uploaderPic.on( 'uploadComplete', function( file ) {
						console.log("不管成功或者失败，文件上传完成时触发");
					});
				*/
    	        

    	        // 验证失败抛出的错误。
    	        uploaderPic.on( 'error', function(type, file) {
		        	var name = file.name;  
		            var str="";  
		            switch (type) {
		                case "Q_EXCEED_NUM_LIMIT":
		                    top.showAlert("提示","超过上传图片的数量限制",'info');
		                    break;
		                case "Q_EXCEED_SIZE_LIMIT":
		                	top.showAlert("提示","添加的文件总大小超出",'info');
		                    break;
		                case "Q_TYPE_DENIED":
		                	str = name + "图片类型错误,只能是以"+ opts.accept.extensions +"为后缀的图片";
		                	top.showAlert("提示",str,'info');
		                    break;
						case "F_DUPLICATE":
							str = name + "该文件已存在!";
		                	top.showAlert("提示",str,'info');
		                    break;
		                default:
		                	top.showAlert("提示","验证不通过!",'info');
		                    break;
		            }
		        });
 
            },
            initializeDescPicLoad:function(){
            	//  console.log("初始化图片加载，带描述信息");
                var thumbnailWidth = opt.thumbnailWidth || 120,  // 缩略图宽
            	thumbnailHeight = opt.thumbnailHeight || 120,// 缩略图高
                descNum = opt.descNum || 200; // 描述信息字数
                
	            var that = this;

				var  opts = {
		            auto: false,
		            swf: rootPath+'common/lib/webuploader/Uploader.swf',
		            server: opt.url || defaultServer,
		            fileNumLimit : opt.fileNumLimit || 200,// 验证文件总数量, 超出则不允许加入队列
		            
		            // dnd:$(".pic-desc-list"),  
		            // 禁掉整个页面的拖拽功能  如果不禁用，图片拖进来的时候会默认被浏览器打开。
		            // disableGlobalDnd:true, 
		            // 选择文件的按钮。可选。
		            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
		            
		            threads:1,//上传并发数。允许同时最大上传进程数,为了保证文件上传顺序
		            pick: {
		            	id:"#"+pickId,
		                multiple :true,
		                innerHTML: '选择图片'
		            },
		            accept: {
		                title: 'Images',
		                extensions: opt.extensions || 'gif,jpg,jpeg,bmp,png',
		                mimeTypes: 'image/*'
		            }
		        };

	            uploaderPic = WebUploader.create(opts);
            
				//当文件被加入队列以后触发
				uploaderPic.on( 'fileQueued', function(file) {
					var $dl = $('<dl class="pic-desc-items" id="'+ file.id +'">\
									<dt>\
										<img class="img" />\
										<span class="file-name" title="'+ file.name +'">'+ file.name +'</span>\
									</dt>\
									<dd class="file-other">\
										<div class="file-operate">\
											<span class="file-operate-btn up-btn">上移</span>\
											<span class="file-operate-btn down-btn">下移</span>\
											<span class="file-operate-btn delete-btn">删除</span>\
										</div>\
										<div class="file-progress">\
											<div class="file-progress-bar"></div>\
											<div class="file-progress-value"></div>\
										</div>\
										<div class="file-upload-status">\
										</div>\
									</dd>\
									<dd class="file-description">\
										<textarea class="file-desc" placeholder="图片描述" maxlength="'+ descNum +'"></textarea>\
										<div class="word-count">\
											<span class="currentNum">0</span>/<span>'+ descNum +'</span>\
										</div>\
									</dd>\
								</dl>');
					$(self).append($dl);
					
					var $img = $dl.find('.img');

					// 删除队列中的文件
					$dl.on('click', '.delete-btn', function() {
						that.removeQueuedFiled($dl,file);
					});
					
					// 上移
					$dl.on('click', '.up-btn', function() {
						var dlId = $(this).parent(".file-operate").parent(".file-other").parent(".pic-desc-items").prop("id");
						var objParentTR = $('#'+ dlId);
						var prevTR = objParentTR.prev();
						if (prevTR.length > 0) {
							prevTR.insertAfter(objParentTR);
						}	
					});
					
					// 下移
					$dl.on('click', '.down-btn', function() {
						var dlId = $(this).parent(".file-operate").parent(".file-other").parent(".pic-desc-items").prop("id");
						var objParentTR = $('#'+ dlId);
						var nextTR = objParentTR.next();
						if (nextTR.length > 0) {
							nextTR.insertBefore(objParentTR);
						}
					});
					
					// 描述信息字数统计
					$dl.on('keyup', '.file-desc', function() {
						var maxlength = $(this).attr("maxlength");
						var curLength=$(this).val().length;
						if(curLength>maxlength){
						$(this).next(".word-count").find(".currentNum").html(maxlength);
					}else{
						$(this).next(".word-count").find(".currentNum").html(curLength);
					}
					});
					
					// 创建缩略图
					// 如果为非图片文件，可以不用调用此方法。
					// thumbnailWidth x thumbnailHeight 为 100 x 100
					uploaderPic.makeThumb( file, function( error, src ) {
						if ( error ) {
							$img.replaceWith('<span>不能预览</span>');
							return;
						}
						$img.attr( 'src', src );
					}, thumbnailWidth, thumbnailHeight );
	
	            });
            
	            that.uploadSaveFun();
	
		        // 当某个文件的分块在发送前触发，主要用来询问是否要添加附带参数，大文件在开起分片上传的前提下此事件可能会触发多次。
		        uploaderPic.on('uploadBeforeSend ', function(object, data, headers) {
	            	if(that.tools.isIE()){
	            		// 解决ie8，ie9走uploadError 并且reason 为http的问题
	            		headers['Access-Control-Allow-Origin'] = '*';
		                headers['Access-Control-Request-Headers'] = 'content-type';
		                headers['Access-Control-Request-Method'] = 'POST';
	            	}
	           	
           	        //    添加描述信息
	            	var desc = $("#"+data.id).find(".file-desc").val();
	            	data.fileDescription= desc;
		        });
		       
	
		        // 上传过程中触发，携带上传进度。
		        uploaderPic.on( 'uploadProgress', function( file, percentage ) {
		        	// console.log("上传进度展示");
		            var $dl = $( '#'+file.id );
		            	$dl.find('.file-progress').show();
		            var $percent = $dl.find('.file-progress-value');
		            $percent.css( 'width', percentage * 100 + '%' );
		        });
	
		        // 文件上传成功，给item添加成功class, 用样式标记上传成功。
		        uploaderPic.on( 'uploadSuccess', function(file) {
		            // console.log("上传成功");
		            $( '#'+file.id ).find(".file-progress").hide();
		            var successHtml = '<span class="file-success"></span><span>上传成功</span>';
		            $( '#'+file.id ).find(".file-upload-status").show();
		            $( '#'+file.id ).find(".file-upload-status").empty();
		            $( '#'+file.id ).find(".file-upload-status").append(successHtml);
		            $( '#'+file.id ).addClass('upload-state-done');
		        });
		        
		        // 当所有文件上传结束时触发。
		        uploaderPic.on( 'uploadFinished', function(file) {
		            // console.log("所有文件上传结束时触发");
		            if(opt.uploadSuccessFun){
		            	opt.uploadSuccessFun();
		            }else{
						var hideBtn = $("#newSaveBtnHide");
						console.log(hideBtn);
						console.log(!that.tools.isNull(hideBtn));
						console.log(opt.picAndFile == "all")
						if(!that.tools.isNull(hideBtn)  &&  opt.picAndFile == "all"){
							console.log("开始上传文件");
							$("#newSaveBtnHide").trigger("click");
						}
					}
		        });
		        
	
		        // 文件上传失败，显示上传出错。
		        uploaderPic.on( 'uploadError', function( file , reason) {
		            console.log("上传失败");
		            console.log(file);
		            console.log(reason);
		            
		            $( '#'+file.id ).find(".file-progress").hide();
		            var errorHtml = '<span class="file-fail"></span><span>上传失败</span>';
		            $( '#'+file.id ).find(".file-upload-status").show();
		            $( '#'+file.id ).find(".file-upload-status").empty();
		            $( '#'+file.id ).find(".file-upload-status").append(errorHtml);
		        });
	
		        // 验证失败抛出的错误。
		        uploaderPic.on( 'error', function(type, file) {
		        	var name = file.name;  
		            var str="";  
		            switch (type) {
		                case "Q_EXCEED_NUM_LIMIT":
		                    top.showAlert("提示","超过上传图片的数量限制",'info');
		                    break;
		                case "Q_EXCEED_SIZE_LIMIT":
		                	top.showAlert("提示","添加的文件总大小超出",'info');
		                    break;
		                case "Q_TYPE_DENIED":
		                	// str = name+"文件类型 不允许"; 
		                	str = name + "图片类型错误,只能是以"+ opts.accept.extensions +"为后缀的图片";
		                	top.showAlert("提示",str,'info');
		                    break;
						case "F_DUPLICATE":
							str = name + "该文件已存在!";
		                	top.showAlert("提示",str,'info');
		                    break;
		                default:
		                	top.showAlert("提示","验证不通过!",'info');
		                    break;
		            }
		        });
            },
            againAddPicLoad:function(){
            	//  console.log("初始化图片加载，不带描述信息  修改页面的添加按钮");
                var thumbnailWidth =  137,  // 缩略图宽
            	thumbnailHeight =  142;// 缩略图高
	            var that = this;

				var  opts = {
		            auto: false,
		            swf: rootPath+'common/lib/webuploader/Uploader.swf',
		            server: opt.url || defaultServer,
		            fileNumLimit : opt.fileNumLimit || 200,// 验证文件总数量, 超出则不允许加入队列
		            
		            // dnd:$(".pic-desc-list"),  
		            // 禁掉整个页面的拖拽功能  如果不禁用，图片拖进来的时候会默认被浏览器打开。
		            // disableGlobalDnd:true, 
		            // 选择文件的按钮。可选。
		            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
		            
		            threads:1,//上传并发数。允许同时最大上传进程数,为了保证文件上传顺序
		            pick: {
		            	id:"#"+pickId,
		                multiple :true,
		                innerHTML: '选择图片'
		            },
		            accept: {
		                title: 'Images',
		                extensions: opt.extensions || 'gif,jpg,jpeg,bmp,png',
		                mimeTypes: 'image/*'
		            }
		        }
	            // 初始化图片加载，无描述信息
	            uploaderPic = WebUploader.create(opts);
	            
                // 当文件被加入队列之前触发
	            uploaderPic.on('beforeFileQueued', function(file) {
               		// console.log("当文件被加入队列之前触发");
                	var currentTrLength = $("#viewPicContainer .list-items").length;
                	if(opt.fileNumLimit <= currentTrLength){
                		 top.showAlert("提示","超过图片上传的数量限制",'info');
		                 return false;
                	}

					var alreadyUpdate = $("#viewPicContainer").find(".update-items");
                	if(alreadyUpdate.length > 0){
                		console.log(file.name);
                		for(var i = 0 ; i < alreadyUpdate.length; i++){
                			console.log($(alreadyUpdate[i]).find(".pic-name-input").val())
                			if(file.name == $(alreadyUpdate[i]).find(".pic-name-input").val()){
    		                	top.showAlert("提示",file.name + "该文件已存在!",'info');
                				return false;
                			}
                		}
                	}
 
                });
            
				//当文件被加入队列以后触发
				uploaderPic.on( 'fileQueued', function(file) {
					var $lis = $('<li class="list-items again-add-items" id="'+file.id+'">\
							<img class="items-img img" />\
							<div class="list-info" style="display: block; bottom: 0px; color: rgb(102, 102, 102); background: rgb(241, 241, 241);">\
								<input type="text" value="'+file.name+'" class="pic-name-input"/>\
							</div>\
							<div class="list-operate">\
								<span class="remove"></span>\
							</div>\
						</li>');
					
					($lis).insertBefore($("#picList"+pickId+" #"+pickId));
					
					var $img = $lis.find('.img');

					// 删除队列中的文件
					$lis.on('click', '.remove', function() {
						that.removeQueuedFiled($lis,file);
					});

					// 创建缩略图
					// thumbnailWidth x thumbnailHeight 为 100 x 100
					uploaderPic.makeThumb( file, function( error, src ) {
						if ( error ) {
							$img.replaceWith('<span>不能预览</span>');
							return;
						}
						$img.attr( 'src', src );
					}, thumbnailWidth, thumbnailHeight );
 
	          	});
            
	         	 that.uploadSaveFun();
	
		        // 当某个文件的分块在发送前触发，主要用来询问是否要添加附带参数，大文件在开起分片上传的前提下此事件可能会触发多次。
		        uploaderPic.on('uploadBeforeSend ', function(object, data, headers) {
	            	if(that.tools.isIE()){
	            		 // 解决ie8，ie9走uploadError 并且reason 为http的问题
	            		headers['Access-Control-Allow-Origin'] = '*';
		                headers['Access-Control-Request-Headers'] = 'content-type';
		                headers['Access-Control-Request-Method'] = 'POST';
	            	}
	            	
    	           	// 添加描述信息
	            	var desc = "";
	            	data.fileDescription = desc;
		        });
		        
		        
                // 某个文件开始上传前触发，一个文件只会触发一次。
		        uploaderPic.on( 'uploadStart', function(file) {
		        	// console.log("文件开始上传前触发  一个文件只会触发一次");
		        	var fileName = $("#"+file.id).find(".pic-name-input").val();
		        	file.name = fileName;
		        });
		        
				/**
					// 上传过程中触发，携带上传进度。
					uploaderPic.on( 'uploadProgress', function( file, percentage ) {
						console.log("上传进度展示");
					});
		
					// 文件上传成功，给item添加成功class, 用样式标记上传成功。
					uploaderPic.on( 'uploadSuccess', function(file) {
						console.log("上传成功");
						$( '#'+file.id ).addClass('upload-state-done');
					});
				*/
		      
		        // 当所有文件上传结束时触发。
		        uploaderPic.on( 'uploadFinished', function(file) {
		            // console.log("所有文件上传结束时触发");
		            if(opt.uploadSuccessFun){
		            	opt.uploadSuccessFun();
		            }
		        });
		        
	
		        // 文件上传失败，显示上传出错。
		        uploaderPic.on( 'uploadError', function( file , reason) {
		            console.log("上传失败");
		            console.log(file);
		            console.log(reason);
		            top.showAlert("提示",file.name+" 上传失败",'info');
		        });
	
		        // 验证失败抛出的错误。
		        uploaderPic.on( 'error', function(type, file) {
		        	var name = file.name;  
		            var str="";  
		            switch (type) {
		                case "Q_EXCEED_NUM_LIMIT":
		                    top.showAlert("提示","超过上传图片的数量限制",'info');
		                    break;
		                case "Q_EXCEED_SIZE_LIMIT":
		                	top.showAlert("提示","添加的文件总大小超出",'info');
		                    break;
		                case "Q_TYPE_DENIED":
		                	// str = name+"文件类型 不允许"; 
		                	str = name + "图片类型错误,只能是以"+ opts.accept.extensions +"为后缀的图片";
		                	top.showAlert("提示",str,'info');
		                    break;
						case "F_DUPLICATE":
							str = name + "该文件已存在!";
		                	top.showAlert("提示",str,'info');
		                    break;
		                default:
		                	top.showAlert("提示","验证不通过!",'info');
		                    break;
		            }
		        });
            },
            againAddDescPicLoad:function(){
            	//  console.log("初始化图片加载，带描述信息  修改页面的添加按钮");
                var thumbnailWidth = 120,  // 缩略图宽
            	thumbnailHeight = 120,// 缩略图高
                descNum = 200; // 描述信息字数
                
	            var that = this;

				var opts = {
		            auto: false,
		            swf: rootPath+'common/lib/webuploader/Uploader.swf',
		            server: opt.url || defaultServer,
		            fileNumLimit : opt.fileNumLimit || 200,// 验证文件总数量, 超出则不允许加入队列
		            
		            // dnd:$(".pic-desc-list"),  
		            // 禁掉整个页面的拖拽功能  如果不禁用，图片拖进来的时候会默认被浏览器打开。
		            // disableGlobalDnd:true, 
		            // 选择文件的按钮。可选。
		            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
		            
		            threads:1,//上传并发数。允许同时最大上传进程数,为了保证文件上传顺序
		            pick: {
		            	id:"#"+pickId,
		                multiple :true,
		                innerHTML: '选择图片'
		            },
		            accept: {
		                title: 'Images',
		                extensions: opt.extensions || 'gif,jpg,jpeg,bmp,png',
		                mimeTypes: 'image/*'
		            }
		        }

	            uploaderPic = WebUploader.create(opts);
	            
                // 当文件被加入队列之前触发
	            uploaderPic.on('beforeFileQueued', function(file) {
                	// console.log("当文件被加入队列之前触发");
                	var currentTrLength = $("#viewPicContainer .pic-desc-items").length;
                	if(opt.fileNumLimit <= currentTrLength){
                		 top.showAlert("提示","超过图片上传的数量限制",'info');
		                 return false;
                	}
					
                	var alreadyUpdate = $("#viewPicContainer").find(".update-items");
                	if(alreadyUpdate.length > 0){
                		console.log(file.name);
                		for(var i = 0 ; i < alreadyUpdate.length; i++){
                			console.log($(alreadyUpdate[i]).find(".file-name").html())
                			if(file.name == $(alreadyUpdate[i]).find(".file-name").html()){
    		                	top.showAlert("提示",file.name + "该文件已存在!",'info');
                				return false;
                			}
                		}
                	}
 
                });
                
            
				//当文件被加入队列以后触发
				uploaderPic.on( 'fileQueued', function(file) {
					var $dl = $('<dl class="pic-desc-items again-add-items" id="'+ file.id +'">\
									<dt>\
										<img class="img" />\
										<p class="file-name" title="'+ file.name +'">'+ file.name +'</p>\
									</dt>\
									<dd class="file-other">\
										<div class="file-operate">\
											<span class="file-operate-btn up-btn">上移</span>\
											<span class="file-operate-btn down-btn">下移</span>\
											<span class="file-operate-btn delete-btn">删除</span>\
										</div>\
										<div class="file-progress">\
											<div class="file-progress-bar"></div>\
											<div class="file-progress-value"></div>\
										</div>\
										<div class="file-upload-status">\
										</div>\
									</dd>\
									<dd class="file-description">\
										<textarea class="file-desc" placeholder="图片描述" maxlength="'+ descNum +'"></textarea>\
										<div class="word-count">\
											<span class="currentNum">0</span>/<span>'+ descNum +'</span>\
										</div>\
									</dd>\
								</dl>');
					
					$(self).append($dl);
					// ($dl).insertBefore($(self).find("#addPicBtn"))
					
					var $img = $dl.find('.img');

					// 删除队列中的文件
					$dl.on('click', '.delete-btn', function() {
						that.removeQueuedFiled($dl,file);
					});
					
					// 上移
					$dl.on('click', '.up-btn', function() {
						var dlId = $(this).parent(".file-operate").parent(".file-other").parent(".pic-desc-items").prop("id");
						var objParentTR = $('#'+ dlId);
						var prevTR = objParentTR.prev();
						if (prevTR.length > 0) {
							prevTR.insertAfter(objParentTR);
						}	
					});
					
					// 下移
					$dl.on('click', '.down-btn', function() {
						var dlId = $(this).parent(".file-operate").parent(".file-other").parent(".pic-desc-items").prop("id");
						var objParentTR = $('#'+ dlId);
						var nextTR = objParentTR.next();
						if (nextTR.length > 0) {
							nextTR.insertBefore(objParentTR);
						}
					});
					
					
					// 描述信息字数统计
					$dl.on('keyup', '.file-desc', function() {
						var maxlength = $(this).attr("maxlength");
							var curLength=$(this).val().length;
							if(curLength>maxlength){
							$(this).next(".word-count").find(".currentNum").html(maxlength);
						}else{
							$(this).next(".word-count").find(".currentNum").html(curLength);
						}
					});



					// 创建缩略图
					// 如果为非图片文件，可以不用调用此方法。
					// thumbnailWidth x thumbnailHeight 为 100 x 100
					uploaderPic.makeThumb( file, function( error, src ) {
						if ( error ) {
							$img.replaceWith('<span>不能预览</span>');
							return;
						}
						$img.attr( 'src', src );
					}, thumbnailWidth, thumbnailHeight );
	                
	               
	            });
            
	            that.uploadSaveFun();
	            
		        // 当某个文件的分块在发送前触发，主要用来询问是否要添加附带参数，大文件在开起分片上传的前提下此事件可能会触发多次。
		        uploaderPic.on('uploadBeforeSend ', function(object, data, headers) {
	            	if(that.tools.isIE()){
	            		 // 解决ie8，ie9走uploadError 并且reason 为http的问题
	            		headers['Access-Control-Allow-Origin'] = '*';
		                headers['Access-Control-Request-Headers'] = 'content-type';
		                headers['Access-Control-Request-Method'] = 'POST';
	            	}
	           	
           	        //    添加描述信息
	            	var desc = $("#"+data.id).find(".file-desc").val();
	            	data.fileDescription= desc;
		        });
		       
                // 某个文件开始上传前触发，一个文件只会触发一次。   修改不允许修改文件名
		        uploaderPic.on( 'uploadStart', function(file) {
		        	// console.log("文件开始上传前触发  一个文件只会触发一次");
		        	// var fileName = $("#"+file.id).find(".file-name").val();
		        	// file.name = fileName;
		        });
                
		        // 上传过程中触发，携带上传进度。
		        uploaderPic.on( 'uploadProgress', function( file, percentage ) {
		        	// console.log("上传进度展示");
		            var $dl = $( '#'+file.id );
		            	$dl.find('.file-progress').show();
		            var $percent = $dl.find('.file-progress-value');
		            $percent.css( 'width', percentage * 100 + '%' );
		        });
	
		        // 文件上传成功，给item添加成功class, 用样式标记上传成功。
		        uploaderPic.on( 'uploadSuccess', function(file) {
		            // console.log("上传成功");
		            $( '#'+file.id ).find(".file-progress").hide();
		            var successHtml = '<span class="file-success"></span><span>上传成功</span>';
		            $( '#'+file.id ).find(".file-upload-status").show();
		            $( '#'+file.id ).find(".file-upload-status").empty();
		            $( '#'+file.id ).find(".file-upload-status").append(successHtml);
		            $( '#'+file.id ).addClass('upload-state-done');
		        });
		        
		        // 当所有文件上传结束时触发。
		        uploaderPic.on( 'uploadFinished', function(file) {
		            // console.log("所有文件上传结束时触发");
		            if(opt.uploadSuccessFun){
		            	opt.uploadSuccessFun();
		            }
		        });
		        
	
		        // 文件上传失败，显示上传出错。
		        uploaderPic.on( 'uploadError', function( file , reason) {
		            console.log("上传失败");
		            console.log(file);
		            console.log(reason);
		            top.showAlert("提示",file.name+" 上传失败",'info');
		        });
	
		        // 验证失败抛出的错误。
		        uploaderPic.on( 'error', function(type, file) {
		        	var name = file.name;  
		            var str="";  
		            switch (type) {
		                case "Q_EXCEED_NUM_LIMIT":
		                    top.showAlert("提示","超过上传图片的数量限制",'info');
		                    break;
		                case "Q_EXCEED_SIZE_LIMIT":
		                	top.showAlert("提示","添加的文件总大小超出",'info');
		                    break;
		                case "Q_TYPE_DENIED":
		                	// str = name+"文件类型 不允许"; 
							str = name + "图片类型错误,只能是以"+ opts.accept.extensions +"为后缀的图片";
		                	top.showAlert("提示",str,'info');
		                    break;
						case "F_DUPLICATE":
							str = name + "该文件已存在!";
		                	top.showAlert("提示",str,'info');
		                    break;
		                default:
		                	top.showAlert("提示","验证不通过!",'info');
		                    break;
		            }
		        });
            },
            initializeFileLoad:function(){
                // 初始化文件上传
                console.log("初始化文件上传");
                var that = this;

                var currentFileQueued = 0;  // 当前队列中的文件个数
                var opts = {
        	            auto: false,
        	            swf: rootPath+'common/lib/webuploader/Uploader.swf',
        	            server: opt.url || defaultServer,
        	            
        	            // dnd:$(".pic-list-container"),  
        	            // 禁掉整个页面的拖拽功能  如果不禁用，图片拖进来的时候会默认被浏览器打开。
        	            // disableGlobalDnd:true, 
        	            // 选择文件的按钮。可选。
        	            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        	            
        	            pick: {
        	            	id:"#"+pickId,
        	                multiple :true,
        	                innerHTML: '选择文件'
        	            },
        	            accept: {
        	                title: 'Files',
        	                extensions: opt.extensions || '', // 放宽默认值 doc,docx,xlsx,xls,pdf,zip,ppt,pptx
        	            },
        	            
        	            // 不压缩，文件上传前会压缩一把再上传！
        	            resize: false,
        	            // 验证文件总数量, 超出则不允许加入队列
        	            fileNumLimit : opt.fileNumLimit || 200,
        	            // 文件总大小
        	            fileSizeLimit : opt.fileSizeLimit || undefined
        	        }
                console.log(opt.fileSizeLimit)
                // 初始化图片加载，无描述信息
                uploaderFile = WebUploader.create(opts);
                
				/**
					 // 当文件被加入队列之前触发
					uploaderFile.on('beforeFileQueued', function(file) {
						console.log("当文件被加入队列之前触发");
					});

				*/
                
                
                //当文件被加入队列以后触发
                uploaderFile.on( 'fileQueued', function(file) {

               		 var tableLength = $(self).find("#fileTable"+pickId).length;
               		 if(tableLength == 0){
               			 var tableContainer = '<table class="file-table-container" id="fileTable'+ pickId +'">\
				       				<tr>\
										<th  width="20%">文件名</th><th  width="20%">文件大小KB</th><th  width="25%">上传进度</th><th  width="10%">文件操作</th>\
									</tr>\
    	   					</table>';              
               			 $(self).append(tableContainer);
               		 }
               		 
                	var size = (file.size/1024).toFixed(2);
                	
                	var $trQueued = $('<tr id="'+ file.id +'">\
										<td>\
											<div class="file-Info" title="'+ file.name+'">'+ file.name+'</div>\
										</td>\
										<td>\
											<div class="file-size">'+ size +'</div>\
										</td>\
										<td >\
											<div class="file-progress">\
												<div class="file-progress-bar"></div>\
												<div class="file-progress-value"></div>\
											</div>\
											<div class="file-upload-status">\
												<span class="file-success"></span><span>上传成功</span>\
												<span class="file-fail"></span><span>上传失败</span>\
											</div>\
										</td>\
										<td class="file-operate">\
											<span class="delete" title="删除"></span>\
										</td>\
									</tr>');
                	
                	$("#fileTable"+pickId).append($trQueued);
                	$trQueued.data(file);
                	currentFileQueued ++;

                	 // 删除队列中的文件
                	$trQueued.on('click', '.delete', function() {
                		var trItem = $(this).parent("td").parent("tr");
                		var fileInfo = $(trItem).data()
                		that.removeQueuedFiled(trItem,fileInfo);
                    })

                });
                
                that.uploadSaveFun();
    	        
    	        // 当某个文件的分块在发送前触发，主要用来询问是否要添加附带参数，大文件在开起分片上传的前提下此事件可能会触发多次。
    	        uploaderFile.on('uploadBeforeSend ', function(object, data, headers) {
	            	if(that.tools.isIE()){
	            		 // 解决ie8，ie9走uploadError 并且reason 为http的问题
	            		 headers['Access-Control-Allow-Origin'] = '*';
	    	             headers['Access-Control-Request-Headers'] = 'content-type';
	    	             headers['Access-Control-Request-Method'] = 'POST';
	            	}
    	        });

    	        // 上传过程中触发，携带上传进度。
    	        uploaderFile.on( 'uploadProgress', function( file, percentage ) {
   	        		// console.log("上传进度展示");
    	            var $tr = $( '#'+file.id ),
    	                $percent = $tr.find('.file-progress-value');
    	            
    	            $percent.css( 'width', percentage * 100 + '%' );
    	        });

    	        // 文件上传成功，给item添加成功class, 用样式标记上传成功。
    	        uploaderFile.on( 'uploadSuccess', function(file) {
   	            	// console.log("上传成功");
    	            var successHtml = '<span class="file-success"></span><span>上传成功</span>'
    	            $( '#'+file.id ).find(".file-progress").hide();
    	            $( '#'+file.id ).find(".file-upload-status").show();
    	            $( '#'+file.id ).find(".file-upload-status").empty();
    	            $( '#'+file.id ).find(".file-upload-status").append(successHtml)
    	        });
    	        
    	        // 当所有文件上传结束时触发。
    	        uploaderFile.on( 'uploadSuccess', function(file,response) {
   	            	// console.log("所有文件上传结束时触发");
    	            if(opt.uploadSuccessFun){
    	            	opt.uploadSuccessFun(file,response);
    	            }else{
						var hideBtn = $("#newSaveBtnHide");
						if(!that.tools.isNull(hideBtn) && opt.picAndFile == "all"){
							console.log("开始上传文件");
							$("#newSaveBtnHide").trigger("click");
						}
					}
    	        });
    	        

    	        // 文件上传失败，显示上传出错。
    	        uploaderFile.on( 'uploadError', function( file , reason) {
    	            console.log("上传失败");
    	            console.log(file);
    	            console.log(reason);
    	            
    	            var failHtml = '<span class="file-fail"></span><span>上传失败</span>'
        	            $( '#'+file.id ).find(".file-progress").hide();
        	            $( '#'+file.id ).find(".file-upload-status").show();
        	            $( '#'+file.id ).find(".file-upload-status").empty();
        	            $( '#'+file.id ).find(".file-upload-status").append(failHtml)
    	        });
    	        
    	        // 验证失败抛出的错误。
    	        uploaderFile.on( 'error', function(type, file) {
		        	var name = file.name;  
		            var str="";  
		            switch (type) {
		                case "Q_EXCEED_NUM_LIMIT":
		                    top.showAlert("提示","超过上传文件的数量限制",'info');
		                    break;
		                case "Q_EXCEED_SIZE_LIMIT":
		                	top.showAlert("提示","添加的文件总大小超出",'info');
		                    break;
		                case "Q_TYPE_DENIED":
		                	// str = name+"文件类型 不允许"; 
		                	str = name + "文件类型错误,只能是以" + opts.accept.extensions +"为后缀的文件";
		                	top.showAlert("提示",str,'info');
		                    break;
						case "F_DUPLICATE":
							str = name + "该文件已存在!";
		                	top.showAlert("提示",str,'info');
		                    break;
		                default:
		                	top.showAlert("提示","验证不通过!",'info');
		                    break;
		            }
		        });
                
            },
            initializeDescFileLoad:function(){
            	//  console.log("初始化文件加载，带描述信息");
            	
            	var that = this;

                var currentFileQueued = 0;  // 当前队列中的文件个数
                var opts = {
        	            auto: false,
        	            swf: rootPath+'common/lib/webuploader/Uploader.swf',
        	            server: opt.url || defaultServer,
        	            
        	            // dnd:$(".pic-list-container"),  
        	            // 禁掉整个页面的拖拽功能  如果不禁用，图片拖进来的时候会默认被浏览器打开。
        	            // disableGlobalDnd:true, 
        	            // 选择文件的按钮。可选。
        	            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        	            
        	            pick: {
        	            	id:"#"+pickId,
        	                multiple :true,
        	                innerHTML: '选择文件'
        	            },
        	            accept: {
        	                title: 'Files',
        	                extensions: opt.extensions || '', // 放宽默认值 doc,docx,xlsx,xls,pdf,zip,ppt,pptx
        	            },
        	            
        	            // 不压缩，文件上传前会压缩一把再上传！
        	            resize: false,
        	            // 验证文件总数量, 超出则不允许加入队列
        	            fileNumLimit : opt.fileNumLimit || 200,
        	            // 文件总大小
        	            fileSizeLimit : opt.fileSizeLimit || undefined
        	        }
               
                // 初始化图片加载，无描述信息
                uploaderFile = WebUploader.create(opts);
                
				/**
					 // 当文件被加入队列之前触发
					uploaderFile.on('beforeFileQueued', function(file) {
						console.log("当文件被加入队列之前触发");
					});

				*/
                
                
                //当文件被加入队列以后触发
                uploaderFile.on( 'fileQueued', function(file) {

               		 var tableLength = $(self).find("#fileTable"+pickId).length;
               		 if(tableLength == 0){
               			 var tableContainer = '<table class="file-table-container" id="fileTable'+pickId+'">\
				       				<tr>\
										<th  width="20%">文件名</th><th  width="20%">文件大小KB</th><th  width="25%">文件描述</th><th  width="25%">上传进度</th><th  width="10%">文件操作</th>\
									</tr>\
    	   					</table>';              
               			 $(self).append(tableContainer);
               		 }
               		 
                	var size = (file.size/1024).toFixed(2);
                	
                	var $trQueued = $('<tr id="'+ file.id +'">\
										<td>\
											<div class="file-Info" title="'+ file.name+'">'+ file.name+'</div>\
										</td>\
										<td>\
											<div class="file-size">'+ size +'</div>\
										</td>\
										<td><input type="text" class="file-desc" /></td>\
										<td >\
											<div class="file-progress">\
												<div class="file-progress-bar"></div>\
												<div class="file-progress-value"></div>\
											</div>\
											<div class="file-upload-status">\
												<span class="file-success"></span><span>上传成功</span>\
												<span class="file-fail"></span><span>上传失败</span>\
											</div>\
										</td>\
										<td class="file-operate">\
											<span class="delete" title="删除"></span>\
										</td>\
									</tr>');
                	
                	$("#fileTable"+pickId).append($trQueued);
                	$trQueued.data(file);
                	currentFileQueued ++;

                	 // 删除队列中的文件
                	$trQueued.on('click', '.delete', function() {
                		var trItem = $(this).parent("td").parent("tr");
                		var fileInfo = $(trItem).data()
                		that.removeQueuedFiled(trItem,fileInfo);
                    })

                });
                
                that.uploadSaveFun();
    	        
    	        // 当某个文件的分块在发送前触发，主要用来询问是否要添加附带参数，大文件在开起分片上传的前提下此事件可能会触发多次。
    	        uploaderFile.on('uploadBeforeSend ', function(object, data, headers) {
	            	if(that.tools.isIE()){
	            		 // 解决ie8，ie9走uploadError 并且reason 为http的问题
	            		 headers['Access-Control-Allow-Origin'] = '*';
	    	             headers['Access-Control-Request-Headers'] = 'content-type';
	    	             headers['Access-Control-Request-Method'] = 'POST';
	            	}
	            	
	                // 添加描述信息
	            	var desc = $("#"+data.id).find(".file-desc").val();
	            	data.fileDescription= desc;
    	        });

    	        // 上传过程中触发，携带上传进度。
    	        uploaderFile.on( 'uploadProgress', function( file, percentage ) {
   	        		// console.log("上传进度展示");
    	            var $tr = $( '#'+file.id ),
    	                $percent = $tr.find('.file-progress-value');
    	            
    	            $percent.css( 'width', percentage * 100 + '%' );
    	        });

    	        // 文件上传成功，给item添加成功class, 用样式标记上传成功。
    	        uploaderFile.on( 'uploadSuccess', function(file) {
   	            	// console.log("上传成功");
    	            var successHtml = '<span class="file-success"></span><span>上传成功</span>'
    	            $( '#'+file.id ).find(".file-progress").hide();
    	            $( '#'+file.id ).find(".file-desc").attr("disabled","disabled");
    	            $( '#'+file.id ).find(".file-upload-status").show();
    	            $( '#'+file.id ).find(".file-upload-status").empty();
    	            $( '#'+file.id ).find(".file-upload-status").append(successHtml)
    	        });
    	        
    	        // 当所有文件上传结束时触发。
    	        uploaderFile.on( 'uploadFinished', function(file) {
   	            	// console.log("所有文件上传结束时触发");
    	            if(opt.uploadSuccessFun){
    	            	opt.uploadSuccessFun();
    	            }else{
						var hideBtn = $("#newSaveBtnHide");
						if(!that.tools.isNull(hideBtn) && opt.picAndFile == "all"){
							console.log("开始上传文件");
							$("#newSaveBtnHide").trigger("click");
						}
					}
    	        });
    	        

    	        // 文件上传失败，显示上传出错。
    	        uploaderFile.on( 'uploadError', function( file , reason) {
    	            console.log("上传失败");
    	            console.log(file);
    	            console.log(reason);
    	            
    	            var failHtml = '<span class="file-fail"></span><span>上传失败</span>'
        	            $( '#'+file.id ).find(".file-progress").hide();
        	            $( '#'+file.id ).find(".file-upload-status").show();
        	            $( '#'+file.id ).find(".file-upload-status").empty();
        	            $( '#'+file.id ).find(".file-upload-status").append(failHtml)
    	        });
    	        
    	        // 验证失败抛出的错误。
    	        uploaderFile.on( 'error', function(type, file) {
		        	var name = file.name;  
		            var str="";  
		            switch (type) {
		                case "Q_EXCEED_NUM_LIMIT":
		                    top.showAlert("提示","超过上传文件的数量限制",'info');
		                    break;
		                case "Q_EXCEED_SIZE_LIMIT":
		                	top.showAlert("提示","添加的文件总大小超出",'info');
		                    break;
		                case "Q_TYPE_DENIED":
		                	// str = name+"文件类型 不允许"; 
		                	str = name + "文件类型错误,只能是以" + opts.accept.extensions +"为后缀的文件";
		                	top.showAlert("提示",str,'info');
		                    break;
						case "F_DUPLICATE":
							str = name + "该文件已存在!";
		                	top.showAlert("提示",str,'info');
		                    break;
		                default:
		                	top.showAlert("提示","验证不通过!",'info');
		                    break;
		            }
		        });
                
            },
            againAddFileDescFileLoad:function(){
            	//  console.log("初始化文件加载，带描述信息       文件修改页面新增");
            	
            	var that = this;
            	var opts = {
        	            auto: false,
        	            swf: rootPath+'common/lib/webuploader/Uploader.swf',
        	            server: opt.url || defaultServer,
        	            
        	            // dnd:$(".pic-list-container"),  
        	            // 禁掉整个页面的拖拽功能  如果不禁用，图片拖进来的时候会默认被浏览器打开。
        	            // disableGlobalDnd:true, 
        	            // 选择文件的按钮。可选。
        	            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        	            
        	            pick: {
        	            	id:"#"+pickId,
        	                multiple :true,
        	                innerHTML: '选择文件'
        	            },
        	            accept: {
        	                title: 'Files',
        	                extensions: opt.extensions ||  '', // 放宽默认值 doc,docx,xlsx,xls,pdf,zip,ppt,pptx
        	            },
        	            
        	            // 不压缩，文件上传前会压缩一把再上传！
        	            resize: false,
        	            // 验证文件总数量, 超出则不允许加入队列
        	            fileNumLimit : opt.fileNumLimit || 200
        	        };
            	
                uploaderFile = WebUploader.create(opts);
           
                // 当文件被加入队列之前触发
                uploaderFile.on('beforeFileQueued', function(file) {
               		// console.log("当文件被加入队列之前触发");
                	var currentTrLength = $("#viewFileContainer .items-tr").length;
                	if(opt.fileNumLimit <= currentTrLength){
                		 top.showAlert("提示","超过上传文件的数量限制",'info');
		                 return false;
                	}
                	
                	var alreadyUpdate = $("#viewFileContainer").find(".update-items");
                	if(alreadyUpdate.length > 0){
                		console.log(file.name);
                		for(var i = 0 ; i < alreadyUpdate.length; i++){
                			console.log($(alreadyUpdate[i]).find(".file-name").html())
                			if(file.name == $(alreadyUpdate[i]).find(".file-name").html()){
    		                	top.showAlert("提示",file.name + "该文件已存在!",'info');
                				return false;
                			}
                		}
                	}

                });
                
                //当文件被加入队列以后触发
                uploaderFile.on( 'fileQueued', function(file) {
                	var detailTable = $(self).find(".file-detail-table");
               		// console.log(detailTable);
                 	if(detailTable.length == 0){
             			 var tableHTML = '<table class="file-detail-table">\
 				         					<tr class="detail-head">\
 				     						<th>文件名称</th><th>文件大小KB</th><th>文件描述</th><th>文件操作</th>\
 				     					</tr>\
 				     				</table>';              
            			 //  $(tableHTML).insertBefore($(self).find(".again-add-btn"));
             			 $(self).append(tableHTML);
                 	} 
					// 允许修改文件名
                	// var $trQueued = $('<tr id="'+ file.id +'" class="items-tr again-add-items">\
					// 			 		<td><input type="text" class="file-name" value="'+ file.name +'"></td>\
					// 			 		<td>'+ file.size +'</td>\
					// 			 		<td><input type="text" class="file-description" value=""></td>\
					// 			 		<td class="file-operate">\
					// 			 			<span class="delete" title="删除"></span>\
					// 			 		</td>\
					// 			 	</tr>');
                 	
                 	var size = (file.size/1024).toFixed(2);
                	
					// 不允许修改文件名
					var $trQueued = $('<tr id="'+ file.id +'" class="items-tr again-add-items">\
									<td class="file-name" title="'+ file.name +'">'+ file.name +'</td>\
									<td>'+ size +'</td>\
									<td><input type="text" class="file-description" value=""></td>\
									<td class="file-operate">\
										<span class="delete" title="删除"></span>\
										<a href="#" style="visibility:hidden;"><span class="download" title="下载"></span></a>\
										<span class="preview" title="预览" style="visibility:hidden;"></span>\
									</td>\
								</tr>');
                	$(self).find(".file-detail-table").append($trQueued);
                	$trQueued.data(file);
                	
                	 // 删除队列中的文件
                	$trQueued.on('click', '.delete', function() {
                		var trItem = $(this).parent("td").parent("tr");
                		var fileInfo = $(trItem).data()
                		that.removeQueuedFiled(trItem,fileInfo);
                    })

                });
                
                that.uploadSaveFun();
    	        
    	        // 当某个文件的分块在发送前触发，主要用来询问是否要添加附带参数，大文件在开起分片上传的前提下此事件可能会触发多次。
                uploaderFile.on('uploadBeforeSend ', function(object, data, headers) {
	            	if(that.tools.isIE()){
	            		 // 解决ie8，ie9走uploadError 并且reason 为http的问题
	            		 headers['Access-Control-Allow-Origin'] = '*';
	    	             headers['Access-Control-Request-Headers'] = 'content-type';
	    	             headers['Access-Control-Request-Method'] = 'POST';
	            	}
	            	
	            	// 添加描述信息
	            	var desc = $("#"+data.id).find(".file-description").val();  
	            	data.fileDescription= desc;
    	        });


				/**
				 	
				 	// 某个文件开始上传前触发，一个文件只会触发一次。  现修改页面不允许修改文件名
	                uploaderFile.on( 'uploadStart', function(file) {
			        	console.log("文件开始上传前触发  一个文件只会触发一次");
			        	console.log(file);
			        	var fileName = $("#"+file.id).find(".file-name").val();
			        	file.name = fileName;
			        });
		        
					 // 上传过程中触发，携带上传进度。
					uploaderFile.on( 'uploadProgress', function( file, percentage ) {
						console.log("上传进度展示");
					});

					// 文件上传成功，给item添加成功class, 用样式标记上传成功。
					uploaderFile.on( 'uploadSuccess', function(file) {
						console.log("上传成功");
					});

				*/

    	        // 当所有文件上传结束时触发。
                uploaderFile.on( 'uploadFinished', function(file) {
   	            	// console.log("所有文件上传结束时触发");
    	            if(opt.uploadSuccessFun){
    	            	opt.uploadSuccessFun();
    	            }
    	        });
    	        
    	        // 文件上传失败，显示上传出错。
                uploaderFile.on( 'uploadError', function( file , reason) {
    	            console.log("上传失败");
    	            console.log(file);
    	            console.log(reason);
    	            top.showAlert("提示",file.name+" 上传失败",'info');
    	        });
    	        
    	        // 验证失败抛出的错误。
                uploaderFile.on( 'error', function(type, file) {
		        	var name = file.name;  
		            var str="";  
		            switch (type) {
		                case "Q_EXCEED_NUM_LIMIT":
		                    top.showAlert("提示","超过上传文件的数量限制",'info');
		                    break;
		                case "Q_EXCEED_SIZE_LIMIT":
		                	top.showAlert("提示","添加的文件总大小超出",'info');
		                    break;
		                case "Q_TYPE_DENIED":
		                	// str = name+"文件类型 不允许";
		                	str = name + "文件类型错误,只能是以" + opts.accept.extensions + "为后缀的文件";
		                	top.showAlert("提示",str,'info');
		                    break;
						case "F_DUPLICATE":
							str = name + "该文件已存在!";
		                	top.showAlert("提示",str,'info');
		                    break;
		                default:
		                	top.showAlert("提示","验证不通过!",'info');
		                    break;
		            }
		        });
            },
            removeQueuedFiled:function(ele,file){
            	if(opt.fileType == "pic"){
            		// 删除队列内的文件
                	uploaderPic.removeFile(file,true);
                	$(ele).remove();
            	}else{
            		var markEle = ele;
        			// 删除队列内的文件
            		uploaderFile.removeFile(file,true);
            		
            		var trLength = $(ele).parent("tbody").children("tr").length;
            		
            		if(trLength == 2){
            			$(ele).parent("tbody").parent("table").remove();
            		}else{
            			$(ele).remove(); 	
            		}
                		
            	}
            	
            },
            uploadClickFun:function(e){
            	var that = this;
				if ( e && e.preventDefault ){
					//阻止默认浏览器动作(W3C) 
					e.preventDefault(); 
				} else {
					//IE中阻止函数器默认动作的方式 
					window.event.returnValue = false; 
				}
				if(opt.uploadBeforeFun){
					var businessId = opt.uploadBeforeFun();
					if(that.tools.isNull(businessId) || businessId==false){
						console.log("此时业务id为null，从页面标签获取");
						businessId = $("#newId").val();
						if(!that.tools.isNull(businessId)){
							console.log("根据从页面获取的新业务id开始上传");
							if(opt.fileType == "pic"){
								uploaderPic.option('server', opt.url+"?businessId="+businessId+"&moduleCode="+moduleCode+"&folderId="+folderId+"&fileType="+fileType+"&businessType="+ businessType +"&token="+localStorage.getItem("token"));
								uploaderPic.upload();
							}else{
								uploaderFile.option('server', opt.url+"?businessId="+businessId+"&moduleCode="+moduleCode+"&folderId="+folderId+"&fileType="+fileType+"&businessType="+ businessType +"&token="+localStorage.getItem("token"));
								uploaderFile.upload();
							}
						}else{
							if(opt.fileType == "pic"){
								var pics = uploaderPic.getFiles();
								if(pics.length>0){
									for(var i = 0; i < pics.length;i++ ){
										uploaderPic.stop(pics[i]);
									}
								}
							}else{
								var files = uploaderFile.getFiles();
								if(files.length>0){
									for(var i = 0; i < files.length;i++ ){
										uploaderFile.stop(files[i]);
									}
								}
							}
						}
					}else{
						console.log("开始上传");
						if(opt.fileType == "pic"){
							uploaderPic.option('server', opt.url+"?businessId="+businessId+"&moduleCode="+moduleCode+"&folderId="+folderId+"&fileType="+fileType+"&businessType="+ businessType +"&token="+localStorage.getItem("token"));
							uploaderPic.upload();
						}else{
							uploaderFile.option('server', opt.url+"?businessId="+businessId+"&moduleCode="+moduleCode+"&folderId="+folderId+"&fileType="+fileType+"&businessType="+ businessType +"&token="+localStorage.getItem("token"));
							uploaderFile.upload();
						}
					}
				}else{
					businessId = $("#newId").val();
					if(!that.tools.isNull(businessId)){
						console.log("根据从页面获取的新业务id开始上传");
						if(opt.fileType == "pic"){
							uploaderPic.option('server', opt.url+"?businessId="+businessId+"&moduleCode="+moduleCode+"&folderId="+folderId+"&fileType="+fileType+"&businessType="+ businessType +"&token="+localStorage.getItem("token"));
							uploaderPic.upload();
						}else{
							uploaderFile.option('server', opt.url+"?businessId="+businessId+"&moduleCode="+moduleCode+"&folderId="+folderId+"&fileType="+fileType+"&businessType="+ businessType +"&token="+localStorage.getItem("token"));
							uploaderFile.upload();
						}
					}else{
						if(opt.fileType == "pic"){
							var pics = uploaderPic.getFiles();
							if(pics.length>0){
								for(var i = 0; i < pics.length;i++ ){
									uploaderPic.stop(pics[i]);
								}
							}
						}else{
							var files = uploaderFile.getFiles();
							if(files.length>0){
								for(var i = 0; i < files.length;i++ ){
									uploaderFile.stop(files[i]);
								}
							}
						}
					}
				}
			},
            uploadSaveFun:function(){
            	var that = this;
            	if(!that.tools.isNull(uploadBtn)){
            		$(uploadBtn).on("click",function(e){
						that.uploadClickFun(e);
            		})
            	}else{
					if(opt.picAndFile == "all"){
						// console.log($(self));
						$(self).append("<span id='newSaveBtnHide' style='display:none'></span>");
						$("#newSaveBtnHide").on("click",function(e){
							that.uploadClickFun(e);
						})
					}
				}
            },
            tools:{
                isIE:function(){
                    if (!!window.ActiveXObject || "ActiveXObject" in window){
    	                 return true;
    	            }else{
    	                 return false;
                    }
                },
                isNull:function(param) {
                    if (param == "" || param == null || param == undefined || param == "null") {
                        return true;
                    } else {
                        return false;
                    }
                   
                }
            }
            
         }
    	 return extendWebUploader.init();
    } 
})(jQuery);