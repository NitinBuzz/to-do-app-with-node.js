var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var mongoose = require('../db/mongoose').mongoose;
//var Schema = require('../db/mongoose').Schema;

var TodoSchema = new Schema({
  text: { type: String, required: true, minlength: 1, trim: true },
  completed: { type: Boolean, default: false },
  completedAt: { type: Number, default: null },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});
var TodoModel = mongoose.model('Todo', TodoSchema);

module.exports = { TodoModel };
