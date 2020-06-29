/** 
 * @file
 * @author  lizhenzhen
 * @desc  查看上传的文件列表与操作
 * @date  2017-10-11 
 * @last modified by lizz
 * @last modified time  2017-10-11 
 */

/**
 * @desc 文件列表信息
 */
function getFileListInfo(oid,type){
	$.ajax({
		url: rootPath+"attachment/getInfo.do?businessId="+oid+"&businessType=file", //业务唯一性验证
	    type: "get",
	    dataType: "json",
	    success:function(data){
//	    	console.log(data);
	    	if(data.status == 1){
	    		var fileList = data.rows;
	    		if(fileList.length>0){
	    			var tableHTML = '<table class="file-detail-table">\
									<tr>\
								<th>文件名称</th><th>文件大小</th><th>文件描述</th><th>文件操作</th>\
							</tr>\
						</table>';
	    			$("#viewFileContainer").append(tableHTML);
	    			if(type == "update"){
	    				$("#viewFileContainer .file-detail-table").addClass("update-file-table");
	    				for(var i = 0; i < fileList.length; i++){
			    			var $tr = $('<tr id="'+ fileList[i].eventid+'" class="items-tr">\
										<td><input type="text" class="file-name" value="'+ fileList[i].fileName +'" /></td>\
										<td>'+ fileList[i].fileSize +'</td>\
										<td><input type="text"  class="file-description" value="'+ fileList[i].fileDescription +'"/></td>\
										<td  class="file-operate">\
											<span class="delete" title="删除"></span></td>\
									</tr>')
			    			$(".file-detail-table").append($tr);
			    		}

	    				$(".file-detail-table .file-operate").on("click",".delete",function(){
	    					var that = this;
	    					$.messager.confirm("提示","您确定要删除该文件吗？",function(r){
		    					if (r){
		    						removeFileFun(that);
		    					}
	    					});
	    				})
	    			}else{
	    				for(var i = 0; i < fileList.length; i++){
			    			var $tr = $('<tr  id="'+ fileList[i].eventid+'" class="items-tr">\
										<td title="'+ fileList[i].fileName +'">'+ fileList[i].fileName +'</td>\
										<td>'+ fileList[i].fileSize  +'</td>\
										<td title="'+ fileList[i].fileDescription +'" >'+ fileList[i].fileDescription +'</td>\
										<td  class="file-operate">\
											<a href="'+rootPath+'attachment/download.do?eventid='+ fileList[i].eventid +'">\
											<span class="download" title="下载"></span></a></td>\
									</tr>')
			    			$(".file-detail-table").append($tr);
			    		}
	    			}
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
 * @desc 删除文件
 */
function removeFileFun(self){
	console.log(self);
	var currentTr = $(self).parent("td").parent("tr");
	console.log(currentTr);
	var eId = $(currentTr).prop("id");
	console.log(eId);
	$.ajax({
		url: rootPath+"attachment/delete.do?eventids="+eId+"&isShiftDelFile=true", //业务唯一性验证
	    type: "get",
	    dataType: "json",
	    success:function(data){
	    	console.log(data);
	    	if(data.status == 1){
	    		$(currentTr).remove();
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
 * @desc 修改文件
 */
function updateFileFun(callback){
	var itemsTr = $("#viewFileContainer .file-detail-table").find(".items-tr");
	console.log(itemsTr.length);
	if(itemsTr.length > 0){
		for(var i = 0; i < itemsTr.length; i++ ){
			var oid = $(itemsTr[i]).prop("id"),
				fileName = $(itemsTr[i]).find(".file-name").val(),
				fileDescription = $(itemsTr[i]).find(".file-description").val();
			$.ajax({
				url: rootPath+"attachment/updateInfo.do", //业务唯一性验证
				type: "post",
				async:false,
				contentType: "application/json;charset=utf-8",
				dataType: "json",
			    data:JSON.stringify({
			    	  "oid":oid,
			    	  "fileName":fileName,
			    	  "fileDescription":fileDescription
			    	}),
			    success:function(data){
			    	if(data.status == 1){
			    		if(i == itemsTr.length-1){
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