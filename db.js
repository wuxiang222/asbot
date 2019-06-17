var config = {
   server: "60.169.70.202"
   ,database: "asbot"
   ,user: "sa"
   ,password: "sd#2013"
   ,port: 1433
   ,pool: {  
		min: 0
		,max: 10 
		,idleTimeoutMillis: 3000  
	}
	,options: {
        encrypt: true //使用windows azure，需要设置次配置。
    }
}

const mssql = require('mssql')

const pool = new mssql.ConnectionPool(config).connect();


async function execute(sql, callback) {
    try {
        let pool = await mssql.connect(config);//连接数据库
        let result = await pool.request()
            .query(sql);
		callback(result)
		return result;
    } catch (err) {
		console.log(`执行 "${sql}" 语句失败！`)
		return console.error(err)
    } finally {
		mssql.close()
	}
}

mssql.on('err', err => {
   console.log("连接失败！！");
   return console.error(err)
});

async function save(msg, callback){
	const fromContact = msg.from()
	const toContact = msg.to()
	const text = msg.text()        //string
	const date = msg.date().toISOString()
	const room = msg.room()
	
	
	
	let sql = null;	
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
	await execute(sql, result => {
		console.log(result)
	});
	
	
	callback();
	
}
let db = {}
db.save = save;
module.exports = db;
