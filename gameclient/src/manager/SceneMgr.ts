/**
 * @brief SceneMgr
 * @author qyp
 */

class SceneMgr {
    constructor(){
        this._currScene = null;
        this._lastScene = null;
    }
    public static readonly instance: SceneMgr = new SceneMgr();
    // 当前场景
    private _currScene : egret.DisplayObjectContainer;
    // 上一个场景
    private _lastScene : egret.DisplayObjectContainer;

    private _popupZ : number;
    // 切换场景
    public replaceScene(newSceneClass : any, params ?: any): void{
        let newScene = new newSceneClass(params);
        if (this._currScene != null) {
            DisplayUtil.removeFromParent(this._currScene);
            this._currScene = null;
        }
        this._currScene = newScene;
        this._popupZ = 1000;
        egret.MainContext.instance.stage.addChild(this._currScene);
    }

    // 添加obj到当前场景
    public addToScene(obj : egret.DisplayObject, zorder ?: number) : void{
        if (this._currScene != null) {
            zorder = zorder ? zorder : ++this._popupZ;
            this._currScene.addChildAt(obj, zorder);
        } else {
            console.log("ERROR***当前没有场景");
        }
    }
}