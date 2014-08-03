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
	var that = this;
	this.movement = function(){
		//默认的行走行为为随机朝向的行走
		that.chooseDirection();
		var range = that.getXRange();
		var sRange = range[0];
		var eRange = range[1];
		if(that.x <= sRange || that.x >= eRange){
			that.directionReserve();
		}
		//TODO行走的时候，还需要根据当前坐标，以及地图信息判断往某个方向是否能走，如果不能走，则折返，或者停止，由ifReverse参数限制，如果ifReverse值为true则折返，否则到头停止。
		switch(that.selectedDirection){
			case DIRECTION_LEFT:
				that.x -= MOVE_STEP_X;
				break;
			case DIRECTION_RIGHT:
				that.x += MOVE_STEP_X;
				break;
			case DIRECTION_UP:
				that.y -= MOVE_STEP_Y;
				break;
			case DIRECTION_DOWN:
				that.y += MOVE_STEP_Y;
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
	};
	
	this.getXRange = function(){
		return [40,1000];
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