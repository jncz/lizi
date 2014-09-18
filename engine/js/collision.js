"use strict"

define(["engine/util/sniffer"],function(sniffer){
	/**
	@param metas - meta data 数组
	@param imgPoint - 图片坐标信息
	@return 返回图片的meta信息
	*/
	var getMetaByPoint = function(metas,imgPoint){
		for(var i=0;i<metas.length;i++){
			var m = metas[i];
			var p = m.point;

			if(p[0] == imgPoint[0] && p[1] == imgPoint[1]){
				return m;
			}
		}
		return null;
	}
	/**
	@param layers - layer 数组
	*/
	var findBGLayer = function(layers){
		for(var i=0;i<layers.length;i++){
			if(layers[i].layerIdx == 0){//背景层
				return layers[i];
			}
		}
		return null;
	}
	var findStopPoint = function(metas,bglayer,x,y,isX){
		var points = bglayer.points;
		var ps = [];//所有Y坐标相同X方向上的不可通过的点
		var cache = {};
		var len = points.length;
		for(var i=len-1;i>=0;i--){//从后往前
			var p = points[i];
			var rawPoint = p.point;
			if(isX?rawPoint[1] == y:rawPoint[0] == x){
				var key = rawPoint[0]+"_"+rawPoint[1];
				if(!cache[key]){
					var imgPoint = p.imgPoint;
					var meta = getMetaByPoint(metas,imgPoint);
					if(meta && !meta.attr.cross){
						ps.push(rawPoint);
					}
					cache[key] = 1;//表示已经填充了
				}
			}
		}
		if(ps.length == 0){//该行没有停止点，全线贯通
			return [[-1,-1],[-1,-1]];
		}
		var checkPoint = [x,y];
		var pIdx = ps.indexOfPoint(checkPoint);
		if(pIdx != -1){//说明当前检测的点已经落到了无法通过的区域，此时应该返回前一段可通行区域
			ps.sort(function(a,b){//将待测点与全部的X方向上的停止点进行排序，待测点两侧的点即为点两侧最近的停止点
				return isX?(a[0]-b[0]):(a[1]-b[1]);
			});
			pIdx = ps.indexOfPoint(checkPoint);
			if(pIdx == 0){
				return [[-1,-1],ps[pIdx]];
			}
			if(pIdx == ps.length - 1){
				return [ps[pIdx],[-1,-1]];
			}
			return [ps[pIdx-1],ps[pIdx]];
		}else{
			ps.push(checkPoint);
			ps.sort(function(a,b){//将待测点与全部的X方向上的停止点进行排序，待测点两侧的点即为点两侧最近的停止点
				return isX?(a[0]-b[0]):(a[1]-b[1]);
			});
			var idx = ps.indexOf(checkPoint);
			if(idx == 0){
				return [[-1,-1],ps[idx+1]];
			}
			if(idx == ps.length - 1){
				return [ps[idx-1],[-1,-1]];
			}
			return [ps[idx-1],ps[idx+1]];
		}
	}
	/**
	@param metas - meta data 数组
	@param layer 背景层数据
	@param x - 当前位置x坐标，非像素坐标
	@param y
	@return 返回值为数组，长度为2，为起始和截止的停止点。如果某一侧没设边界，比如左侧，那么左侧点为[-1,-1]
	由于地图设计的时候，并不是一定要覆盖全地图，可能只是几棵树，几棵草。空白的部分根据配置信息决定是否可通行
	
	该方法查找X方向的[x,y]点左右的停止点
	*/
	var findXStopPoint = function(metas,bglayer,x,y){
		return findStopPoint(metas,bglayer,x,y,true);
	}
	var findYStopPoint = function(metas,bglayer,x,y){
		return findStopPoint(metas,bglayer,x,y,false);
	}
	/**
	@param points - 停止点信息
	@param xMaxUnit - X方向最大单位个数
	@return 返回为具体的像素距离信息，仅仅返回X方向的像素点信息，从1-10之类的，表示物体所能移动的坐标只能是1-10
	*/
	var toXPixel = function(points,xMaxUnit){
		var sp = points[0];//start point
		var ep = points[1];//end point
		var x0,x1; x0 = x1 = 0;
		
		var spx = sp[0];
		var epx = ep[0];
		if(spx >= 0){
			spx = spx+1;
		}
		if(spx == -1){
			spx = 0;
		}
		if(epx == -1){
			epx = xMaxUnit;
		}
		
		x0 = spx*unit;
		x1 = x0 + (epx-spx)*unit;
		
		return [x0,x1];
	}
	var toYPixel = function(points,yMaxUnit){
		var sp = points[0];
		var ep = points[1];
		var y0,y1; y0 = y1 = 0;
		
		var spy = sp[1];
		var epy = ep[1];
		if(spy >= 0){
			spy = spy+1;
		}
		if(spy == -1){
			spy = 0;
		}
		if(epy == -1){
			epy = yMaxUnit;
		}
		
		y0 = spy*unit;
		y1 = y0 + (epy-spy)*unit;
		
		return [y0,y1];
	}
	var f = function(map){
		this.map = map;
		this.px;
		this.py;
		this.unit = map.unit;
		this.w = map.width;
		this.h = map.height;
		this.xrange;
		this.yrange;
		
		this.setCheckPoint = function(x,y){
			this.px = x;
			this.py = y;
		};
		/**
		@return 长度为2的数组，每个数组元素为一个长度为2的数组，代表了X方向可运行的起点和终点，每个元素中的元素分别为x,y坐标
		格式：[[x1,y1],[x2,y2]]
		*/
		this.x = function(){
			var layers = map.layers;
			var metas = map.meta;
			var xMaxUnit = Math.ceil(this.w/this.unit);
			var layer = findBGLayer(layers);
			sniffer.printXEles(layer,8,"层信息",true);
			var points = findXStopPoint(metas,layer,this.px,this.py);
			//this.xrange = points;
			sniffer.printArray(points,"X方向停止点");
			var pixelPoints = toXPixel(points,xMaxUnit);
			sniffer.printArray(pixelPoints,"X方向停止坐标");
			return pixelPoints;
		};
		this.y = function(){
			var layers = map.layers;
			var metas = map.meta;
			var yMaxUnit = Math.ceil(this.h/this.unit);
			var layer = findBGLayer(layers);
			var points = findYStopPoint(metas,layer,this.px,this.py);
			//this.yrange = points;
			var pixelPoints = toYPixel(points,yMaxUnit);
			return pixelPoints;
		};
	}
	
	Object.freeze(f);
	return f;
});