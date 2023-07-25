const superagent = require('./superagent');
const config = require('../config/index');
const schedule = require('../schedule/index');
const untils = require('../utils/index');
const cheerio = require('cheerio');
const { machineIdSync } = require('node-machine-id');
const crypto = require('crypto');
let md5 = crypto.createHash('md5');
let uniqueId = md5.update(machineIdSync()).digest('hex'); // 获取机器唯一识别码并MD5，方便机器人上下文关联
const ONE = 'http://wufazhuce.com/'; // ONE的web版网站
const TXHOST = 'http://api.tianapi.com/txapi/'; // 天行host
const TULINGAPI = 'http://www.tuling123.com/openapi/api'; // 图灵1.0接口api

// 延时函数，防止检测出类似机器人行为操作
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 指定对象发送消息
async function sendRoomMessage(res, str) {
    // 你可以修改下面的 str 来自定义每日说的内容和格式
    // PS: 如果需要插入 emoji(表情), 可访问 "https://getemoji.com/" 复制插入
    let logMsg;
    try {
        logMsg = str;
        await delay(1000);
        await res.say(str); // 发送消息
    } catch (e) {
        logMsg = e.message;
    }
    console.log(logMsg);
}

// 创建微信每日说定时任务
async function initDay(bot) {
    console.log(`已经设定每日说任务`);
    schedule.setSchedule(config.SENDDATE, async () => {
        let Rooms = config.ROOMNAME;
        for (var i = 0; i < Rooms.length; i++) {
            let room = await bot.Room.find({ topic: Rooms[i] }) // 获取你要发送的 - 群名称
            // let zaoan = await getZaoAn(); //获取每日一句
            // let one = await getOne(); //获取每日一句
            let weather = await getTXweather(config.CITY); //获取天气信息
            let today = await untils.formatDate(new Date()); //获取今天的日期
            // 你可以修改下面的 str 来自定义每日说的内容和格式
            // PS: 如果需要插入 emoji(表情), 可访问 "https://getemoji.com/" 复制插入
            let str = `${today}\n`;
            // str += `${zaoan}\n`
            str += `元气满满得一天开始啦！\n`
            str += `${weather}`
            // str += `发送‘城市名+天气’即可获取指定城市天气信息\n`
            // str += `每日一句:${one}\n`
            sendRoomMessage(room, str);
        }
    });
}

// 获取每日一句
async function getOne() {
    try {
        let res = await superagent.req({ url: ONE, method: 'GET', spider: true });
        let $ = cheerio.load(res);
        let todayOneList = $('#carousel-one .carousel-inner .item');
        let todayOne = $(todayOneList[0])
            .find('.fp-one-cita')
            .text()
            .replace(/(^\s*)|(\s*$)/g, '');
        return todayOne;
    } catch (err) {
        console.log('获取每日一句出错', err);
        return err;
    }
}

// 获取毒鸡汤
async function getDuJiTang() {
    let url = TXHOST + 'dujitang/';
    try {
        let content = await superagent.req({ url, method: 'GET', params: { key: config.TXAPIKEY } });
        if (content.code === 200) {
            let sweet = content.newslist[0].content;
            let str = sweet.replace('\r\n', '<br>');
            return str;
        } else {
            return '获取失败，请联系管理员'
        }
    } catch (err) {
        console.log('获取接口失败', err);
    }
}

// 获取早安心语
async function getZaoAn() {
    let url = TXHOST + 'zaoan/';
    try {
        let content = await superagent.req({ url, method: 'GET', params: { key: config.TXAPIKEY } });
        if (content.code === 200) {
            let sweet = content.newslist[0].content;
            let str = sweet.replace('\r\n', '<br>');
            return str;
        } else {
            return '获取失败，请联系管理员'
        }
    } catch (err) {
        console.log('获取接口失败', err);
    }
}

// 获取彩虹屁
async function getCaiHongPi() {
    let url = TXHOST + 'caihongpi/';
    try {
        let content = await superagent.req({ url, method: 'GET', params: { key: config.TXAPIKEY } });
        if (content.code === 200) {
            let sweet = content.newslist[0].content;
            let str = sweet.replace('\r\n', '<br>');
            return str;
        } else {
            return '获取失败，请联系管理员'
        }
    } catch (err) {
        console.log('获取接口失败', err);
    }
}

// 获取舔狗日记
async function getTianGou() {
    let url = TXHOST + 'tiangou/';
    try {
        let content = await superagent.req({ url, method: 'GET', params: { key: config.TXAPIKEY } });
        if (content.code === 200) {
            let sweet = content.newslist[0].content;
            let str = sweet.replace('\r\n', '<br>');
            return str;
        } else {
            return '获取失败，请联系管理员'
        }
    } catch (err) {
        console.log('获取接口失败', err);
    }
}

// 获取神回复
async function getGodReply() {
    let url = TXHOST + 'godreply/';
    try {
        let content = await superagent.req({ url, method: 'GET', params: { key: config.TXAPIKEY } });
        if (content.code === 200) {
            let sweet = '问：' + content.newslist[0].title + '\r\n' + '答：' + content.newslist[0].content;
            let str = sweet.replace('\r\n', '<br>');
            return str;
        } else {
            return '获取失败，请联系管理员'
        }
    } catch (err) {
        console.log('获取接口失败', err);
    }
}

