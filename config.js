/*
	poperty	-	datatype
	removeExpiredTokensTimer	-	 number(milliseconds) (900000 => 15min)
	expiresIn	-	number(seconds) (28800 => 8h)
*/
module.exports = {
	mongoDbUrl: (process.env.isDocker) ? 'mongodb://mongodb:27017/posts' : 'mongodb://localhost:27017/posts',
	secret: 'secret should not be  disclosed',
	expiresIn: 28800,
	jwtExcludeEndpoints: [
		'/signup',
		'/login',
		'/fast',
		'/delay',
		'/longrunning'
	],
	removeExpiredTokensTimer: 900000
}