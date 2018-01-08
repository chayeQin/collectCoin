/**
 * @brief HitEffect
 * @author qyp
 */

class HitEffect extends egret.DisplayObjectContainer {
    private _mc : egret.MovieClip;
    private _effectName : string;
    constructor(effectName:string){
        super();
        this._effectName = effectName;
        let data = RES.getRes(effectName + "_json");
        let txtr = RES.getRes(effectName + "_png");
        let mcFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory( data, txtr );
        this._mc = new egret.MovieClip( mcFactory.generateMovieClipData("effect")); 
        this.addChild(this._mc);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onEnter, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
    }

    public destroy(){
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onEnter, this);
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
    }

    private onEnter(evt:egret.Event) {
        this._mc.gotoAndPlay("play");
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
    }

    private onExit(evt:egret.Event) {
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
    }
    
    private onEnterFrame(){
        if (!this._mc.isPlaying){
            DisplayUtil.removeFromParent(this);
        }
    }
}

