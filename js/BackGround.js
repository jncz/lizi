//对于背景大图，可以通过该类进行一次渲染，减少渲染次数。
function BackGround(img,data){
	this.img = img;
	this.data = data;
	this.frameW = 1024;//直接切整张图
	this.frameH = 768;
	this.x = 1024/2;//渲染的时候，会把坐标点移动到x,y点， 这里取图的中心。 我们这里的canvas尺寸就是1024*768
	this.y = 768/2;
}

BackGround.prototype = new MovieClip2D();
BackGround.prototype.constructor = BackGround;