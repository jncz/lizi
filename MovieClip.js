function MovieClip2D(img,data){
	this.x = 0;
	this.y = 0;
	this.rotation = 0;
	this.scaleX = 1;
	this.scaleY = 1;
	this.visible = true;
	this.alpha = 1;
	
	this.paint = function(){
		if(this.visible){
			context.save();
			
			context.globalAlpha = this.alpha;
			context.translate(this.x,this.y);
			context.rotate(this.rotation*Math.PI/180);
			context.scale(this.scaleX,this.scaleY);
			context.drawImage(img,0,0,img.width,img.height,-img.width/2,-img.height/2,img.width,img.height);
			
			context.restore();
		}
	};
}