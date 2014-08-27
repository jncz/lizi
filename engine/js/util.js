/**
提供基础的函数库
*/
String.prototype.startWith=function(str){     
  var reg=new RegExp("^"+str);     
  return reg.test(this);        
} 
 
String.prototype.endWith=function(str){     
  var reg=new RegExp(str+"$");     
  return reg.test(this);        
}
function $(id){
	return document.getElementById(id);
}

function isKeyEvent(eventType){
	return eventType.startWith("key");
}

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

function getDirection(e){
	if(goLeft(e)){
		return DIRECTION_LEFT;
	}else if(goRight(e)){
		return DIRECTION_RIGHT;
	}else if(goUp(e)){
		return DIRECTION_UP;
	}else if(goDown(e)){
		return DIRECTION_DOWN;
	}
}

function goFire(e){
	return e.keyCode == 32;
}

function extend(c,p){
	var c = c || {};
	
	for(var i in p){
		if(typeof p[i] === 'object'){
			c[i] = (p[i].constructor === Array)?[]:{};
			extend(c[i],p[i]);
		}else{
			if(c.hasOwnProperty(i)){
				continue;
			}
			c[i] = p[i];
		}
	}
	return c;
}

function extend2(c,p){
	var F = function(){};
	F.prototype = p.prototype;
	c.prototype = new F();
	c.prototype.constructor = c;
}