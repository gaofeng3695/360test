// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.18/esri/copyright.txt for details.
//>>built
define("esri/layers/vectorTiles/views/vectorTiles/TileHandler","require exports module dojo/Deferred dojo/promise/all ../../core/workers ../../core/promiseUtils ../../core/requireUtils ../../request ../2d/layers/support/TileKey ./TileIndex ./SpriteMosaic ./SpriteSource ./GlyphMosaic ./GlyphSource ./VectorTileDisplayObject ./GeometryUtils".split(" "),function(r,D,s,t,l,u,d,v,p,w,x,y,z,A,B,C,q){return function(){function b(a,h){this._tileIndex=this._connection=this._glyphMosaic=this._spriteMosaic=null;
this._vectorTileLayer=a;this._requestUpdate=h;this.devicePixelRatio=window.devicePixelRatio||1}b.prototype.destroy=function(){this.stop();this._vectorTileLayer=this._requestUpdate=null};Object.defineProperty(b.prototype,"spriteMosaic",{get:function(){return this._spriteMosaic},enumerable:!0,configurable:!0});Object.defineProperty(b.prototype,"glyphMosaic",{get:function(){return this._glyphMosaic},enumerable:!0,configurable:!0});b.prototype.start=function(){var a=this;this.stop();var h=this._vectorTileLayer.styleRepository,
c=new z(h.sprite,this.devicePixelRatio);c.devicePixelRatio=devicePixelRatio;var b=c.load().then(function(){a._spriteMosaic=new y(1024,1024);a._spriteMosaic.setSpriteSource(c)}),d=new B(h.glyphs);this._glyphMosaic=new A(1024,1024,d);var g=this._fetchTileMap(this._vectorTileLayer.tileIndexUrl),n=u.open(this,v.getAbsMid("./WorkerTileHandler",r,s)).then(function(b){a._connection=b}),e=new t(function(a){b.isFulfilled()||b.cancel();g.isFulfilled()||g.cancel();n.isFulfilled()||n.cancel()});l([b,g,n]).then(function(b){l(a._connection.broadcast("setLayers",
h.styleJSON)).then(function(){e.resolve()})});return this._broadcastPromise=e.promise};b.prototype.stop=function(){this._broadcastPromise&&!this._broadcastPromise.isFulfilled()&&this._broadcastPromise.cancel();this._connection&&(this._connection.close(),this._connection=null)};b.prototype.updateTile=function(a,b){if(!this._broadcastPromise.isFulfilled()||!this._connection)return d.reject(Error("no connection"));var c=Math.round(q.degToByte(b.state.rotation));if(a.rotation===c)return null;a.rotation=
c;return this._connection.invoke("update",{key:a.id,rotation:c},[],{id:a.workerID}).then(function(b){a.updateSymbolData(b);return a})};b.prototype.getVectorTile=function(a,b){var c=this;if(!this._broadcastPromise.isFulfilled()||!this._connection)return d.reject(Error("no connection"));var m=this._vectorTileLayer.tileInfo,f=Math.round(b.state.rotation);if(m.lods.length<=a.level)return d.reject("Cannot create tile for the requested level");var g=this._tileIndex?this._tileIndex.dataKey(a):a;return!g?
d.reject(Error("no data")):this._getTileData(this._connection,a,g,f).then(function(d){var e=m.size[0]*m.lods[a.level].resolution,k=m.origin,f=k.x+a.col*e+a.world*c._vectorTileLayer.fullExtent.width,l=f+e,k=k.y-a.row*e,e=k-e;c._requestUpdate();return new C(a,g,[f,k,l,e],c._vectorTileLayer.tileInfo.size[1],4096,Math.round(q.degToByte(b.state.rotation)),d.tileData,c._vectorTileLayer.styleRepository,c._glyphMosaic,d.workerId,c._connection)}).otherwise(function(a){return d.reject(a)})};b.prototype.fetchTileData=
function(a){a=w.fromId(a);a=this._vectorTileLayer.getTileUrl(a.level,a.row,a.col);return p(a,{callbackParamName:"callback",responseType:"array-buffer"}).then(function(a){return{data:{protobuff:a.data},buffers:[a.data]}})};b.prototype.getSprites=function(a){return d.resolve({data:{spriteItems:this._spriteMosaic.getSpriteItems(a.sprites)}})};b.prototype.getGlyphs=function(a){return this._glyphMosaic.getGlyphItems(a.tileID,a.font,a.codePoints).then(function(a){return{data:{glyphItems:a}}})};b.prototype.getStyleRepository=
function(){return this._vectorTileLayer.styleRepository};b.prototype.getTileIndex=function(){return this._tileIndex};b.prototype._getTileData=function(a,b,c,d){var f={id:null};return this._connection.invoke("getTile",{key:b.id,refKey:c.id,rotation:d},[],f).then(function(a){return{tileData:a,workerId:f.id}})};b.prototype._fetchTileMap=function(a){var b=this;return!a?null:p(a,{callbackParamName:"callback",responseType:"json"}).then(function(a){b._tileIndex=new x(a.data)})};return b}()});