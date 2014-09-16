"use strict"

define(function(){
	var actor = function(){
		this.pos = {x:0,y:0};
		this.direction = [];
		this.faces = [];
		this.move = function(){};
	};
	
	return actor;
});