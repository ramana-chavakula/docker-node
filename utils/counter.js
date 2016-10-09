'use strict';
let getNextId = function (db, name, callback) {
	/* 
		upsert: true will add the record if record not found
		new: true will return the latest updated record
	*/
	db.collection('counter').findAndModify({_id: name}, [['_id', '1']], {$inc: {seq: 1}}, {upsert: true, new: true}, (err, res) => { 
		if(err) {
			callback(err, null);
		}
		callback(null, name + "-" + res.value.seq);
	});
};
module.exports = {getNextId}