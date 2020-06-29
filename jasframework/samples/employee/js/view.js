
	/**
	 * 描述：载入数据
	 */
	function loadData() {
		var id1;
		var param = this.location.search;
		if(param != null && "" != param) {
			id1 = getParamter("id");
		}
		if(id1 != null && "" != param) {
			$.getJSON("../../emploryTest/getEmploryeInfo.do?random="+new Date().getTime()
				,{"id":id1}
				,function(emplorye) {
					$("#name").html(emplorye.username);
					$("#sex").html(emplorye.sex);	
				}                       
			);
		} 
	}
		
	/**
	 * 描述：关闭窗口
	 */
	function closeUser(){
		top. closeDlg("viewiframe");
	}