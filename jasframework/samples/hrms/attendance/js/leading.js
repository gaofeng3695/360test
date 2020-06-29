	//绑定表单的ajax事件
    function uploadtable(){
		 $('#uploadform').ajaxForm({
			url: '/platform/hrms/attendance/leading.do',  //文件上传路径
			type: "POST",							//提交方式
			success: function(id)
			{												
				alert("1");
			},
			dataType:"text",						//返回值类型
			async: false							//是否异步提交
		});
	}
    
    function sumbitleading(){
    	$('#uploadform').submit();
    }
    
    $(document).ready(function() {
//    	uploadtable();
		 });
