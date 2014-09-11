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
					regionPaint : false,//是否启用局部绘制优化，仅仅绘制变动的局部. 参考建议：如果因某活动元素变动，而导致其背景，前景(背景，前景可能都有多层)的各个方格都需要重绘，那么所有的方格总数如果超过整个画布的方格(多层方格之和)总数的55%。 那么最好不要打开此优化选项。反而会拖累渲染速度。测试详见test/testCleanRect.html 以及test/性能分析.xls
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
