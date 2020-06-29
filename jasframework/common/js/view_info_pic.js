/** 
 * @file
 * @author  xxx
 * @desc  图片预览封装
 * @date  2017-08-15
 * @last modified by xxx
 * @last modified time  2017-08-15
 */

(function($){
    "use strict";

      $.fn.viewInfoPic = function(opt){
         var isOpen = false;
         var viewInfoPicHandler = {
            init:function(){
               if(this.isNull(opt)){
                   // opt为空
                  //  console.log("opt为空");
                   this.bindMouseEvent();
               }else{
                  // console.log("opt为不为空");
                  //  trigger
                  if(opt.trigger == "click"){
                    // console.log("click");
                    this.bindClickEvent();
                    this.closeShade();
                  }else{
                    //  console.log("mouse");
                     this.bindMouseEvent();
                  }
               }
            },
            bindMouseEvent:function(){
                 var $that = this;
                 $(".show-info-table .icon-img").mouseenter(function(){
                    // console.log("进入");
                    $that.getDetailShow(this);
                }).mouseleave(function(){
                    // console.log("离开");
                    $that.getDetailHide();
                })
            },
            getDetailShow:function(ele){
                var eleInfo =  this.getElementInfo(ele);
                var detailImg = '<div class="mouse-show-container"><div class="mouse-img-detail"></div></div>';
                $("body").append(detailImg);
                var offserX = opt.x?opt.x:20,
                    offsetY = opt.y?opt.y:0;
                $("body").find(".mouse-show-container").offset({
                        top:eleInfo.aOffsetTop+offsetY,
                        left:eleInfo.aOffsetLeft+eleInfo.aWidth+offserX
                });
                $("body").find(".mouse-img-detail").css({
                    backgroundImage: 'url("'+eleInfo.imgSrc+'")',
                    filter:"progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+ eleInfo.imgSrc +"',sizingMethod='scale')"
                })
            },
            getDetailHide:function(){
                $("body").find(".mouse-show-container").hide("slow").remove();
            },
            bindClickEvent:function(){
                var $that = this; 
                $(".show-info-table").on("click",".icon-img",function(){
                     var eleInfo =  $that.getElementInfo(this);
                    //  console.log(eleInfo);
                     $that.openShade(eleInfo.imgSrc);
                });
            },
            openShade:function(imgInfo){
                var shadeDetail = '<div class="click-show-container"><div class="click-img-detail"></div></div>';
                $("body").append(shadeDetail);
                $("body").find(".click-img-detail").css({
                  backgroundImage:'url("'+imgInfo+'")',
                  filter:"progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+imgInfo+"',sizingMethod='scale')"
                });
                this.getOpenShadeSize();
                this.windowResize();
                setTimeout(function(){
                   isOpen = true;
                })
            },
            closeShade:function(){
                $("body").click(function(){
                  if(isOpen){
                     $("body").find(".click-show-container").hide("slow").remove();
                      isOpen = false;
                  }
                })
            },
            getElementInfo:function(ele){
                var $self = $(ele);
                var aOffsetTop = $self.offset().top,
                    aOffsetLeft = $self.offset().left,
                    aWidth = $self.outerWidth(),
                    aHeight = $self.outerHeight(),
                    imgSrc = $self.find("img").attr("src");
                return {
                    aOffsetTop:aOffsetTop,
                    aOffsetLeft:aOffsetLeft,
                    aWidth:aWidth,
                    aHeight:aHeight,
                    imgSrc:imgSrc
                }
            },
            getOpenShadeSize:function(){
               var shadow = $("body").find(".click-show-container");
               shadow.width($(window).width());
               shadow.height($(window).height());
            },
            windowResize:function(){
               var $that = this;
                $(window).resize(function() {
                   $that.getOpenShadeSize();
                });
            },
            isNull:function(param) {
              if (param == "" || param == null || param == undefined) {
                  return true;
              } else {
                  return false;
              }
            }
         }

         return viewInfoPicHandler.init();
      }
     
})(jQuery);