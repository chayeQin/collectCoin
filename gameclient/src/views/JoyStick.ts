/**
 * @brief Util
 * @author qyp
 */

enum JOY_STICK_DIRECTION {
    CENTER,
    LEFT,
    RIGHT,
}

class JoyStick extends egret.DisplayObjectContainer {
    private _img : egret.Bitmap;
    private _direction :JOY_STICK_DIRECTION;
    constructor() {
        super();
        let shp:egret.Shape = new egret.Shape();
        this.addChild(shp);
        shp.graphics.beginFill( 0x000000 );
        shp.alpha = 0;
        shp.graphics.drawRect( 0, 0, 300, 250 );
        shp.graphics.endFill();
        Util.setAnchorPoint(shp, 0.5, 0.3);
        this._img = DisplayUtil.sprite("btn_png");
        this.addChild(this._img);
        Util.setAnchorPoint(this._img, 0.5, 0.5);
        this.touchEnabled = true;
        this._direction = null;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onEnter, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
    }

     public destroy(){
        this.removeChild(this._img);
        this._img = null;
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onEnter, this);
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
    }

    private onEnter(evt:egret.Event) {
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        this.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancel, this);
        this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onReleaseOutSide, this);
    }

    private onExit(evt:egret.Event) {
        this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onReleaseOutSide, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancel, this);
    }
    
    private onTouchBegin(evt:egret.TouchEvent) {
        this.updateDirection(evt.localX);
    }

    private onTouchMove(evt:egret.TouchEvent) {
        this.updateDirection(evt.localX);
    }

    private onTouchEnd(evt:egret.TouchEvent) {
        this.updateDirection(0);
    }

    private onTouchCancel(evt:egret.TouchEvent) {
       this.updateDirection(0);
    }

    private onReleaseOutSide(evt:egret.TouchEvent) {
        this.updateDirection(0);
    }
    
    private updateDirection(x){
        let tmpDirection = JOY_STICK_DIRECTION.CENTER;
        if (x > 36){
            DisplayUtil.updateTexture(this._img, "btn_right_png");
            tmpDirection = JOY_STICK_DIRECTION.RIGHT;
        } else if (x < -36) {
            DisplayUtil.updateTexture(this._img, "btn_left_png");
            tmpDirection = JOY_STICK_DIRECTION.LEFT;
        }else {
            DisplayUtil.updateTexture(this._img, "btn_png");
            tmpDirection = JOY_STICK_DIRECTION.CENTER
        }

        if (this._direction != tmpDirection) {
            this._direction =  tmpDirection;
            EventCenter.instance.dispatchSelfEvent(EventConst.JOY_STICK, {id:GameModel.instance.userUid, direction:this._direction});
        }
    }

}
