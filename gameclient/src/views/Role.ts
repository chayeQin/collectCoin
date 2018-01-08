/**
 * @brief Role
 * @author qyp
 */

enum ROLE_STATE {
    NORMAL,
    RUN,
    JUMP,
    BOOM,
}

class Role extends egret.DisplayObjectContainer {
    private _speed:number;
    private _roleState:ROLE_STATE;
    private _mc:egret.MovieClip;
    private _id:string;
    private _teamId:string;
    private _userTag:egret.Bitmap;
    private _gravity:number;
    private _vx:number;
    private _vy:number;
    private _maxJumpY:number;
    private _actStartTime:number;
    private _actStartX:number;
    private _actStartY:number;

    private _posSend:number;
    private _boomeffect:egret.MovieClip;

    constructor(res:string, pData?:{uid:string, teamId:string}) {
        super();
        this._id = pData ? pData.uid : "0";
        this._teamId = pData ? pData.teamId : "";
        let data = RES.getRes(res + "_json");
        let txtr = RES.getRes(res + "_png");
        let mcFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory( data, txtr );
        this._mc = new egret.MovieClip( mcFactory.generateMovieClipData("ani")); 
        this.addChild(this._mc);

        let boomData = RES.getRes("boomEffect_json");
        let boomTxtr = RES.getRes("boomEffect_png");
        let mcFactory2:egret.MovieClipDataFactory = new egret.MovieClipDataFactory( boomData, boomTxtr );
        this._boomeffect = new egret.MovieClip( mcFactory2.generateMovieClipData("effect")); 
        this.addChild(this._boomeffect);
        this._boomeffect.visible = false;

        this._userTag = DisplayUtil.sprite("you_png");
        this.addChild(this._userTag);
        Util.setAnchorPoint(this._userTag, 0.5, 1);
        this._userTag.x = 0;
        this._userTag.y = -120;
        let tw = egret.Tween.get(this._userTag, {loop:true});
        tw.to({y:-100}, 500).to({y:-120}, 500)
        this._speed = 0;
        this.roleState = ROLE_STATE.NORMAL;
        this._gravity = this.calGravity();
        this._posSend = 0;

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onEnter, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
    }

