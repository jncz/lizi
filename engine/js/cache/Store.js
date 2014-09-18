"use strict"

define(function(){
	var store = localStorage;
	
	var o = {
		save : function(ns,obj){
			store[ns] = JSON.stringify(obj);
		},
		get : function(ns){
			var d = store[ns];
			if(d){
				var o = JSON.parse(d);
				if(o.data){
					return o.data;
				}
			}
			return [];
		},
	};
	
	Object.freeze(o);
	return o;
});