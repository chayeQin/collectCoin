/**
 * @brief DropLayer
 * @author qyp
 */

class GameLayer extends egret.DisplayObjectContainer {
    private tmp : egret.Bitmap;
    private _dropImgLst : DropItem[];
    private _rolelst :  { [key:string]: Role};
    private _gameEndLab : egret.TextField;

    constructor(){
        super();
        this._dropImgLst = new Array<DropItem>();
        this._rolelst = {};
        let rect:egret.Rectangle = new egret.Rectangle(0, GameConfig.TOP_Y, DisplayUtil.stageWidth, GameConfig.VIEW_HEIGHT);  
        this.mask = rect;

        // 测试文本
        this._gameEndLab = DisplayUtil.label("游戏结束", 100);
        this.addChild(this._gameEndLab)
        this._gameEndLab.x = 150;
        this._gameEndLab.y = 500;
        this._gameEndLab.visible = false;
        
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onEnter, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
    }
    
    public destroy(){
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onEnter, this);
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
    }

    private onEnter(evt:egret.Event) {
        this.addRoles();
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        EventCenter.instance.addEventListener(EventConst.SCORE_SYNC, this.onScoreSync, this);
    }

    private onExit(evt:egret.Event) {
        this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        EventCenter.instance.removeEventListener(EventConst.SCORE_SYNC, this.onScoreSync, this);
    }

    private onScoreSync(evt:egret.Event) {
        let data = evt.data;
        let userId = data[0];
        let itemId = data[1];
        let getPoint = data[2];
        let teamId = data[3];
        let totalPoint = data[4];

        for (let i = 0; i <  this._dropImgLst.length; ++i) {
            let img = this._dropImgLst[i];
            if (img.itemId == itemId) {
                this.rmDrop(img);
                break;
            }
        }
    }
  
    public addRoles(){
        GameModel.instance.players.forEach((pData:{uid:string, teamId:string}, index)=>{
            let res = "";
            let id = null;
            let x = 0;
            if (index == 0) {
                res = "cat_ani";
                x = 200;
            } else {
                res = "dog_ani";
                x = 520;
            }
            let role = new Role(res, pData);
            this.addChild(role);
            role.x = x
            role.y = GameConfig.TOP_Y + GameConfig.VIEW_HEIGHT;
            this._rolelst[pData.uid] = role;

        })
    }

    private addDrop(data){
        let itemData = data[0];
        let itemId = data[1];
        let startDropTime = data[2];
        let dropSpeed = data[3]
        let imgId = itemData[0];
        let x = itemData[2];
        let now = Util.time();
        let startY = (now - startDropTime) * dropSpeed / 1000;
        let leftTime = (GameConfig.VIEW_HEIGHT - startY) / dropSpeed ;
        if (leftTime < 0){
            return;
        }
        let img = new DropItem(data);
        this.addChild(img);
        this._dropImgLst.push(img);
    }

    public rmDrop(img){
        let index = this._dropImgLst.indexOf(img);
        if (index != -1){
            // console.log("remove item", this._dropImgLst[index].name)
            DisplayUtil.removeFromParent(this._dropImgLst[index]);
            this._dropImgLst.splice(index, 1);
        }
    }

    // 检测是否捡到星星
    public checkHited(){
        let rmLst = new Array<DropItem>();
        for (let i = 0; i < this._dropImgLst.length; ++i){
            let img = this._dropImgLst[i];
            let role:Role = this._rolelst[GameModel.instance.userUid]
            if (role){
                let tRect = role.getTransformedBounds(this);
                tRect.width = 80;
                tRect.height = 80;
                tRect.x = tRect.x + 20;
                tRect.y = tRect.y + 20;
                let tmpRect = img.getTransformedBounds(this);
                if (tmpRect.intersects(tRect)){
                    rmLst.push(img);
                    let itemId = img.itemId
                    // if (img.point != 0)
                    Net.instance.send("game_score_change", itemId, img.point);

                    let sound:egret.Sound = RES.getRes(img.sound);
                    sound.play(0, 1);

                    if (img.effect != ""){
                        let t = new HitEffect(img.effect);
                        this.addChild(t)
                        t.x = img.x;
                        t.y = img.y;
                    }

                    if (img.dropType == DROP_TYPE.BOOM) {
                        EventCenter.instance.dispatchSelfEvent(EventConst.HIT_BOOM, role.id);
                    }
                    continue;
                }
            }

            if (img.y > GameConfig.TOP_Y + GameConfig.VIEW_HEIGHT + img.height) {
                rmLst.push(img);
                continue;

            }
        }
        
        rmLst.forEach((img:DropItem, index:number, array:any[])=>{
            this.rmDrop(img);
        }, this)
        
    }

    private onEnterFrame(evt : egret.Event) {
        if (GameModel.instance.stop) {
            // this._gameEndLab.visible = true;
            return;
        }

        let dropData = GameModel.instance.getNxtDrop();
        if (dropData) {
            this.addDrop(dropData);
        }
        
        this.checkHited();
    }
}
