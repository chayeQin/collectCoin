/**
 * @brief Util
 * @author qyp
 */

class DisplayUtil {
    public static removeFromParent(obj: egret.DisplayObject) : void {
        if (obj && obj.parent) {
            obj.parent.removeChild(obj);
        }
    }

    public static get stageWidth() : number {
        return egret.MainContext.instance.stage.stageWidth;
    }

    public static get stageHeight() : number {
        return egret.MainContext.instance.stage.stageHeight; 
    }

    public static sprite(res:string) : egret.Bitmap {
        let img = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(res);
        img.texture = texture;
        return img;
    }

    public static sprite9(res:string, rect:egret.Rectangle) : egret.Bitmap {
        let img = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(res);
        img.texture = texture;
        img.scale9Grid = rect;
        return img;
    }

    public static label(txt:string, fontSize?:number, color?:number) : egret.TextField {
        let label:egret.TextField = new egret.TextField();
        label.size = fontSize ? fontSize : 30;
        label.textColor = color ? color : 0xffffff;
        label.text = txt;
        return label
    }

    public static labelOutLine(txt:string, fontSize?:number, color?:number, outlineColor?:number, outlineSize?:number) : egret.TextField {
        let label:egret.TextField = new egret.TextField();
        label.size = fontSize ? fontSize : 30;
        label.textColor = color ? color : 0xffffff;
        label.strokeColor = outlineColor ? outlineColor : 0x000000;
        label.stroke = outlineSize ? outlineSize : 2;
        label.text = txt;
        return label
    }

    public static updateTexture(img:egret.Bitmap, res:string) {
        let texture: egret.Texture = RES.getRes(res);
        img.texture = texture;
    }

    public static number(fnt:string) : egret.BitmapText {
        var txt = new egret.BitmapText();
        txt.font = RES.getRes(fnt);
        return txt
    }

}