var mongoose = require("mongoose");
mongoose.connect("mongodb+srv://prasanna:prasanna@password-wbnob.mongodb.net/test?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useCreateIndex: true
});
var conn = mongoose.connection;
var passNewSchema = new mongoose.Schema({
  password_category: { type: String, required: true, index: { unique: true } },
  website_name: { type: String, required: true },
  password_details: { type: String, required: true },
  date: { type: Date, default: Date.now }
});
var passNewModel = mongoose.model("password_details", passNewSchema);
module.exports = passNewModel;
