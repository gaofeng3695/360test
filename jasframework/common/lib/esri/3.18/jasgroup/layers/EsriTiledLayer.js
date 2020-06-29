define([
    "dojo/_base/declare","dojo/_base/lang","dojo/request/script",
    "esri/map","esri/SpatialReference","esri/geometry/Extent",
    "esri/layers/TileInfo","esri/layers/TiledMapServiceLayer",
    "esri/geometry/Point","dojo/domReady!"
], function (declare, lang ,script,
             Map ,SpatialReference , Extent,
             TileInfo, TiledMapServiceLayer,Point){
    return declare("EsriTiledLayer", TiledMapServiceLayer, {
        type: "esritiled",
        constructor: function (url,options,map) {
            //this.inherited(url,options);
            var defaults = {
                dpi:96,
                rows:512,
                cols:512,
                origin:null,
                lods:null,
                format:"PNG32"
            };
            var params = lang.mixin(defaults,options);
            var wkid = this.spatialReference.wkid;
            var ext = map.extent;
            if(url.substring(url.length-1) !== "/"){
                url += "/";
            }
            this.url = url ;
            this.spatialReference = new SpatialReference(wkid);
            this.initialExtent = this.fullExtent = new Extent(ext.xmin,ext.ymin,ext.xmax,ext.ymax,this.spatialReference) ;

            if(!params.lods ){
                params.lods = map._mapParams.lods;
            }
            if(!params.origin){
                params.origin = map._mapParams.origin;
            }
            this.tileInfo = new TileInfo({
                "rows": 512,
                "cols": 512,
                "dpi": 96,
                "format": "PNG32",
                "compressionQuality": 0,
                "origin": new Point( params.origin[0],params.origin[1], this.spatialReference),
                "spatialReference": { wkid: wkid },
                "lods": params.lods
            });
            this.loaded = true;
            this.onLoad(this);
        },
        getTileUrl: function (level, row, col) {
            return this.url +
                "L" + dojo.string.pad(level, 2, '0') + "/" +
                "R" + dojo.string.pad(row.toString(16), 8, '0') + "/" +
                "C" + dojo.string.pad(col.toString(16), 8, '0') + "." +
                "png";
        },
        setType: function (type) {
            this.type = type ;
        }
    });
});