function showLayerByUnitid(_self,node,checked,ids){
	$.post(rootPath+"/xncommon/getUnitBo.do?token="+localStorage.getItem("token"),function(result){
		if(result.stauts = 1){
			var hierarchy = result.hierarchy;
			var where = {
					"where":"HIERARCHY like '"+hierarchy+"%'",
					"show":checked
			};
			if(node.attributes.layerSet == false){
				_self.mapApi.updateLayer(node.id,where);
			}else if(ids != null){
				for(var i = 0; i < ids.length ; i++){
					_self.mapApi.updateLayer(ids[i],where);
				}
			}
		}else{
			top.showAlert('错误', '查询出错', 'info');
		}
	})
}

/**
 * 管道保护
 * @returns
 */
function pipeprotect(){
	showDialog1('pipeprotect','管道保护', '../../pipeprotect/gps_construction/mapstatistics/mappipeprotect.html', 430, 650, 10, 60, 23, 23);
//	showDialog1('pipeprotect','管道保护', './demo/demo2.html', 430, 650, 10, 60, 23, 23);
}

/**
 * 关键点管理
 * @returns
 */
function keypointmanage(){
	showDialog1('keypointmanage','关键点管理', '../../linePatrolManage/pathLine/keypoint/query_gps_keypoint_map.html', 430, 650, 10, 60, 23, 23);
}