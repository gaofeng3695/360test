	function reloadData(url, elementId){
		var fra= parent.$("iframe");
		for(var i=0; i<fra.length;i++) {
			if(fra[i].src.indexOf(url) != -1) {
				fra[i].contentWindow.$(elementId).datagrid("reload");
			}
		}
	}
	