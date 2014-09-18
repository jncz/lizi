/**
this object is used for holding the global varible.
*/
"use strict"
define(["engine/Constants"],function(C){
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
				collision : {//用于指定碰撞检测算法中，是以物体占据的方格进行判断，还是以物体实际形状进行检测。比如，有个方格，32*32大小，里面的内容物只有2*2大小，那么如果去做碰撞检测，可能会有些奇怪，两个物体实际都没碰上，但是却无法前进，这时候使用物体的实际形状进行检测就比较好些。
					type : C.COLLISION_OBJ,//可选的值还有C.COLLISION_RECT
					blank : {//设定地图的空白部分的属性，所谓空白部分是指设计地图时，未被背景覆盖的部分
						cross : true,//是否可穿越
						jump : true,//是否可跳跃
					},
				},
				debug : {
					enable : true,
				},
			  },

	};
	
	window.g = g;
	return g;
});
