"use strict"
define(["engine/promise/q/q"],function(q){
	var p0 = function(fn){
		var o = q.Promise(fn);
		this.resolve = function(v){
			return o.resolve(v);
		};
		/**
		@param - sfn successful fn
		@param - efn error fn
		*/
		this.then = function(sfn,efn){
			//TODO
			return o.then(sfn,efn);
		};
	};
	p0.resolve = function(v){
		return q.resolve(v);
	};
	p0.reject = function(reason){
		return q.reject(reason);
	};
	/**
	@param - ps - promise array
	*/
	p0.all = function(ps){
		return q.all(ps);
	};

	var p;
	if(window.Promise){
		p = window.Promise;
	}else{
		p = p0;
	}
	return p;
});