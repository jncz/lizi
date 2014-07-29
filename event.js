function initEvent(){
	document.body.addEventListener("click",function(e){
		console.log("clicked");
		fireLizi(e.x,e.y);
	});
}

function Event2D(){
	this.eventType = "";
	this.callback = function(element){}
}