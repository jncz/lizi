define(function(){
	function changeFace(targetObj,face){
		targetObj.frameHeadX = face[0];
		targetObj.frameHeadY = face[1];
	};
	var MovementObject = function(img,data){
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
			var range = that.getRange();
			var x0Range = range[0];
			var x1Range = range[1];
			var y0Range = range[2];
			var y1Range = range[3];
			
			//因为x,y的坐标是物体中心点的坐标，所以需要通过物体的宽高的1/2进行修正
			if((that.selectedDirection == DIRECTION_LEFT && (that.x) <= x0Range)
				|| (that.selectedDirection == DIRECTION_RIGHT && (that.x) >= x1Range)
				|| (that.selectedDirection == DIRECTION_UP && (that.y-that.frameH/2) <= y0Range)
				|| (that.selectedDirection == DIRECTION_DOWN && (that.y+that.frameH/2) >= y1Range)
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
		/**
		返回值格式为：[x0,x1,y0,y1]分别表示在X轴上左右边界，Y轴的上下边界。值为像素
		*/
		this.getRange = function(){
			var xu = Math.floor(this.x/unit);//xu 表示x unit在X轴上第几个单位
			var yu = Math.floor(this.y/unit);//同上
			
			
			var xr = this.getXRange(xu,yu);//xr 表示x方向的range
			var yr = this.getYRange(xu,yu);//同上
			
			var range = [xr[0],xr[1],yr[0],yr[1]];
			return range;
			//return [0,1024,0,768];
			//TODO 生成某物体的可移动距离范围，根据地图的信息生成。比如某个地方有树木，岩石等会影响通过性。
		};
		
		this.getRangeRf = function(){
			var xu = Math.floor(this.x/unit);//xu 表示x unit在X轴上第几个单位
			var yu = Math.floor(this.y/unit);//同上
			
			
			var xr = this.getXRange(xu,yu);//xr 表示x方向的range
			var yr = this.getYRange(xu,yu);//同上
			
			var range = [xr[0],xr[1],yr[0],yr[1]];
			return range;
			//return [0,1024,0,768];
			//TODO 生成某物体的可移动距离范围，根据地图的信息生成。比如某个地方有树木，岩石等会影响通过性。
		};
		/**
		@param x 表示的是X方向上第几个单位，不是像素，比如第0个单位，那么0*unit才是像素
		*/
		this.getXRange = function(x,y){//TODO 考虑将已经计算出来的区域信息缓存起来，否则每次move的时候，都要遍历所有点坐标去计算，可能比较浪费性能
			//var l = this.getLeftBoundary(x,y);
			//var r = this.getRightBoundary(x,y);
			
			var blocks = this.getStopBlocksFromCache();//从cache中获取块信息
			if(!blocks){//如果cache中没有，则开始查找
				//获取X方向的行动区域
				blocks = this.getBlockByY(y);//获取这一行上的所有块信息
				blocks = this.getStopBlocks(blocks);//从这一行上的块信息中提起所有不可穿越的块 
				//TODO 这里仅仅考虑了不可穿越，还有其他情况，甚至是目前未定义的情况，所以需要考虑引入其他变量或者回调方法来表示
			}
			var brange = this.getXBlockRange(blocks,x,y);
			var startBlock = brange[0];
			var endBlock   = brange[1];
			
			var startBound = this.getStopPointBound(startBlock);
			var endBound = this.getStopPointBound(endBlock);
			
			
			var dx0 = (startBlock[0]+1)*unit-startBound[2];
			var dx1 = endBlock[0]*unit+endBound[0];
			if(startBlock[0] == 0){//如果起始点为第一个点，那么起始x坐标为0
				dx0 = unit-startBound[2];
			}
			if(endBlock[0] == maxXUnit-1){//如果点为最后一个点，那么X坐标为最大单位-1之后乘以unit再减去最后一个点左侧边无效像素数
				dx1 = (maxXUnit-1)*unit+endBound[0];
			}
			
			return [dx0,dx1];
		};
		/**
		获取该点实际像素距离边的像素数
		*/
		this.getStopPointBound = function(point){
			var imgs = this.getImgPointsByMapPoint(point);
			for(var i = 0;i<imgs.length;i++){
				var img = imgs[i];
				var m = this.getMetaByPoint(img);
				if(m){
					var a = m.attr;
					if(!a.cross){
						return m.bound;
					}
				}
			}
			return [unit,unit,unit,unit];
		};
		/**
		从给定的blocks数组中查找点(x,y)所能到达的左右边界块,所以返回值为长度为2的数组
		*/
		this.getXBlockRange = function(blocks,x,y){
			if(!blocks || blocks.length == 0){
				return [[0,y],[maxXUnit-1,y]];
			}
			blocks.sort(function(a,b){
				if(a[0] > b[0]){
					return true;
				}
				return false;
			});
			var checkPoint = [x,y];//待测点
			blocks.push(checkPoint);
			
			blocks.sort(function(a,b){
				if(a[0] > b[0]){
					return true;
				}
				return false;
			});//再次排序
			
			var idx = blocks.indexOf(checkPoint);
			//idx左右的block就是左右边界
			if(idx == 0){
				return [[0,y],blocks[idx+1]];
			}
			if(idx == blocks.length-1){
				return [blocks[idx-1],blocks[idx]];
			}
			return [blocks[idx-1],blocks[idx+1]];
		};
		this.getStopBlocksFromCache = function(){
			//TODO
		};
		/**
		@param y
		根据y坐标获取整行的block
		*/
		this.getBlockByY = function(y){
			var blocks = [];
			for(var i=0;i<maxXUnit;i++){
				blocks.push([i,y]);
			}
			return blocks;
		};
		this.getStopBlocks = function(blocks){
			//地图默认都为不可通过，需要在地图上配置可通过才行
			var stopBlocks = [];
			for(var i=0;i<blocks.length;i++){
				var block = blocks[i];
				var imgs = this.getImgPointsByMapPoint(block);
				for(var j=0;j<imgs.length;j++){
					var img = imgs[j];
					var m = this.getMetaByPoint(img);
					if(m){
						var a = m.attr;
						if(!a.cross){
							stopBlocks.push(block);
							continue;
						}
					}
				}
				
			}
			return stopBlocks;
		};
		//根据地图上的点获取该点图像在原始图片中的点坐标
		this.getImgPointByMapPoint = function(point){
			var imgPoints = this.getImgPointsByMapPoint(point);
			if(!imgPoints || imgPoints.length == 0){
				return null;
			}else{
				return imgPoints[0];//第一个为最表层的点
			}
		};
		//根据地图上的点获取该点图像在原始图片中的点坐标集
		this.getImgPointsByMapPoint = function(point){
			var valid = this.isValidPoint(point);
			if(!valid){
				return null;
			}
			var imgPoints = [];
			var layers = jsonmap.layers;
			for(var i=layers.length-1;i>=0;i--){//从最上层开始取
				var layer = layers[i];
				var points = layer.points;
				for(var j=points.length-1;j>=0;j--){//最后被压入数组的点是最后绘制的，所以更接近表面，所以倒序检测
					var p = points[j];
					if(p.point[0] == point[0] && p.point[1] == point[1]){
						imgPoints.push(p.imgPoint);
					}
				}
			}
			return imgPoints;
		};
		/**
		检测输入点是否为有效点，有效点是指在整个地图之内的点，超出的算无效点
		*/
		this.isValidPoint = function(point){
			if(!point){
				return false;
			}
			var x = point[0];
			var y = point[1];
			if((x >=0 && x <= maxXUnit) && (y >= 0 && y <= maxYUnit)){
				return true;
			}
			return false;
		};
		this.getMetaByPoint = function(imgPoint){
			var metas = jsonmap.meta;
			for(var i=0;i<metas.length;i++){
				var m = metas[i];
				var p = m.point;

				if(p[0] == imgPoint[0] && p[1] == imgPoint[1]){
					return m;
				}
			}
			return null;
		}
		this.getYRange = function(y){
			var u = this.getUpBoundary(y);
			var d = this.getDownBoundary(y);
			return [u,d];
		};

		/**
		@param x 单位点
		@param y
		以unit为单位长度，将整个画布划分为若干个矩形块，x,y表示的是横向，纵向第几个块，并不是像素数
		以x,y为参数，找到第一个阻止行进的块信息，然后返回
		*/
		this.findBlock = function(x,y){//检测是否可以通过
			var layers = jsonmap.layers;
			var imgPoint;
			var layer = layers[layers.length-1];//只需要考虑最上面的一层的通过性就可以了
			var points = layer.points;
			for(var j=points.length-1;j>0;j--){//最后被压入数组的点是最后绘制的，所以更接近表明，所以倒叙检测
				var point = points[j];
				var p = point.point;
				if(p[0] == x && p[1] == y){
					imgPoint = point.imgPoint;
					break;
				}
			}
			if(!imgPoint){
				return null;
			}
			var metas = jsonmap.meta;
			for(var i=0;i<metas.length;i++){
				var m = metas[i];
				var p = m.point;

				if(p[0] == imgPoint[0] && p[1] == imgPoint[1]){
					var a = m.attr;
					if(!a.cross){
						return m;
					}
				}
				
			}
			return null;
		};
		this.getLeftBoundary = function(x,y){
			for(var i=x;i>=0;i--){
				var b = this.findBlock(i,y);
				if(b){
					//找到第一个障碍物之后，停止，由于图片上的内容可能并不是充满整个矩形的，
					//所以还需要对这个矩形区域的像素进行检查，看看是否还能再往前进多少像素
					var bound = b.bound;//bound为长度为4的数组，分别代表了左，上，右，下距离矩形边的距离
					return i*unit-bound[2];//向左行进，所以要减去矩形图块的右边距
				}
			}
			return 0;//如果没障碍，则左边界为地图边界，为0
		};
		this.getRightBoundary = function(x,y){
			var maxRightBoundary = Math.floor(jsonmap.width/jsonmap.unit);
			for(var i=x;i<maxRightBoundary;i++){
				var b = this.findBlock(i,y);
				
				if(b){
					var bound = b.bound;
					return i*unit+bound[0];//向右行进，要加上左边距
				}
			}
			return jsonmap.width;//FIXME 如果没障碍，则右边界为地图边界，为地图最大单位
		};
		this.getUpBoundary = function(x,y){
			return 0;//TODO
		};
		this.getDownBoundary = function(x,y){
			return 0;//TODO
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
	};
	
	return MovementObject;
});
