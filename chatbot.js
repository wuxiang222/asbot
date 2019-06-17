/**
 * Wechaty - WeChat Bot SDK for Personal Account, Powered by TypeScript, Docker, and 💖
 *  - https://github.com/chatie/wechaty
 */
const { Wechaty } = require('wechaty')
const db = require('./db.js')
const bot = new Wechaty()

bot
.on('scan',        onScan)
.on('login',       onLogin)
.on('logout',      onLogout)
.on('message',     onMessage)
.on('friendship',  onFriendship)
.on('room-invite', onRoomInvite)
.start()
.then(() => console.log('Starter Bot Started.'))
.catch(e => console.error(e))

/* 生成二维码 */
function onScan (qrcode, status) {
	// qrcode == "https://login.weixin.qq.com/l/YZXEpNfgqw=="
	// status == 0 (生成)  status == 408 (重发)
  require('qrcode-terminal').generate(qrcode, { small: false })  // show qrcode on console

  const qrcodeImageUrl = [
    'https://api.qrserver.com/v1/create-qr-code/?data=',
    encodeURIComponent(qrcode),
  ].join('')

  console.log(qrcodeImageUrl)
}

/* 登陆处理 */
function onLogin (user) {
  console.log(`${user} login~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`)
}

/* 注销处理 */
function onLogout(user) {
  console.log(`${user} logout**************************************************`)
}

/* 收到消息处理 */
async function onMessage (msg) {
	// 判断是文本信息
	if(msg.type() == bot.Message.Type.Text){
		db.save(msg, ()=>{
			// 发送http请求，获取信息回复
			const request = require('request');
			const url = 'http://oa.vviivv.com/vivOAApi/api/ShipApi/'+msg.text().trim()
			request(encodeURI(url), function(error, response, body){
				if(!error && response.statusCode == 200){
					if ( body && body !=='null' ) {
						
						let reply = "";
						let jsonString = JSON.parse(body);
						let jsonObj = JSON.parse(jsonString);
						for ( v of jsonObj){
		
							reply += `船名: ${v.ShipName}   联系人: ${v.ShipOwnerName}   联系电话: ${v.ShipOwnerPhone}`+'\n'
						
						}
						msg.from().say(reply);
					}
				}
			})	
		})
	}
	
	// console.log(msg.toString())
}

/* 收到添加好友 */
async function onFriendship(friendship) {
  await friendship.accept()
}

/* 收到入群邀请 */
async function onRoomInvite(invitation) {
  await roomInvitation.accept()
}
