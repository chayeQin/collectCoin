/**
 * @brief TestConfig
 * @author qyp
 */

class TestConfig {

    private static _isTest = false;
    // static TEST_URL = "ws://192.168.1.72:10000"
    static TEST_URL = "ws://39.108.173.10:10001"

    private static _roomId = "";
    private static _uid = "";
    private static _teamId = "";
    
    static get isTest() {
        return this._isTest;
    }
    static set isTest(b) {
        this._isTest = b;
    }

    static get gameId() :string {
        return "tianjiangfuyun";
    }

    static get uid() : string {
        return TestConfig._uid;
    }

    static set uid(uid) {
        TestConfig._uid = uid;
    }

    static get roomId() : string {
        return TestConfig._roomId;
    }

    static set roomId(id) {
        TestConfig._roomId = id;
    }

    static get teamId() : string {
        return ""
    }

    static set teamId(id) {
        TestConfig._teamId = id;
    }
}