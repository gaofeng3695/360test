/** 
 * @file
 * @author  xxx
 * @desc  图片预览封装
 * @date  2017-08-15
 * @last modified by xxx
 * @last modified time  2017-08-15
 */
function isIE() { //ie?
	 if (!!window.ActiveXObject || "ActiveXObject" in window)
       return true;
     else
       return false;
}
 function resizeImg(i){
	if (!isIE()){
		 var zoom = parseInt(i.style.zoom,10)||100;
			zoom += event.wheelDelta / 12;
			if(zoom > 0 )
			i.style.zoom=zoom+'%';
			return false; 
	 }else{
		 i.style.zoom='0%';
	 }
}
 
//在一个ul列表中查看大图，大图路径存放在一个属性data-original中,运用在jquery中
var viewPicObj = (function() {

    var view = $('<div class="viewWindow"></div>');
    var imgMain = $('<div class="viewMain"></div>');
    var img = $('<img src="" alt="" onmousewheel="return resizeImg(this)">');
    var closed = $('<div class="viewClose"><i>&times;</i></div>');
    var prev = $('<div class="viewLeft">&lt;</div>');
    var next = $('<div class="viewRight">&gt;</div>');

    var index = null;
    var totalLeng = null;
    var src = null;
    var container = null;
    var viewH = null;
    var viewW = null;
    
    var imgH = null;
    var imgW = null;
    
    var flag = null;
    var srcLoad = rootPath+'jasframework/common/image/webuploader/loading.gif';
    

    //打开视图窗口
    var openView = function() {
        flag = true;
        index = 0;
        $("body").addClass("viewer-open");
        $("body").append(view);
        view.append(imgMain);
        imgMain.append(img);
        view.append(closed);
        view.append(prev);
        view.append(next);
        prev.show();
        next.show();
        viewH = view.height();
        viewW = view.width();
        img.css({
            "width": '56px',
            "height": '56px',
            "margin-top": "-28px",
            "margin-left": "-28px"
        });
        

        $(".viewWindow").on("click", ".viewClose", function() {　　　
            closeView();
        });
        $(".viewWindow").on("click", ".viewLeft", function() {
            prevView();
        });
        $(".viewWindow").on("click", ".viewRight", function() {　　　
            nextView();
        });
        
        $(window).on("resize",function(){
  
//        	alert("dkdkdkdk");
        	console.log(111222);
        	var viewH1 = view.height();
            var viewW1 = view.width();
            var h1 = img.height();
            var w1 = img.width();
            img.get(0).style.zoom='0%';

        	if (imgH > viewH1) {
//        		alert("11111");
                img.height(viewH1);
                img.width('auto');
                h1 = viewH1;
                w1 = img.width();
            }else{
            	img.height(imgH);
                img.width('auto');
                h1 = imgH;
                w1 = img.width();
            }
            if (imgW > viewW1) {
//            	alert("2222");
                img.width(viewW1);
                img.height('auto');
                w1 = viewW1;
                h1 = img.height();
            }else{
            	img.width(imgW);
                img.height('auto');
                w1 = imgW;
                h1 = img.height();
            }
            
            img.css({
                "margin-top": -h1 / 2 + "px",
                "margin-left": -w1 / 2 + "px"
            });
        	
        });
  
    };
    //关闭视图窗口
    var closeView = function() {
        $("body").removeClass("viewer-open");
        view.remove();
    };
    //查看上一张
    var prevView = function() {
        if (flag == true) {
            flag = false;
            img.css({
                "width": '56px',
                "height": '56px',
                "margin-top": "-28px",
                "margin-left": "-28px"
            });
            next.show();
            if (index == 1) {
                prev.hide();
            }
            src = container.find("li").eq(index - 1).find(".items-img").attr("data-original");
            img.attr("src", srcLoad);
            imgLocation(src);
            index--;
        }
    };
    //查看下一张
    var nextView = function() {
        if (flag == true) {
            flag = false;
            img.css({
                "width": '56px',
                "height": '56px',
                "margin-top": "-28px",
                "margin-left": "-28px"
            });
           
            prev.show();
            if (index == (totalLeng - 2)) {
                next.hide();
            }
            src = container.find("li").eq(index + 1).find(".items-img").attr("data-original");
            img.attr("src", srcLoad);
            imgLocation(src);
            index++;
        }
    };
    //计算图片的宽高，来确定它显示的位置
    var imgLocation = function(src) {
    	
        getImageWidth(src, function(w, h) {
        	imgW = w;
            imgH = h; 
             
            flag = true;
            img.attr("src", src);
            img.height(h);
            img.width(w);
            if (h > viewH) {
                img.height(viewH);
                img.width('auto');
                h = viewH;
                w = img.width();
            }
            if (w > viewW) {
                img.width(viewW);
                img.height('auto');
                w = viewW;
                h = img.height();
            }
            
            img.css({
                "margin-top": -h / 2 + "px",
                "margin-left": -w / 2 + "px"
            });

        });
  
        $(window).trigger("resize");
    };

    function getImageWidth(url, callback) {
        var img = new Image();
        img.src = url;

        // 如果图片被缓存，则直接返回缓存数据
        if (img.complete) {
            callback(img.width, img.height);
        } else {
            // 完全加载完毕的事件
            img.onload = function() {
                callback(img.width, img.height);
            }
        }

    }
    
    
  
    
    //查看图片
    var viewPic = function(e) {
        openView();
        index = $(e).closest("li").index();
        container = $(e).closest("ul");
        totalLeng = container.find("li").length;
        var totalLeng_temp = totalLeng;
        for(var index_temp=0; index_temp < totalLeng_temp;index_temp++){
        	var src_index = container.find("li").eq(index_temp).find(".items-img").attr("data-original");
        	if(!src_index){
        		totalLeng--;
        	}
        }
        
        src = $(e).attr("data-original");
        img.attr("src", srcLoad);

        if (index == 0) {
            prev.hide();
        }
        if (index == (totalLeng - 1)) {
            next.hide();
        }
        flag = false;
        imgLocation(src);
    };
    return {
        viewPic: viewPic
    }
})();
