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
				},
				opt : {
					regionPaint : false,//�Ƿ����þֲ������Ż����������Ʊ䶯�ľֲ�
				}
			  },

	};
	
	window.g = g;
	return g;
});
