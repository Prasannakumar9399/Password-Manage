const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://prasanna:prasanna@password-wbnob.mongodb.net/test?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useCreateIndex: true
});
var conn = mongoose.connection;
var userSchema = new mongoose.Schema({
  username: { type: String, required: true, index: { unique: true } },
  fname: { type: String, required: true },
  email: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  date: { type: Date, default: Date.now }
});
var userModel = mongoose.model("users", userSchema);
module.exports = userModel;
