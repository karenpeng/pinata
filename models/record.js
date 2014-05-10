var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
/**
 * 定义数据库对象结构
 * @type {Schema}
 */
var RecordSchema = new Schema({
		id: {
				type: ObjectId
		},
		name: {
				type: String
		},
		score: {
				type: Number
		},
		create_at: {
				type: Date,
				default: Date.now
		}, // 默认的创建时间是 Date.now, 所以可以不传这个参数，mongo会自己赋值
});

/**
 * 建立索引
 * @type {Number}
 */
RecordSchema.index({
		master_id: 1,
		name: 1,
		score: 1
});

/**
 * 绑定Record结构给 mongoose
 */
module.exports = mongoose.model('Record', RecordSchema);