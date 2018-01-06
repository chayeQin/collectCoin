/**
 * @brief GameConfig
 * @author qyp
 */

class GameConfig{
    static GAME_NAME = "tianjiangfuyun";
    static VIEW_HEIGHT = 765; // 游戏区高度 
    static MOVE_SPEED = 240; // 玩家横向移动速度
    static JUMP_HEIGHT = 220; // 能跳多高
    static JUMP_TIME = 0.5;   // 跳到最高点需要x 秒
    static GAME_TIME = 60;  // 游戏时长
    static READY_TIME = 4; // 准备时长

    static MIN_X = 60;  // 最左能走到哪里
    static MAX_X = 660;  // 最右位置

    // 掉落物品  [id, 图片, 分数, 掉落速度, 声音]
    static DROP_ITEM = [
        [1, "coin_yin_png", 1, 250, "chijinbi_mp3"],
        [2, "coin_jin_png", 5, 250, "chijinbi_mp3"],
        [3, "coin_xing_png", 10, 400, "chijinbi_mp3"],
        [4, "boom_png", 0, 300, "chizhadan_mp3"],
    ]

    // 各个跳板, 左上角为坐标 （0,0）
    // y: 出去顶部分数面板部分的高度
    static GROUND_LST = [
        {y:356, fromX:225, toX:500},
        {y:563, fromX:0, toX:290},
        {y:563, fromX:420, toX:720},
        {y:765, fromX:0, toX:720}// 地面必须有
    ]

}
