/**
 * Wechaty - WeChat Bot SDK for Personal Account, Powered by TypeScript, Docker, and 💖
 *  - https://github.com/chatie/wechaty
 */
const { Wechaty } = require('wechaty')
const db = require('./db.js')

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

/* 收到消息 */
async function onMessage (msg) {
	const fromContact = msg.from()
	const toContact = msg.to()
	const text = msg.text()        //string
	const date = msg.date().toISOString()
	
	let sql = null;
	
	const room = msg.room()
	if (room) {
		const topic = await room.topic()
		sql = `insert into message (fromContact, toContact, text, room, date) values(
			'${fromContact.name()}', '${toContact.name()}', '${text}', '${topic}', '${date}'
		)`
	} else {
		sql = `insert into message (fromContact, toContact, text, date) values(
			'${fromContact.name()}', '${toContact.name()}', '${text}', '${date}'
		)`
	}
	
	db.execute(sql, (result)=>{})
	console.log(msg.toString())
	
}

/* 收到添加好友 */
async function onFriendship(friendship) {
  await friendship.accept()
}

/* 收到入群邀请 */
async function onRoomInvite(invitation) {
  await roomInvitation.accept()
}

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