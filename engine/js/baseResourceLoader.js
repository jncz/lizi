"use strict"
define(["engine/Promise"],function(Promise){
	return {
		load:function(items,callback){
			var promises = [];
			//d data, i index, a array
			items.forEach(function(d,i,a){
				var promise = callback(d);
				
				promises.push(promise);
			});
			
			return Promise.all(promises);
		},
	};
});