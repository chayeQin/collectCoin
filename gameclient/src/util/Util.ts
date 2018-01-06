/**
 * @brief Util
 * @author qyp
 */

let greyMatrix = [
    0.3,0.6,0,0,0,
    0.3,0.6,0,0,0,
    0.3,0.6,0,0,0,
    0,0,0,1,0
];

class Util{

    static timer:egret.Timer = new egret.Timer(1000);

    public static urlencode(params: Object) {
        let tmp = new egret.URLVariables();
        let keys: string[] = Object.keys(params).sort();
        let sortedObj: Object = {};
        for (let i = 0; i < keys.length; i++) {
            sortedObj[keys[i]] = params[keys[i]];
        }
        tmp.variables = sortedObj;
        let result: string = encodeURIComponent(tmp.toString());
        return result
    }

    static time(v?:any) : number {
        if (typeof(v) == "object"){
            let t = new Date(v.year, v.month, v.date, v.hour, v.minutes, v.seconds, v.ms)
            return t.getTime() + GameModel.instance.servertTimeZone;
        }

        let t = new Date();
        let cTime = t.getTime();
        return cTime + GameModel.instance.serverDt;
    }

    // 算出时区
    static timezone(now){
        let t = new Date(now);
        return -t.getTimezoneOffset() * 6000;
        // return now - t.getTime();
    }
        
    static setGray(obj, boo){
        if (boo){
            let greyFilter = new egret.ColorMatrixFilter(greyMatrix);
            obj.filters = [ greyFilter ];
        }else{
            obj.filters = null;
        }
    }

    // 置灰
    static grey(obj:egret.DisplayObject, boo?:boolean){
        boo = boo == null ? true : boo;
        if (obj instanceof egret.DisplayObjectContainer){
            let childrenCount = obj.numChildren;
            for (let i = 0; i < obj.numChildren; ++i){
                let child = obj.getChildAt(i);
                Util.setGray(child, boo);
            }
        } else {
            Util.setGray(obj, boo);
        }
    }

    /**
     *  外发光
     * @param obj 显示对象
     * @param color 外发光颜色
     * @param alpha 透明度(0~1)
     */
    static glow(obj:egret.DisplayObject, color:number, alpha?:number){
        alpha = alpha ? alpha : 0.8;
        let blurX:number = 35;              /// 水平模糊量。有效值为 0 到 255.0（浮点）
        let blurY:number = 35;              /// 垂直模糊量。有效值为 0 到 255.0（浮点）
        let strength:number = 2;            /// 压印的强度，值越大，压印的颜色越深，而且发光与背景之间的对比度也越强。有效值为 0 到 255。暂未实现
        let quality:number = egret.BitmapFilterQuality.HIGH;        /// 应用滤镜的次数，建议用 BitmapFilterQuality 类的常量来体现
        let inner:boolean = false;            /// 指定发光是否为内侧发光，暂未实现
        let knockout:boolean = false;            /// 指定对象是否具有挖空效果，暂未实现
        let glowFilter:egret.GlowFilter = new egret.GlowFilter( color, alpha, blurX, blurY,
        strength, quality, inner, knockout );
        obj.filters = [ glowFilter ];
    }

    /**
     * 阴影
     * @param color 阴影颜色
     * @param distance 阴影的偏移距离，以像素为单位
     * @param angle 投影角度(0~360)
     * @param alpha 透明度 (0~1)
     */
    static shadow(obj:egret.DisplayObject, color:number, distance?:number, angle?:number, alpha?:number){
        angle = angle ? angle : 45;
        alpha = alpha ? alpha : 0.7;
        distance = distance ? distance : 6;
        let blurX:number = 16;              /// 水平模糊量。有效值为 0 到 255.0（浮点）
        let blurY:number = 16;              /// 垂直模糊量。有效值为 0 到 255.0（浮点）
        let strength:number = 0.65;                /// 压印的强度，值越大，压印的颜色越深，而且阴影与背景之间的对比度也越强。有效值为 0 到 255。暂未实现
        let quality:number = egret.BitmapFilterQuality.LOW;              /// 应用滤镜的次数，暂无实现
        let inner:boolean = false;            /// 指定发光是否为内侧发光
        let knockout:boolean = false;            /// 指定对象是否具有挖空效果
        let dropShadowFilter:egret.DropShadowFilter =  new egret.DropShadowFilter( distance, angle, color, alpha, blurX, blurY,
            strength, quality, inner, knockout );
        obj.filters = [ dropShadowFilter ];
    }


    static setAnchorPoint(obj:egret.DisplayObject, x:number, y:number){
        obj.anchorOffsetX = obj.width * x;
        obj.anchorOffsetY = obj.height * y;
    }


    static createAction(target:egret.DisplayObject, list:any[]) : egret.Tween {
        let funcName:string = list[0];
        funcName = funcName.toLowerCase();
        let func : Function = Action[funcName];
        list.shift();
        list.unshift(target);
        console.log("params", list);
        return func.apply(null, list);
    }

    public static startHeartBeat(){
        Util.timer.addEventListener(egret.TimerEvent.TIMER,Util.heartbeat,Util);
        Util.timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE,Util.heartbeat,Util);
        Util.timer.start()
    }

    public static stopHeartHeat(){
        Util.timer.removeEventListener(egret.TimerEvent.TIMER,Util.heartbeat,Util);
        Util.timer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE,Util.heartbeat,Util);
        Util.timer.stop()
    }

    public static randStr() :string{
        let str = "";
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

            str += String.fromCharCode(num);
        }
        return str
    }
    
    public static heartbeat(){
        //开始计时
        Net.instance.send("heart")
        return
    }

    // function runAction(target, list){
    //     let tw = egret.Tween.get(target);
    //     createAction(target, list, tw);
    // }

    // run([
    //     "rep",
    //         ["seq",
    //             ["moveto", 0.5, 100, 100],
    //             ["call", func, thisObj],
    //             []
    //         ]
    // ])

    public static exitGame(){
    }

}

