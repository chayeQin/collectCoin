/**
 * @brief DropItem
 * @author qyp
 */

class DropItem extends egret.DisplayObjectContainer{
    private _img : egret.Bitmap;
    private _itemId : number;
    private _dropStartTime : number;
    private _point :number;
    private _speed :number;
    private _itemCfg : any;
    private _sound :string;
    private _effect :string;
    private _dropType:number;

    constructor(data:any){
        super();
        let itemData = data[0];
        let itemId = data[1];
        let dropStartTime = data[2];

        let dropType = itemData[0];
        this._dropType = dropType;
        let x = itemData[2];
        this._dropStartTime = dropStartTime;
        this._itemId = itemId;
        for (let i = 0; i < GameConfig.DROP_ITEM.length; ++i){
            if (GameConfig.DROP_ITEM[i][0] == dropType){
                 this._itemCfg = GameConfig.DROP_ITEM[i]
            }
        }
        if (!this._itemCfg) {
            console.log("ERROR*** 错误的掉落类型", dropType);
            return;
        }
        this._point = this._itemCfg[2];
        this._speed = this._itemCfg[3];
        this._sound = this._itemCfg[4];
        this._effect = this._itemCfg[5];

        this._img = DisplayUtil.sprite(this._itemCfg[1])
        this.addChild(this._img);
        this.x = x;
        Util.setAnchorPoint(this._img, 0.5, 1);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onEnter, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
    }

    public destroy(){
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onEnter, this);
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
    }

    private onEnter(evt:egret.Event) {
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
    }

    private onExit(evt:egret.Event) {
        this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
    }
    get dropType() : number{
        return this._dropType;
    }
    get sound(): string{
        return this._sound;
    }

    get effect() :string {
        return this._effect;
    }

    private onEnterFrame(){
        if (GameModel.instance.stop) {
            return;
        }

        let now = Util.time();
        let y = (now - this._dropStartTime) / 1000 * this._speed;
        this.y = y;
    }

    get itemId() : number {
        return this._itemId;
    }

    get point() : number {
        return this._point;
    }
}