/*
	poperty	-	datatype
	removeExpiredTokensTimer	-	 number(milliseconds) (900000 => 15min)
	expiresIn	-	number(seconds) (28800 => 8h)
*/
module.exports = {
	mongoDbUrl: 'mongodb://mongodb:27017/posts',
	secret: 'secret should not be  disclosed',
	expiresIn: 28800,
	jwtExcludeEndpoints: [
		'/signup',
		'/login'
	],
	removeExpiredTokensTimer: 900000
}