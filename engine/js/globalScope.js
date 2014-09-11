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
				audio : {//音频选项
						enable : false,//是否enable音效
						echo : false,//是否启用混响,似乎效果不太好
				},
				opt : {//优化选项
					regionPaint : false,//是否启用局部绘制优化，仅仅绘制变动的局部
				},
				mouse : {//鼠标相关设置
					enable : true,//是否启用鼠标
				},
				touch : {//触摸相关设置
					enable : true,//是否启用触摸
				},
			  },

	};
	
	window.g = g;
	return g;
});
