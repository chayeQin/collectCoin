/**
 * @brief Button
 * @author qyp
 */

enum ButtonState {
    TOUCH_STATE_NORMAL,
    TOUCH_STATE_PRESSED,
    TOUCH_STATE_DISABLED
}

class Button extends eui.Component {
    private _normalImg : egret.Bitmap;
    private _selectedImg : egret.Bitmap;
    private _disableImg : egret.Bitmap;
    private _label : egret.TextField;
    private _scale9Enabled : boolean;
    private _zoomScale : number;
    private _enabled : boolean;
    private _scale9Grid : egret.Rectangle;
    private _dirty : boolean;
    private _touchState : number;
    private _thisObj : any;
    private _callback: any;
    private _touchInsided : boolean;
    private _listenAllTouchEvent : boolean;

    constructor(resCfg?:{normalRes?:string, selectedRes?:string, disabledRes?:string}, 
                labCfg?:{text?:string, fontSize?:number, color?:number, font?:string}, 
                callback?:Function, 
                thisObj?:any){
        super();
        resCfg = resCfg ? resCfg : {};
        labCfg = labCfg ? labCfg : {};
        this._callback = callback;
        this._thisObj = thisObj;
        this.init();
        this.loadTexture(resCfg.normalRes, resCfg.selectedRes, resCfg.disabledRes);
        this.titleText = labCfg.text ? labCfg.text : "";
        this.textColor = labCfg.color ? labCfg.color : 0x000000;
        this.fontSize = labCfg.fontSize ? labCfg.fontSize : 30;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onEnter, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
    }

    private init(){
        this.zoomScale = 0.1;
        this.scale9Grid = new egret.Rectangle();
        this.scale9Enabled = false;
        this.enabled = true;
        this.dirty = true;
        this.touchEnabled = this.enabled;
        this._listenAllTouchEvent = false;
        this._normalImg = new egret.Bitmap();
        this.addChild(this._normalImg);
        this._selectedImg = new egret.Bitmap();
        this.addChild(this._selectedImg);
        this._disableImg = new egret.Bitmap();
        this.addChild(this._disableImg);
        this._label = new egret.TextField;
        this.addChild(this._label);
    }
    
