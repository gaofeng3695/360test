define(["dojo/_base/declare", "dijit/Dialog", "dijit/_WidgetBase",
        "dijit/_TemplatedMixin", "esri/layers/TiledMapServiceLayer", "esri/SpatialReference", "esri/geometry/Extent", "esri/layers/TileInfo"],
    function (declare,Dialog, _WidgetBase, _TemplatedMixin, TiledMapServiceLayer, SpatialReference, Extent, TileInfo) {
        return declare("TianDiTuLayer", TiledMapServiceLayer, {
            // create WMTSLayer by extending esri.layers.TiledMapServiceLayer
            type: "tdt-vec",
            _hosts: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],//8个并发服务
            constructor: function () {
                this.spatialReference = new SpatialReference({
                    wkid: 4490
                });
                this.initialExtent = new Extent(-180, -90, 180, 90, this.spatialReference);
                this.fullExtent = new Extent(-180, -90, 180, 90, this.spatialReference);
                this.tileInfo = new TileInfo({
                    "dpi": "90.71428571427429",
                    "format": "image/png",
                    "compressionQuality": 0,
                    "spatialReference": {
                        "wkid": "4326"
                    },
                    "rows": 256,
                    "cols": 256,
                    "origin": {
                        "x": -180,
                        "y": 90
                    },
                    "lods": [
                        { level: 0, resolution: 0.703125, scale: 295497598.57083454877776507238 },
                        { level: 1, resolution: 0.3515625, scale: 147748799.28541727438888253619 },
                        { level: 2, resolution: 0.17578125, scale: 73874399.642708637194441268094 },
                        { level: 3, resolution: 0.087890625, scale: 36937199.821354318597220634047 },
                        { level: 4, resolution: 0.0439453125, scale: 18468599.910677159298610317023 },
                        { level: 5, resolution: 0.02197265625, scale: 9234299.955338579649305158512 },
                        { level: 6, resolution: 0.010986328125, scale: 4617149.9776692898246525792559 },
                        { level: 7, resolution: 0.0054931640625, scale: 2308574.9888346449123262896279 },
                        { level: 8, resolution: 0.00274658203125, scale: 1154287.494417322456163144814 },
                        { level: 9, resolution: 0.001373291015625, scale: 577143.74720866122808157240698 },
                        { level: 10, resolution: 0.0006866455078125, scale: 288571.87360433061404078620349 },
                        { level: 11, resolution: 0.00034332275390625, scale: 144285.93680216530702039310175 },
                        { level: 12, resolution: 0.000171661376953125, scale: 72142.968401082653510196550873 },
                        { level: 13, resolution: 0.0000858306884765625, scale: 36071.484200541326755098275436 },
                        { level: 14, resolution: 0.00004291534423828125, scale: 18035.742100270663377549137718 },
                        { level: 15, resolution: 0.000021457672119140625, scale: 9017.871050135331688774568859 },
                        { level: 16, resolution: 0.0000107288360595703125, scale: 4508.9355250676658443872844296 },
                        { level: 17, resolution: 0.00000536441802978515625, scale: 2254.4677625338329221936422148 },
                        { level: 18, resolution: 0.000002682209014892578125, scale: 1127.2338812669164610968211074 },
                        { level: 19, resolution: 0.0000013411045074462890625, scale: 563.61694063345823054841055369 }
                    ]
                });
                this.loaded = true;
                this.onLoad(this);
                this.options = arguments[1] ? arguments[1] :{};
                if(this.options.type){
                    this.type = arguments[1].type;
                }
            },
            getTileUrl: function (level, row, col) {
                var index = Math.abs(col % 7);//
                var host = this._hosts[index];
                var url = "";
                if (this.type === "tdt-vec") {// 全球矢量图
                    url = "http://" + host + ".tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX=" + (level + 1) + "&TILECOL=" + col + "&TILEROW=" + row;
                }
                else if (this.type === "tdt-cva") {// 全球矢量中文标注
                    url = "http://" + host + ".tianditu.gov.cn/cva_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX=" + (level + 1) + "&TILECOL=" + col + "&TILEROW=" + row;
                }
                else if (this.type === "tdt-ter") {// 全球地形图
                    url = "http://" + host + ".tianditu.gov.cn/ter_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX=" + (level + 1) + "&TILECOL=" + col + "&TILEROW=" + row;
                }
                else if (this.type === "tdt-cta") {//全球地形中文标注
                    url = "http://" + host + ".tianditu.gov.cn/cta_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cta&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX=" + (level + 1) + "&TILECOL=" + col + "&TILEROW=" + row;
                }
                else if (this.type === "tdt-img") {//全球影像
                    url = "http://" + host + ".tianditu.gov.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX=" + (level + 1) + "&TILECOL=" + col + "&TILEROW=" + row;
                }
                else if (this.type === "tdt-cia") {//全球影像标注
                    url = "http://" + host + ".tianditu.gov.cn/cia_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX=" + (level + 1) + "&TILECOL=" + col + "&TILEROW=" + row;
                }
                if(this.options.key){
                    url += "&tk=" + this.options.key ;
                }
                return url;
            }
        });
    });