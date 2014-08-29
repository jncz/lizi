"use strict"
define(["engine/Constants"],function(C){
	function goLeft(e){
		return e.keyCode == 37;
	}

	function goRight(e){
		return e.keyCode == 39;
	}

	function goUp(e){
		return e.keyCode == 38;
	}

	function goDown(e){
		return e.keyCode == 40;
	}
	return {
			getDirection : function (e){
				if(goLeft(e)){
					return C.DIRECTION_LEFT;
				}else if(goRight(e)){
					return C.DIRECTION_RIGHT;
				}else if(goUp(e)){
					return C.DIRECTION_UP;
				}else if(goDown(e)){
					return C.DIRECTION_DOWN;
				}
			}

	}
});