    public destroy(){
        this.removeChild(this._normalImg);
        this._normalImg = null;
        this.removeChild(this._selectedImg);
        this._selectedImg = null;
        this.removeChild(this._disableImg);
        this._disableImg = null;
        this.removeChild(this._label);
        this._label = null
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onEnter, this);
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
    }

    private onEnter(evt:egret.Event) {
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
        this.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancel, this);
        this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onReleaseOutSide, this);
    }

    private onExit(evt:egret.Event) {
        this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onReleaseOutSide, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancel, this);
    }
    
    private onTouchBegin(evt : egret.TouchEvent ){
        if (this._touchState == ButtonState.TOUCH_STATE_DISABLED) { 
            return
        }
        this._touchInsided = true
        this._touchState = ButtonState.TOUCH_STATE_PRESSED;
        this.dirty = true;

        if (this._listenAllTouchEvent){
            if (this._callback){
                this._callback.call(this._thisObj, {target:this, event:evt});
            }
        }
    }

    private onTouchEnd(evt : egret.TouchEvent ){
        if (this._touchState == ButtonState.TOUCH_STATE_DISABLED) { 
            return
        }

        this._touchState = ButtonState.TOUCH_STATE_NORMAL;
        this.dirty = true;

        if (this._callback && this._touchInsided){
            this._callback.call(this._thisObj, {target:this, event:evt});
        }

        this._touchInsided = false
    }

    private onTouchCancel(evt : egret.TouchEvent ){
        if (this._touchState == ButtonState.TOUCH_STATE_DISABLED) { 
            return
        }
        this._touchState = ButtonState.TOUCH_STATE_NORMAL;
        this.dirty = true;
        this._touchInsided = false

        if (this._listenAllTouchEvent){
            if (this._callback){
                this._callback.call(this._thisObj, {target:this, event:evt});
            }
        }
    }

    private onReleaseOutSide(evt : egret.TouchEvent ){
        if (this._touchState == ButtonState.TOUCH_STATE_DISABLED) { 
            return
        }
        this._touchState = ButtonState.TOUCH_STATE_NORMAL;
        this.dirty = true;
        this._touchInsided = false

        if (this._listenAllTouchEvent){
            if (this._callback){
                this._callback.call(this._thisObj, {target:this, event:evt});
            }
        }

    }

    public loadTexture(normalRes?:string, selectedRes?:string, disabledRes?:string){
        this.normalTexture = normalRes;
        this.textureSelected = selectedRes;
        this.textureDisabled = disabledRes;
    }

    public set normalTexture(res:string){
        if (res){
            let texture: egret.Texture = RES.getRes(res);
            this._normalImg.texture = texture;
            Util.setAnchorPoint(this._normalImg, 0.5, 0.5);
        } else if (this._normalImg){
            this._normalImg.texture = null;
        }
       
        this.dirty = true;
    }

    public set textureSelected(res:string){
        if (res){
            let texture: egret.Texture = RES.getRes(res);
            this._selectedImg.texture = texture;
            Util.setAnchorPoint(this._selectedImg, 0.5, 0.5);
        } else if (this._selectedImg){
           this._selectedImg.texture = null;
        }
        this.dirty = true;
    }

    public set textureDisabled(res:string){
        if (res){
            let texture: egret.Texture = RES.getRes(res);
            this._disableImg.texture = texture;
            Util.setAnchorPoint(this._disableImg, 0.5, 0.5);
        } else if (this._disableImg){
            this._disableImg.texture = null;
        }

        this.dirty = true;
    }

    public set titleText(str:string){
        this._label.text = str;
      
    }
    public get titleText(){
        return this._label.text;
    }

    public set textColor(color:number){
        this._label.textColor = color;
    }
    public get textColor(){
        return this._label.textColor;
    }

    public set fontSize(size:number){
        this._label.size = size;
    }
    public get fontSize(){
        return this._label.size;
    }

    public set scale9Enabled(boo : boolean) {
        this._scale9Enabled = boo;
        this.dirty = true;
    }
    public get scale9Enabled() : boolean {
        return this._scale9Enabled;
    }

    public set enabled(boo:boolean) {
        this._enabled = boo;
        this.touchEnabled = boo;
        if (boo) {
            this._touchState = ButtonState.TOUCH_STATE_NORMAL;
        }else {
            this._touchState = ButtonState.TOUCH_STATE_DISABLED;
        }
        this.dirty = true
    }
    public get enabled() : boolean{
        return this._enabled;
    }

    public set scale9Grid(rect:egret.Rectangle) {
        this._scale9Grid = rect;
        this.dirty = true;
    }
    
    public set zoomScale(zoomScale:number) {
        this._zoomScale = zoomScale;
    }
    public get zoomScale() : number {
        return this._zoomScale;
    }

    private set dirty(boo: boolean) {
        this._dirty = boo;
    }
    private get dirty() : boolean {
        return this._dirty;
    }

    public get touchState() : ButtonState {
        return this._touchState;
    }

    public onEnterFrame(evt : egret.Event) {
        if (!this.dirty){
            return
        }

        this.dirty = false;
        Util.setAnchorPoint(this._label, 0.5, 0.5);

        if (this.scale9Enabled) {
            this._normalImg.scale9Grid = this.scale9Grid;
            this._selectedImg.scale9Grid = this.scale9Grid;
            this._disableImg.scale9Grid = this.scale9Grid;
        }else {
            this._normalImg.scale9Grid = null;
            this._selectedImg.scale9Grid = null;
            this._disableImg.scale9Grid = null;
        }

        switch(this._touchState) {
            case ButtonState.TOUCH_STATE_NORMAL: // 普通状态
                this._normalImg.visible = true;
                this._selectedImg.visible = false;
                this._disableImg.visible = false;
                this._normalImg.scaleX = 1.0;
                this._normalImg.scaleY = 1.0;
                this._label.scaleX = 1.0;
                this._label.scaleY = 1.0;
                Util.grey(this, false)
                break;
            case ButtonState.TOUCH_STATE_PRESSED: // 按下的状态
                if (this._selectedImg.texture){
                    this._normalImg.visible = false;
                    this._selectedImg.visible = true;
                    this._disableImg.visible = false;
                }else{
                    this._normalImg.scaleX = 1.0 + this._zoomScale;
                    this._normalImg.scaleY = 1.0 + this._zoomScale;
                    this._label.scaleX = 1.0 + this._zoomScale;
                    this._label.scaleY = 1.0 + this._zoomScale;
                }
                break;
            case ButtonState.TOUCH_STATE_DISABLED: // 禁用状态
                if (this._disableImg.texture){
                    this._normalImg.visible = false
                    this._selectedImg.visible = false;
                    this._disableImg.visible = true;
                }else{
                    Util.grey(this);
                }
                break;
        }
    }

    get listenAllTouchEvent() : boolean{
        return this._listenAllTouchEvent;
    }

    set listenAllTouchEvent(boo:boolean){
        this._listenAllTouchEvent = boo;
    }
}
