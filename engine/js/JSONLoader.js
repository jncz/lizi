"use strict"
define(["engine/ajax","engine/Promise"],function(ajax,Promise){
	
	return {
		load : function(jsonpath){
			var p = new Promise(function(resolve,reject){
			ajax.openURL("res/json/"+jsonpath,
						function(http){
							var jsonText = http.responseText;
							var obj = JSON.parse(jsonText);
							resolve(obj);
						},
						function(){
							reject(-1);
						},
						{"Accecpt":"application/json","Content-Type":"application/json"},
						"GET",
						null,
						true);
		});
		return p;
		},
	};
	
});