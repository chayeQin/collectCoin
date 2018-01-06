/**
 * @brief GameModel
 * @author qyp
 */

class GameModel {
    public static instance:GameModel = new GameModel();
    private _dropDataLst:any[];
    private _groundLst:any[];
    private _startTime:number;
    private _userUid:string;
    private _players:{uid:string, teamId:string}[];
    private _serverTimeZone:number;
    private _serverDtime:number;
    private _dropIndex:number;
    private _lastDropTime:number;
    private _itemId:number;
    private _isStop:boolean;
    private _playerScore:number;

    private initGround(){
        this._groundLst = GameConfig.GROUND_LST;
        this._groundLst.sort((a, b) => {
            return a.y - b.y;
        })
    }

    public init(){
        this._dropIndex = 0;
        this._itemId = 0;
        this.playerScore = 0;
        this._players = new Array<{uid:string, teamId:string}>();
        this.initGround();
        GameModel.instance.stop = false;
    }

    set playerScore(s:number){
        this._playerScore = s;
    }

    get playerScore():number{
        return this._playerScore;
    }

    get stop() : boolean {
        return this._isStop;
    }

    set stop(b : boolean) {
        this._isStop = b;
    }

    get isReady() : boolean {
        return this.startTime >= Util.time()
    }

    get startTime() : number {
        return this._startTime;
    }
    set startTime(t) {
        this._startTime = t;
    }

    public get groundLst() : any[] {
        return this._groundLst;
    }

    get userUid() : string{
        return this._userUid;
    }
    set userUid(uid:string){
        this._userUid = uid;
    }

    get players() : {uid:string, teamId:string}[] {
        return this._players;
    }

    get dropDataLst(): any[]{
        this._dropDataLst.forEach((data)=>{
            data[1] = Math.floor(data[1]);
            data[2] = Math.floor(data[2]);
        })

        return this._dropDataLst; 
    }

    public getNxtDrop(){
        let nxtItem = this._dropDataLst[this._dropIndex]
        if (!nxtItem)
            return;

        let nxtDropTime = this._lastDropTime + nxtItem[2]
        let now = Util.time()
        if (now >= nxtDropTime){
            if (++this._dropIndex >= this._dropDataLst.length) {
                this._dropIndex = 0;
            }
            this._lastDropTime = nxtDropTime;
            return [nxtItem, this._itemId++, nxtDropTime]
        }
    }
    
    public initTime(v:number, stz?:number) {
        if (stz == null)
            stz = 8*3600000;

        let t = new Date();
        let cTime = t.getTime();
        let ctz = -t.getTimezoneOffset() * 60000;
        console.log("ctz", ctz)
        let ctz2 = Util.timezone(cTime);
        console.log("ctz2", ctz2)
        this._serverTimeZone = stz - ctz
        this._serverDtime = v - cTime
        this._startTime = v + GameConfig.READY_TIME * 1000; // 3秒后开始游戏
        this._lastDropTime = this._startTime;

        console.log("*** time diff ",this._serverDtime,this._serverTimeZone)
    }

    get serverDt() : number{
        return this._serverDtime
    }

    get servertTimeZone() :number{
        return this._serverTimeZone;
    }

    public addPlayer(uid:string, teamId:string) {
        this._players.push({uid:uid, teamId:teamId});
    }

    // [类型,时间间隔,位置]
    public initDrops(drops:any[]) {
        this._dropDataLst = drops;
    }
    
    // 测试单机掉落
    public testInitDropLst(){
        let dropDataLst = new Array<Object>();
        let t = 0;
        while (dropDataLst.length < 30){
            let startX = Math.random()*620 + 50;
            let resIndex = Math.floor(Math.random() * 3) + 1;
            let data = [resIndex, t, startX]
            dropDataLst.push(data);
            let randT = Math.random()*300 + 200;
            t += randT;
        }
        return dropDataLst;
    }


}