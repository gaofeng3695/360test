;(function($){
    "use strict";
     $.ajaxSetup({ cache:false });
     
     $.fn.initializeWebUploader = function (opt){
    	 var uploaderPic,
    	 	 uploaderFile;
    	 
    	 var self = this;
    
         var fileType = opt.fileType || "file",
             addDesc = opt.addDesc || "false",
             uploadBtn = opt.uploadBtn,
             moduleCode = opt.moduleCode || "default";
         
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
//                  var uls = '<ul class="pic-list" id="picList"></ul>',
//                      btnContainer = ' <div class="pic-btn" id="addPicBtn"></div>';
//                		
//                   $(self).append(uls);
//                   $(self).append(btnContainer);
                    // 初始化图片加载
                   if(addDesc == "true"){
                        console.log("pic add desc ");
                        this.initializeDescPicLoad();
                   }else{
                        console.log("pic no desc ");
                        this.initializePicLoad();
                   }
                }else{
                  
                  // 文件
//                   var selectBtn = '<div id="addFile" class="save-btn"></div>';
//                   $(self).append(selectBtn);  
     
                   if(addDesc == "true"){
//                        console.log("file add desc ");
                        this.initializeDescFileLoad()
                   }else{
                        console.log("file no desc ");
                        this.initializeFileLoad();
                   }
                }
               
            },
            initializePicLoad:function(){
//                console.log("初始化图片加载，无描述信息");

                var thumbnailWidth = opt.thumbnailWidth || 120,  // 缩略图宽
                	thumbnailHeight = opt.thumbnailHeight;  120// 缩略图高
                
                var that = this;
  
                // 初始化图片加载，无描述信息
                uploaderPic = WebUploader.create({
    	            auto: false,
//    	            swf: '../lib/webuploader/Uploader.swf',
    	            swf: rootPath+'jasframework/common/lib/webuploader/Uploader.swf',
    	            server: opt.url || defaultServer,
    	            fileNumLimit : opt.fileNumLimit || 200,// 验证文件总数量, 超出则不允许加入队列
    	            //dnd:$(".pic-list-container"),  
    	            // 禁掉整个页面的拖拽功能  如果不禁用，图片拖进来的时候会默认被浏览器打开。
    	            //disableGlobalDnd:true, 
    	            // 选择文件的按钮。可选。
    	            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
    	            pick: {
    	                id:'#addPicBtn',
   	                    multiple :true,
    	                innerHTML: '添加图片'
    	            },
    	            accept: {
    	                title: 'Images',
    	                extensions: opt.extensions || 'gif,jpg,jpeg,bmp,png',
    	                mimeTypes: 'image/*'
    	            }
    	            
//    	           
    	        });

                //当文件被加入队列以后触发
                uploaderPic.on( 'fileQueued', function(file) {
                	console.log(file);
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
                    // $list为容器jQuery实例
                    $("#picList").append( $li);
                    
                    var $img = $li.find('.img');

                    // 删除队列中的文件
                    $li.on('click', '.delete', function() {
                    	console.log("删除");
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
                
//    	        if(that.tools.isIE()){
//    	            // 解决ie8，ie9走uploadError 并且reason 为http的问题
//    	            var setHeader = function(object, data, headers) {
//    	            	console.log(object);
//    	            	console.log(data);
// 
//    	                headers['Access-Control-Allow-Origin'] = '*';
//    	                headers['Access-Control-Request-Headers'] = 'content-type';
//    	                headers['Access-Control-Request-Method'] = 'POST';
//    	            }
//    	            uploaderPic.on('uploadBeforeSend ', setHeader);
//    	        };
    	        
    	        // 当某个文件的分块在发送前触发，主要用来询问是否要添加附带参数，大文件在开起分片上传的前提下此事件可能会触发多次。
    	        uploaderPic.on('uploadBeforeSend ', function(object, data, headers) {
//    	        	console.log(object);
//	            	console.log(data);
//	            	console.log(uploaderPic.option( 'server'));
	            	if(that.tools.isIE()){
	            		 // 解决ie8，ie9走uploadError 并且reason 为http的问题
	            		headers['Access-Control-Allow-Origin'] = '*';
    	                headers['Access-Control-Request-Headers'] = 'content-type';
    	                headers['Access-Control-Request-Method'] = 'POST';
	            	}
//     	           	添加附加信息的
	            	var desc = null;
	            	//添加附加信息的
	            	data.fileDescription = desc;
    	        });
    	        
//    	        // 当开始上传流程时触发
//    	        uploaderPic.on( 'uploadStart', function( file, percentage ) {
//    	        	console.log(file);
//    	        	console.log("开始上传");
//    	        });
    	        
//    	        
//    	        // 当开始上传流程暂停时触发
//    	        uploaderPic.on( 'stopUpload', function( file, percentage ) {
//    	        	console.log("stopUpload");
//    	        });
//    	        
//    	        // 当所有文件上传结束时触发。
//    	        uploaderPic.on( 'uploadFinished', function( file, percentage ) {
//    	        	console.log("开始完成");
//    	        });

    	        // 上传过程中触发，携带上传进度。
    	        uploaderPic.on( 'uploadProgress', function( file, percentage ) {
//    	        	console.log("上传进度展示");
    	            var $li = $( '#'+file.id );
    	            	$li.find('.pic-progress').show();
    	            var $percent = $li.find('.progress-value');
    	            
    	            $percent.css( 'width', percentage * 100 + '%' );
    	        });

    	        // 文件上传成功，给item添加成功class, 用样式标记上传成功。
    	        uploaderPic.on( 'uploadSuccess', function(file) {
//    	            console.log("上传成功");
    	            var successHtml = '<span class="success" title="上传成功"></span>'
    	            $( '#'+file.id ).find(".pic-operate").append(successHtml);
    	            $( '#'+file.id ).addClass('upload-state-done');
    	            
    	        });
    	        
    	        // 当所有文件上传结束时触发。
    	        uploaderPic.on( 'uploadFinished', function(file) {
//    	            console.log("所有文件上传结束时触发");
    	            
    	            if(opt.uploadSuccessFun){
    	            	opt.uploadSuccessFun();
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
    	        
//		        // 不管成功或者失败，文件上传完成时触发
//		        uploaderPic.on( 'uploadComplete', function( file ) {
//		             console.log("不管成功或者失败，文件上传完成时触发");
//		        });

    	        // 验证失败抛出的错误。
    	        uploaderPic.on( 'error', function(type, file) {
		        	var name = file.name;  
		            var str="";  
		            switch (type) {
		                case "Q_EXCEED_NUM_LIMIT":
		                    top.showAlert("提示","超过每次上传图片的数量限制",'info');
		                    break;
		                case "Q_EXCEED_SIZE_LIMIT":
		                	top.showAlert("提示","添加的文件总大小超出",'info');
		                    break;
		                case "Q_TYPE_DENIED":
		                	str = name+"文件类型 不允许"; 
		                	top.showAlert("提示",str,'info');
		                    break;
		                default:
		                	top.showAlert("提示","验证不通过!",'info');
		                    break;
		            }
		        });
 
            },
            initializeDescPicLoad:function(){
                // 初始化图片加载，带描述信息
                console.log("初始化图片加载，带描述信息");
                var thumbnailWidth = opt.thumbnailWidth || 120,  // 缩略图宽
            	thumbnailHeight = opt.thumbnailHeight || 120,// 缩略图高
                descNum = opt.descNum || 200; // 描述信息字数
	            var that = this;
	
	            // 初始化图片加载，无描述信息
	            uploaderPic = WebUploader.create({
		            auto: false,
//		            swf: '../lib/webuploader/Uploader.swf',
		            swf: rootPath+'jasframework/common/lib/webuploader/Uploader.swf',
		            server: opt.url || defaultServer,
		            fileNumLimit : opt.fileNumLimit || 200,// 验证文件总数量, 超出则不允许加入队列
//		            dnd:$(".pic-desc-list"),  
		            // 禁掉整个页面的拖拽功能  如果不禁用，图片拖进来的时候会默认被浏览器打开。
//		            disableGlobalDnd:true, 
		            // 选择文件的按钮。可选。
		            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
		            threads:1,//上传并发数。允许同时最大上传进程数,为了保证文件上传顺序
		            pick: {
		                id:'#addPicBtn',
		                multiple :true,
		                innerHTML: '选择图片'
		            },
		            accept: {
		                title: 'Images',
		                extensions: opt.extensions || 'gif,jpg,jpeg,bmp,png',
		                mimeTypes: 'image/*'
		            }
		        });
            
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
                // $list为容器jQuery实例
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
                
                

////                <textarea id="taContent" rows="3"  maxlength="20" 
//                onchange="this.value=this.value.substring(0, 20)" 
//                	onkeydown="this.value=this.value.substring(0, 20)" 
//                		onkeyup="this.value=this.value.substring(0, 20)" ></textarea>
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
	           	
//            	           添加附加信息的
	            	var desc = $("#"+data.id).find(".file-desc").val();
//	            	console.log(desc);
	            	//添加附加信息的
	            	data.fileDescription= desc;
		        });
		       
	
		        // 上传过程中触发，携带上传进度。
		        uploaderPic.on( 'uploadProgress', function( file, percentage ) {
//		        	console.log("上传进度展示");
		            var $dl = $( '#'+file.id );
		            	$dl.find('.file-progress').show();
		            var $percent = $dl.find('.file-progress-value');
		            $percent.css( 'width', percentage * 100 + '%' );
		        });
	
		        // 文件上传成功，给item添加成功class, 用样式标记上传成功。
		        uploaderPic.on( 'uploadSuccess', function(file) {
//		            console.log("上传成功");
		            $( '#'+file.id ).find(".file-progress").hide();
		            var successHtml = '<span class="file-success"></span><span>上传成功</span>';
		            $( '#'+file.id ).find(".file-upload-status").show();
		            $( '#'+file.id ).find(".file-upload-status").empty();
		            $( '#'+file.id ).find(".file-upload-status").append(successHtml);
		            $( '#'+file.id ).addClass('upload-state-done');
		        });
		        
		        // 当所有文件上传结束时触发。
		        uploaderPic.on( 'uploadFinished', function(file) {
//		            console.log("所有文件上传结束时触发");
		            
		            if(opt.uploadSuccessFun){
		            	opt.uploadSuccessFun();
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
		                    top.showAlert("提示","超过每次上传图片的数量限制",'info');
		                    break;
		                case "Q_EXCEED_SIZE_LIMIT":
		                	top.showAlert("提示","添加的文件总大小超出",'info');
		                    break;
		                case "Q_TYPE_DENIED":
		                	str = name+"文件类型 不允许"; 
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
            },
            initializeDescFileLoad:function(){
            	var that = this;
                // 初始化文件加载，带描述信息
//                console.log("初始化文件加载，带描述信息");
                
                var currentFileQueued = 0;
                
                // 初始化图片加载，无描述信息
                uploaderFile = WebUploader.create({
    	            auto: false,
//    	            swf: '../lib/webuploader/Uploader.swf',
    	            swf: rootPath+'jasframework/common/lib/webuploader/Uploader.swf',
    	            server: opt.url || defaultServer,
    	            //dnd:$(".pic-list-container"),  
    	            // 禁掉整个页面的拖拽功能  如果不禁用，图片拖进来的时候会默认被浏览器打开。
    	            //disableGlobalDnd:true, 
    	            // 选择文件的按钮。可选。
    	            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
    	            pick: {
    	                id:'#addFile',
    	                multiple :true,
    	                innerHTML: '添加文件'
    	            },
    	            accept: {
    	                title: 'Files',
    	                extensions: opt.extensions || 'doc,docx,xlsx,xls,pdf,zip,ppt,pptx',
    	            },
    	            
    	            // 不压缩，文件上传前会压缩一把再上传！
    	            resize: false,
    	            // 验证文件总数量, 超出则不允许加入队列
    	            fileNumLimit : opt.fileNumLimit || 200
    	        });
                
                // 当文件被加入队列之前触发
                uploaderFile.on('beforeFileQueued', function(file) {
//                	console.log("当文件被加入队列之前触发");
                	if(currentFileQueued == 0){
                		 var tableLength = $(self).find("#fileTable").length;
                		 if(tableLength == 0){
                			 var tableContainer = '<table class="file-table-container" id="fileTable">\
				       				<tr>\
										<th  width="20%">文件名</th><th  width="20%">文件大小B</th><th  width="25%">文件描述</th><th  width="25%">上传进度</th><th  width="10%">文件操作</th>\
									</tr>\
     	   					</table>';              
                			 $(self).append(tableContainer);
                		 }
                	} 
                });
                
                //当文件被加入队列以后触发
                uploaderFile.on( 'fileQueued', function(file) {
 
                	var $trQueued = $('<tr id="'+ file.id +'">\
										<td>\
											<div class="file-Info" title="'+ file.name+'">'+ file.name+'</div>\
										</td>\
										<td>\
											<div class="file-size">'+ file.size+'</div>\
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
                	
                	$("#fileTable").append($trQueued);
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
	          
	            	var desc = $("#"+data.id).find(".file-desc").val();
//	            	console.log(desc);
	            	//添加附加信息的
	            	data.fileDescription= desc;
    	        });

    	        // 上传过程中触发，携带上传进度。
    	        uploaderFile.on( 'uploadProgress', function( file, percentage ) {
//    	        	console.log("上传进度展示");
    	            var $tr = $( '#'+file.id ),
    	                $percent = $tr.find('.file-progress-value');
    	            
    	            $percent.css( 'width', percentage * 100 + '%' );
    	        });

    	        // 文件上传成功，给item添加成功class, 用样式标记上传成功。
    	        uploaderFile.on( 'uploadSuccess', function(file) {
//    	            console.log("上传成功");
    	            var successHtml = '<span class="file-success"></span><span>上传成功</span>'
    	            $( '#'+file.id ).find(".file-progress").hide();
    	            $( '#'+file.id ).find(".file-desc").attr("disabled","disabled");
    	            $( '#'+file.id ).find(".file-upload-status").show();
    	            $( '#'+file.id ).find(".file-upload-status").empty();
    	            $( '#'+file.id ).find(".file-upload-status").append(successHtml)
    	        });
    	        
    	        // 当所有文件上传结束时触发。
    	        uploaderFile.on( 'uploadFinished', function(file) {
    	            console.log("所有文件上传结束时触发");''
    	            if(opt.uploadSuccessFun){
    	            	opt.uploadSuccessFun();
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
		                    top.showAlert("提示","超过每次上传图片的数量限制",'info');
		                    break;
		                case "Q_EXCEED_SIZE_LIMIT":
		                	top.showAlert("提示","添加的文件总大小超出",'info');
		                    break;
		                case "Q_TYPE_DENIED":
		                	str = name+"文件类型 不允许"; 
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
            		// 删除队列内的文件
            		uploaderFile.removeFile(file,true);
                	$(ele).remove();
            	}
            	
            },
            uploadSaveFun:function(){
            	var that = this;
            	if(!that.tools.isNull(uploadBtn)){
            		$(uploadBtn).on("click",function(e){
            			if ( e && e.preventDefault ){
            				//阻止默认浏览器动作(W3C) 
            				e.preventDefault(); 
            			} else {
            				//IE中阻止函数器默认动作的方式 
            				window.event.returnValue = false; 
            			}
            			if(opt.uploadBeforeFun){
            				var businessId = opt.uploadBeforeFun();
            				if(opt.fileType == "pic"){
	            				uploaderPic.option('server', opt.url+"?businessId="+businessId+"&moduleCode="+moduleCode+"&businessType=pic");
	                			uploaderPic.upload();
            				}else{
            					uploaderFile.option('server', opt.url+"?businessId="+businessId+"&moduleCode="+moduleCode+"&businessType=file");
	                			uploaderFile.upload();
            				}
            			}
            		})
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
                    if (param == "" || param == null || param == undefined) {
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