"use strict"
/**
日志模块
*/
define(["engine/globalScope"],function(g){
	var impl = window.console || function(){};
	var log = {
		enable : function(){
			return g.cfg.debug.enable;
		},
		group : function(id,collapse){
			if(this.enable()){
				if(collapse){
					impl.groupCollapsed(id);
				}else{
					impl.group(id);
				}
			}
		},
		groupEnd : function(){
			if(this.enable()){
				impl.groupEnd();
			}
		},
		log : function(msg){
			if(this.enable()){
				impl.log(msg);
			}
		},
		info : function(msg){
			if(this.enable()){
				impl.info(msg);
			}
		},
		debug : function(msg){
			if(this.enable()){
				impl.debug(msg);
			}
		},
		dir : function(obj){
			if(this.enable()){
				impl.dir(obj);
			}
		},
	};
	
	Object.freeze(log);
	return log;
});