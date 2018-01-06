/**
 * @brief Net
 * @author qyp
 */

class Net {
    private _socket : egret.WebSocket;
    static instance : Net = new Net();
    private _id : number;
    constructor(){
        this._socket = new egret.WebSocket();
        this._socket.type = egret.WebSocket.TYPE_STRING;
        this._socket.addEventListener(egret.Event.CONNECT, this.onConnect, this);
        this._socket.addEventListener(egret.Event.CLOSE, this.onClose, this);
        this._socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceive, this);
        this._socket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onError, this);
    }

    public connect(host:string, port:number) {
        if (!this._socket.connected) {
            this._socket.connect(host, port);
        } else {
            console.log("ERROR*** 已经连接服务器");
        }
    }

    public connectByUrl(url) {
        if (!this._socket.connected) {
            console.log("connectByUrl:", url);
            this._socket.connectByUrl(url);
        } else {
            console.log("ERROR*** 已经连接服务器");
        }
    }

    private onConnect(evt:egret.Event) {
        this._id = 0;
        EventCenter.instance.dispatchSelfEvent(EventConst.CONNECT_SUCCESS)

        console.log("***Net.onConnect 连接服务器成功");
        Util.startHeartBeat();
    }

    private onClose(evt:egret.Event) {
        console.log("***Net.onClose 断开服务器");
        Util.stopHeartHeat();
    }

    private onReceive(evt:egret.Event) {
        // console.log("****Net.onReceive");
        let str = this._socket.readUTF();
        let jsObj = JSON.parse(str);
        if (jsObj.code != 0) {
            console.log("ERROR***Net.onReceive", jsObj);
        } else {
            ResponseMgr.onResponse(jsObj);
        }
    }

    private onError(evt:egret.Event) {
        console.log("***Net.onError");
    }

    public close() {
        this._socket.close();
    }


    /**
     * 
     */
    public send(method:string, ...params){
        if (!this._socket.connected){
            console.log("ERROR*** Net.send 没有连接服务器");
            return
        }

        // params.unshift(action);
        let obj = {
            code:0,
            msg:method,
            data:params,
        }
        let str = JSON.stringify(obj);
        // console.log("发送成功", str)
        this._socket.writeUTF(str);
        this._socket.flush();
    }
}
