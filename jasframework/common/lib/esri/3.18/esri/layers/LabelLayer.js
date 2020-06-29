// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.18/esri/copyright.txt for details.
//>>built
require({cache:{"esri/layers/labelLayerUtils/DynamicLabelClass":function(){define("dojo/_base/declare dojo/_base/lang dojo/has ../../kernel ../../geometry/Extent ../../geometry/Polygon".split(" "),function(B,F,A,G,C,D){B=B(null,{declaredClass:"esri.layers.labelLayerUtils.DynamicLabelClass",constructor:function(){this._preparedLabels=[];this._placedLabels=[];this._extent=null;this._y1=this._x1=this._y0=this._x0=this._ymax=this._ymin=this._xmax=this._xmin=0;this._scale=1},setMap:function(h,b){this._labelLayer=
b;this._xmin=h.extent.xmin;this._xmax=h.extent.xmax;this._ymin=h.extent.ymin;this._ymax=h.extent.ymax;this._scale=(this._xmax-this._xmin)/h.width},_process:function(h){this._preparedLabels=h;this._placedLabels=[];var b;for(h=this._preparedLabels.length-1;0<=h;h--){var a=this._preparedLabels[h],c=Math.min(a.labelWidth,a.labelHeight),k=a.labelWidth+0*c,c=a.labelHeight+0*c,f=(b=a.options)&&void 0!==b.lineLabelPlacement?b.lineLabelPlacement:"PlaceAtCenter",e=b&&void 0!==b.lineLabelPosition?b.lineLabelPosition:
"Above",d=b&&void 0!==b.pointPriorities?b.pointPriorities:"AboveRight",l=[2,2,1,3,0,2,3,3,2];"AboveLeft"==d?l=[1,2,2,2,0,3,2,3,3]:"AboveCenter"==d?l=[2,1,2,2,0,2,3,3,3]:"AboveRight"==d?l=[2,2,1,3,0,2,3,3,2]:"CenterLeft"==d?l=[2,2,3,1,0,3,2,2,3]:"CenterCenter"==d?l=[0,0,0,0,1,0,0,0,0]:"CenterRight"==d?l=[3,2,2,3,0,1,3,2,2]:"BelowLeft"==d?l=[2,3,3,2,0,3,1,2,2]:"BelowCenter"==d?l=[3,3,3,2,0,2,2,1,2]:"BelowRight"==d&&(l=[3,3,2,3,0,2,2,2,1]);var g=b&&void 0!==b.labelRotation?b.labelRotation:!0,d=a.angle*
(Math.PI/180);b=b&&void 0!==b.howManyLabels?b.howManyLabels:"OneLabel";if("point"==a.geometry.type)this._generatePointPositions(a,a.geometry.x,a.geometry.y,a.text,d,k,c,a.symbolWidth,a.symbolHeight,l);else if("multipoint"==a.geometry.type){f=a.geometry;for(e=0;e<f.points.length;e++)this._generatePointPositions(a,f.points[e][0],f.points[e][1],a.text,d,k,c,a.symbolWidth,a.symbolHeight,l)}else"polyline"==a.geometry.type?this._generateLinePositions(a,a.geometry,a.text,k,c,2*a.symbolHeight+c,f,e,g):"polygon"==
a.geometry.type&&this._generatePolygonPositions(a,b,a.geometry,a.text,d,k,c)}return this._placedLabels},_generatePointPositions:function(h,b,a,c,k,f,e,d,l,g){d=(d+f)*this._scale;l=(l+e)*this._scale;var t,n;for(t=1;3>=t;t++)for(n=1;9>=n;n++)if(g[n-1]==t)switch(n){case 1:if(this._findPlace(h,c,b-d,a+l,k,f,e))return;break;case 2:if(this._findPlace(h,c,b,a+l,k,f,e))return;break;case 3:if(this._findPlace(h,c,b+d,a+l,k,f,e))return;break;case 4:if(this._findPlace(h,c,b-d,a,k,f,e))return;break;case 5:if(this._findPlace(h,
c,b,a,k,f,e))return;break;case 6:if(this._findPlace(h,c,b+d,a,k,f,e))return;break;case 7:if(this._findPlace(h,c,b-d,a-l,k,f,e))return;break;case 8:if(this._findPlace(h,c,b,a-l,k,f,e))return;break;case 9:if(this._findPlace(h,c,b+d,a-l,k,f,e))return}},_generateLinePositions:function(h,b,a,c,k,f,e,d,l){var g=c*this._scale*c*this._scale,t,n,m;for(t=0;t<b.paths.length;t++){var r=b.paths[t],q=r.length,p=Math.floor((q-1)/2),v=0!==(q-1)%2?1:-1;"PlaceAtStart"==e&&(p=0,v=1);"PlaceAtEnd"==e&&(p=q-2,v=-1);for(;0<=
p&&p<q-1;){for(n=p;n<q;n++){var u=r[p][0],s=r[p][1],x=r[n][0]-u,w=r[n][1]-s;if(x*x+w*w>g){for(var y=Math.atan2(w,x);y>Math.PI/2;)y-=Math.PI;for(;y<-(Math.PI/2);)y+=Math.PI;var z=Math.sin(y),E=Math.cos(y),H=0,I=0;"Above"==d&&(H=f*z*this._scale,I=f*E*this._scale);"Below"==d&&(H=-f*z*this._scale,I=-f*E*this._scale);if(1==n-p){if(this._clipLine(u,s,r[n][0],r[n][1])&&(u=this._x1-this._x0,m=this._y1-this._y0,u*u+m*m>g&&(n=Math.atan2(m,u),x=c/2+2*k,s=x*this._scale*Math.cos(n),x=x*this._scale*Math.sin(n),
"PlaceAtStart"==e?(u=this._x0+s,m=this._y0+x):"PlaceAtEnd"==e?(u=this._x1-s,m=this._y1-x):(u=this._x0+u/2,m=this._y0+m/2),this._findPlace(h,a,u-H,m+I,l?-n:0,c,k))))return}else{var J=0;for(m=p;m<=n;m++)J=Math.max(J,Math.abs((r[m][1]-s)*E-(r[m][0]-u)*z));if(J<k&&this._findPlace(h,a,u+x/2-H,s+w/2+I,l?-y:0,c,k))return}break}}p+=v}}},_generatePolygonPositions:function(h,b,a,c,k,f,e){var d;if("ManyLabels"==b)for(b=0;b<a.rings.length;b++)d=a.rings[b],D.prototype.isClockwise(d)&&(d=this._findCentroid(d,this._xmin,
this._ymin,this._xmax,this._ymax),this._findPlace(h,c,d[0],d[1],k,f,e));else{d=this._findCentroidForFeature(a,this._xmin,this._ymin,this._xmax,this._ymax);var l=d[1],g=0;for(b=0;10>b;b++){g+=e/4;d=this._findCentroidForFeature(a,this._xmin,l+(g-e/4),this._xmax,l+(g+e/4));if(this._findPlace(h,c,d[0],d[1],k,f,e))break;d=this._findCentroidForFeature(a,this._xmin,l-(g+e/4),this._xmax,l-(g-e/4));if(this._findPlace(h,c,d[0],d[1],k,f,e))break}}},_findCentroid:function(h,b,a,c,k){var f=h.length,e=[0,0],d=
0,l=h[0][0],g=h[0][1];l>c&&(l=c);l<b&&(l=b);g>k&&(g=k);g<a&&(g=a);for(var t=1;t<f-1;t++){var n=h[t][0],m=h[t][1],r=h[t+1][0],q=h[t+1][1];n>c&&(n=c);n<b&&(n=b);m>k&&(m=k);m<a&&(m=a);r>c&&(r=c);r<b&&(r=b);q>k&&(q=k);q<a&&(q=a);var p=(n-l)*(q-g)-(r-l)*(m-g);e[0]+=p*(l+n+r);e[1]+=p*(g+m+q);d+=p}e[0]/=3*d;e[1]/=3*d;if(isNaN(e[0])||isNaN(e[1]))return e;a=[];this._fillBuffer(h,a,e);e[0]=this._sortBuffer(a,e[0],b,c);return e},_findCentroidForFeature:function(h,b,a,c,k){for(var f,e=0,d=[0,0],l=0;l<h.rings.length;l++){var g=
h.rings[l],t=g.length,n=g[0][0],m=g[0][1];n>c&&(n=c);n<b&&(n=b);m>k&&(m=k);m<a&&(m=a);for(f=1;f<t-1;f++){var r=g[f][0],q=g[f][1],p=g[f+1][0],v=g[f+1][1];r>c&&(r=c);r<b&&(r=b);q>k&&(q=k);q<a&&(q=a);p>c&&(p=c);p<b&&(p=b);v>k&&(v=k);v<a&&(v=a);var u=(r-n)*(v-m)-(p-n)*(q-m);d[0]+=u*(n+r+p);d[1]+=u*(m+q+v);e+=u}}d[0]/=3*e;d[1]/=3*e;if(isNaN(d[0])||isNaN(d[1]))return d;a=[];for(f=0;f<h.rings.length;f++)this._fillBuffer(h.rings[f],a,d);d[0]=this._sortBuffer(a,d[0],b,c);return d},_fillBuffer:function(h,b,
a){for(var c=h.length-1,k=h[0][1]>=h[c][1]?1:-1,f=0;f<=c;f++){var e=f,d=f+1;f==c&&(d=0);var l=h[e][0],e=h[e][1],g=h[d][0],d=h[d][1],t=d>=e?1:-1;if(e<=a[1]&&a[1]<=d||d<=a[1]&&a[1]<=e)a[1]!=e&&a[1]!=d?(b.push((a[1]-e)*(g-l)/(d-e)+l),k=t):a[1]==e&&a[1]!=d?(k!=t&&b.push(l),k=t):a[1]!=e&&a[1]==d?(b.push(g),k=t):a[1]==e&&a[1]==d&&(1==k&&b.push(l),b.push(g),k=t)}},_sortBuffer:function(h,b,a,c){var k=h.length;h.sort();if(0<k){for(var f=0,e=b=0;e<k-1;e+=2){var d=Math.abs(h[e+1]-h[e]);!(h[e]<=a&&h[e+1]<=a)&&
(!(h[e]>=c&&h[e+1]>=c)&&d>f)&&(f=d,b=e)}k=h[b];h=h[b+1];k>c&&(k=c);k<a&&(k=a);h>c&&(h=c);h<a&&(h=a);b=(k+h)/2}return b},_findPlace:function(h,b,a,c,k,f,e){if(isNaN(a)||isNaN(c))return!1;for(var d=0;d<this._placedLabels.length;d++){var l=this._placedLabels[d].angle,g=this._placedLabels[d].width*this._scale,t=this._placedLabels[d].height*this._scale,n=this._placedLabels[d].x-a,m=this._placedLabels[d].y-c;if(0===k&&0===l){if(this._findPlace2(-f*this._scale,-e*this._scale,f*this._scale,e*this._scale,
n-g,m-t,n+g,m+t))return!1}else{var r=new C(-f*this._scale,-e*this._scale,f*this._scale,e*this._scale,null),q=0,p=1;0!==k&&(q=Math.sin(k),p=Math.cos(k));var v=n*p-m*q,n=n*q+m*p,l=l-k,q=Math.sin(l),p=Math.cos(l),u=-g*p- -t*q,m=-g*q+-t*p,l=+g*p- -t*q,s=+g*q+-t*p,g=v+u,t=n-m,q=v+l,p=n-s,u=v-u,m=n+m,v=v-l,n=n+s,l=new D;l.addRing([[g,t],[q,p],[u,m],[v,n],[g,t]]);if(r.intersects(l))return!1}}for(;k>Math.PI/2;)k-=Math.PI;for(;k<-(Math.PI/2);)k+=Math.PI;d={};d.layer=h;d.text=b;d.angle=k;d.x=a;d.y=c;d.width=
f;d.height=e;this._placedLabels.push(d);return!0},_findPlace2:function(h,b,a,c,k,f,e,d){return(h>=k&&h<=e||a>=k&&a<=e||h<=k&&a>=e)&&(b>=f&&b<=d||c>=f&&c<=d||b<=f&&c>=d)?!0:!1},_clipLine:function(h,b,a,c){for(var k=this._code(h,b),f=this._code(a,c);0!==k||0!==f;){if(0!==(k&f))return!1;var e=a-h,d=c-b;0!==k?(h<this._xmin?(b+=d*(this._xmin-h)/e,h=this._xmin):h>this._xmax?(b+=d*(this._xmax-h)/e,h=this._xmax):b<this._ymin?(h+=e*(this._ymin-b)/d,b=this._ymin):b>this._ymax&&(h+=e*(this._ymax-b)/d,b=this._ymax),
k=this._code(h,b)):(a<this._xmin?(c+=d*(this._xmin-a)/e,a=this._xmin):a>this._xmax?(c+=d*(this._xmax-a)/e,a=this._xmax):c<this._ymin?(a+=e*(this._ymin-c)/d,c=this._ymin):c>this._ymax&&(a+=e*(this._ymax-c)/d,c=this._ymax),f=this._code(a,c))}this._x0=h;this._y0=b;this._x1=a;this._y1=c;return!0},_code:function(h,b){var a=0;h<this._xmin&&(a+=8);h>this._xmax&&(a+=4);b<this._ymin&&(a+=2);b>this._ymax&&(a+=1);return a}});A("extend-esri")&&F.setObject("layers.labelLayerUtils.DynamicLabelClass",B,G);return B})},
"esri/layers/labelLayerUtils/StaticLabelClass":function(){define("dojo/_base/declare dojo/_base/lang dojo/has ../../kernel ../../geometry/Extent ../../geometry/Point ../../geometry/Polygon".split(" "),function(B,F,A,G,C,D,h){return B(null,{declaredClass:"esri.layers.labelLayerUtils.StaticLabel",constructor:function(){this._preparedLabels=[];this._placedLabels=[];this._extent=null;this._ymax=this._ymin=this._xmax=this._xmin=0;this._scale=1;this._LINE_STEP_CONST=1.5;this._POLYGON_X_STEP_CONST=1;this._POLYGON_Y_STEP_CONST=
0.75;this._OVERRUN=2},setMap:function(b,a){this._labelLayer=a;this._map=b;this._xmin=b.extent.xmin;this._xmax=b.extent.xmax;this._ymin=b.extent.ymin;this._ymax=b.extent.ymax;this._scale=(this._xmax-this._xmin)/b.width},_process:function(b){var a,c,k,f,e,d,l,g,t;this._preparedLabels=b;this._placedLabels=[];for(b=this._preparedLabels.length-1;0<=b;b--){a=this._preparedLabels[b];e=a.labelWidth;d=a.labelHeight;g=(l=a.options)&&l.lineLabelPlacement?l.lineLabelPlacement:"PlaceAtCenter";t=l&&l.lineLabelPosition?
l.lineLabelPosition:"Above";c=l&&l.labelRotation?l.labelRotation:!0;k=a.angle*(Math.PI/180);f=l&&l.howManyLabels?l.howManyLabels:"OneLabel";var n=[];if("point"===a.geometry.type)this._generatePointPositions(a.geometry.x,a.geometry.y,a.text,k,e,d,a.symbolWidth,a.symbolHeight,l,n);else if("multipoint"===a.geometry.type)for(c=0;c<a.geometry.points.length;c++)this._generatePointPositions(a.geometry.points[c][0],a.geometry.points[c][1],a.text,k,e,d,a.symbolWidth,a.symbolHeight,l,n);else if("polyline"===
a.geometry.type)if("PlaceAtStart"===g)this._generateLinePositionsPlaceAtStart(a.geometry,!0,a.text,e,d,2*a.symbolHeight+d,g,t,c,n);else if("PlaceAtEnd"===g)this._generateLinePositionsPlaceAtEnd(a.geometry,!0,a.text,e,d,2*a.symbolHeight+d,g,t,c,n);else{l=[];var m=a.geometry.getExtent(),r=this._map.extent;if(m.getWidth()<e*this._scale/this._OVERRUN&&m.getHeight()<e*this._scale/this._OVERRUN)continue;else 0.5*m.getWidth()<r.getWidth()&&0.5*m.getHeight()<r.getHeight()?(m=0.1*Math.min(this._map.width,
this._map.height)*this._scale,this._generateLinePositionsPlaceAtCenter(a.geometry,!1,m,a.text,e,d,2*a.symbolHeight+d,g,t,c,l)):(m=0.2*Math.min(this._map.width,this._map.height)*this._scale,this._generateLinePositionsPlaceAtCenter(a.geometry,!0,m,a.text,e,d,2*a.symbolHeight+d,g,t,c,l));this._postSorting(r,l,n)}else if("polygon"===a.geometry.type){g=[];for(c=0;c<a.geometry.rings.length;c++)t=a.geometry.rings[c],h.prototype.isClockwise(t)&&(l=this._calcRingExtent(t),l.xmax-l.xmin<4*e*this._scale/this._OVERRUN&&
l.ymax-l.ymin<4*d*this._scale/this._OVERRUN||g.push(t));g.sort(function(a,b){return b.length-a.length});for(c=0;c<g.length;c++)this._generatePolygonPositionsForManyLabels(g[c],a.geometry.spatialReference,a.text,k,e,d,n)}for(c=0;c<n.length&&!(g=n[c].x,t=n[c].y,void 0!==n[c].angle&&(k=n[c].angle),l=this._findPlace(a,a.text,g,t,k,e,d),"OneLabel"===f&&l&&this._labelLayer._isWithinScreenArea(new D(g,t,a.geometry.spatialReference)));c++);}return this._placedLabels},_generatePointPositions:function(b,a,
c,k,f,e,d,l,g,t){c=g&&g.pointPriorities?g.pointPriorities:"AboveRight";f=(d+f)*this._scale;e=(l+e)*this._scale;switch(c.toLowerCase()){case "aboveleft":b-=f;a+=e;break;case "abovecenter":a+=e;break;case "aboveright":b+=f;a+=e;break;case "centerleft":b-=f;break;case "centercenter":break;case "centerright":b+=f;break;case "belowleft":b-=f;a-=e;break;case "belowcenter":a-=e;break;case "belowright":b+=f;a-=e;break;default:return}t.push({x:b,y:a})},_generateLinePositionsPlaceAtStart:function(b,a,c,k,f,
e,d,l,g,t){d=k*this._scale;var n=this._LINE_STEP_CONST*Math.min(this._map.width,this._map.height)*this._scale,m,h,q,p,v,u,s,x;for(m=0;m<b.paths.length;m++){var w=b.paths[m],y=d,z=0;for(h=0;h<w.length-1;h++)q=w[h][0],p=w[h][1],v=w[h+1][0],u=w[h+1][1],s=v-q,x=u-p,s=Math.sqrt(s*s+x*x),z+s>y?(z=this._generatePositionsOnLine(b.spatialReference,a,y,n,z,q,p,v,u,c,k,f,e,l,g,t),y=n):z+=s}},_generateLinePositionsPlaceAtEnd:function(b,a,c,k,f,e,d,l,g,h){d=k*this._scale;var n=this._LINE_STEP_CONST*Math.min(this._map.width,
this._map.height)*this._scale,m,r,q,p,v,u,s,x;for(m=0;m<b.paths.length;m++){var w=b.paths[m],y=d,z=0;for(r=w.length-2;0<=r;r--)q=w[r+1][0],p=w[r+1][1],v=w[r][0],u=w[r][1],s=v-q,x=u-p,s=Math.sqrt(s*s+x*x),z+s>y?(z=this._generatePositionsOnLine(b.spatialReference,a,y,n,z,q,p,v,u,c,k,f,e,l,g,h),y=n):z+=s}},_generateLinePositionsPlaceAtCenter:function(b,a,c,k,f,e,d,l,g,h,n){var m,r,q,p,v,u,s,x;for(l=0;l<b.paths.length;l++){var w=b.paths[l];if(!(2>w.length)){if(2==w.length){p=w[0];m=w[1];q=p[0];p=p[1];
w=m[0];u=m[1];v=(w-q)*(w-q)+(u-p)*(u-p);s=Math.atan2(u-p,w-q);u=Math.cos(s);s=Math.sin(s);w=[];x=q;for(var y=p;(x-q)*(x-q)+(y-p)*(y-p)<v;)w.push([x,y]),x+=c/2*u,y+=c/2*s;w.push(m)}var z=0;for(m=0;m<w.length-1;m++)q=w[m][0],p=w[m][1],v=w[m+1][0],u=w[m+1][1],s=v-q,x=u-p,z+=Math.sqrt(s*s+x*x);for(m=y=0;m<w.length-1;m++){q=w[m][0];p=w[m][1];v=w[m+1][0];u=w[m+1][1];s=v-q;x=u-p;s=Math.sqrt(s*s+x*x);if(y+s>z/2)break;y+=s}m==w.length-1&&m--;q=w[m][0];p=w[m][1];v=w[m+1][0];u=w[m+1][1];s=v-q;x=u-p;y=z/2-y;
s=Math.atan2(x,s);x=q+y*Math.cos(s);s=p+y*Math.sin(s);q=this._angleAndShifts(q,p,v,u,d,g,h);n.push({x:x+q.shiftX,y:s+q.shiftY,angle:q.angle});var z=x,E=s,y=0;for(r=m;r<w.length-1;r++)r==m?(q=z,p=E):(q=w[r][0],p=w[r][1]),v=w[r+1][0],u=w[r+1][1],s=v-q,x=u-p,s=Math.sqrt(s*s+x*x),y=y+s>c?this._generatePositionsOnLine(b.spatialReference,a,c,c,y,q,p,v,u,k,f,e,d,g,h,n):y+s;y=0;for(r=m;0<=r;r--)r==m?(q=z,p=E):(q=w[r+1][0],p=w[r+1][1]),v=w[r][0],u=w[r][1],s=v-q,x=u-p,s=Math.sqrt(s*s+x*x),y=y+s>c?this._generatePositionsOnLine(b.spatialReference,
a,c,c,y,q,p,v,u,k,f,e,d,g,h,n):y+s}}},_generatePositionsOnLine:function(b,a,c,k,f,e,d,l,g,h,n,m,r,q,p,v){h=Math.atan2(g-d,l-e);n=e;m=d;var u=n,s=m;do if(f=c-f,n+=f*Math.cos(h),m+=f*Math.sin(h),this._belongs(n,m,e,d,l,g))f=this._angleAndShifts(e,d,l,g,r,q,p),c=n+f.shiftX,s=m+f.shiftY,a?this._labelLayer._isWithinScreenArea(new C(c,s,c,s,b))&&v.push({x:c,y:s,angle:f.angle}):v.push({x:c,y:s,angle:f.angle}),u=n,s=m,f=0,c=k;else return b=l-u,g-=s,Math.sqrt(b*b+g*g);while(1)},_postSorting:function(b,a,c){if(b&&
0<a.length){var k=0.5*(b.xmin+b.xmax);b=0.5*(b.ymin+b.ymax);for(var f=a[0].x,e=a[0].y,d=Math.sqrt((f-k)*(f-k)+(e-b)*(e-b)),l=a[0].angle,g=0;g<a.length;g++){var h=a[g].x,n=a[g].y,m=Math.sqrt((h-k)*(h-k)+(n-b)*(n-b));m<d&&(f=h,e=n,d=m,l=a[g].angle)}c.push({x:f,y:e,angle:l})}},_belongs:function(b,a,c,k,f,e){if(f==c&&e==k)return!1;if(f>c){if(b>f||b<c)return!1}else if(b<f||b>c)return!1;if(e>k){if(a>e||a<k)return!1}else if(a<e||a>k)return!1;return!0},_angleAndShifts:function(b,a,c,k,f,e,d){for(b=Math.atan2(k-
a,c-b);b>Math.PI/2;)b-=Math.PI;for(;b<-(Math.PI/2);)b+=Math.PI;k=Math.sin(b);var l=Math.cos(b);c=a=0;"Above"==e&&(a=f*k*this._scale,c=f*l*this._scale);"Below"==e&&(a=-f*k*this._scale,c=-f*l*this._scale);f=[];f.angle=d?-b:0;f.shiftX=-a;f.shiftY=c;return f},_generatePolygonPositionsForManyLabels:function(b,a,c,k,f,e,d){f=this._findCentroidForRing(b);k=f[0];var l=f[1],g=this._calcRingExtent(b);f=g.xmin;e=g.ymin;var h=g.xmax,g=g.ymax,n=(g-e)/(this._map.height*this._scale);if(!(10<(h-f)/(this._map.width*
this._scale)&&10<n)){var m=!0;if(h-f>this._map.width*this._scale||g-e>this._map.height*this._scale)m=!1;var n=this._map.width*this._scale*(m?0.1875:0.5),m=this._map.height*this._scale*(m?0.1875:0.5),r=!0,q=!0,p=0;do{l+=(p%2?-1:1)*p*m;if(this._scanRingByX(c,a,b,k,l,f,h,n,d))break;l<e&&(r=!1);l>g&&(q=!1);p++}while(r||q)}},_scanRingByX:function(b,a,c,k,f,e,d,l,g){var h=!0,n=!0,m=0,r=1E3;do{k+=(m%2?-1:1)*m*l;var q=this._movePointInsideRing(c,k,f),p=this._labelLayer._isWithinScreenArea(new C(q,f,q,f,a)),
v=this._isPointWithinRing(b,c,q,f);if(p&&v)return g.push({x:q,y:f}),!0;k<e&&(h=!1);k>d&&(n=!1);m++;r--;if(0>=r)return!0}while(h||n);return!1},_movePointInsideRing:function(b,a,c){for(var k=[],f=b.length-1,e=b[0][1]>=b[f][1]?1:-1,d=0;d<=f;d++){var l=d,g=d+1;d==f&&(g=0);var h=b[l][0],l=b[l][1],n=b[g][0],g=b[g][1],m=g>=l?1:-1;if(l<=c&&c<=g||g<=c&&c<=l)c!=l&&c!=g?(k.push((c-l)*(n-h)/(g-l)+h),e=m):c==l&&c!=g?(e!=m&&k.push(h),e=m):c!=l&&c==g?(k.push(n),e=m):c==l&&c==g&&(1==e&&k.push(h),k.push(n),e=m)}k.sort(function(a,
b){return a-b});b=k.length;if(0<b){for(d=c=a=0;d<b-1;d+=2)f=Math.abs(k[d+1]-k[d]),f>a&&(a=f,c=d);a=(k[c]+k[c+1])/2}return a},_calcRingExtent:function(b){var a,c;c=new C;for(a=0;a<b.length-1;a++){var k=b[a][0],f=b[a][1];if(void 0===c.xmin||k<c.xmin)c.xmin=k;if(void 0===c.ymin||f<c.ymin)c.ymin=f;if(void 0===c.xmax||k>c.xmax)c.xmax=k;if(void 0===c.ymax||f>c.ymax)c.ymax=f}return c},_isPointWithinPolygon:function(b,a,c,k){var f;for(f=0;f<a.rings.length;f++)if(this._isPointWithinRing(b,a.rings[f],c,k))return!0;
return!1},_isPointWithinRing:function(b,a,c,k){var f,e,d,l,g=[],h=a.length;for(b=0;b<h-1;b++)if(f=a[b][0],e=a[b][1],d=a[b+1][0],l=a[b+1][1],!(f==d&&e==l)){if(e==l)if(k==e)g.push(f);else continue;f==d?(e<l&&(k>=e&&k<l)&&g.push(f),e>l&&(k<=e&&k>l)&&g.push(f)):(e=(d-f)/(l-e)*(k-e)+f,f<d&&(e>=f&&e<d)&&g.push(e),f>d&&(e<=f&&e>d)&&g.push(e))}g.sort(function(a,b){return a-b});for(b=0;b<g.length-1;b++)if(f=g[b],d=g[b+1],c>=f&&c<d)if(b%2)break;else return!0;return!1},_findCentroidForRing:function(b){for(var a=
b.length,c=[0,0],k=0,f=b[0][0],e=b[0][1],d=1;d<a-1;d++){var l=b[d][0],g=b[d][1],h=b[d+1][0],n=b[d+1][1],m=(l-f)*(n-e)-(h-f)*(g-e);c[0]+=m*(f+l+h);c[1]+=m*(e+g+n);k+=m}c[0]/=3*k;c[1]/=3*k;return c},_findCentroidForFeature:function(b){for(var a=0,c=[0,0],k=0;k<b.rings.length;k++)for(var f=b.rings[k],e=f.length,d=f[0][0],l=f[0][1],g=1;g<e-1;g++){var h=f[g][0],n=f[g][1],m=f[g+1][0],r=f[g+1][1],q=(h-d)*(r-l)-(m-d)*(n-l);c[0]+=q*(d+h+m);c[1]+=q*(l+n+r);a+=q}c[0]/=3*a;c[1]/=3*a;return c},_findPlace:function(b,
a,c,k,f,e,d){if(isNaN(c)||isNaN(k))return!1;for(var l=0;l<this._placedLabels.length;l++){var g=this._placedLabels[l].angle,t=this._placedLabels[l].width*this._scale,n=this._placedLabels[l].height*this._scale,m=this._placedLabels[l].x-c,r=this._placedLabels[l].y-k;if(0===f&&0===g){if(this._findPlace2(-e*this._scale,-d*this._scale,e*this._scale,d*this._scale,m-t,r-n,m+t,r+n))return!1}else{var q=new C(-e*this._scale,-d*this._scale,e*this._scale,d*this._scale,null),p=0,v=1;0!==f&&(p=Math.sin(f),v=Math.cos(f));
var u=m*v-r*p,m=m*p+r*v,g=g-f,p=Math.sin(g),v=Math.cos(g),s=-t*v- -n*p,r=-t*p+-n*v,g=+t*v- -n*p,x=+t*p+-n*v,t=u+s,n=m-r,p=u+g,v=m-x,s=u-s,r=m+r,u=u-g,m=m+x,g=new h;g.addRing([[t,n],[p,v],[s,r],[u,m],[t,n]]);if(q.intersects(g))return!1}}for(;f>Math.PI/2;)f-=Math.PI;for(;f<-(Math.PI/2);)f+=Math.PI;l={};l.layer=b;l.text=a;l.angle=f;l.x=c;l.y=k;l.width=e;l.height=d;this._placedLabels.push(l);return!0},_findPlace2:function(b,a,c,k,f,e,d,l){return(b>=f&&b<=d||c>=f&&c<=d||b<=f&&c>=d)&&(a>=e&&a<=l||k>=e&&
k<=l||a<=e&&k>=l)?!0:!1}})})},"*noref":1}});
define("esri/layers/LabelLayer","require dojo/_base/declare dojo/_base/lang dojo/number dojo/i18n!dojo/cldr/nls/number dojo/_base/array dojo/_base/connect dojo/has dojox/gfx/_base ../kernel ../lang ../graphic ../PopupInfo ./labelLayerUtils/DynamicLabelClass ./labelLayerUtils/StaticLabelClass ../symbols/TextSymbol ../symbols/ShieldLabelSymbol ../geometry/Extent ../geometry/Point ../geometry/webMercatorUtils ./GraphicsLayer ./LabelClass ../renderers/SimpleRenderer".split(" "),function(B,F,A,G,C,D,h,
b,a,c,k,f,e,d,l,g,t,n,m,r,q,p,v){function u(a){return"sizeInfo"===a.type}B=F(q,{declaredClass:"esri.layers.LabelLayer",constructor:function(a){this._refreshLabels=A.hitch(this,this._refreshLabels);this.id="labels";this.featureLayers=[];this._featureLayerInfos=[];this._preparedLabels=[];this._engineType="STATIC";this._mapEventHandlers=[];a&&(a.id&&(this.id=a.id),a.mode&&(this._engineType="DYNAMIC"===a.mode.toUpperCase()?"DYNAMIC":"STATIC"))},_setMap:function(a){this._mapEventHandlers.push(a.on("extent-change",
A.hitch(this,"_handleLevelChange")));var b=this.inherited(arguments);this.refresh();return b},_unsetMap:function(){var a;for(a=0;a<this._mapEventHandlers.length;a++)h.disconnect(this._mapEventHandlers[a]);this.refresh();clearTimeout(this._refreshHandle);this._refreshHandle=null;this.inherited(arguments)},setAlgorithmType:function(a){this._engineType=a&&"DYNAMIC"===a.toUpperCase()?"DYNAMIC":"STATIC";this.refresh()},addFeatureLayer:function(a,b,c,d){if(!this.getFeatureLayer(a.layerId)){var e=[];e.push(a.on("update-end",
A.hitch(this,"refresh")));e.push(a.on("suspend",A.hitch(this,"refresh")));e.push(a.on("resume",A.hitch(this,"refresh")));e.push(a.on("edits-complete",A.hitch(this,"refresh")));e.push(a.on("labeling-info-change",A.hitch(this,"refresh")));e.push(a.on("time-extent-change",A.hitch(this,"refresh")));e.push(a.on("show-labels-change",A.hitch(this,"refresh")));this._featureLayerInfos.push({FeatureLayer:a,LabelExpressionInfo:c,LabelingOptions:d,LabelRenderer:b,EventHandlers:e});this.featureLayers.push(a);
this.refresh()}},getFeatureLayer:function(a){var b,c;for(b=0;b<this.featureLayers.length;b++)if(c=this.featureLayers[b],void 0!==c&&c.id==a)return c;return null},removeFeatureLayer:function(a){var b;a=this.getFeatureLayer(a);if(void 0!==a&&(b=D.indexOf(this.featureLayers,a),-1<b)){this.featureLayers.splice(b,1);for(a=0;a<this._featureLayerInfos[b].EventHandlers.length;a++)h.disconnect(this._featureLayerInfos[b].EventHandlers[a]);this._featureLayerInfos.splice(b,1);this.refresh()}},removeAllFeatureLayers:function(){var a;
for(a=0;a<this.featureLayers.length;a++){for(var b=0;b<this._featureLayerInfos[a].EventHandlers.length;b++)h.disconnect(this._featureLayerInfos[a].EventHandlers[b]);this.featureLayers=[];this._featureLayerInfos=[]}this.refresh()},getFeatureLayers:function(){return this.featureLayers},getFeatureLayerInfo:function(a){var b,c;for(b=0;b<this.featureLayers.length;b++)if(c=this.featureLayers[b],void 0!==c&&c.id==a)return this._featureLayerInfos[b];return null},refresh:function(){null==this._refreshHandle&&
(this._refreshHandle=setTimeout(this._refreshLabels,0))},_handleLevelChange:function(a){a.levelChange&&this.clear();this.refresh()},_refreshLabels:function(a){this._refreshHandle=null;var b,c,e,f,k,g=[],h,m="DYNAMIC"===this._engineType?new d:new l;if(this._map){m.setMap(this._map,this);this._preparedLabels=[];for(a=0;a<this.featureLayers.length;a++)if(c=this.featureLayers[a],c.visible&&c.showLabels&&c.visibleAtMapScale&&!c._suspended)if(b=this._featureLayerInfos[a],k=this._convertOptions(null),b.LabelRenderer){if(g=
c.labelingInfo)if(h=g[0])f=this._getLabelExpression(h),k=this._convertOptions(h);e=b.LabelRenderer;b.LabelExpressionInfo&&(f=b.LabelExpressionInfo);b.LabelingOptions&&(k=this._convertOptions(null),void 0!==b.LabelingOptions.pointPriorities&&(g=b.LabelingOptions.pointPriorities,k.pointPriorities="above-center"==g||"AboveCenter"==g||"esriServerPointLabelPlacementAboveCenter"==g?"AboveCenter":"above-left"==g||"AboveLeft"==g||"esriServerPointLabelPlacementAboveLeft"==g?"AboveLeft":"above-right"==g||"AboveRight"==
g||"esriServerPointLabelPlacementAboveRight"==g?"AboveRight":"below-center"==g||"BelowCenter"==g||"esriServerPointLabelPlacementBelowCenter"==g?"BelowCenter":"below-left"==g||"BelowLeft"==g||"esriServerPointLabelPlacementBelowLeft"==g?"BelowLeft":"below-right"==g||"BelowRight"==g||"esriServerPointLabelPlacementBelowRight"==g?"BelowRight":"center-center"==g||"CenterCenter"==g||"esriServerPointLabelPlacementCenterCenter"==g?"CenterCenter":"center-left"==g||"CenterLeft"==g||"esriServerPointLabelPlacementCenterLeft"==
g?"CenterLeft":"center-right"==g||"CenterRight"==g||"esriServerPointLabelPlacementCenterRight"==g?"CenterRight":"AboveRight"),void 0!==b.LabelingOptions.lineLabelPlacement&&(k.lineLabelPlacement=b.LabelingOptions.lineLabelPlacement),void 0!==b.LabelingOptions.lineLabelPosition&&(k.lineLabelPosition=b.LabelingOptions.lineLabelPosition),void 0!==b.LabelingOptions.labelRotation&&(k.labelRotation=b.LabelingOptions.labelRotation),void 0!==b.LabelingOptions.howManyLabels&&(k.howManyLabels=b.LabelingOptions.howManyLabels));
e instanceof p&&(f=this._getLabelExpression(e),e=new v(e.symbol),k=this._convertOptions(e));this._addLabels(c,e,f,k)}else if(g=c.labelingInfo)for(b=g.length-1;0<=b;b--)if(h=g[b])e=new p(h instanceof p?h.toJson():h),f=this._getLabelExpression(h),k=this._convertOptions(h),this._addLabels(c,e,f,k);f=m._process(this._preparedLabels);this.clear();this.drawLabels(this._map,f)}},drawLabels:function(a,b){this._scale=(a.extent.xmax-a.extent.xmin)/a.width;var c;for(c=0;c<b.length;c++){var e=b[c],d=e.x,k=e.y,
l=e.text,h=e.angle,n=e.layer.labelSymbol;"polyline"==e.layer.geometry.type&&e.layer.options.labelRotation&&n.setAngle(h*(180/Math.PI));n.setText(l);e=d;n instanceof g&&(d=n.getHeight(),h=Math.sin(h),e-=0.25*d*this._scale*h,k-=0.33*d*this._scale);h=new f(new m(e,k,a.extent.spatialReference));h.setSymbol(n);this.add(h)}},_addLabels:function(a,b,c,e){var d,f,k,g;if(this._isWithinScaleRange(b.minScale,b.maxScale)&&c&&""!==c){var l=this._map,h=!a.url&&!l.spatialReference.equals(a.spatialReference);for(d=
0;d<a.graphics.length;d++)if(f=a.graphics[d],!1!==f.visible){k=f.geometry;if(h){if(!r.canProject(k,l))continue;k=r.project(k,l)}k&&(this._isWhere(b.where,f.attributes)&&this._isWithinScreenArea(k))&&(g=this._buildLabelText(c,f.attributes,a.fields,e),this._addLabel(g,b,a.renderer,f,e,k,l))}}},_isWithinScreenArea:function(a){a="point"===a.type?new n(a.x,a.y,a.x,a.y,a.spatialReference):a.getExtent();if(void 0===a)return!1;a=this._intersects(this._map,a);return null===a||0===a.length?!1:!0},_isWithinScaleRange:function(a,
b){var c=this._map.getScale();return 0<a&&c>=a||0<b&&c<=b?!1:!0},_isWhere:function(a,b){try{if(!a)return!0;if(a){var c=a.split(" ");if(3===c.length)return this._sqlEquation(b[this._removeQuotes(c[0])],c[1],this._removeQuotes(c[2]));if(7===c.length){var e=this._sqlEquation(b[this._removeQuotes(c[0])],c[1],this._removeQuotes(c[2])),d=c[3],f=this._sqlEquation(b[this._removeQuotes(c[4])],c[5],this._removeQuotes(c[6]));switch(d){case "AND":return e&&f;case "OR":return e||f}}}return!1}catch(k){console.log("Error.: can't parse \x3d "+
a)}},_sqlEquation:function(a,b,c){switch(b){case "\x3d":return a==c?!0:!1;case "\x3c\x3e":return a!=c?!0:!1;case "\x3e":return a>c?!0:!1;case "\x3e\x3d":return a>=c?!0:!1;case "\x3c":return a<c?!0:!1;case "\x3c\x3d":return a<=c?!0:!1}return!1},_removeQuotes:function(a){var b=a.indexOf('"'),c=a.lastIndexOf('"');if(-1!=b&&-1!=c)return a.substr(1,a.length-2);b=a.indexOf("'");c=a.lastIndexOf("'");return-1!=b&&-1!=c?a.substr(1,a.length-2):a},_getSizeInfo:function(a){return a?a.sizeInfo||D.filter(a.visualVariables,
u)[0]:null},_addLabel:function(b,c,e,d,f,k,l){var h,m,n,p;if(b&&""!==A.trim(b)&&c){b=b.replace(/\s+/g," ");h=c.getSymbol(d);h instanceof g?(h=new g(h.toJson()),h.setVerticalAlignment("baseline"),h.setHorizontalAlignment("center")):h=h instanceof t?new t(h.toJson()):new g;h.setText(b);c.symbol=h;if(n=this._getProportionalSize(c.sizeInfo,d.attributes))h instanceof g?h.setSize(n):h instanceof t&&(h.setWidth(n),h.setHeight(n));p=n=0;if(e){m=e.getSymbol(d);var q=this._getSizeInfo(e),r;q&&(r=e.getSize(d,
{sizeInfo:q,resolution:l.getResolutionInMeters()}));if(r&&null!==r)n=p=r;else if(m)if("simplemarkersymbol"==m.type)p=n=m.size;else if("picturemarkersymbol"==m.type)n=m.width,p=m.height;else if("simplelinesymbol"==m.type||"cartographiclinesymbol"==m.type)n=m.width}e={};e.graphic=d;e.options=f;e.geometry=k;e.labelRenderer=c;e.labelSymbol=h;e.labelWidth=h.getWidth()/2;e.labelHeight=h.getHeight()/2;e.symbolWidth=a.normalizedLength(n)/2;e.symbolHeight=a.normalizedLength(p)/2;e.text=b;e.angle=h.angle;this._preparedLabels.push(e)}},
_buildLabelText:function(a,b,c,d){return a.replace(/{[^}]*}/g,function(a){var f,g=a;for(f=0;f<c.length;f++)if("{"+c[f].name+"}"==a){var g=b[c[f].name],h=c[f].domain;if(h&&A.isObject(h)){if("codedValue"==h.type&&d.useCodedValues){f=g;for(a=0;a<h.codedValues.length;a++)if(h.codedValues[a].code==f){g=h.codedValues[a].name;break}}else"range"==h.type&&(h.minValue<=g&&g<=h.maxValue)&&(g=h.name);break}h=c[f].type;if(d.fieldInfos){var l=d.fieldInfos;for(f=0;f<l.length;f++)if("{"+l[f].fieldName+"}"==a){a=
l[f].format;if("esriFieldTypeDate"==h)(a="DateFormat"+e.prototype._dateFormats[a.dateFormat?a.dateFormat:"shortDate"])&&(g=k.substitute({myKey:g},"${myKey:"+a+"}"));else if(("esriFieldTypeInteger"==h||"esriFieldTypeSingle"==h||"esriFieldTypeSmallInteger"==h||"esriFieldTypeLong"==h||"esriFieldTypeDouble"==h)&&a)g=G.format(g,{places:a.places}),a.digitSeparator||C.group&&(g=g.replace(RegExp("\\"+C.group,"g"),""));break}}break}else g="";return null===g?"":g})},_getLabelExpression:function(a){return a.labelExpressionInfo?
a.labelExpressionInfo.value:this._validSyntax(a.labelExpression)?this._convertLabelExpression(a.labelExpression):""},_validSyntax:function(a){return/^(\s*\[[^\]]+\]\s*)+$/i.test(a)},_convertLabelExpression:function(a){return a.replace(RegExp("\\[","g"),"{").replace(RegExp("\\]","g"),"}")},_getProportionalSize:function(a,b){if(!a)return null;var c=k.substitute(b,"${"+a.field+"}",{first:!0});return!a.minSize||!a.maxSize||!a.minDataValue||!a.maxDataValue||!c||0>=a.maxDataValue-a.minDataValue?null:(a.maxSize-
a.minSize)/(a.maxDataValue-a.minDataValue)*(c-a.minDataValue)+a.minSize},_convertOptions:function(a){var b=!0,c="shortDate",e=null,f=null,d="",g=!0;a&&(a.format&&(c=a.format.dateFormat,e={places:a.format.places,digitSeparator:a.format.digitSeparator}),f=a.fieldInfos,d=a.labelPlacement,null!=a.useCodedValues&&(b=a.useCodedValues));if("always-horizontal"==d||"esriServerPolygonPlacementAlwaysHorizontal"==d)g=!1;return{useCodedValues:b,dateFormat:c,numberFormat:e,fieldInfos:f,pointPriorities:"above-center"==
d||"esriServerPointLabelPlacementAboveCenter"==d?"AboveCenter":"above-left"==d||"esriServerPointLabelPlacementAboveLeft"==d?"AboveLeft":"above-right"==d||"esriServerPointLabelPlacementAboveRight"==d?"AboveRight":"below-center"==d||"esriServerPointLabelPlacementBelowCenter"==d?"BelowCenter":"below-left"==d||"esriServerPointLabelPlacementBelowLeft"==d?"BelowLeft":"below-right"==d||"esriServerPointLabelPlacementBelowRight"==d?"BelowRight":"center-center"==d||"esriServerPointLabelPlacementCenterCenter"==
d?"CenterCenter":"center-left"==d||"esriServerPointLabelPlacementCenterLeft"==d?"CenterLeft":"center-right"==d||"esriServerPointLabelPlacementCenterRight"==d?"CenterRight":"AboveRight",lineLabelPlacement:"above-start"==d||"below-start"==d||"center-start"==d?"PlaceAtStart":"above-end"==d||"below-end"==d||"center-end"==d?"PlaceAtEnd":"PlaceAtCenter",lineLabelPosition:"above-after"==d||"esriServerLinePlacementAboveAfter"==d||"above-along"==d||"esriServerLinePlacementAboveAlong"==d||"above-before"==d||
"esriServerLinePlacementAboveBefore"==d||"above-start"==d||"esriServerLinePlacementAboveStart"==d||"above-end"==d||"esriServerLinePlacementAboveEnd"==d?"Above":"below-after"==d||"esriServerLinePlacementBelowAfter"==d||"below-along"==d||"esriServerLinePlacementBelowAlong"==d||"below-before"==d||"esriServerLinePlacementBelowBefore"==d||"below-start"==d||"esriServerLinePlacementBelowStart"==d||"below-end"==d||"esriServerLinePlacementBelowEnd"==d?"Below":"center-after"==d||"esriServerLinePlacementCenterAfter"==
d||"center-along"==d||"esriServerLinePlacementCenterAlong"==d||"center-before"==d||"esriServerLinePlacementCenterBefore"==d||"center-start"==d||"esriServerLinePlacementCenterStart"==d||"center-end"==d||"esriServerLinePlacementCenterEnd"==d?"OnLine":"Above",labelRotation:g,howManyLabels:"OneLabel"}}});b("extend-esri")&&A.setObject("layers.LabelLayer",B,c);return B});