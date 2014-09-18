"use strict"
/**
该对象用于将图像缓存到隐藏的CANVAS元素中，在后续的绘制中就不需要再次按照一个一个的方格进行重新绘制了，直接将已经绘制好的图像取出即可
*/
define(["engine/PaintSource"],function(PaintSource){
	var prefix = "temp_canvas_prefix_";
	
	var __createTempCanvas = function(user_id,w,h){
		var id = prefix + user_id;
		var c = $(id);
		if(!c){//如果不存在则创建
			var c = document.createElement("canvas");
			c.setAttribute("id",id);
			c.setAttribute("width",w);
			c.setAttribute("height",h);
			c.setAttribute("style","display:none");
			document.body.appendChild(c);
		}
		return c;
	};
	var __deleteTempCanvas = function(id){
		var id = prefix + user_id;
		var c = $(id);
		if(c){
			document.body.removeChild(c);
		}
	};
	var __draw = function(ctx,data){
		var w = data.width;
		var h = data.height;
		ctx.clearRect(0,0,w,h);
		ctx.save();
		ctx.drawImage(data,0,0,w,h);
		ctx.restore();
	};
	var internalCache = {};
	var impl = {
		/**
		@param id
		@param data - 传入的是canvas对象
		*/
		cache : function(id,data){
			if(!(data instanceof HTMLCanvasElement)){
				throw "data is not valid, it should be HTMLCanvasElement type";
			}
			var w = data.width;
			var h = data.height;
			var c = __createTempCanvas(id,w,h);
			var ctx = c.getContext("2d");
			__draw(ctx,data);
			var paintSrc = new PaintSource(c,w,h);
			internalCache[id] = paintSrc;
		},
		release : function(id){
			internalCache[id] = null;
			__deleteTempCanvas(id);
		},
		cached : function(id){
			return internalCache[id]!=null;
		},
		get : function(id){
			return internalCache[id];
		},
	};
	Object.freeze(impl);
	return impl;
});