/**
 * @brief ServerConfig
 * @author qyp
 */

class ServerConfig {
    // static URL_BASE = "wolfkill-game.yy.com";   // dist
    /**
     * 获取WEBSocket连接地址
     */
    public static getWs():string{
        if(TestConfig.isTest)
        {
            let player:any = {
                "channelid":"guangzhou1",
                "gameid":TestConfig.gameId,
                "roomid":TestConfig.roomId,
                "player":{
                    "uid":TestConfig.uid,
                    "name":"userName",
                    "avatarurl":"http://s1.yy.com/guild/header/10001.jpg",
                    "teamid":TestConfig.teamId,
                    "opt":""
                }
            }

            player = JSON.stringify(player);
            player = encodeURI(player);
            return TestConfig.TEST_URL + "/" + TestConfig.gameId + "/" + TestConfig.roomId + "?post_data=" + player;
        }else{
            return GetWssUrl();
        }
    }
}
