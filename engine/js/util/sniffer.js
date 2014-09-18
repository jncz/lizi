"use strict"
/**
该嗅探器，用于各种对象的检测处理，仅用来做调试用。
*/
define(["engine/log/log"],function(log){
	var o = {
		/**
		用于获取某层地图上的X方向上，Y值等于y的所有点
		*/
		printXEles : function(layer,y,msg,collapse){
			msg = msg || "";
			log.group(msg+" start",collapse);
			var points = layer.points;
			var len = points.length;
			for(var i=len-1;i>=0;i--){//从后往前
				if(points[i].point[1] == y){
					log.log("X ele: "+points[i].point+" --- "+points[i].imgPoint);
				}
			}
			log.groupEnd();
		},
		printArray : function(ar,msg,collapse){
			msg = msg || "";
			log.group(msg+" start",collapse);
			if(ar){
				ar.forEach(function(d,i,a){
					log.log("array: idx: "+i+" data:"+d);
				});
			}else{
				log.log("null obj");
			}
			log.groupEnd();
		},
	};
	
	return o;
});