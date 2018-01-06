/**
 * @brief GameScene
 * @author qyp
 */

class EventCenter extends egret.EventDispatcher {
    public static instance : EventCenter = new EventCenter();
    public dispatchSelfEvent(type: string, data?: any, bubbles: boolean = false, cancelable: boolean = false) {
        let event = new egret.Event(type, bubbles, cancelable, data);
        this.dispatchEvent(event);
        egret.Event.release(event);
        event = null;
    }
}