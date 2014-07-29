function fireLizi(x,y){
	var fashi = xmlLoaded[0];
	var mc = new MovieClip2D(imageLoaded[2],fashi.quadFrameList);
    mc.isPlay=2;
    mc.x=x;
    mc.y=y;
    stage2d.addChild(mc);
}