/** 
 * @file
 * @author  xxx
 * @desc  文件上传
 * @date  2017-08-15
 * @last modified by xxx
 * @last modified time  2017-08-15
 */

;(function($){
    "use strict";
    $.fn.extendFileUpload = function(opt){
        var $self = $(this);
        
        var dataQueue = [];
        
        
        // 无拖拽的模板
        var selfTableTemplateNo = ' <div class="fileupload"><p class="table-head-title">附件:</p>\
            <table class="table-content" id="table-content">\
                <tr>\
                    <th width="25%">文件</th>\
                    <th width="25%">文件描述</th>\
                    <th width="25%">上传进度</th>\
                    <th width="25%">文件操作</th>\
                </tr>\
                <tr class="table-row">\
                    <td class="upload-file-content"><input type="file" name="file"><span class="file-name"></span></td>\
                    <td><input type="text" class="file-description" placeholder="添加文件描述"></td>\
                    <td>\
                        <div class="progress-content">\
                            <div class="progress-value">\
                                <div class="progress-bar"></div>\
                            </div>\
                            <div class="upload-success"><span class="success-icon">上传成功</span></div>\
                            <div class="upload-error"><span class="error-icon">上传失败</span></div>\
                        </div>\
                    </td>\
                    <td class="operate">\
        				<a href="#" title="上传" class="upload-or-cancel upload-row" style="display:none"></a>\
                        <a href="#" title="添加" class="add-row"></a>\
                        <a href="#" title="删除" class="delete-row"></a>\
                    </td>\
                </tr>\
            </table></div>';

        // 有拖拽功能的模板
        var selfTableTemplate = '<div class="fileupload"><div class="upload-container">\
                    <b>拖入文件上传</b>\
                    <p>or</p>\
                    <div class="upload-button">选择文件</div>\
                    <input id="uploadFile" type="file" name="file[]" multiple style="width:100%;height:100%;position: absolute;left:0;top:0;opacity: 0;filter:alpha(opacity=0)" >\
                </div>\
                 <table class="table-content drop-show" id="table-content">\
                    <tr>\
                        <th style="width:25%">文件名</th>\
                        <th style="width:10%">文件大小B</th>\
                        <th style="width:30%">文件描述</th>\
                        <th style="width:20%">上传进度</th>\
                        <th style="width:15%">文件操作</th>\
                    </tr>\
                </table></div>';

       
        var currentProgress; // 用于拖拽上传时当前上传文件
        // 可拖拽上传按钮
        var uploadButton = $('<a href="#" title="上传" class="upload-row upload-or-cancel"></a>').on('click', function () {
            var $this = $(this),
                data = $this.data();
            currentProgress = $(this);
            var $descInfo =  $this.parent("td").parent("tr").find(".file-description");
            $descInfo.attr("disabled","true");
            var descStr = $descInfo.val();
            //  console.log(descStr);
            // console.log(data.files[0]);
            data.files[0].desc = descStr;
            $this
                .off('click')
                .removeClass('upload-row')
                .addClass("cancel-row")
                .attr("title","取消上传")
                .on('click', function () {
                    data.abort();
                });
            data.submit().always(function () {
                $this.css("visibility","hidden");
            });
        });
    
        // var DEFAULTS = {
        //     url: "file-manage/mytest/method1",  // ajax请求的地址
        //     // type: 'post', // 请求方式
        //     // enctype: 'multipart/form-data',   // 请求类型
        //     autoUpload: false,
        //     // maxFileSize:10, // 最大上传文件大小 单位：B
        //     // acceptFileTypes: /(\.|\/)(zip|doc|docx)$/i
        //     // acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i
        // };
        
        // var settings = $.extend({},opt,DEFAULTS);

        // 工具类
        var Tools = {
            init:function(){
                // if(this.isNull(opt)){
                //     // console.log("空") // 默认模板  可拖拽
                //     $self.append($(selfTableTemplate));
                //     this.dragFileAloadAndBindEvent();
                //     this.deleteRowEvent();
                //     // settings = DEFAULTS;
                // }else{
                     // console.log("非空") // 指定模板
                     if(opt.dragAble){
                        // 拖拽
                        //console.log("可拖拽");
                        $self.append($(selfTableTemplate));
                        this.dragFileAloadAndBindEvent();
                        this.deleteRowEvent();
                     }else{
                        // 没有拖拽
                        //console.log("不可拖拽");
                        $self.append($(selfTableTemplateNo));
                        this.operateBtnBindEvent();
                        this.deleteRowEvent();
                        this.everyTrBindUploadEvent();
                     }
                    // settings = $.extend({}, DEFAULTS,opt);
                // }
            },
            isNull:function(param) {
                if (param == "" || param == null || param == undefined) {
                    return true;
                } else {
                    return false;
                }
            },
            operateBtnBindEvent:function(){
                // 添加行
                $(".table-content").on("click","tr .add-row",function(e){
                    e.preventDefault();
                    var trs='<tr>\
                            <td class="upload-file-content"><input type="file" name="file"><span class="file-name"></span></td>\
                            <td><input type="text" name="desc" class="file-description"  placeholder="添加文件描述"></td>\
                            <td>\
                                <div class="progress-content">\
                                    <div class="progress-value">\
                                        <div class="progress-bar"></div>\
                                    </div>\
                                    <div class="upload-success"><span class="success-icon">上传成功</span></div>\
                                    <div class="upload-error"><span class="error-icon">上传失败</span></div>\
                                </div>\
                            </td>\
                                <td class="operate">\
                                <a href="#" title="上传" class="upload-or-cancel upload-row" style="display:none"></a>\
                                <a href="#" title="添加" class="add-row"></a>\
                                <a href="#" title="删除" class="delete-row"></a>\
                            </td>\
                        </tr>';
                            $(trs).insertAfter($(this).parent("td").parent("tr"));
                            Tools.everyTrBindUploadEvent();
                });

                $(".table-content").on("click","tr .file-description",function(e){
                	console.log($(this))
                	$(this).blur(function(){
                		console.log("失去焦点");
                		console.log($(this).val())
                	});
                });
                // 上传或取消上传
                $(".table-content").on("click","tr .upload-or-cancel",function(e){
                    e.preventDefault();
                    var $that = $(this);
                    var data = $that.data();
                    var cnt = 0;
                    for(var o in data){
                        cnt++;
                    };
                    if(cnt == 0){
                        alert("请先选择文件！");
                        return 
                    }

                    $(".table-content").find(".upload-or-cancel").removeClass("active");
                    var $descInfo =   $that.parent("td").parent("tr").find(".file-description");
                    $descInfo.attr("disabled","true");
                    var descStr = $descInfo.val();
                    // console.log(descStr);
                    // console.log(data.files[0]);
                    data.files[0].desc = descStr;
//                    $that
//                        .off('click')
//                        .removeClass('upload-row')
//                        .addClass('cancel-row')
//                        .addClass('active')
//                        .attr("title","取消上传")
//                        .on('click', function () {
//                            data.abort();
//                        });
                    data.submit().always(function () {
//                        $that.css("visibility","hidden");
                    	  $that.attr("disabled","true");
                    });
                });
            },
            everyTrBindUploadEvent:function(){
                var that  = this;
                $(".upload-file-content input[type='file']").fileupload(opt)
                .on('fileuploadadd', function (e, data) {
                	var dataItems = data;
                	dataQueue.push(dataItems);
                    // console.log('fileuploadadd');
                    var $this =  $(this);
                    var currentTd = $this.parent("td");
                    var fileName=data.files[0].name;
                    var fileSize=data.files[0].size;
                    $this.fadeOut("slow",function(){
                        currentTd.find(".file-name").html(fileName).fadeIn("slow");
                    });
                    // 是否开启自动上传
                    if(opt.autoUpload){
                        currentTd.parent("tr").find(".upload-or-cancel").addClass("active").data(data);
                    }else{
                        currentTd.parent("tr").find(".upload-or-cancel").data(data);
                    }
                    // 校验
                    that.rulesValidation(currentTd.parent("tr"),data,fileName,fileSize);
                    that.submitFun();

                }).on('fileuploadprogressall', function (e, data) {
                    // console.log('fileuploadprogressall');
                    var $uploadBtn =  $(".table-content").find(".active");
                    var bar = $uploadBtn.parent("td").parent("tr").find(".progress-bar");
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    $(bar).css(
                        'width',progress + '%'
                    );
                }).on('fileuploaddone', function (e, data) {
                    // console.log('fileuploaddone');
                    var $uploadBtn =  $(".table-content").find(".active");
                    $uploadBtn.parent("td").parent("tr").find(".progress-value").fadeOut("slow",function(){
                        $uploadBtn.parent("td").parent("tr").find(".upload-success").fadeIn("slow");
                    });
                    var $descInfo =  $uploadBtn.parent("td").parent("tr").find(".file-description");
                    $descInfo.attr("disabled","true");
                    if(opt.callback){
                    	console.log("有回调函数");
                    	opt.callback();
                    }
                    
                }).on('fileuploadfail', function (e, data) {
                    // console.log('fileuploadfail');
                    var $uploadBtn =  $(".table-content").find(".active");
                    $uploadBtn.parent("td").parent("tr").find(".progress-value").fadeOut("slow",function(){
                        $uploadBtn.parent("td").parent("tr").find(".upload-error").fadeIn("slow");
                    });
                    
                });
                $(".upload-file-content input[type='file']").bind('fileuploadsubmit', function (e, data) {
                	
//                	if(opt.submitBefore){
//                		submitBefore()
//                	}
                	var businessId = saveTestPipelineProject();
                	console.log(businessId);

                	var descInfo = $(this).parent("td").siblings("td").children("input").val();
                	console.log(descInfo);

                   
	            	$(".upload-file-content input[type='file']").fileupload("option",{
	            		 url:opt.url+"?businessId="+businessId+"&moduleCode=samples"
	            	})
	            	
//                    data.formData = {
//                    	 desc:descInfo,
////	            		 businessId: businessId
//                    };  //如果需要额外添加参数可以在这里添加

                });
            },
            deleteRowEvent:function(){
                // 删除行
                $(".table-content").on("click","tr .delete-row",function(e){
                    e.preventDefault();
                    $(this).parent("td").parent("tr").remove();
                });
            },
            rulesValidation:function(ele,data,fileName,fileSize){
                // 文件类型校验
                if(opt.acceptFileTypes){
                    var regResult = opt.acceptFileTypes.test(fileName)
                    if(!regResult){
                        alert(fileName+" 文件类型错误");
                        this.checkErrorHandler(ele);
                    }
                }
                // 文件大小校验
                if(opt.maxFileSize){
                    if(fileSize>opt.maxFileSize){
                        alert(fileName+" 文件太大");
                        this.checkErrorHandler(ele);
                    }
                }
                if(opt.minFileSize){
                    if(fileSize<opt.minFileSize){
                        alert(fileName+" 文件太小");
                        this.checkErrorHandler(ele);
                    }
                }
            },
            checkErrorHandler:function(ele){
                ele.find(".file-description").attr("disabled","true");
                var subBtn = ele.find(".upload-or-cancel");
                subBtn.removeClass("upload-or-cancel").removeClass("active").addClass("error-row").attr("title","不可上传");
            },
            submitFun:function(){
            	console.log("submit");
            	var submitBtn = opt.submitBtn;
            	if(!this.isNull(submitBtn)){
            		console.log("有提交按钮");
            		$(submitBtn).on("click",function(){
            			for(var i = 0; i < dataQueue.length; i++){
            				console.log(dataQueue[i]);
            				dataQueue[i].submit();
            			} 
            		})
            	}
            },
            dragFileAloadAndBindEvent:function(){
                var that = this;
                // 文件上传初始化
                 $('#uploadFile').fileupload(opt)
                .on('fileuploadadd', function (e, data) {
                   
                    $(".table-content").removeClass("drop-show");
                    $.each(data.files, function (index, file) {
//                        var btn = uploadButton.clone(true).data(data);
                        var node = '<tr class="'+file.lastModified+'"><td>'+file.name+'</td>\
                                    <td>'+file.size+'</td>\
                                    <td><input type="text" name="desc" class="file-description" placeholder="添加文件描述"></td>\
                                    <td>\
                                        <div class="progress-content">\
                                            <div class="progress-value">\
                                                <div class="progress-bar"></div>\
                                            </div>\
                                            <div class="upload-success"><span class="success-icon">上传成功</span></div>\
                                            <div class="upload-error"><span class="error-icon">上传失败</span></div>\
                                        </div>\
                                    </td>\
                                    <td class="operate">\
                                    <a href="#" title="删除" class="delete-row"></a>\
                                    </td></tr>';
                    
                        $(node).appendTo(('#table-content'));
                        $("."+file.lastModified).find(".operate").prepend(btn);

                        if(opt.autoUpload){
                           $("."+file.lastModified).find(".operate").prepend(btn).trigger("click");
                        }
                      
                        // 校验
                        that.rulesValidation($("."+file.lastModified),data,file.name,file.size);
                        
                    });
                }).on('fileuploadprogressall', function (e, data) {
                    // console.log("fileuploadprogressall");
                    var bar = $(currentProgress).parent("td").prev("td").find(".progress-bar");
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    $(bar).css(
                        'width',progress + '%'
                    );
                }).on('fileuploaddone', function (e, data) {
                    // console.log("fileuploaddone");
                    $("."+data.files[0].lastModified).find(".progress-value").fadeOut("slow",function(){
                        $("."+data.files[0].lastModified).find(".upload-success").fadeIn("slow");
                    })

                    var $descInfo =   $("."+data.files[0].lastModified).find(".file-description");
                    $descInfo.attr("disabled","true");

                }).on('fileuploadfail', function (e, data) {
                    //  console.log("fileuploadfail");
                    $("."+data.files[0].lastModified).find(".progress-value").fadeOut("slow",function(){
                        $("."+data.files[0].lastModified).find(".upload-error").fadeIn("slow");
                    })
                })
             }
         }

        return Tools.init();
    }

})(jQuery);