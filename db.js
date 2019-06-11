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
		console.log(`执行 ${sql} 失败！`)
		return console.error(err)
    } 
}

mssql.on('err', err => {
   console.log("连接失败！！");
   return console.error(err)
});

exports.execute = execute;
