

class ResultView extends egret.DisplayObjectContainer {
    constructor(isWin:boolean){
        console.log("******result view", isWin)
        super();
        let shp:egret.Shape = new egret.Shape();
        this.addChild(shp);
        shp.graphics.beginFill( 0, 0.8 );
        shp.graphics.drawRect( 0,0,DisplayUtil.stageWidth,DisplayUtil.stageHeight);
        shp.graphics.endFill();
        shp.width = DisplayUtil.stageWidth;
        shp.height = DisplayUtil.stageHeight;

        let res = "lose_png";
        let soundRes = "shibai_mp3";
        let score = "";
        if (isWin) {
            res = "win_png";
            soundRes = "shengli_mp3";
            score = "" + GameModel.instance.playerScore;
        } 
        var sound:egret.Sound = RES.getRes(soundRes);
        sound.play(0, 1);
        
        let img = DisplayUtil.sprite(res);
        this.addChild(img);

        let num = DisplayUtil.number("num6_fnt");
        this.addChild(num);
        num.text = score;
        Util.setAnchorPoint(num, 0, 0.5);
        num.x = DisplayUtil.stageWidth/2;
        num.y = 780;
        img.x = DisplayUtil.stageWidth/2 - img.width/2;
        img.y = DisplayUtil.stageHeight/2 - img.height/2;
    }
}