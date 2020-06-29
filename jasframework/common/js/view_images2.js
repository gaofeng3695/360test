/** 
 * @file
 * @author  lizhenzhen
 * @desc  查看上传的图片列表与操作
 * @date  2017-10-11 
 * @last modified by lizz
 * @last modified time  2017-10-11 
 */

/**
 * @desc 图片列表
 */
function getPicListInfo(oid,type,addDesc){
	$.ajax({
		url: rootPath+"attachment/getInfo.do?businessId="+oid+"&businessType=pic", //业务唯一性验证
	    type: "get",
	    dataType: "json",
	    success:function(data){
//	    	console.log(data);
	    	if(data.status == 1){
	    		$("#viewPicContainer").append("<ul class='pic-list'></ul>");
	    		/*$("#viewPicContainer").addClass("pic-list");*/
	    		var fileList = data.rows;
	    		if(fileList.length>0){
		    		for(var i = 0; i < fileList.length; i++){
		    			var eventid = fileList[i].eventid,
		    				fileName = fileList[i].fileName,
		    				fileDescription = fileList[i].fileDescription;
		    			getImageItemsInfo(eventid,fileName,fileDescription,type,addDesc);
		    		}
	   
		    		// 绑定点击全图预览
		    		$(".pic-list .list-items").on("click",".items-img",function(e){
	                    viewPicObj.viewPic(this)
	                })
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

/**
 * @desc 单张图片信息
 */
function getImageItemsInfo(eventid,fileName,fileDescription,type,addDesc){
//	var itemsUrl = rootPath+"attachment/getImageBySize.do?eventid="+eventid+"&width=400&height=340&rate=0"; //业务唯一性验证
	var itemsUrl = rootPath+"attachment/getImageBySize.do?eventid="+eventid;
	var lisView = $('<li class="list-items">\
		<div class="items-img" \
		data-original="'+ itemsUrl +'" \
		style="background:url('+ itemsUrl +') no-repeat center;background-size:contain;"></div>\
		<div class="list-info" style="display: block; bottom: 0px; color: rgb(102, 102, 102); background: rgb(241, 241, 241);">\
			<p class="pic-name">'+ fileName +'</p>\
		</div>\
	</li>');
	var lisViewDesc =  $('<li class="list-items  list-items-desc list-items-view">\
			<div class="items-img" \
			data-original="'+ itemsUrl +'" \
			style="background:url('+ itemsUrl +') no-repeat center;background-size:contain;"></div>\
			<div class="list-info" style="display: block; bottom: 0px; color: rgb(102, 102, 102); background: rgb(241, 241, 241);">\
				<p class="pic-name" title="'+ fileName +'">'+ fileName +'</p>\
				<p class="pic-desc" title="'+ fileDescription +'">'+ fileDescription +'</p>\
			</div>\
		</li>');
	var lisUpdate = $('<li class="list-items" id="'+eventid+'">\
			<div class="items-img" \
			data-original="'+ itemsUrl +'" \
			style="background:url('+ itemsUrl +') no-repeat center;background-size:contain;"></div>\
			<div class="list-info" style="display: block; bottom: 0px; color: rgb(102, 102, 102); background: rgb(241, 241, 241);">\
				<input type="text" value="'+ fileName +'" class="pic-name-input"/>\
			</div>\
			<div class="list-operate">\
				<span class="delete"></span>\
			</div>\
		</li>'); 
	var lisUpdateDesc = $('<li class="list-items  list-items-desc" id="'+eventid+'">\
			<div class="items-img" \
			data-original="'+ itemsUrl +'" \
			style="background:url('+ itemsUrl +') no-repeat center;background-size:contain;"></div>\
			<div class="list-info" style="display: block; bottom: 0px; color: rgb(102, 102, 102); background: rgb(241, 241, 241);">\
				<input type="text" value="'+ fileName +'" class="pic-name-input"/>\
				<textarea class="pic-description-input">'+ fileDescription +'</textarea>\
			</div>\
			<div class="list-operate">\
				<span class="delete"></span>\
			</div>\
		</li>'); 
	
	if(type == "update"){
		if(addDesc == "addDesc"){
			$("#viewPicContainer .pic-list").append(lisUpdateDesc);
			$(lisUpdateDesc).on("click",".delete",function(){
				var eId = $(lisUpdate).prop("id");
				console.log(eId);
				$.messager.confirm("提示","您确定要删除该用图片吗？",function(r){
					if (r){
						removeImagesFun(lisUpdateDesc,eId);
					}
				})
			})
		}else{
			$("#viewPicContainer .pic-list").append(lisUpdate);
			$(lisUpdate).on("click",".delete",function(){
				var eId = $(lisUpdate).prop("id");
				console.log(eId);
				$.messager.confirm("提示","您确定要删除该用图片吗？",function(r){
					if (r){
						removeImagesFun(lisUpdate,eId);
					}
				})
			});
		}
		
	}else{
		if(addDesc == "addDesc"){
			$("#viewPicContainer .pic-list").append(lisViewDesc);
		}else{
			$("#viewPicContainer .pic-list").append(lisView);
		}
	}
}

/**
 * @desc 修改图片信息
 */
function updatePicFun(callback){
	var itemsLi = $("#viewPicContainer .pic-list").find(".list-items");
	console.log(itemsLi.length);
	if(itemsLi.length > 0){
		for(var i = 0; i < itemsLi.length; i++ ){
			var oid = $(itemsLi[i]).prop("id"),
				fileName = $(itemsLi[i]).find(".pic-name-input").val(),
				fileDescription =  $(itemsLi[i]).find(".pic-description-input").val();
			var data;
			if(!isNull(fileDescription)){
				data = {
				    	  "oid":oid,
				    	  "fileName":fileName,
				    	  "fileDescription":fileDescription
				    	}
			}else{
				data = {
				    	  "oid":oid,
				    	  "fileName":fileName
				        }
			};
			console.log(data);
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
			    			callback();
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
		callback();
	}
}


/**
 * @desc 删除图片信息
 */
function removeImagesFun(ele,eId){
	$.ajax({
		url: rootPath+"attachment/delete.do?eventids="+eId+"&isShiftDelFile=true", //业务唯一性验证
	    type: "get",
	    dataType: "json",
	    success:function(data){
	    	console.log(data);
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
