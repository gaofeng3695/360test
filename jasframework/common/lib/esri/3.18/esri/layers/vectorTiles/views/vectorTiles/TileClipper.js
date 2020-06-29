// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.18/esri/copyright.txt for details.
//>>built
define("esri/layers/vectorTiles/views/vectorTiles/TileClipper",["require","exports","./Geometry"],function(n,q,l){var p=function(){return function(e,a,b){this.ratio=e;this.x=a;this.y=b}}();n=function(){function e(a,b,c){this.dz=a;this.yPos=b;this.xPos=c}e.prototype.setExtent=function(a){this.finalRatio=4096/a*(1<<this.dz);var b;b=64/this.finalRatio;a>>=this.dz;b>a&&(b=a);this.margin=b;this.xmin=a*this.xPos-b;this.ymin=a*this.yPos-b;this.xmax=this.xmin+a+2*b;this.ymax=this.ymin+a+2*b};e.prototype.reset=
function(a){this.type=a;this._prevIsIn=!1;this.lines=[];this.line=null};e.prototype.moveTo=function(a,b){this._push_line();this._prevIsIn=this._isIn(a,b);this._moveTo(a,b,this._prevIsIn);this._prevPt=new l.Point(a,b);this._firstPt=new l.Point(a,b)};e.prototype.lineTo=function(a,b){var c=this._isIn(a,b),d,g,h,e,m,k;if(c)this._prevIsIn?this._lineTo(a,b,!0):(d=this._prevPt,g=new l.Point(a,b),h=this._intersect(g,d),this._lineTo(h.x,h.y,!0),this._lineTo(g.x,g.y,!0));else{if(this._prevIsIn)g=this._prevPt,
d=new l.Point(a,b),h=this._intersect(g,d),this._lineTo(h.x,h.y,!0);else{var f=this._prevPt;d=new l.Point(a,b);if(!(f.x<=this.xmin&&d.x<=this.xmin||f.x>=this.xmax&&d.x>=this.xmax||f.y<=this.ymin&&d.y<=this.ymin||f.y>=this.ymax&&d.y>=this.ymax)){g=[];if(f.x<this.xmin&&d.x>this.xmin||f.x>this.xmin&&d.x<this.xmin)h=(this.xmin-f.x)/(d.x-f.x),k=f.y+h*(d.y-f.y),k<=this.ymin?m=!1:k>=this.ymax?m=!0:g.push(new p(h,this.xmin,k));if(f.x<this.xmax&&d.x>this.xmax||f.x>this.xmax&&d.x<this.xmax)h=(this.xmax-f.x)/
(d.x-f.x),k=f.y+h*(d.y-f.y),k<=this.ymin?m=!1:k>=this.ymax?m=!0:g.push(new p(h,this.xmax,k));if(f.y<this.ymin&&d.y>this.ymin||f.y>this.ymin&&d.y<this.ymin)h=(this.ymin-f.y)/(d.y-f.y),k=f.x+h*(d.x-f.x),k<=this.xmin?e=!1:k>=this.xmax?e=!0:g.push(new p(h,k,this.ymin));if(f.y<this.ymax&&d.y>this.ymax||f.y>this.ymax&&d.y<this.ymax)h=(this.ymax-f.y)/(d.y-f.y),k=f.x+h*(d.x-f.x),k<=this.xmin?e=!1:k>=this.xmax?e=!0:g.push(new p(h,k,this.ymax));if(0===g.length)e?m?this._lineTo(this.xmax,this.ymax,!0):this._lineTo(this.xmax,
this.ymin,!0):m?this._lineTo(this.xmin,this.ymax,!0):this._lineTo(this.xmin,this.ymin,!0);else if(1<g.length&&g[0].ratio>g[1].ratio)this._lineTo(g[1].x,g[1].y,!0),this._lineTo(g[0].x,g[0].y,!0);else for(h=0;h<g.length;h++)this._lineTo(g[h].x,g[h].y,!0)}}this._lineTo(d.x,d.y,!1)}this._prevIsIn=c;this._prevPt=new l.Point(a,b)};e.prototype.close=function(){var a,b;if(0<this.line.length&&(a=this._firstPt,b=this._prevPt,(a.x!==b.x||a.y!==b.y)&&this.lineTo(a.x,a.y),a=this.line,b=a.length,4<=b&&(a[0].x===
a[1].x&&a[0].x===a[b-2].x||a[0].y===a[1].y&&a[0].y===a[b-2].y)))a.pop(),a[0].x=a[b-2].x,a[0].y=a[b-2].y};e.prototype.result=function(){this._push_line();return 0===this.lines.length?null:this.lines};e.prototype._isIn=function(a,b){return a>=this.xmin&&a<=this.xmax&&b>=this.ymin&&b<=this.ymax};e.prototype._intersect=function(a,b){var c,d;if(b.x>=this.xmin&&b.x<=this.xmax)d=b.y<=this.ymin?this.ymin:this.ymax,c=a.x+(d-a.y)/(b.y-a.y)*(b.x-a.x);else if(b.y>=this.ymin&&b.y<=this.ymax)c=b.x<=this.xmin?this.xmin:
this.xmax,d=a.y+(c-a.x)/(b.x-a.x)*(b.y-a.y);else{d=b.y<=this.ymin?this.ymin:this.ymax;c=b.x<=this.xmin?this.xmin:this.xmax;var g=(c-a.x)/(b.x-a.x),e=(d-a.y)/(b.y-a.y);g<e?d=a.y+g*(b.y-a.y):c=a.x+e*(b.x-a.x)}return new l.Point(c,d)};e.prototype._push_line=function(){this.line&&(1===this.type?0<this.line.length&&this.lines.push(this.line):2===this.type?1<this.line.length&&this.lines.push(this.line):3===this.type&&3<this.line.length&&this.lines.push(this.line));this.line=[]};e.prototype._moveTo=function(a,
b,c){3!==this.type?c&&(a=Math.round((a-(this.xmin+this.margin))*this.finalRatio),b=Math.round((b-(this.ymin+this.margin))*this.finalRatio),this.line.push(new l.Point(a,b))):(c||(a<this.xmin&&(a=this.xmin),a>this.xmax&&(a=this.xmax),b<this.ymin&&(b=this.ymin),b>this.ymax&&(b=this.ymax)),a=Math.round((a-(this.xmin+this.margin))*this.finalRatio),b=Math.round((b-(this.ymin+this.margin))*this.finalRatio),this.line.push(new l.Point(a,b)),this._is_v=this._is_h=!1)};e.prototype._lineTo=function(a,b,c){if(3!==
this.type)if(c){a=Math.round((a-(this.xmin+this.margin))*this.finalRatio);b=Math.round((b-(this.ymin+this.margin))*this.finalRatio);if(0<this.line.length&&(c=this.line[this.line.length-1],c.equals(a,b)))return;this.line.push(new l.Point(a,b))}else this.line&&0<this.line.length&&this._push_line();else if(c||(a<this.xmin&&(a=this.xmin),a>this.xmax&&(a=this.xmax),b<this.ymin&&(b=this.ymin),b>this.ymax&&(b=this.ymax)),a=Math.round((a-(this.xmin+this.margin))*this.finalRatio),b=Math.round((b-(this.ymin+
this.margin))*this.finalRatio),this.line&&0<this.line.length){c=this.line[this.line.length-1];var d=c.x===a,e=c.y===b;if(!d||!e)this._is_h&&d?(c.x=a,c.y=b,c=this.line[this.line.length-2],this._is_h=c.x===a,this._is_v=c.y===b):this._is_v&&e?(c.x=a,c.y=b,c=this.line[this.line.length-2],this._is_h=c.x===a,this._is_v=c.y===b):(this.line.push(new l.Point(a,b)),this._is_h=d,this._is_v=e)}else this.line.push(new l.Point(a,b))};return e}();q.TileClipper=n;n=function(){function e(){}e.prototype.setExtent=
function(a){this._ratio=4096===a?1:4096/a};e.prototype.reset=function(a){this.lines=[];this.line=null};e.prototype.moveTo=function(a,b){this.line&&this.lines.push(this.line);this.line=[];var c=this._ratio;this.line.push(new l.Point(Math.round(a*c),Math.round(b*c)))};e.prototype.lineTo=function(a,b){var c=this._ratio;this.line.push(new l.Point(Math.round(a*c),Math.round(b*c)))};e.prototype.close=function(){var a=this.line;a&&!a[0].isEqual(a[a.length-1])&&a.push(a[0])};e.prototype.result=function(){this.line&&
this.lines.push(this.line);return 0===this.lines.length?null:this.lines};return e}();q.SimpleBuilder=n});