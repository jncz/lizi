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
	
	//动画实际宽度
    this.width=0;
 
    //动画实际高度
    this.height=0;
 
    //帧偏移X信息
    this.frameX=0;
 
    //帧偏移Y信息
    this.frameY=0;
 
    //动画ID
    this.nameId=0;
	
	//动画播放速度
    this.animationSpeed=24;
 
    //用于计算过去的时间
    this.animationTime=0;
	
	//混色参数
	this.blend="source-over";
	
	this.paint = function(){
		if(this.visible){
			this.updateFrameData();
			
			context.save();
			
			context.globalCompositeOperation = this.blend;
			context.globalAlpha = this.alpha;
			context.translate(this.x,this.y);
			context.rotate(this.rotation*Math.PI/180);
			context.scale(this.scaleX,this.scaleY);
			
			switch(this.isPlay){
				case 1:
					context.drawImage(img,this.mcX,this.mcY,this.frameW,this.frameH,-this.frameW/2,-this.frameH/2,this.frameW,this.frameH);
					break;
				case 2:
					context.drawImage(img,this.mcX,this.mcY,this.width,this.height,
                        -(this.frameX)-this.frameWidth/2,
                        -(this.frameY)-this.frameHeight/2
                        ,this.width,this.height);
					break;
				default:
					context.drawImage(img,this.mcX,this.mcY,this.frameW,this.frameH,-this.frameW/2,-this.frameH/2,this.frameW,this.frameH);
					break;
			}
			
			
			context.restore();
		}
	};
	this.updateFrameData = function(){
		switch(this.isPlay){
			case 1:
				this.mcY = this.frameHeadX*this.frameH;
				this.mcX = this.frameHeadX*this.frameW+this.currentFrame*this.frameW;
				break;
			case 2:
				if(data){
					this.width=data[this.currentFrame].w;
					this.height=data[this.currentFrame].h;
					this.mcX=data[this.currentFrame].x;
					this.mcY=data[this.currentFrame].y;
					this.frameX=data[this.currentFrame].frameX;
					this.frameY=data[this.currentFrame].frameY;
					this.frameWidth=data[this.currentFrame].frameW;
					this.frameHeight=data[this.currentFrame].frameH;
					this.totalFrames=data.length;
				}
				break;
		}
		
		var date=new Date();
        if((date.getTime()-this.animationTime>=1000/this.animationSpeed))
        {
            this.animationTime=date.getTime();
            this.currentFrame++;
        }
        if(this.currentFrame>=this.totalFrames)
        {
            this.currentFrame=0;
        }
	};
	this.move = function(callback){
		var that = this;
		setInterval(function(){
			callback.apply(that);
		},10);
		
	};
}