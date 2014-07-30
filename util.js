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
//创建promise对象
this.load = function(items,callback){
	var promises = [];
	//d data, i index, a array
	items.forEach(function(d,i,a){
		var promise = callback(d);
		
		promises.push(promise);
	});
	
	return Promise.all(promises);
};

//these two callback have default parameter XMLHttpRequest object
function openURL(url,successCallback,failCallback,headers,method,body,async){
	var h = new XMLHttpRequest();
	h.onreadystatechange=function(){
		if (h.readyState==4){// 4 = "loaded"
			if (h.status==200){// 200 = OK
				successCallback && successCallback(h);
			}else{
				failCallback && failCallback(h);
				console.log("Fail to access URL, maybe you have not logon");
			}
		}
	};
	h.open(method,url,async);
	for(i in headers){
		h.setRequestHeader(i,headers[i]);
	}
	h.send(body);
}

function __sort(items){
	//TODO
	return items;
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

function goFire(e){
	return e.keyCode == 32;
}
