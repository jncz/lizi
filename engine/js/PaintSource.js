"use strict"

define(function(){
	var f = function(source,w,h){
		this.source = source;
		this.width = w;
		this.height = h;
		/**
		@param ctx - canvas context obj. It will paint to the target context
		*/
		this.paint = function(ctx){
			if(ctx)
				ctx.save();
				ctx.drawImage(this.source,0,0,this.width,this.height);
				ctx.restore();
		};
	};
	Object.freeze(f);
	return f;
});