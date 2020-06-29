

//Firefox支持属性pageX,与pageY属性，这两个属性已经把页面滚动计算在内了, 
//在Chrome可以通过document.body.scrollLeft，document.body.scrollTop计算出页面滚动位移， 
//而在IE下可以通过document.documentElement.scrollLeft ，document.documentElement.scrollTop 
function getMousePos(event) { 
  var e = event || window.event; 
  var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft; 
  var scrollY = document.documentElement.scrollTop || document.body.scrollTop; 
  var x = e.pageX || e.clientX + scrollX; 
  var y = e.pageY || e.clientY + scrollY; 
  return { 'x': x, 'y': y }; 
} 

function dragAble(e){ 
	var leftWidth = parseInt($("#left").css("width")),
		leftHeight = parseInt($("#left").css("height"));
	if(getMousePos(e).x>=(leftWidth-5)){
		$("#dragBtn").css({
			height:leftHeight,
			display:"block",
			left:leftWidth
		});
		
		var dragObj = createDraggableObject();
		dragObj.init(document.getElementById("dragBtn"));
	}else{
		$("#dragBtn").css({
			display:"none"	
		});
	}
};

/** 
 * @desc 创建可拖拽对象的工厂方法 
 */  
function createDraggableObject() {  
    return {  
        obj: null, left: 0, top: 0,  
        oldX: 0, oldY: 0, isMouseLeftButtonDown: false,  
        init: function (obj) {
            this.obj = obj;  
            var that = this;  
            this.obj.onmousedown = function (args) {  
                var evt = args || event;  
                this.style.zIndex = 100;  
                that.isMouseLeftButtonDown = true;  
                that.oldX = evt.clientX;  
                that.oldY = evt.clientY;  
                if (this.currentStyle) {  
                    that.left = parseInt(this.currentStyle.left);  
                    that.top = parseInt(this.currentStyle.top);  
                }  
                else {  
                    var divStyle = document.defaultView.getComputedStyle(this, null);  
                    that.left = parseInt(divStyle.left);  
                    that.top = parseInt(divStyle.top);  
                }  
            };  
            this.obj.onmousemove = function (args) {  
                that.move(args || event);  
            };  
            this.obj.onmouseup = function () { 
                that.isMouseLeftButtonDown = false;  
                this.style.zIndex = 0; 
                this.style.display="none";
            }; 
            this.obj.onmouseout = function(){
            	 that.isMouseLeftButtonDown = false;  
                 this.style.zIndex = 0; 
                 this.style.display="none";
                 this.onmouseup=null;
            }
        },  
        move: function (evt) {  
            if (this.isMouseLeftButtonDown) {  
                var dx = parseInt(evt.clientX - this.oldX);  
                var dy = parseInt(evt.clientY - this.oldY);  
                var leftX = this.left + dx ;
                
                if(leftX>=200){
                	 this.obj.style.left = (this.left + dx) + 'px';
                	 $("#left").css("width",this.left + dx);
                }else{
                	 this.obj.style.cursor = 'not-allowed';
                	 this.obj.style.display='none';
                	 $("#left").css("width","200px");
                	 this.obj.onmouseup=null;
                }
                
               /* this.obj.style.top = (this.top + dy) + 'px';*/  
            }  
        }  
    };  
}  