    public destroy(){
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onEnter, this);
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
    }

    private onEnter(evt:egret.Event) {
        EventCenter.instance.addEventListener(EventConst.JOY_STICK,  this.onJoyStick, this);
        EventCenter.instance.addEventListener(EventConst.JUMP_BTN, this.onJump, this);
        EventCenter.instance.addEventListener(EventConst.ROLE_STATE, this.onRoleState, this)
        EventCenter.instance.addEventListener(EventConst.HIT_BOOM, this.onBoom, this)
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
    }

    private onExit(evt:egret.Event) {
        EventCenter.instance.removeEventListener(EventConst.JUMP_BTN, this.onJump, this);
        EventCenter.instance.removeEventListener(EventConst.JOY_STICK,  this.onJoyStick, this);
        EventCenter.instance.removeEventListener(EventConst.ROLE_STATE,  this.onRoleState, this);
        EventCenter.instance.removeEventListener(EventConst.HIT_BOOM, this.onBoom, this)
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
    }
    
    get roleState() : ROLE_STATE {
        return this._roleState;
    }

    set roleState(state:ROLE_STATE) {
        // if (this._roleState == state){
        //     return;
        // }

        this._roleState = state;
        this._mc.visible = true;
        this._boomeffect.visible = false;
        if (this._roleState == ROLE_STATE.JUMP) {
            this._mc.gotoAndPlay("jump", -1);
        } else if(this._roleState == ROLE_STATE.RUN){
            this._mc.gotoAndPlay("run", -1);
        } else if (this._roleState == ROLE_STATE.BOOM) {
            this._mc.visible = false;
            this._boomeffect.visible = true;
            this._boomeffect.gotoAndPlay("play")
        } else {
            this._mc.gotoAndPlay("run", -1);
        }
    }

    private onBoom(evt:egret.Event) {
        let id = evt.data;
        if (id == this.id) {
            this.onStateChange(ROLE_STATE.BOOM, Util.time(), this.x, this.y)
        }
    }

    private onRoleState(evt:egret.Event){
        let data:any[] = evt.data;
        let id = data[0];
        let newState = data[1];
        let params = data[2];

        if (id == this.id){
            this.onStateChange(newState, ...params);
        }
    }

    private onStateChange(newState:ROLE_STATE, ...params) {
        if (this.id == GameModel.instance.userUid) {
            if (newState == ROLE_STATE.RUN){
                this._actStartTime = params[0];
                this._actStartX = params[1];
                this._actStartY = params[2]
                this._speed = params[3];
            } else if (newState == ROLE_STATE.JUMP){
                this._actStartTime = params[0];
                this._actStartX = params[1];
                this._actStartY = params[2];
                this._vx = params[3];
                this._vy = params[4];
            } else if (newState == ROLE_STATE.BOOM) {
                this._actStartTime = params[0];
                this._actStartX = params[1];
                this._actStartY = params[2];
            } else {
                this._actStartTime = params[0];
                this._actStartX = params[1];
                this._actStartY = params[2];
                this._speed = params[3];
            }

            if (this._speed < 0){
                this._mc.scaleX = 1;
            } else if(this._speed > 0){
                this._mc.scaleX = -1;
            }

            this.x = this._actStartX;
            this.y = this._actStartY;

            Net.instance.send("game_move", this.id, newState); // 同步状态
        }

        if (newState == -1) {
            let x = params[0];
            let y = params[1];

            if (this.x < x){
                this._mc.scaleX = -1;
            } else if(this.x > x){
                this._mc.scaleX = 1;
            }
            this.x = x;
            this.y = y;
            console.log("x, y", x, y);
        }
        else{
            this.roleState = newState;
        }
    }

    get id() : string {
        return this._id;
    }

    private onJoyStick(evt:egret.Event) {
        if (GameModel.instance.isReady){ // 准备期间
            return
        }


        if (evt.data.id == this._id) {
            let speed = 0
            if (evt.data.direction == JOY_STICK_DIRECTION.LEFT) {
                speed = -GameConfig.MOVE_SPEED;
            } else if (evt.data.direction == JOY_STICK_DIRECTION.RIGHT) {
                speed = GameConfig.MOVE_SPEED;
            } else {
                speed = 0;
            }

            if (speed != 0 && (this.roleState == ROLE_STATE.NORMAL || this.roleState == ROLE_STATE.RUN && speed != this._speed)) {
                this.onStateChange(ROLE_STATE.RUN, Util.time(), this.x, this.y, speed);
            } else if (speed == 0 && this.roleState == ROLE_STATE.RUN) {
                this.onStateChange(ROLE_STATE.NORMAL, Util.time(), this.x, this.y, speed);
            }

            this._speed = speed;
        }
    }

    private onEnterFrame(evt:egret.Event) {
        if (GameModel.instance.isReady){ // 准备期间
            if (this.id == GameModel.instance.userUid){
            } else{
                if (this._userTag) {
                    this.removeChild(this._userTag);
                    this._userTag = null
                }
            }
            return
        }

        if (GameModel.instance.stop) {  // 游戏结束
            return;
        }

        if (this.id != GameModel.instance.userUid) { 
            return
        }

        if (this._userTag) {
            this.removeChild(this._userTag);
            this._userTag = null
        }

        let now = Util.time();
        if (this.roleState == ROLE_STATE.RUN && this._speed != 0){
            this.x = this._actStartX + this._speed * (now - this._actStartTime)/1000
        } else if (this.roleState == ROLE_STATE.JUMP) {
            let p:egret.Point = this.getJumpPos((now - this._actStartTime)/1000);
            this.x = p.x;
            this.y = p.y;
        } else if (this.roleState == ROLE_STATE.BOOM) {
            // console.log("check boom time", now - this._actStartTime)
            if (now - this._actStartTime > GameConfig.BOOM_TIME * 1000) {
                
                if (this._speed != 0) {
                    this.onStateChange(ROLE_STATE.RUN, Util.time(), this.x, this.y, this._speed);
                } else {
                    this.onStateChange(ROLE_STATE.NORMAL, Util.time(), this.x, this.y, this._speed);
                }
            }
        }

        if (this.x < GameConfig.MIN_X) {
            this.x = GameConfig.MIN_X;
        } else if (this.x > GameConfig.MAX_X) {
            this.x = GameConfig.MAX_X;
        }

        this.checkOnGround();

        if (this._posSend == 1){ // 同步位置
            Net.instance.send("game_move", this.id, -1, [Math.floor(this.x), Math.floor(this.y)]);
            this._posSend = 0;
        } else {
            ++this._posSend;
        }
    }

    private checkOnGround(){
        if (this.id != GameModel.instance.userUid){
            return;
        }

        if (this.roleState == ROLE_STATE.JUMP) { // 判断停在上一层
            let now = Util.time();
            let dt = (now - this._actStartTime)/1000;
            let v = this.calVerticalV(dt);
            // 判断跳跃下降轨迹与地形有没有相交， 相交的时间点到达没有
            // 当速度v>0 时玩家开始下降, 到达y 处所需的时间 t 
            if (v > 0) {
                for (let i = 0; i < GameModel.instance.groundLst.length; ++i){
                    let ground = GameModel.instance.groundLst[i];
                    if (this.y >= ground.y) {
                        // 在下降到y 时与地形有没有相交
                        let a = -this._gravity/2;
                        let b = this._vy;
                        let c = this._actStartY - ground.y;
                        let t1 = (-b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2*a);
                        let t2 = (-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2*a);
                        let t = t1 >= dt ?  t1 : t2;
                        let x = this.calJumpX(t);
                        x = Math.max(x, GameConfig.MIN_X);
                        x = Math.min(x, GameConfig.MAX_X);
                        if (x >= ground.fromX && 
                            x <= ground.toX){
                            this.y = ground.y;
                            if (this._speed != 0) {
                                this.onStateChange(ROLE_STATE.RUN, Util.time(), this.x, this.y, this._speed);
                            } else {
                                this.onStateChange(ROLE_STATE.NORMAL, Util.time(), this.x, this.y, this._speed);
                            }
                            break;
                        }
                    }
                }
            }
            
        }else if (this.roleState == ROLE_STATE.NORMAL || this.roleState == ROLE_STATE.RUN){ // 掉下去
            let now = Util.time();
            let isFall = true
            for (let i = 0; i < GameModel.instance.groundLst.length; ++i){
                let g = GameModel.instance.groundLst[i];
                if (this.y <= g.y + 10 && this.y >= g.y - 10) {// 在这层
                    if (this.x >= g.fromX && this.x <= g.toX) {// 地块范围内不会掉下去
                        isFall = false;
                        break;
                     }
                }
            }

            if (isFall) {
                let v0 = this.calJumpV0(isFall);
                this.onStateChange(ROLE_STATE.JUMP, now, this.x, this.y, v0.x, v0.y);
            }
        }
    }

    // 收到跳跃指令
    private onJump(evt:egret.Event) {
        if (GameModel.instance.isReady){ // 准备期间
            return
        }

        if (this.roleState != ROLE_STATE.JUMP && 
            this.roleState != ROLE_STATE.BOOM &&
            evt.data.id == this._id) {
            let now = Util.time();
            let v0 = this.calJumpV0();
            this.onStateChange(ROLE_STATE.JUMP, now, this.x, this.y, v0.x, v0.y);
        }
    }

    // 根据跳跃高度和时间计算重力加速度
    private calGravity() : number{
        let h = GameConfig.JUMP_TIME;
        let a = GameConfig.JUMP_HEIGHT/Math.pow(-h, 2);
        let g = - a* 2;
        return g;
    }

    // 计算跳跃初速度
    private calJumpV0(isFall?:boolean) : egret.Point{
        let vx = this._speed;
        let vy = 0; //自由落体初速度
        if (!isFall) {
            let h = GameConfig.JUMP_TIME;
            let a = GameConfig.JUMP_HEIGHT/Math.pow(-h, 2);
            vy = - 2 * a * h;
        }
        return new egret.Point(vx, vy);
    }

    // 计算某时刻的垂直速度
    private calVerticalV(dt) : number {
        if (this.roleState != ROLE_STATE.JUMP)
            return 0;
        let v = this._vy - this._gravity * dt;
        return v;
    }

    // 跳起期间某时间点到什么位置了
    private getJumpPos(dt:number): egret.Point {
        let y = this.calJumpY(dt);
        let x = this.calJumpX(dt);
        return new egret.Point(x, y);
    }

    private calJumpY(dt:number) : number {
        let g = this._gravity;
        let y = -g/2*Math.pow(dt, 2) + this._vy*dt + this._actStartY;
        return y;
    }

    private calJumpX(dt:number) : number {
        let x = dt * this._vx + this._actStartX;
        return x;
    }


}

