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
						enable : false,//�Ƿ�enable��Ч
						echo : false,//�Ƿ����û���,�ƺ�Ч����̫��
				}
			  },

	};
	
	window.g = g;
	return g;
});
