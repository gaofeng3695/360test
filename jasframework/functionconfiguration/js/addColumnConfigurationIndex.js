$(document).ready(function() {
	var eventid =getParamter('eventid');
	var viewname =getParamter('viewname');
	var databasetype=getParamter('databasetype');	//数据库类型
	var datasourcename=getParamter('datasourcename');	//数据源名称
	var tablename=getParamter('tablename');	//表名称
//	var functionnumber=getParamter('functionnumber');	//表名称
	$("#tt").tabs({
		onSelect:function(title,index){
				if(index==0){	//字段信息
					$('#addColumn').attr('src','basicFieldsInfo.htm?eventid='+eventid+"&datasourcename="+datasourcename+"&viewname="+viewname+"&tablename="+tablename+"&databasetype="+databasetype);
				}else if(index==1){	//主子表关联信息
					$('#addRelatedColumn').attr('src','relatedTable.htm?sid='+eventid+"&tableid="+viewname+"&dsName="+datasourcename+"&tablename="+tablename+"&databasetype="+databasetype);
				}
		}
	});
});