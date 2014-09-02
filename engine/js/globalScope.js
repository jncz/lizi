/**
this object is used for holding the global varible.
*/
"use strict"
define(function(){
	var g = {
		LOADED_IMGS : [],
		LOADED_XMLS : [],
		LOADING_IMG_QUEUE : [],
		aud : {},
		cfg : {
				audio : {
						enable : false,//是否enable音效
						echo : false,//是否启用混响,似乎效果不太好
				}
			  },

	};
	
	window.g = g;
	return g;
});
