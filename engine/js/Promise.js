"use strict"
define(function(){
	var p0 = function(fn){
		this.then = function(){
		
		};
		this.all = function(){
		
		};
		this.taskQ = [];
		//添加任务至队列
		if(fn)this.then(fn);
		this.resolve = function(){
			var fn = this.taskQ && this.taskQ[0];
			if(fn){
				var ret = fn.apply(this,arguments);
				this.taskQ.shift();
				if(ret){
					this.resolve.apply(this,ret);
				}
			}
			return this;
		};
		
	};
	p0.resolve = function(){
		var fn = this.taskQ && this.taskQ[0];
		if(fn){
			var ret = fn.apply(this,arguments);
			this.taskQ.shift();
			if(ret){
				this.resolve.apply(this,ret);
			}
		}
		return this;
	};
	p0.prototype.then = function(){
		console.log("aa");
	};

	var p;
	if(window.Promise){
		p = window.Promise;
	}else{
		p = p0;
	}
	return p;
});