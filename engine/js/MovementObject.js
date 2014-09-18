/**
该对象用于表示，受鼠标，键盘，触碰等事件控制的对象，在这些事件控制之下，该对象具有可动的属性。
*/
"use strict"
define(["engine/Constants","engine/collision"],function(C,Collision){
	function changeFace(targetObj,face){
		targetObj.frameHeadX = face[0];
		targetObj.frameHeadY = face[1];
	};
	var MovementObject = function(img,data){
		this.px = 0;//元素的上一次绘制时所在坐标
		this.py = 0;
		this.img = img;
		this.data = data;
		this.selectedDirection;
		this.moveDirection = [];
		this.ifReverse = true;
		this.faceLeft = [0,1];//一下四个值为不同方向的时候，物体显示的样子，数组长度为2，为切图的坐标。参考MovieClip.js中的frameHeadY注释。这四个值需要被各个对象重载
		this.faceRight = [0,2];
		this.faceUp = [0,3];
		this.faceDown = [0,0];
		this.allowOut = false;//是否允许该物体超出屏幕之外，对于比如人来说，人的边缘到达屏幕边缘之后，停止或者折返，对于子弹来说，允许超出屏幕，但超出屏幕之后该对象被删除。
		
		var that = this;
		var x0Step = C.MOVE_STEP_X;
		var x1Step = C.MOVE_STEP_X;
		var y0Step = C.MOVE_STEP_Y;
		var y1Step = C.MOVE_STEP_Y;

		var collisionChecker = new Collision(jsonmap);
		var cache = {x:{},y:{}};//用于cache x方向和y方向已经计算出来的可运动范围. x表示的是y坐标相同的起始，终止点，y表示x坐标相同的起始终止点
		/**
		@param standImg 停止时站立图片的偏移坐标
		*/
		this.stop = function(standImg){
			switch(that.selectedDirection){
				case C.DIRECTION_LEFT:
					changeFace(that,that.faceLeft);
					break;
				case C.DIRECTION_RIGHT:
					changeFace(that,that.faceRight);
					break;
				case C.DIRECTION_UP:
					changeFace(that,that.faceUp);
					break;
				case C.DIRECTION_DOWN:
					changeFace(that,that.faceDown);
					break;
			}
		};
		/**
		@param direction 移动方向
		@param step 移动步伐，可选值为三种: X, {X,Y},{X1,X2,Y1,Y2},分别表示四个方向的步伐一样都为X，第二个表示X方向的步伐为X，Y的方向步伐为Y， 第三个表示向左步伐为X1，向右的步伐为X2，以此类推
		*/
		this.movement = function(direction,step){
			//默认的行走行为为随机朝向的行走
			that.selectedDirection = direction || that.chooseDirection();
			
			if(step){
				if(step.length){
					if(step.length == 2){
						x0Step = x1Step = step[0];
						y0Step = y1Step = step[1];
					}else if(step.length == 4){
						x0Step = step[0];
						x1Step = step[1];
						y0Step = step[2];
						y1Step = step[3];
					}else{
						console.log("step length is incorrect. 可选值为三种: X, {X,Y},{X1,X2,Y1,Y2}");
					}
				}else{
					x0Step = x1Step = y0Step = y1Step = step;
				}
			}
			var range = that.getRange();
			var x0Range = range[0];
			var x1Range = range[1];
			var y0Range = range[2];
			var y1Range = range[3];
			
			//因为x,y的坐标是物体中心点的坐标，所以需要通过物体的宽高的1/2进行修正
			if((that.selectedDirection == C.DIRECTION_LEFT && (that.x) <= x0Range)
				|| (that.selectedDirection == C.DIRECTION_RIGHT && (that.x) > x1Range)
				|| (that.selectedDirection == C.DIRECTION_UP && (that.y-that.frameH/2) <= y0Range)
				|| (that.selectedDirection == C.DIRECTION_DOWN && (that.y+that.frameH/2) >= y1Range)
				){
				if(that.ifReverse){
					that.directionReserve();
				}else{
					return;//如果移动，且物体坐标边缘超出边界，则停止移动。
				}
			}
			
			//console.log("dir: "+that.selectedDirection+" x: "+that.x+"  y: "+that.y);
			//TODO行走的时候，还需要根据当前坐标，以及地图信息判断往某个方向是否能走，如果不能走，则折返，或者停止，由ifReverse参数限制，如果ifReverse值为true则折返，否则到头停止。
			switch(that.selectedDirection){
				case C.DIRECTION_LEFT:
					changeFace(that,that.faceLeft);
					that.px = that.x;
					that.py = that.y;
					that.x -= x0Step;
					if(that.x < x0Range){
						that.x = x0Range+1;
					}
					break;
				case C.DIRECTION_RIGHT:
					changeFace(that,that.faceRight);
					that.px = that.x;
					that.py = that.y;
					that.x += x1Step;
					if(that.x > x1Range){
						that.x = x1Range-1;
					}
					break;
				case C.DIRECTION_UP:
					changeFace(that,that.faceUp);
					that.px = that.x;
					that.py = that.y;
					that.y -= y0Step;
					if(that.y < y0Range){
						that.y = y0Range+1;
					}
					break;
				case C.DIRECTION_DOWN:
					changeFace(that,that.faceDown);
					that.px = that.x;
					that.py = that.y;
					that.y += y1Step;
					if(that.y > y1Range){
						that.y = y1Range-1;
					}
					break;
			}
		};
		//limitDirections 方向数组，用来限制当前对象只能向某几个方向移动
		this.chooseDirection = function(){
			var limitDirections = that.moveDirection || [C.DIRECTION_LEFT];
			var direction;
			var r = Math.random();
			if(r>=0 && r<0.25){
				if(limitDirections.indexOf(C.DIRECTION_LEFT) != -1)
					direction = C.DIRECTION_LEFT;
			}else if(r >= 0.25 && r < 0.5){
				if(limitDirections.indexOf(C.DIRECTION_RIGHT) != -1)
					direction = C.DIRECTION_RIGHT;
			}else if(r >= 0.5 && r < 0.75){
				if(limitDirections.indexOf(C.DIRECTION_UP) != -1)
					direction = C.DIRECTION_UP;
			}else if(r >= 0.75 && r <= 1){
				if(limitDirections.indexOf(C.DIRECTION_DOWN) != -1)
					direction = C.DIRECTION_DOWN;
			}
			if(!that.selectedDirection){
				that.selectedDirection = direction;
			}
			return that.selectedDirection;
		};
		/**
		返回值格式为：[x0,x1,y0,y1]分别表示在X轴上左右边界，Y轴的上下边界。值为像素
		*/
		this.getRange = function(){
			var xu = Math.floor(this.x/unit);//xu 表示x unit在X轴上第几个单位
			var yu = Math.floor(this.y/unit);//同上
			collisionChecker.setCheckPoint(xu,yu);
			
			
			var xr = collisionChecker.x();
			var yr = collisionChecker.y();
			
			
			var range = [xr[0],xr[1],yr[0],yr[1]];
			return range;
		};
		
		this.directionReserve = function(){
			if(that.selectedDirection == C.DIRECTION_LEFT){
				that.selectedDirection = C.DIRECTION_RIGHT;
				that.frameHeadX = that.faceRight[0];
				that.frameHeadY = that.faceRight[1];
			}else if(that.selectedDirection == C.DIRECTION_RIGHT){
				that.selectedDirection = C.DIRECTION_LEFT;
				that.frameHeadX = that.faceLeft[0];
				that.frameHeadY = that.faceLeft[1];
			}else if(that.selectedDirection == C.DIRECTION_UP){
				that.selectedDirection = C.DIRECTION_DOWN;
				that.frameHeadX = that.faceDown[0];
				that.frameHeadY = that.faceDown[1];
			}else if(that.selectedDirection == C.DIRECTION_DOWN){
				that.selectedDirection = C.DIRECTION_UP;
				that.frameHeadX = that.faceUp[0];
				that.frameHeadY = that.faceUp[1];
			}
		};
	};
	
	return MovementObject;
});
