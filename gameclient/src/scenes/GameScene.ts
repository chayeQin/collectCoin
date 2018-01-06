/**
 * @brief GameScene
 * @author qyp
 */

class GameScene extends egret.DisplayObjectContainer {
    private _joyStick : JoyStick;
    private _score1 : egret.BitmapText;
    private _score2 : egret.BitmapText;
    private _clock : egret.BitmapText;
    private _readyClock : egret.BitmapText;

    constructor(){
        super();
        let bg = DisplayUtil.sprite("qjb_bg_jpg")
        this.addChild(bg);
        bg.scaleX = DisplayUtil.stageWidth / bg.width;
        bg.scaleY = DisplayUtil.stageHeight / bg.height;

        this._readyClock = DisplayUtil.number("num7_fnt");
        this._readyClock.text = "0";
        this.addChild(this._readyClock);
        this._readyClock.x = DisplayUtil.stageWidth/2;
        this._readyClock.y = DisplayUtil.stageHeight/2-200;

        this._joyStick = new JoyStick();
        this.addChild(this._joyStick);
        this._joyStick.x = 200;
        this._joyStick.y = DisplayUtil.stageHeight - 180;
     
        let btn  = new Button({normalRes:"btn_jump_a_png", selectedRes:"btn_jump_b_png"}, null, this.onPressJump, this)
        this.addChild(btn);
        btn.x = DisplayUtil.stageWidth - 140;
        btn.y = DisplayUtil.stageHeight - 180;

        let dLayer =  new GameLayer();
        this.addChild(dLayer);
        dLayer.y = 200;

        this._score1 = DisplayUtil.number("num4_fnt");
        this.addChild(this._score1);
        this._score1.x=138;
        this._score1.y=143;
        this._score1.text = "0";

        this._score2 = DisplayUtil.number("num1_fnt");
        this.addChild(this._score2);
        this._score2.x=560;
        this._score2.y=143;
        this._score2.text = "0";

        this._clock = DisplayUtil.number("num3_fnt");
        this.addChild(this._clock);
        let leftTime = GameConfig.GAME_TIME * 1000;
        leftTime /= 1000;
        leftTime = Math.ceil(leftTime);
        leftTime = Math.max(leftTime, 0);
        this._clock.text = leftTime + "s";
        
        Util.setAnchorPoint(this._clock, 0.5, 0);
        this._clock.x=DisplayUtil.stageWidth/2 + 20;
        this._clock.y=135;
        this.touchEnabled = true

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onEnter, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
    }
    
    public destroy(){
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onEnter, this);
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
    }

    private onEnter(evt:egret.Event) {
        let sound:egret.Sound = RES.getRes("bmg_mp3");
        sound.play(0, 0);

        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        EventCenter.instance.addEventListener(EventConst.SCORE_SYNC, this.onScoreSync, this);
    }

    private onExit(evt:egret.Event) {
        this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        EventCenter.instance.removeEventListener(EventConst.SCORE_SYNC, this.onScoreSync, this);
    }

    private onEnterFrame(){
        if (GameModel.instance.stop){
            return;
        }

        if (GameModel.instance.isReady) { // 准备期间
            let leftTime =  GameModel.instance.startTime - Util.time();
            leftTime /= 1000;
            leftTime = Math.floor(leftTime);
            leftTime = Math.max(leftTime, 0);
            this._readyClock.visible = true;
            this._readyClock.text = leftTime + "";
            Util.setAnchorPoint(this._readyClock, 0.5, 0.5);
        } else {
            this._readyClock.visible = false;
            let leftTime = GameConfig.GAME_TIME * 1000 + GameModel.instance.startTime - Util.time();
            leftTime /= 1000;
            leftTime = Math.ceil(leftTime);
            leftTime = Math.max(leftTime, 0);
            this._clock.text = leftTime + "s";

            if (leftTime <= 0) {
                GameModel.instance.stop = true;
                Net.instance.send("game_over");
            }
        }
    }

    private onScoreSync(evt:egret.Event) {
        let data = evt.data;
        let userId = data[0];
        let itemId = data[1];
        let score = data[2];
        let teamId = data[3];
        let totalScore = data[4];

        let scoreTxt : egret.BitmapText;
        let tmp = Math.abs(score)
        if (score >= 0){
            scoreTxt = DisplayUtil.number("num2_fnt");
            scoreTxt.text = "+" + tmp;
        }else{
            scoreTxt = DisplayUtil.number("num5_fnt");
            scoreTxt.text = score + "";
        }
        this.addChild(scoreTxt);

        let targetScoreTxt : egret.BitmapText;
        if (userId == GameModel.instance.userUid) {
            scoreTxt.x=138;
            scoreTxt.y=120;
            targetScoreTxt = this._score1
            totalScore = Math.max(totalScore, 0);
            targetScoreTxt.text = totalScore + "";
        } else {
            scoreTxt.x=560;
            scoreTxt.y=120;
            targetScoreTxt = this._score2
            totalScore = Math.max(totalScore, 0);
            targetScoreTxt.text = totalScore + "";
        }
        let tw : egret.Tween = egret.Tween.get(scoreTxt);
        tw.to({y:20}, 1000).wait(500).call(()=>{
           
            this.removeChild(scoreTxt);
        })
    }

    private onPressLeft(data) {
        if (data.target.touchState == ButtonState.TOUCH_STATE_PRESSED) {
            EventCenter.instance.dispatchSelfEvent(EventConst.JOY_STICK, {id:GameModel.instance.userUid, direction:JOY_STICK_DIRECTION.LEFT});
        }else {
            EventCenter.instance.dispatchSelfEvent(EventConst.JOY_STICK, {id:GameModel.instance.userUid, direction:JOY_STICK_DIRECTION.CENTER});
        }
    }

    private onPressRight(data) {
        if (data.target.touchState == ButtonState.TOUCH_STATE_PRESSED) {
            EventCenter.instance.dispatchSelfEvent(EventConst.JOY_STICK, {id:GameModel.instance.userUid, direction:JOY_STICK_DIRECTION.RIGHT});
        }else {
            EventCenter.instance.dispatchSelfEvent(EventConst.JOY_STICK, {id:GameModel.instance.userUid, direction:JOY_STICK_DIRECTION.CENTER});
        }
    }

    private onPressJump(data) {
        var sound:egret.Sound = RES.getRes("diaoyue_mp3");
        sound.play(0, 1);
        EventCenter.instance.dispatchSelfEvent(EventConst.JUMP_BTN, {id:GameModel.instance.userUid});
    }

}