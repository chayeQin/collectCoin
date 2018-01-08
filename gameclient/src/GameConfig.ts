/**
 * @brief GameConfig
 * @author qyp
 */

enum DROP_TYPE {
    YIN = 1,
    JIN,
    XING,
    BOOM,
}

class GameConfig{
    static GAME_NAME = "tianjiangfuyun";
    static TOP_Y = 206; // 游戏区顶部高度
    static VIEW_HEIGHT = 800; // 游戏区高度 
    static MOVE_SPEED = 240; // 玩家横向移动速度
    static JUMP_HEIGHT = 220; // 能跳多高
    static JUMP_TIME = 0.5;   // 跳到最高点需要x 秒
    static GAME_TIME = 60;  // 游戏时长
    static READY_TIME = 3; // 准备时长
    static BOOM_TIME = 2; // 炸弹命中僵直时长

    static MIN_X = 60;  // 最左能走到哪里
    static MAX_X = 660;  // 最右位置

    // 掉落物品  [掉落类型, 图片, 分数, 掉落速度, 声音, 特效]
    
    static DROP_ITEM = [
        [DROP_TYPE.YIN, "coin_yin_png", 1, 250, "chijinbi_mp3", "yinbi"],
        [DROP_TYPE.JIN, "coin_jin_png", 5, 250, "chijinbi_mp3", "jinbi"],
        [DROP_TYPE.XING, "coin_xing_png", 10, 400, "chijinbi_mp3", "zuanshi"],
        [DROP_TYPE.BOOM, "boom_png", 0, 300, "chizhadan_mp3", ""],
    ]

    // 各个跳板, 左上角为坐标 （0,0）
    // y: 出去顶部分数面板部分的高度
    static GROUND_LST = [
        {y:585, fromX:230, toX:520},
        {y:800, fromX:0, toX:290},
        {y:800, fromX:460, toX:750},
        {y:GameConfig.TOP_Y + GameConfig.VIEW_HEIGHT, fromX:0, toX:750}// 地面必须有
    ]

}
