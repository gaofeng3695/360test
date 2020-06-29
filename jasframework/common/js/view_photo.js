/** 
 * @file
 * @author  xxx
 * @desc  图片预览封装
 * @date  2017-08-15
 * @last modified by xxx
 * @last modified time  2017-08-15
 */

;(function($){
    "use strict";
      $.ajaxSetup({ cache:false });

      $.fn.viewPhoto = function(opt){
         var  $ele = $(this);
         var  uls = '<ul class="pic-list"></ul>';
         var desc = false;  // 是否有文件描述

         var viewPhotoHandle = {
             ajaxResult:null, // ajax请求数据结果
             init:function(){
                 this.sendRequest();
             },
             sendRequest:function(){
                var that = this;
                $.ajax({
                    url:opt.url,
                    type:opt.type?opt.type:"get", // 默认get
                    async:opt.async?opt.async:true, // 默认true
                    data:opt.data?opt.data:null, // 默认为空
                    dataType:opt.dataType?opt.dataType:"json", // 默认"json",
                    success:function(result){
                        console.log(result);
                        that.ajaxResult = result.rows;
                        that.judgeRequestResult();
                        if(!that.isNull(opt.callback)){
                        	opt.callback(result);
                        }    
                    },
                    error:function(a,b,c){
                        console.log(c);
                        // console.log("出错");
                        alert("加载图片请求出错");
                    }
                })
             },
             judgeRequestResult:function(){
                // console.log(this.ajaxResult);
                if(this.isNull(this.ajaxResult)){
                    // console.log("没有请求结果");
                    alert("请求图片列表信息为空");
                }else{
                    // console.log("有请求结果");
                    this.judgeDescInfo();
                }
             },
             judgeDescInfo:function(){
                 if(this.isNull(opt)){
                     this.loadPicNoDesc();
                 }else{
                    //  console.log(opt.isPicInfo);
                     if( !(this.isNull(opt.isPicInfo)) && opt.isPicInfo == true){
                        // console.log("有图片其它描述信息");
                        desc = true;
                        this.loadPicAndDesc();
                        if(opt.isDescPosition == "outside"){
                            // console.log("图片描述信息显示图片外部");
                            $ele.find(".list-items").css({
                                paddingBottom:"45px",
                            });
                            $ele.find(".list-info").css({
                                display:"block",
                                bottom:0,
                                color:"#666",
                                background:"#f1f1f1"
                            })
                        }else{
                            // console.log("图片描述信息显示图片内部");
                            this.hoverEvent();
                        }
                     }else{
                        // console.log("没有图片其它描述信息");
                        desc = false;
                        // 开始加载图片
                        this.loadPicNoDesc();
                     }
                 }
             },
             loadPicNoDesc:function(){
                // console.log("加载没有图片描述信息的Dom");
                var piclist = this.ajaxResult;
                var lis = "";
                 
                // for(var i = 0 ; i < piclist.length; i++){
                //     lis+=(' <li class="list-items"><img src="'+piclist[i].picUrl+'" data-original="'+piclist[i].picUrl+'"></li>');
                // };

                for(var i = 0 ; i < piclist.length; i++){
                	
                     lis+=('<li class="list-items"><div id="' + piclist[i].oid + '" class="items-img" data-original="'+piclist[i].picUrl+'" src="'+piclist[i].picUrl+'" style="background:url('+piclist[i].picUrl+') no-repeat center;background-size:contain;"></div></li>');
                };
                $ele.append($(uls));
                $ele.find(".pic-list").append(lis);
                this.bindClickEvent();
                this.getElementSize();
                this.windowResize();
             },
             loadPicAndDesc:function(){
                // console.log("加载有图片描述信息的Dom");
                var piclistInfo = this.ajaxResult;
                var lis = "";

                // for(var i = 0 ; i < piclistInfo.length; i++){
                //     lis+=(' <li class="list-items"><img src="'+piclistInfo[i].picUrl+'" data-original="'+piclistInfo[i].picUrl+'"><div class="list-info"><p class="pic-name">'+ piclistInfo[i].picName+'</p><p class="pic-desc">'+  piclistInfo[i].picTitle+'</p></div></li>');
                // };

                for(var i = 0 ; i < piclistInfo.length; i++){
                	 console.log(piclistInfo[i].oid);
                    lis+=('<li class="list-items"><input type="checkbox"/><div id="' + piclistInfo[i].oid + '"  class="items-img" data-original="'+piclistInfo[i].picUrl+'" src="'+piclistInfo[i].picUrl+'" style="background:url('+piclistInfo[i].picUrl+') no-repeat center;background-size:contain;"></div><div class="list-info"><p class="pic-name">'+ piclistInfo[i].picName+'</p><p class="pic-desc">'+  piclistInfo[i].picTitle+'</p></div></li>');
                };
                $ele.append($(uls));
                $ele.find(".pic-list").append(lis);
                this.bindClickEvent();
                this.getElementSize();
                this.windowResize();
             },
             hoverEvent:function(){
                $ele.find(".list-items").hover(function(){
                    // console.log("进入");
                    var $self = $(this);
                    $self.find(".list-info").show().animate({
                        bottom:"0"
                    },"slow");
                },function(){
                    // console.log("离开");
                    var $self = $(this);
                    $self.find(".list-info").animate({
                        bottom:"-50px"
                    },"slow",function(){
                        $self.find(".list-info").hide();
                    })
                })
             },
             bindClickEvent:function(){
                var $that = this;
                $(".list-items").on("click",".items-img",function(){
//                     console.log(this);
                    $that.previewPicture(this);
                })
             },
             previewPicture:function(e) {
                viewPicObj.viewPic(e)
             },
             getElementSize:function(){
                var $W = $ele.width(),
                    colNum = opt?(opt.columeNum?opt.columeNum:4):4,
                    itemsHeight = opt?(opt.itemsHeight?opt.itemsHeight:"140px"):"140px";
                    // console.log($W);
                var itemsMarginTop = parseInt($ele.find(".list-items").css("margin-top")),
                    itemsMarginBot = parseInt($ele.find(".list-items").css("margin-bottom")),
                    itemsMarginLeft = parseInt($ele.find(".list-items").css("margin-left")),
                    itemsMarginRight = parseInt($ele.find(".list-items").css("margin-right")),
                	itemsBorder = parseInt($ele.find(".list-items").css("border-width"));
                var itemsW = $W/colNum-(itemsMarginLeft+itemsMarginRight+itemsBorder*3); // 2是边框
                // console.log(itemsW);
                // console.log(itemsHeight);
                $ele.find(".list-items").css({
                    width:itemsW+"px",
                    height:itemsHeight
                })
             },
             windowResize:function(){
                var $that = this;
                $(window).resize(function() {
                   $that.getElementSize();
                });
             },
             isNull:function(param) {
                if (param == "" || param == null || param == undefined) {
                    return true;
                } else {
                    return false;
                }
             },
         }
         return viewPhotoHandle.init();
      }

      
})(jQuery);