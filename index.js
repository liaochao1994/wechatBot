/**
 * WechatBot
 *  - https://github.com/gengchen528/wechatBot
 */
const { WechatyBuilder } = require('wechaty');
const config = require('./config/index');
const superagent = require('./superagent/index');

// 二维码生成
function onScan(qrcode, status) {
  require('qrcode-terminal').generate(qrcode); // 在console端显示二维码
  const qrcodeImageUrl = [
    'https://api.qrserver.com/v1/create-qr-code/?data=',
    encodeURIComponent(qrcode),
  ].join('');
  console.log(qrcodeImageUrl);
}

// 登录
async function onLogin(user) {
  console.log(`贴心小助理${user}登录了`);
  if (config.AUTOREPLY) console.log(`已开启机器人自动聊天模式`);
  let Rooms = config.ROOMNAME;
  for (var i = 0; i < Rooms.length; i++) {
    try {
      let room = await bot.Room.find({ topic: Rooms[i] }) // 获取你要发送的 - 群名称
      // let str = '贴心小助理上线啦！\n';
      // str += config.keywordsTip;
      // await superagent.sendRoomMessage(room, str);
      await superagent.roomListenJoin(room);
    }
    catch {

    }
  }
  // 登陆后创建定时任务
  await superagent.initDay(bot);
}

// 登出
function onLogout(user) {
  console.log(`小助手${user} 已经登出`);
}

// 监听对话
var reback_message_listen = true // 是否开启防撤回，默认开启
var reback_message = [] // 自动保存最近的30条记录
async function onMessage(msg) {
  const contact = await msg.talker(); // 发消息人 
  const content = await msg.text().trim(); // 消息内容
  const room = await msg.room(); // 是否是群消息
  const alias = await contact.alias() || contact.name(); // 发消息人备注
  const isText = msg.type() === bot.Message.Type.Text; // 检测属于文字内容
  const isImage = msg.type() === bot.Message.Type.Image; // 检测属于图片
  // if (isImage) {
  // let file = await msg.toFileBox() // 获取消息中的文件 - 暂时对应为图片
  // console.log(file)
  // }
  let str = '';
  if (msg.self()) return // 如果是自己发的消息则直接过滤
  let content_key = content.split('天气') || content.split('运势') || content.split('是什么垃圾') || []; // 天气
  switch (content) {
    case '@Bot':
      str = config.keywordsTip;
      break;
    case '土味情话':
      let low = await superagent.getSweetWord(); //获取土味情话
      str = `${low}`;
      break;
    case '神回复':
      let godReply = await superagent.getGodReply(); //获取神回复
      str = `${godReply}`;
      break;
    case '拍马屁':
      let pi = await superagent.getCaiHongPi(); //获取彩虹屁
      str = `${pi}`;
      break;
    case '舔狗日记':
      let tiangou = await superagent.getTianGou(); //获取舔狗日记
      str = `${tiangou}`;
      break;
    case '毒鸡汤':
      let du = await superagent.getDuJiTang(); //获取毒鸡汤
      str = `${du}`;
      break;
    case '早上好，米娜桑':
      let zaoan = await superagent.getZaoAn(); //获取早安心语
      str = `${zaoan}`;
      break;
    case content_key[0] + '是什么垃圾':
      if (content_key[0]) {
        let fenlei = await superagent.getRubbishType(content_key[0]); //获取垃圾分类
        if (fenlei) str = `${fenlei}`;
      }
      break;
    case content_key[0] + '天气':
      if (content_key[0]) {
        let weather = await superagent.getTXweather(content_key[0]); //获取天气信息
        if (weather) str = `${weather}`;
      }
      break;
    case content_key[0] + '运势':
      if (content_key[0]) {
        let text = await superagent.getXingZuo(content_key[0]); //获取星座信息
        if (text) str = `${text}`;
      }
      break;
    case '开启防撤回':
      reback_message_listen = true
      str += `已开启防撤回`;
      break;
    case '关闭防撤回':
      reback_message_listen = false
      str += `已关闭防撤回`;
      break;
    default:
      // 尝试性开发的功能，不符合微信规定，无优化，无调整，存在一定的风险
      let check_contact_data = null
      if (reback_message_listen && content.match('\" 撤回了一条消息')) {
        for (let i = 0; i < reback_message.length; i++) {
          if (reback_message[i].name == alias) {
            check_contact_data = reback_message[i]
          }
        }
        if (check_contact_data && check_contact_data.isText) {
          let reg = /\["(.*?)" 撤回了一条消息\]/g
          let name = content.match(reg)
          name = name ? name[0].split('"')[1] : ''
          // 如果有返回值则进行内容回复
          // str += `太天真了，想撤回不可能的\n`;
          str += `${name} 说: ${check_contact_data.content}\n`;
          str += `【消息防撤回仅支持最近的一条文字消息，关闭防撤回请说：关闭防撤回】`;
        }
      } else {
        if (reback_message.length > 29) reback_message.splice(0, 1) // 如果已记录对话超过30条，自动删除第一条
        reback_message.push({
          name: alias,
          content: content,
          isText: isText
        })
      }
      break;
  }
  if (room) {
    // 如果是群消息 目前只处理文字消息
    const topic = await room.topic();
    // console.log(`群名: ${topic} 发消息人: ${alias} 内容: ${content}`);
    // 如果是指定得群，就恢复指定消息
    if (config.ROOMNAME.length > 0 && config.ROOMNAME.indexOf(topic) != -1) {
      // 如果有返回值则进行内容回复
      if (str) await superagent.sendRoomMessage(room, str);
    }
  } else {
    if (str) await superagent.sendRoomMessage(contact, str)
  }
}

const bot = WechatyBuilder.build({
  name: 'WechatEveryDay',
  puppet: 'wechaty-puppet-wechat4u', // 如果有token，记得更换对应的puppet
})

bot.on('scan', onScan);
bot.on('login', onLogin);
bot.on('logout', onLogout);
bot.on('message', onMessage);

bot
  .start()
  .then(() => console.log('开始登陆微信'))
  .catch((e) => console.error(e));
