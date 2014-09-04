"use strict"
define(["engine/event"],function(Event2D){
	var MovieClip2D = function(img,data){
		this.img = img;
		this.data = data;
		this.x = 0;
		this.y = 0;
		this.rotation = 0;
		this.scaleX = 1;
		this.scaleY = 1;
		this.visible = true;
		this.alpha = 1;
		this.direction = "left";//物体朝向，默认向左
		//偏移, 从大图上哪个坐标点开始切图
		this.mcX = 0;
		this.mcY = 0;
		//帧的宽高
		this.frameW = 32;
		this.frameH = 32;
		
		this.currentFrame = 0;
		//动画播放头X位置
		this.frameHeadX = 0;
		//动画播放头Y位置
		this.frameHeadY = 0;
		/**
		动画播放头X,Y含义，见下图：
		1,1,1,2,2,2,3,3,3
		4,4,4,5,5,5,6,6,6
		7,7,7,8,8,8,9,9,9
		假设上图中的1.。。9分别为9组不同的动画，数字相同的为一组。
		如果frameHeadX = 0, frameHeadY = 0,则表示当前的帧为第0行，第0列所对应的图像
		如果frameHeadX = 0, frameHeadY = 1,则表示当前的帧为第1行，第0列所对应的图像
		配合上totalFrames参数， 比如对于这个图来说，每组动画为3帧，则这个数值为3，会将第0个到第2个的帧依次播放形成动画
		动画间隙由animationSpeed控制
		*/
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
			//performance.mark("paint_start");
			if(this.visible){
				this.updateFrameData();
				
				context.save();
				
				context.globalCompositeOperation = this.blend;
				context.globalAlpha = this.alpha;
				context.translate(this.x,this.y);
				context.rotate(this.rotation*Math.PI/180);
				context.scale(this.scaleX,this.scaleY);
				
				switch(this.isPlay){
					case 1://From static image
						context.drawImage(this.img,this.mcX,this.mcY,this.frameW,this.frameH,-this.frameW/2,-this.frameH/2,this.frameW,this.frameH);
						break;
					case 2://From xml definition
						context.drawImage(this.img,this.mcX,this.mcY,this.width,this.height,
							-(this.frameX)-this.frameWidth/2,
							-(this.frameY)-this.frameHeight/2
							,this.width,this.height);
						break;
					default:
						context.drawImage(this.img,this.mcX,this.mcY,this.frameW,this.frameH,-this.frameW/2,-this.frameH/2,this.frameW,this.frameH);
						break;
				}
				
				
				context.restore();
			}
			/**
			performance.mark("paint_end");
			performance.measure("paint","paint_start","paint_end");
			var ms = performance.getEntriesByName("paint");
			console.log("between:  "+ms[0].duration);
			performance.clearMarks("paint_start");
			performance.clearMarks("paint_end");
			performance.clearMeasures("paint");
			*/
		};
		this.updateFrameData = function(){
			switch(this.isPlay){
				case 1://From static image
					this.mcY = this.frameHeadY*this.frameH;
					this.mcX = this.frameHeadX*this.frameW+this.currentFrame*this.frameW;
					break;
				case 2://From xml definition
					if(this.data){
						var cFrame = this.data[this.currentFrame];
						this.width=cFrame.w;
						this.height=cFrame.h;
						this.mcX=cFrame.x;
						this.mcY=cFrame.y;
						this.frameX=cFrame.frameX;
						this.frameY=cFrame.frameY;
						this.frameWidth=cFrame.frameW;
						this.frameHeight=cFrame.frameH;
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
			setInterval(that.movement,10);
			
		};
		this.addEventListener = function(eventType,callback){
			//TODO
			var eventObj = new Event2D();
			eventObj.eventType = eventType;
			eventObj.callback = callback;
			stage2d.addEventListener(eventObj);
		};
	};
	
	return MovieClip2D;
});