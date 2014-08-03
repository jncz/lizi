function MovementObject(img,data){
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
	
	/**
	@param direction 移动方向
	@param step 移动步伐，可选值为三种: X, {X,Y},{X1,X2,Y1,Y2},分别表示四个方向的步伐一样都为X，第二个表示X方向的步伐为X，Y的方向步伐为Y， 第三个表示向左步伐为X1，向右的步伐为X2，以此类推
	*/
	this.movement = function(direction,step){
		//默认的行走行为为随机朝向的行走
		that.selectedDirection = direction || that.chooseDirection();
		
		var x0Step = MOVE_STEP_X;
		var x1Step = MOVE_STEP_X;
		var y0Step = MOVE_STEP_Y;
		var y1Step = MOVE_STEP_Y;
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
		var range = that.getXRange();
		var x0Range = range[0];
		var x1Range = range[1];
		var y0Range = range[2];
		var y1Range = range[3];
		
		//因为x,y的坐标是物体中心点的坐标，所以需要通过物体的宽高的1/2进行修正
		if((that.selectedDirection == DIRECTION_LEFT && (that.x-that.frameW/2) <= x0Range)
			|| (that.selectedDirection == DIRECTION_RIGHT && (that.x+that.frameW/2) >= x1Range)
			|| (that.selectedDirection == DIRECTION_UP && (that.y-that.frameH/2) <= y0Range)
			|| (that.selectedDirection == DIRECTION_DOWN && (that.y+that.frameH/2) >= y1Range)
			){
			if(that.ifReverse){
				that.directionReserve();
			}else{
				return;//如果移动，且物体坐标边缘超出边界，则停止移动。
			}
		}
		
		console.log("dir: "+that.selectedDirection+" x: "+that.x+"  y: "+that.y);
		//TODO行走的时候，还需要根据当前坐标，以及地图信息判断往某个方向是否能走，如果不能走，则折返，或者停止，由ifReverse参数限制，如果ifReverse值为true则折返，否则到头停止。
		switch(that.selectedDirection){
			case DIRECTION_LEFT:
				changeFace(that,that.faceLeft);
				that.x -= x0Step;
				break;
			case DIRECTION_RIGHT:
				changeFace(that,that.faceRight);
				that.x += x1Step;
				break;
			case DIRECTION_UP:
				changeFace(that,that.faceUp);
				that.y -= y0Step;
				break;
			case DIRECTION_DOWN:
				changeFace(that,that.faceDown);
				that.y += y1Step;
				break;
		}
	};
	//limitDirections 方向数组，用来限制当前对象只能向某几个方向移动
	this.chooseDirection = function(){
		var limitDirections = that.moveDirection || [DIRECTION_LEFT];
		var direction;
		var r = Math.random();
		if(r>=0 && r<0.25){
			if(limitDirections.indexOf(DIRECTION_LEFT) != -1)
				direction = DIRECTION_LEFT;
		}else if(r >= 0.25 && r < 0.5){
			if(limitDirections.indexOf(DIRECTION_RIGHT) != -1)
				direction = DIRECTION_RIGHT;
		}else if(r >= 0.5 && r < 0.75){
			if(limitDirections.indexOf(DIRECTION_UP) != -1)
				direction = DIRECTION_UP;
		}else if(r >= 0.75 && r <= 1){
			if(limitDirections.indexOf(DIRECTION_DOWN) != -1)
				direction = DIRECTION_DOWN;
		}
		if(!that.selectedDirection){
			that.selectedDirection = direction;
		}
		return that.selectedDirection;
	};
	
	this.getXRange = function(){
		return [0,1024,0,768];
		//TODO 生成某物体的X轴可移动距离范围，根据地图的信息生成。比如某个地方有树木，岩石等会影响通过性。
	};
	
	this.directionReserve = function(){
		if(that.selectedDirection == DIRECTION_LEFT){
			that.selectedDirection = DIRECTION_RIGHT;
			that.frameHeadX = that.faceRight[0];
			that.frameHeadY = that.faceRight[1];
		}else if(that.selectedDirection == DIRECTION_RIGHT){
			that.selectedDirection = DIRECTION_LEFT;
			that.frameHeadX = that.faceLeft[0];
			that.frameHeadY = that.faceLeft[1];
		}else if(that.selectedDirection == DIRECTION_UP){
			that.selectedDirection = DIRECTION_DOWN;
			that.frameHeadX = that.faceDown[0];
			that.frameHeadY = that.faceDown[1];
		}else if(that.selectedDirection == DIRECTION_DOWN){
			that.selectedDirection = DIRECTION_UP;
			that.frameHeadX = that.faceUp[0];
			that.frameHeadY = that.faceUp[1];
		}
	};
}