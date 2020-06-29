
/**
 * @file
 * @author 作者
 * @desc 网格化查询页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var querySerialize=null;	//查询条件

/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	$('#gpsqueryrealtimestatisticsdatagrid').datagrid({
		idField:'oid',
		url: rootPath+"/realtimestatistics/getPage.do",
		collapsible:true,
		autoRowHeight: false,
		remoteSort:true,
        pagination:false,
        fitColumns: true,
		frozenColumns:[[
			{	
				field:"unitname",
				title:"部门名称",
				width:$(this).width() * 0.22,
				resizable:true,
				align:'center'
			},{	
				field:"inspectorName",
				title:"巡检人员",
				width:$(this).width() * 0.125,
				resizable:true,
				align:'center'
			},
            {
                field:"pathlinerate",
                title:"轨迹线匹配度（%）",
                width:$(this).width() * 0.125,
                resizable:true,
                align:'center',
                formatter: function(value,row,index){
                	if( value == null )
						return '<span title="--"  class="tip tooltip-f">'+"--"+'</span>';
					return '<span title="'+value*100+'"  class="tip tooltip-f">'+value*100+'</span>';
                }
            },
            {
                field:"assessscoreString",
                title:"实时分数",
                width:$(this).width() * 0.125,
                resizable:true,
                align:'center',
                formatter: function(value,row,index){
                    if(row.ykeypointnum == 0 && row.ytemporarykeypointnum == 0 )
                    	return '<span title="--"  class="tip tooltip-f">'+"--"+'</span>';
                    else
                        return '<span title="'+value+'"  class="tip tooltip-f">'+value+'</span>';
                }
            }
			]
		],
			columns: 
				[
					[
						{
							field:"key",
							title:"关键点",
							width:$(this).width() * 0.125,
							resizable:true,
							colspan:4,
							align:'center'
						}
					],
					[
						{	
							field:"ykeypointnum",
							title:"应巡关键点",
                            width:$(this).width() * 0.03125,
							resizable:true,
							align:'center',
                            formatter: function(value,row,index){
                                if(row.ykeypointnum == 0)
                                	return '<span title="--"  class="tip tooltip-f">'+"--"+'</span>';
                                else
                                    return '<span title="'+value+'"  class="tip tooltip-f">'+value+'</span>';
                            }
						},{	
							field:"skeypointnum",
							title:"实巡关键点",
                        	width:$(this).width() * 0.03125,
							resizable:true,
							align:'center',
							formatter: function(value,row,index){
								if(row.ykeypointnum == 0)
									return '<span title="--"  class="tip tooltip-f">'+"--"+'</span>';
			                    else
			                        return '<span title="'+value+'"  class="tip tooltip-f">'+value+'</span>';
							}
						},{	
							field:"ytemporarykeypointnum",
							title:"应巡临时关键点",
                        	width:$(this).width() * 0.03125,
							resizable:true,
							align:'center',
							formatter: function(value,row,index){
								if(row.ytemporarykeypointnum == 0)
									return '<span title="--"  class="tip tooltip-f">'+"--"+'</span>';
			                    else
			                        return '<span title="'+value+'"  class="tip tooltip-f">'+value+'</span>';
							}
						},{	
							field:"stemporarykeypointnum",
							title:"实巡临时关键点",
                        	width:$(this).width() * 0.03125,
							resizable:true,
							align:'center',
							formatter: function(value,row,index){
								if(row.ytemporarykeypointnum == 0)
									return '<span title="--"  class="tip tooltip-f">'+"--"+'</span>';
			                    else
			                        return '<span title="'+value+'"  class="tip tooltip-f">'+value+'</span>';
							}
						}
						]


				],
		onDblClickRow:function(index,indexData){
			// top.getDlg("view_gps_dev_offline_warning.html?oid="+indexData.oid,"viewGpsDevOfflineWarning","详细",700,400,false,true,true);
		},
		onLoadSuccess:function(data){
	    	$('#gpsqueryrealtimestatisticsdatagrid').datagrid('clearSelections'); //clear selected options

            $(".datagrid-header td[field='assessscoreString']").tooltip({
                position: 'bottom',
                content: '<span style="color:#fff">概念：三种分数的综合分数。<br/>' +
                '1、如果有日常任务和临时任务以及标准轨迹线，则分数组成为 日常关键点分数*0.8 + 临时关键点*0.1 + 标准轨迹线*0.1 <br/>' +
                '2、如果只有日常任务和标准轨迹线，则分数组成为日常关键点分数*0.9 + 标准轨迹线*0.1<br/>' +
                '3、如果只有日常任务，则分数即是日常任务的分数<br/>' +
                '4、如果只有临时任务，则分数也就是临时任务的分数</span>',
                onShow: function(){
                    $(this).tooltip('tip').css({
                        backgroundColor: '#666',
                        borderColor: '#666'
                    });
                }
            });

            $(".datagrid-header td[field='ykeypointnum']").tooltip({
                position: 'bottom',
                content: '<span style="color:#fff">注意点：如果是多天一巡，则只有最后一天才算关键点数量。<br/>' +
                '</span>',
                onShow: function(){
                    $(this).tooltip('tip').css({
                        backgroundColor: '#666',
                        borderColor: '#666'
                    });
                }
            });

            $(".datagrid-header td[field='ytemporarykeypointnum']").tooltip({
                position: 'bottom',
                content: '<span style="color:#fff">注意点：如果是多天一巡，则只有最后一天才算临时关键点数量。<br/>' +
                '</span>',
                onShow: function(){
                    $(this).tooltip('tip').css({
                        backgroundColor: '#666',
                        borderColor: '#666'
                    });
                }
            });
	    }
	});
	//页面自适应
	initDatagrigHeight('gpsqueryrealtimestatisticsdatagrid','queryDiv','100');
	initUnitComboTree('unitid');
	
});




