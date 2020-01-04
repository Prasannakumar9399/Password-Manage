var mongoose = require("mongoose");
mongoose.connect("mongodb+srv://prasanna:prasanna@password-wbnob.mongodb.net/test?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useCreateIndex: true
});
var conn = mongoose.connection;
var passCatSchema = new mongoose.Schema({
  password_category: { type: String, required: true, index: { unique: true } },
  date: { type: Date, default: Date.now }
});
var passCatModel = mongoose.model("password_categories", passCatSchema);
module.exports = passCatModel;
