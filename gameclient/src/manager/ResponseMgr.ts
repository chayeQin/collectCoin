/**
 * @brief Net
 * @author qyp
 */

class ResponseMgr {
    public static onResponse(obj){
        let methodName = obj.msg
        let method = ResponseMgr[methodName]
        if (!method) {
            console.log("ERROR*** 没找到方法", methodName);
        } else {
            // console.log("response methodName", methodName);
            method(obj.data);
        }
    }

    public static login_success(params:any[]) {
        console.log(params);
        // GameModel.instance.userUid = params[0];
        JYXFinishLoading();
        // ResponseMgr.testGameStart()
    }

    public static testGameStart(){
        let d = new Date();
        let tmpAry = GameModel.instance.testInitDropLst();
        ResponseMgr.game_start([0, d.getTime(), [[GameModel.instance.userUid], ["asdff"]], tmpAry])
    }

    public static game_start(params:any[]) {
        GameModel.instance.initTime(params[1], params[0])
        let players:any[]= params[2]
        players.forEach((team:any[], index:number)=>{
            team.forEach((uid)=>{
                GameModel.instance.addPlayer(uid, index.toString());
            })
        })

        let dropData = params[3]
        GameModel.instance.initDrops(dropData);
        SceneMgr.instance.replaceScene(GameScene);

        JYXPKStart();
    }

    public static game_move(params:any[]) {
        EventCenter.instance.dispatchSelfEvent(EventConst.ROLE_STATE, params);
    }

    public static game_score_sync(params:any[]) {
        let userId = params[0];
        let itemId = params[1];
        let score = params[2];
        let teamId = params[3];
        let totalScore = params[4];
        if (userId == GameModel.instance.userUid) {
            GameModel.instance.playerScore = totalScore;
        }
        
        EventCenter.instance.dispatchSelfEvent(EventConst.SCORE_SYNC, params);
    }

    public static game_over(params:any) {
        GameModel.instance.stop = true;
        if (params.length<=0) {
            let v = new ResultView(true);
            SceneMgr.instance.addToScene(v);
            return;
        }

        let winnerTeam : any[] = params[0];
        let winnerUids : any[] = winnerTeam[0];
        let isWin = false;
        for (let i = 0; i < winnerUids.length; ++i){
            if (winnerUids[i] == GameModel.instance.userUid){
                isWin = true;
                break
            }
        }

        let v = new ResultView(isWin);
        SceneMgr.instance.addToScene(v);

        let str = JSON.stringify(params);

        JYXPKFinish(str);
    }

    public static heart(){
    }
}
