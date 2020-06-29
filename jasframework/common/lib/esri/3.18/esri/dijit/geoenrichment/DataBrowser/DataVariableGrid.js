// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.18/esri/copyright.txt for details.
//>>built
define("esri/dijit/geoenrichment/DataBrowser/DataVariableGrid","dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/dom-construct dojo/dom-class dojo/on dijit/Tooltip dgrid/OnDemandGrid dgrid/tree ../_Invoke ../SelectableTree ../TriStateItem ./VariableUtil ./VariableToggle".split(" "),function(p,k,f,m,h,l,n,q,r,s,t,u,v,w){return p([q,s],{manager:null,showHeader:!1,keepScrollPosition:!0,groupCategories:!0,animateSelection:null,queryID:"/",_selectionHandler:null,_cellHash:null,_tooltipIcon:null,
_tooltipHidden:!1,_inUpdate:!1,_expansionHash:null,_lastToggledIndex:0,_maxGroupSize:0,buildRendering:function(){var a={label:"",renderCell:k.hitch(this,this._renderNode),sortable:!1};this.groupCategories&&(a.indentWidth=this.manager.variables.favorites?1:this.manager.multipleSelectIsAllowed()?16:8,a=r(a));this.columns=[a];this._cellHash={};this.setVariables([]);this.inherited(arguments)},refresh:function(){this._cellHash={};this.inherited(arguments)},setVariables:function(a,b){this._cleanup();var c=
this._prepareVariables(a);c.length&&(this._selectionHandler=this.manager.watch("selection",k.hitch(this,this._selectionUpdated)));this.groupCategories&&(c.length&&!b?(this._expansionHash=this._expansionHash||{},this._expanded=this._expansionHash[this.queryID]||{}):this._expansionHash&&(this._expansionHash[this.queryID]=this._expanded||{}));c=new t(c);this._started?(this.set("store",c),this.refresh()):this.store=c},_prepareVariables:function(a){if(!a.length)return[];this._lastToggledIndex=this._maxGroupSize=
0;this.groupCategories?(a=this._prepareVariableCategories(a),0>this.manager.selectionLimit&&f.forEach(a,function(a,c){a.index=c+1;f.forEach(a.children,function(a,b){a.index=b+1});this._maxGroupSize=Math.max(this._maxGroupSize,a.children.length+2)},this)):a=f.map(a,this._prepareVariableItem,this);return a},_prepareVariableCategories:function(a){var b={};f.forEach(a,function(a){var c=a.fieldCategory,g=b[c];g||(g={label:c,id:c,children:[]},b[c]=g);g.children.push(this._prepareVariableItem(a))},this);
a=[];for(var c in b)a.push(b[c]);return this.manager.variables.queryEngine({},{sort:[{attribute:"label"}]})(a)},_prepareVariableItem:function(a){var b=this._prepareVariableNode(a);b.id=this.manager.variables.getIdentity(a);return b},_prepareVariableNode:function(a){var b={label:a.description,variable:a};b.group=v.getToggleGroup(this.manager.variables,this.manager.variables.getIdentity(a));if(a=this.manager.getSelectionGroups().hash[b.group.value])b.selected=!0,b.group.value=a.value;return b},renderHeader:function(){},
_renderNode:function(a,b,c){this._cellHash[this.store.getIdentity(a)]=c;h.add(c,"DataBrowserVarCell");if(a.variable)if(this.manager.variables.favorites){if(b=this._addVariableFavoriteIcon(a,c)){var d=this._getFavoriteId(a);this._updateFavorite(b,this.manager.variables.favorites.contains(d));l(b,"click",k.hitch(this,this._toggleFavorite,b,d));c.__favoriteIcon=b}this._addSpacer(c)}else this.manager.multipleSelectIsAllowed()&&this._addSpacer(c);if(this.manager.multipleSelectIsAllowed()){var e=new u(c,
{"class":"dijitInline DataBrowserVarIcon DataBrowserCheckBox DataBrowserVarFloatStart"});e.autoToggle=!1;e.node=a;c.__cellCheckbox=e;this._updateCheckboxState(e);this._addSpacer(c)}if(b=this._addVariableInfoIcon(a,c))l(b,"click",k.hitch(this,this._toggleTooltip,b,a.variable)),l(b,"mouseover",k.hitch(this,this._showTooltip,b,a.variable)),l(b,"mouseout",k.hitch(this,this._hideTooltip));a.variable&&a.group.states&&(b=new w(a.group,m.create("div",{"class":"dijitInline DataBrowserVarFloatEnd"},c)),l(b,
"change",k.hitch(this,this._onVariableToggleChange,a,b)),c.__varToggle=b,this._addSpacer(c,!0));b=m.create("div",{"class":"TrimWithEllipses "+(a.variable?"DataBrowserVarLabel":"DataBrowserVarGroup"),innerHTML:a.label},c);d=k.hitch(this,this._onRowClick,a,b);e&&(e.onClick=d);a.variable?this.manager.selectionLimit&&(h.add(b,"DataBrowser_Clickable"),l(b,"click",d),1==this.manager.selectionLimit&&h.add(c,"DataBrowser_Selectable")):(h.add(b,"DataBrowser_Clickable"),l(b,"click",k.hitch(this,this._onCategoryExpand,
a.id)))},_addVariableFavoriteIcon:function(a,b){return m.create("div",{"class":"dijitInline DataBrowserVarIcon FavoriteItemIcon DataBrowserVarFloatStart"},b)},_getFavoriteId:function(a){return a.id},_addVariableInfoIcon:function(a,b){if(a.variable&&this.manager.variableInfo){var c=m.create("div",{"class":"dijitInline DataBrowserVarIcon DataBrowserVarFloatStart DataBrowserInfoIcon"},b);this._addSpacer(b)}return c},_addSpacer:function(a,b){m.create("div",{"class":"dijitInline DataBrowserVarSpacer "+
(b?"DataBrowserVarFloatEnd":"DataBrowserVarFloatStart"),innerHTML:"\x26nbsp;"},a)},_onCategoryExpand:function(a){this.expand(a,!(this._expanded&&this._expanded[a]))},_toggleFavorite:function(a,b){var c=this.manager.variables.favorites;c.contains(b)?c.remove(b):c.add(b);c=c.contains(b);this._updateFavorite(a,c);this.invoke("_saveFavorites",1E3);return c},_updateFavorite:function(a,b){b?(h.remove(a,"FavoriteItem"),h.add(a,"FavoriteItemChecked")):(h.remove(a,"FavoriteItemChecked"),h.add(a,"FavoriteItem"))},
_saveFavorites:function(){this.manager.variables.favorites.save()},_toggleTooltip:function(a,b){(this._tooltipHidden=!this._tooltipHidden)?this._hideTooltip():this._showTooltip(a,b)},_showTooltip:function(a,b){this._tooltipHidden||this._tooltipIcon===a||(this._tooltipIcon=a,this.manager.variableInfo.set("variable",b),n.show(this.manager.variableInfo.domNode.outerHTML,a,["above","below"]))},_hideTooltip:function(){this._tooltipIcon&&(n.hide(this._tooltipIcon),this._tooltipIcon=null)},_onRowClick:function(a,
b,c){if(0>this.manager.selectionLimit){if(c.shiftKey&&this._applyMultiSelect(a))return;this._updateLastItem(a)}c=1==this.manager.selectionLimit;var d=!a.children?[a]:this.store.getDescendingNodes(a,a.selected?null:!1,!0),e=f.map(d,function(a){return a.group.value});this._inUpdate=!0;var g=c||!a.selected,e=g?this.manager.addToSelection(e):this.manager.removeFromSelection(e,!!a.children);this._inUpdate=!1;e?(this._updateSelection(d,e,g),a.children&&!c&&(a.selected=g),this._synchronizeWithStore(),g&&
this.animateSelection&&this.animateSelection(b)):g&&(d.length&&!c)&&(a.children?a.selected=!0:a.parent.selected=!0)},_updateSelection:function(a,b,c){f.forEach(a,function(a){b[a.group.value]&&this.store.changeSelect(a,c)},this)},_onVariableToggleChange:function(a,b){a.group.value=b.value;this._inUpdate=!0;this.manager.updateSelection(b.value);this._inUpdate=!1;this.manager.allowMultipleSelectInGroup&&this._selectionUpdated()},_selectionUpdated:function(){if(!this._inUpdate){var a=this.manager.getSelectionGroups();
f.forEach(this.store.data,function(b){f.forEach(b.children||[b],function(b){var d=a.hash[b.group.value];d&&(b.group.value=d.value);this.store.changeSelect(b,!!d)},this)},this);this._synchronizeWithStore()}},_synchronizeWithStore:function(){var a=this.manager.getSelectionGroups(),b;for(b in this._cellHash){var c=this._cellHash[b],d=c.__cellCheckbox;d&&this._updateCheckboxState(d);(d=(c=c.__varToggle)&&a.hash[c.value])&&c.set("value",d.value)}},_updateCheckboxState:function(a){var b=this.store.getSelectionState(a.node);
a.set("checked",b)},_getNodeIndex:function(a){var b=a.index;return b=a.children?b*this._maxGroupSize:b+a.parent.index*this._maxGroupSize},_updateLastItem:function(a){this._lastToggledIndex=this._getNodeIndex(a);a.children&&(this._lastToggledIndex+=a.children.length+1)},_applyMultiSelect:function(a){var b=this._lastToggledIndex,c=this._lastToggledIndex=this._getNodeIndex(a);if(!b||c==b)return!1;c<b?b-=1:(c=b+1,a.children&&(this._lastToggledIndex+=a.children.length+1),b=this._lastToggledIndex);var d=
[],e=[];a=Math.floor(c/this._maxGroupSize);for(var g=Math.floor(b/this._maxGroupSize),c=c%this._maxGroupSize,b=b%this._maxGroupSize,k=this.store.root.children,f=a;f<=g;f++,c=1)for(var h=k[f-1].children,l=f!=g?h.length:Math.min(h.length,b),c=Math.max(c-1,0);c<l;c++){a=h[c];var m=!a.selected;this.store.changeSelect(a,m);(m?e:d).push(a.group.value)}this._inUpdate=!0;d.length&&this.manager.removeFromSelection(d,!0);e.length&&this.manager.addToSelection(e);this._inUpdate=!1;this._synchronizeWithStore();
return!0},destroy:function(){this._cleanup();this.inherited(arguments)},_cleanup:function(){this._selectionHandler&&(this._selectionHandler.remove(),delete this._selectionHandler);this._cellHash={}}})});