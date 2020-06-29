function mapExtentChangeHanlder(extend)
{  
	if(top.isLinkage) 
	{
		if(!top.inLinkage)
		{
    		var iframe3D=top.getEarthIframe();
    		if(iframe3D)
    		{
    			var arr=extend.split(",");
    			var level=arr[2];
    			var iZ=top.mapLevelToZ[level]; 	            			      			         			
    			iframe3D.window.changeTo3D(arr[0],arr[1],iZ);        			
    		} 
		}             		       		
	}            	
}

function zoomToLodAndCenterAt(x,y,level)
{  
	if(top.isLinkage)
	{            		
		//top.inLinkage=true;
		//setTimeout(setInLinkPara,1000);
		top.inLinkage=true;
		setTimeout(setInLinkPara,1000);	 
		var iLevel=Number(level);
		//var nX=Number(x)-38000000;
		//nX=Math.round(nX * 10) / 10;
		//var nY=Number(y);
		//nY=Math.round(nY * 10) / 10;            		
		getMapApp().zoomAt(iLevel,x,y); 
	}          	          	           	           	
} 


function setInLinkPara()
{
	top.inLinkage=false;            	
}

function setIsLinkage(bIsLinage)
{
	top.isLinkage=bIsLinage;
}