// 配置文件
module.exports = {
    // 管理员配置（必填项）
    NAME: '廖超', // 备注姓名
    NICKNAME: 'vanfree', //昵称
    CITY: '上海', //所在城市（城市名称，不要带“市”）

    // 天行API_KEY
    TXAPIKEY: 'a7a2173047b32b82256463d327963b97', //此处须填写个人申请的apikey

    // 设置指定时间定时发送
    SENDDATE: '0 0 7 * * *', //定时发送时间 每天早上7点0分0秒发送，规则见 /schedule/index.js

    // 监听群
    ROOMNAME: ['机器人测试', '老年人活动中心', 'Web前端交流群'],

    // 现有功能
    keywordsTip: `发送关键字：\n@Bot、\n拍马屁、\n舔狗日记、\n毒鸡汤、\n早上好，米娜桑、\n土味情话、\n神回复、\n星座运势（例：白羊座运势）、\n城市名+天气（例：上海天气）\n获取相关信息\n更多互动功能开发中`,

    // 高级功能配置项（非必填项）
    AUTOREPLY: false, //自动聊天功能 默认开启, 关闭设置为: false
    DEFAULTBOT: '0', //设置默认聊天机器人 0 天行机器人 1 图灵机器人 2 天行对接的图灵机器人，需要到天行机器人官网充值（50元/年，每天1000次）
    AUTOREPLYPERSON: [], //指定多个好友开启机器人聊天功能   指定好友的备注，最好不要带有特殊字符
    TULINGKEY: '图灵机器人apikey',//图灵机器人apikey,需要自己到图灵机器人官网申请，并且需要认证

    // (自定义) 如果你有 DIY 和基本的编程基础, 可以在这自己定义变量, 用于 js 文件访问, 包括设置简单的定时任务, 例如可以定义 task 数组
    // tasks: [{nick: 'personA', time: '早上', emoji: '🌝', action: 'eat xx', date: '0 0 8 * * *'}, 
    //         {nick: 'personA', time: '午饭后', emoji: '🌞', action: 'eat xx', date: '0 0 12 * * *'},
    //         {nick: 'personB', time: '晚饭前', emoji: '🌔', action: 'eat xx', date: '0 0 18 * * *'}, 
    //         {nick: 'personC', time: '睡前', emoji: '🌚', action: 'sleep', date: '0 0 22 * * *'}],
}

