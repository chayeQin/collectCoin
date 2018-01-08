/**
 * @brief GameScene
 * @author qyp
 */


class StartScene extends egret.DisplayObjectContainer {
    private _roomId;
    private _uid;
    _tmpbtn : Button;
    constructor(){
        super();
        this.initGame();
    }
    
    private initGame() {
        GameModel.instance.init();
        let str = JYXGetGameData();
        if (str == null || str == "" || str == "null") {
            TestConfig.isTest = true;
            this.initTestUi();
        } else {
            let data = JSON.parse(str);
            GameModel.instance.userUid = data.player.uid;
            Net.instance.connectByUrl(ServerConfig.getWs())
        }
    }

    private initTestUi(){
        let txt = new egret.TextField()
        txt.type = egret.TextFieldType.INPUT;
        txt.inputType = egret.TextFieldInputType.TEXT;
        txt.text = "房间id:";
        this.addChild(txt);
        txt.x = 210;
        txt.y = 300;

        this._roomId = new egret.TextField()
        this._roomId.type = egret.TextFieldType.INPUT;
        this._roomId.inputType = egret.TextFieldInputType.TEXT;
        this._roomId.text = "";
        this.addChild(this._roomId);
        this._roomId.x = 310;
        this._roomId.y = 300;
        this._roomId.width = 400;

        let txt2 = new egret.TextField()
        txt2.type = egret.TextFieldType.INPUT;
        txt2.inputType = egret.TextFieldInputType.TEXT;
        txt2.text = "玩家id:";
        this.addChild(txt2);
        txt2.x = 210;
        txt2.y = 400;

        this._uid = new egret.TextField()
        this._uid.type = egret.TextFieldType.INPUT;
        this._uid.inputType = egret.TextFieldInputType.TEXT;
        this._uid.text = "";
        this.addChild(this._uid);
        this._uid.x = 310;
        this._uid.y = 400;
        this._uid.width = 400;

        this._tmpbtn = new Button({normalRes:"btn_jump_a_png"}, null, this.startGame, this);
        this.addChild(this._tmpbtn)
        this._tmpbtn.x = 500;
        this._tmpbtn.y = 500;


        // let t = new Role("cat_ani")
        // this.addChild(t)
        // t.x = 300;
        // t.y = 500;
        // this.role = t;


    }
    role;
    private startGame(){

        // EventCenter.instance.dispatchSelfEvent(EventConst.HIT_BOOM, this.role.id);

        var sound:egret.Sound = RES.getRes("chizhadan_mp3");
        sound.play(0, 1);
        let uid = this.randUid();
        let d = new Date();
        // Net.instance.send("login",  uid,  this._input.text, GameConfig.GAME_NAME);
        this._tmpbtn.enabled = false;
        TestConfig.uid = this._uid.text;
        TestConfig.roomId = this._roomId.text;
        GameModel.instance.userUid = TestConfig.uid;

        Net.instance.connectByUrl(ServerConfig.getWs())
    }

    private randUid() : string {
        let uid = "";
        for (let i = 0; i < 8; ++i){
            let t = Math.floor(Math.random() * 3);
            let num = 0;
            if (t == 0) {
                num = Math.floor(Math.random() * 9);
                num += 48;
            } else if (t == 1) {
                num = Math.floor(Math.random() * 25);
                num += 65;
            } else {
                num = Math.floor(Math.random() * 25);
                num += 97;
            }

            uid += String.fromCharCode(num);
        }
        return uid
    }
}