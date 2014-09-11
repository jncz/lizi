/**
定义常量，之所以要定义为对象，是为了能精确控制这些值是否可以被编辑
*/
"use strict"
define(function(){
	var o = {
		//物体朝向
		DIRECTION_LEFT  : 1,
		DIRECTION_RIGHT : 2,
		DIRECTION_UP    : 3,
		DIRECTION_DOWN  : 4,

		//X轴移动步伐
		MOVE_STEP_X : 1,
		//Y轴移动步伐
		MOVE_STEP_Y : 1,

		//事件类型
		EVENT_MOUSE_DOWN : "mouseDown",
		EVENT_MOUSE_UP   : "mouseUp",
		EVENT_MOUSE_MOVE : "mouseMove",
		EVENT_KEY_DOWN   : "keyDown",
		
		//渲染类型，渲染为静态图，或者动态图
		RENDER_STATIC : 1,
		RENDER_DYNAMIC : 2,
	};
	Object.freeze(o);
	return o;
});
