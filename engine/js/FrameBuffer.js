"use strict"
/**
用来缓存帧信息
*/
define(["engine/cache/CanvasCache"],function(cacheImpl){
	var buffer = {
		/**
		@param id - cache obj id
		@param data - 要缓存的层的所有信息，包含每一个方格，在底层会将这些数据根据具体的缓存实现进行缓存
		*/
		cache : function(id,data){cacheImpl.cache(id,data);},
		
		
		/**
		@param id - cache obj id
		*/
		release : function(id){cacheImpl.release(id);},
		
		
		/**
		@param id - 根据ID判断是否缓存了
		@param boolean
		*/
		cached : function(id){return cacheImpl.cached(id);},
		
		
		/**
		@param id - 根据id获取缓存的对象
		@return 返回类型为PaintSource
		*/
		get : function(id){return cacheImpl.get(id);},
	};
	
	return buffer;
});