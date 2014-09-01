"use strict"
define(function(){
	var list = {};
	var o = {
		add : function(){
			var idxs = [];
			for(var a in list){
				if(list.hasOwnProperty(a)){
					idxs.push(a);
				}
			}
			
			list[idxs.length] = [];
			return idxs.length;
		},
		get : function(idx){
			if(!list[idx]){
				list[idx] = [];
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
			//console.log("Top Layer len: "+r[0].length);
			return r;
		},
	};
	Object.freeze(o);
	return o;
});