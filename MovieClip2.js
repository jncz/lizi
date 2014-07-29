function MovieClip2D(img,data){
	this.x = 0;
	this.y = 0;
	this.rotation = 0;
	this.scaleX = 1;
	this.scaleY = 1;
	this.visible = true;
	this.alpha = 1;
	//偏移
	this.mcX = 0;
	this.mcY = 0;
	//帧的宽高
	this.frameW = 32;
	this.frameH = 32;
	
	this.totalFrames = 1;
	this.currentFrame = 0;
	//动画播放头X位置
	this.frameHeadX = 0;
	//动画播放头Y位置
	this.frameHeadY = 0;
	//总帧数
	this.totalFrames = 0;
	
	//是否播放动画
	this.isPlay = true;
	
	this.paint = function(){
		if(this.visible){
			this.updateFrameData();
			
			context.save();
			
			context.globalAlpha = this.alpha;
			context.translate(this.x,this.y);
			context.rotate(this.rotation*Math.PI/180);
			context.scale(this.scaleX,this.scaleY);
			
			context.drawImage(img,this.mcX,this.mcY,this.frameW,this.frameH,-this.frameW/2,-this.frameH/2,this.frameW,this.frameH);
			
			context.restore();
		}
	};
	this.updateFrameData = function(){
		if(this.isPlay){
			this.mcY = this.frameHeadX*this.frameH;
			this.mcX = this.frameHeadX*this.frameW+this.currentFrame*this.frameW;
			this.currentFrame++;
			if(this.currentFrame>=this.totalFrames){
				this.currentFrame = 0;
			}
		}
	};
}