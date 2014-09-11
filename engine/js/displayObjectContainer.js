"use strict"
define(["engine/Constants"],function(C){
	/**
	@param fxi
	@param fyi
	@param lxi
	@param lyi
	
	@return 
	*/
	function fill(fxi,fyi,lxi,lyi){
		var result = [];
		for(var i=fyi;i<=lyi;i++){
			for(var x=fxi;x<=lxi;x++){
				result.push([(x+0.5)*unit,(i+0.5)*unit]);
			}
		}
		return result;
	}
	/**
	@param ele
	@param elements
	@param w
	@param h
	
	@return 数组，其中的每个元素为长度为2的数组，0位表示x，1位表示y
	[[x1,y1],[x2,y2],..]
	*/
	function getCoveredEles(ele,w,h){
		var x = ele[0];
		var y = ele[1];
		
		var hw = w/2;//half width
		var hh = h/2;//half height
		
		var lucX = x - hw;
		var lucY = y - hh;
		
		var rdcX = x + hw;
		var rdcY = y + hh;
		
		var fxi = Math.floor(lucX/unit);//x index, fxi means first x axis index
		var fyi = Math.floor(lucY/unit);//y index, 左上角覆盖的方格为[xi,yi]， 如果lucX = lucY = 17，则覆盖的方格为[0,0]
		
		var lxi = Math.floor(rdcX/unit);//x index, lxi means last x axis index
		var lyi = Math.floor(rdcY/unit);//y index,右下角覆盖的方格为[xi,yi]，如果lucX = lucY = 49,则覆盖的方格为[1,1].
		
		//左上角为[0,0],右下角为[1,1]. 则自动补全整个矩阵[1,0],[0,1], 然后根据从左到右，从上到下的顺序将元素排序返回。
		var result = fill(fxi,fyi,lxi,lyi);
		
		return result;
	}
	/**
	获取ele元素重叠的元素，包含本层重复的，和别的层重复的。
	返回值格式为：[{idx:1,data:[0,1]},{idx:2,data:[0,1]},...] 表示不同层的同一竖直位置的元素
	
	1.最简单的情况，显示元素正好每次移动一个整单位方格，则每次只需要重绘之前的方格，以及最终的方格，绘制2个方格
	2.如果显示元素刚好横跨在两个单位方格上，则需要重绘这两个方格，以及绘制显示元素本身， 绘制3个方格
	3.如果显示元素正好在四个单位方格的交叉角上，则需要绘制四个单位方格，以及绘制显示元素本身，绘制5个方格
	4.如果显示元素本身不是单位大小的，则需要计算元素的四个角，及其四个角中间覆盖的单位方格。
	*/
	var getVEles = function(ele){
		var result = [];
		for(var i=0;i<=maxIdx;i++){
			var eles = list[i];
			var coveredElementPos = getCoveredEles([ele.x,ele.y],ele.frameW,ele.frameH);
			var subResult = [];
			for(var x=0;x<coveredElementPos.length;x++){
				var pos = coveredElementPos[x];
				for(var y=0;y<eles.length;y++){
					if(ele == eles[y]){
						subResult.upush(ele);
					}else if(pos[0] == eles[y].x && pos[1] == eles[y].y){
						subResult.upush(eles[y]);
					}
				}
			}
			var obj = {idx:i,data:subResult};
			result.push(obj);
		}
		return result;
	};
	var list = {};
	var maxIdx = 0;//最大层数
	var o = {
		add : function(){
			var idxs = [];
			for(var a in list){
				if(list.hasOwnProperty(a)){
					idxs.push(a);
					if(a > maxIdx){
						maxIdx = a;
					}
				}
			}
			
			list[idxs.length] = [];
			return idxs.length;
		},
		get : function(idx){
			if(!list[idx]){
				list[idx] = [];
			}
			if(idx > maxIdx){
				maxIdx = idx;
			}
			return list[idx];
		},
		/**
		返回所有层的显示对象列表，第一个元素为最顶部元素，应该最先被渲染的层
		*/
		all : function(){
			var idxs = [];
			for(var a in list){
				if(list.hasOwnProperty(a)){
					idxs.push(a);
				}
			}
			idxs.sort(function(a,b){
				return parseInt(a) > parseInt(b);
			});
			
			var r = [];
			for(var i=0;i<idxs.length;i++){
				r.push(list[i]);
			}
			
			if(g.cfg.opt.regionPaint){
				var animationDataCache = {};
				for(var x=0;x<r.length;x++){
					var eles = r[x];
					if(!animationDataCache[x]){//存储同一层的元素
						animationDataCache[x] = [];
					}
					for(var i=0;i<eles.length;i++){
						var ele = eles[i];
						//var key = (ele.x-unit/2)+"_"+(ele.y-unit/2)+"_"+ele.frameW+"_"+ele.frameH;
						if(ele.animation() || !ele.painted){
							var veles = getVEles(ele);//获取ele元素同位置的其他层的元素
							//eles格式为：[{idx:1,data:[0,1]},{idx:2,data:[0,1]},...] 表示不同层的同一竖直位置的元素
							for(var y=0;y<veles.length;y++){
								var vele = veles[y];
								var datas = vele.data;
								for(var z=0;z<datas.length;z++){
									if(animationDataCache[vele.idx].indexOf(datas[z])==-1){
										animationDataCache[vele.idx].push(datas[z]);
									}
								}
							}
						}
					}
				}
				r = [];
				for(var i=0;i<idxs.length;i++){
					r.push(animationDataCache[i]);
				}
			}
			//console.log("Top Layer len: "+r[0].length);
			return r;
		},
	};
	Object.freeze(o);
	return o;
});