// 获取土味情话
async function getSweetWord() {
    let url = TXHOST + 'saylove/';
    try {
        let content = await superagent.req({ url, method: 'GET', params: { key: config.TXAPIKEY } });
        if (content.code === 200) {
            let sweet = content.newslist[0].content;
            let str = sweet.replace('\r\n', '<br>');
            return str;
        } else {
            return '你很像一款游戏。我的世界'
        }
    } catch (err) {
        console.log('获取接口失败', err);
    }
}

/**
 * @param {String} city 城市名称
 * @param {Number} type 实时 （1）/ 天数（2，3，4，5，6，7）
 */
// 获取天气
async function getTXweather(city) {
    // 获取天行天气
    let url = TXHOST + 'tianqi/';
    try {
        let content = await superagent.req({
            url, method: 'GET', params: {
                key: config.TXAPIKEY,
                city: city,
                type: 1
            }
        });
        // 10000
        if (content.code === 200) {
            let str = ``;
            let todayInfo = content.newslist[0];
            str += `今天${city}${todayInfo.weather}\n`;
            str += `温度:${todayInfo.lowest}/${todayInfo.highest}\n`;
            str += `${todayInfo.wind} ${todayInfo.windspeed}\n`;
            str += `${todayInfo.tips}\n`;
            return str;
        } else {
            return null;
        }
    } catch (err) {
        console.log('请求天气失败', err);
    }
}

/**
 * @param {String} word 垃圾名称
 */
//获取垃圾分类结果
async function getRubbishType(word) {
    let url = TXHOST + 'lajifenlei/';
    let content = await superagent.req({ url, method: 'GET', params: { key: config.TXAPIKEY, word: word } });

    if (content.code === 200) {
        let type;
        if (content.newslist[0].type == 0) {
            type = '是可回收垃圾';
        } else if (content.newslist[0].type == 1) {
            type = '是有害垃圾';
        } else if (content.newslist[0].type == 2) {
            type = '是厨余(湿)垃圾';
        } else if (content.newslist[0].type == 3) {
            type = '是其他(干)垃圾';
        }
        let response =
            content.newslist[0].name +
            type +
            '<br>解释：' +
            content.newslist[0].explain +
            '<br>主要包括：' +
            content.newslist[0].contain +
            '<br>投放提示：' +
            content.newslist[0].tip;
        return response;
    } else {
        return '暂时还没找到这个分类信息呢';
    }
}

// 监听新成员加入群
async function roomListenJoin(room) {
    if (room) {
        room.on('join', (res, inviteeList, inviter) => {
            let str = '';
            str += `欢迎新人，@群主记得先发红包`;
            sendRoomMessage(room, str);
        })
    }
}

// 获取星座运势
async function getXingZuo(astro) {
    let url = TXHOST + 'star/';
    try {
        let content = await superagent.req({
            url, method: 'GET', params: {
                key: config.TXAPIKEY,
                astro: astro
            }
        });
        if (content.code === 200) {
            let newslist = content.newslist || [];
            let str = '';
            for (var i = 0; i < newslist.length; i++) {
                str += newslist[i].type + ':' + newslist[i].content + '\n'
            }
            return str;
        } else {
            return null;
        }
    } catch (err) {
        console.log('请求星座信息失败', err);
    }
}

// 天行对接的图灵机器人
async function getTXTLReply(word) {
    let url = TXHOST + 'tuling/';
    let content = await superagent.req({
        url, method: 'GET', params: {
            key: config.TXAPIKEY,
            question: word,
            userid: uniqueId
        }
    });

    if (content.code === 200) {
        let response = content.newslist[0].reply;
        console.log('天行对接的图灵机器人:', content);
        return response;
    } else {
        return '我好像迷失在无边的网络中了，接口调用错误：' + content.msg;
    }
}

// 图灵智能聊天机器人
async function getTuLingReply(word) {
    let url = TULINGAPI;
    let content = await superagent.req({
        url, method: 'GET', params: {
            key: config.TULINGKEY,
            info: word
        },
        platform: 'tl'
    });

    if (content.code === 100000) {
        return content.text;
    } else {
        return '出错了：' + content.text;
    }
}

// 天行聊天机器人
async function getReply(word) {
    let url = TXHOST + 'robot/';
    let content = await superagent.req({
        url, method: 'GET', params: {
            key: config.TXAPIKEY,
            question: word,
            mode: 1,
            datatype: 0,
            userid: uniqueId
        }
    });

    if (content.code === 200) {
        let res = content.newslist[0]
        let response = '';
        if (res.datatype === 'text') {
            response = res.reply
        } else if (res.datatype === 'view') {
            response = `虽然我不太懂你说的是什么，但是感觉很高级的样子，因此我也查找了类似的文章去学习，你觉得有用吗<br>《${content.newslist[0].title}》${content.newslist[0].url}`
        } else {
            response = '你太厉害了，说的话把我难倒了，我要去学习了，不然没法回答你的问题';
        }
        return response;
    } else {
        return '我好像迷失在无边的网络中了，你能找回我么';
    }
}

module.exports = {
    sendRoomMessage,
    initDay,
    getOne,
    getZaoAn,
    getCaiHongPi,
    getTXweather,
    getXingZuo,
    getTianGou,
    getReply,
    getDuJiTang,
    getGodReply,
    getSweetWord,
    getTuLingReply,
    getTXTLReply,
    getRubbishType,
    roomListenJoin
};
