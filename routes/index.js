var express = require("express");
var router = express.Router();
var bcyrpt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var userModel = require("../module/user");
var passCatModel = require("../module/password_category");
var passNewModel = require("../module/add_pass");
var passCat = passCatModel.find({});
var getAllPass = passNewModel.find({});
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./scratch");
}

/* GET home page. */

function checkloginUser(req, res, next) {
  var userToken = localStorage.getItem("userToken");
  try {
    var decoded = jwt.verify(userToken, "loginToken");
  } catch (err) {
    res.redirect("/");
  }
  next();
}

function checkEmail(req, res, next) {
  var email = req.body.email;
  var checkexitEmail = userModel.findOne({ email: email });
  checkexitEmail.exec((err, data) => {
    if (err) throw err;
    if (data) {
      return res.render("signup", {
        title: "Password management System",
        msg: "E-mail already exits!"
      });
    }
    next();
  });
}
router.get("/", function(req, res, next) {
  var loginUser = localStorage.getItem("loginUser");
  if (loginUser) {
    res.redirect("./dashboard");
  } else res.render("index", { title: " Password Management System", msg: "" });
});
router.post("/", function(req, res, next) {
  var user = req.body.uname;
  var password = req.body.pass;
  var checkuser = userModel.findOne({ username: user });
  checkuser.exec((err, data) => {
    if (err) throw err;
    var getUserId = data._id;
    if (password == data.password) {
      var token = jwt.sign({ userId: getUserId }, "loginToken");
      localStorage.setItem("userToken", token);
      localStorage.setItem("loginUser", user);
      res.redirect("dashboard");
    } else {
      res.render("index", {
        title: "Password Management System",
        msg: "Invalid username or password!"
      });
    }
  });
});
router.get("/signup", function(req, res, next) {
  var loginUser = localStorage.getItem("loginUser");
  if (loginUser) {
    res.redirect("./dashboard");
  } else res.render("signup", { msg: "" });
});
router.post("/signup", checkEmail, function(req, res, next) {
  var username = req.body.uname;
  var fullname = req.body.fname;
  var email = req.body.email;
  var password = req.body.pass;
  var cpass = req.body.cpass;
  if (password != cpass) {
    res.render("signup", {
      title: "Password Management System",
      msg: "Password Does not Match"
    });
  } else {
    // password = bcyrpt.hashSync(req.body.password, 10);
    var userDetails = new userModel({
      username: username,
      fname: fullname,
      email: email,
      password: password
    });
    userDetails.save((err, document) => {
      if (err) throw err;
      res.render("signup", {
        title: "Password Management System",
        msg: "User Registration Successfully"
      });
    });
  }
});
router.get("/passCat", checkloginUser, function(req, res, next) {
  passCat.exec(function(err, data) {
    if (err) throw err;
    res.render("password_category", {
      loginUser: localStorage.getItem("loginUser"),
      records: data
    });
  });
});
router.get("/add-new-category", checkloginUser, function(req, res, next) {
  res.render("addNewCategory", {
    loginUser: localStorage.getItem("loginUser"),
    msg: "",
    title: "Password Management System"
  });
});
router.post("/add-new-category", function(req, res, next) {
  var loginUser = localStorage.getItem("loginUser");
  var passCatName = req.body.cname;
  var passCatDetail = new passCatModel({
    password_category: passCatName
  });
  passCatDetail.save(function(err, data) {
    if (err) throw err;
    res.render("addNewCategory", {
      title: "Password Management System",
      msg: "New Category Added",
      loginUser: loginUser
    });
  });
});
/*code to add new Password in a PMS Project*/
router.get("/addnewpass", checkloginUser, function(req, res, next) {
  passCat.exec(function(err, data) {
    if (err) throw err;
    res.render("addNewPassword", {
      loginUser: localStorage.getItem("loginUser"),
      records: data,
      msg: ""
    });
  });
});
router.post("/addnewpass", function(req, res, next) {
  var loginUser = localStorage.getItem("loginUser");
  var pass_cat = req.body.pass_cat;
  var webname = req.body.webname;
  var pass_details = req.body.detail;
  var password_details = new passNewModel({
    password_category: pass_cat,
    website_name: webname,
    password_details: pass_details
  });

  password_details.save(function(err, doc) {
    passCat.exec(function(err, data) {
      if (err) throw err;
      res.render("addNewPassword", {
        title: "Password Management System",
        records: data,
        loginUser: loginUser,
        msg: "Password Details Inserted Successfully"
      });
    });
  });
});
router.get("/viewallpass", checkloginUser, function(req, res, next) {
  getAllPass.exec(function(err, data) {
    if (err) throw err;
    res.render("viewAllPass", {
      loginUser: localStorage.getItem("loginUser"),
      records: data
    });
  });
});
router.get("/dashboard", checkloginUser, function(req, res, next) {
  var loginUser = localStorage.getItem("loginUser");
  res.render("dashboard", {
    title: "Password Management System ",
    loginUser: loginUser,
    msg: ""
  });
});
router.get("/logout", function(req, res, next) {
  localStorage.removeItem("loginUser");
  localStorage.removeItem("userToken");
  res.redirect("/");
});
router.get("/deleteCat/:id", function(req, res, next) {
  var loginUser = localStorage.getItem("loginUser");
  var passcat_id = req.params.id;
  var passdelete = passCatModel.findByIdAndDelete(passcat_id);
  passdelete.exec(function(err, data) {
    if (err) throw err;
    res.redirect("/passCat");
  });
});
router.post("/editCat/:id", function(req, res, next) {
  var loginUser = localStorage.getItem("loginUser");
  var id = req.params.id;
  var newPassCat = req.body.cname;
  var updatePass = passCatModel.findByIdAndUpdate(id, {
    password_category: newPassCat
  });
  updatePass.exec(function(err, data) {
    if (err) throw err;
    res.redirect("/passcat");
  });
});
router.get("/editCat/:id", function(req, res, next) {
  var loginUser = localStorage.getItem("loginUser");
  var id = req.params.id;
  var getPaswordCat = passCatModel.findById(id);
  console.log(getPaswordCat);
  getPaswordCat.exec(function(err, data) {
    if (err) throw err;
    console.log(data.password_category);
    res.render("edit_Pass_Cat", {
      title: "Password Management System",
      loginUser: loginUser,
      records: data
    });
  });
});
router.get("/editPass/:id", function(req, res, next) {
  var id = req.params.id;
  var pass = passNewModel.findById(id);
  pass.exec(function(err, data) {
    if (err) throw err;
    res.render("editPass", {
      title: "Password Management System",
      loginUser: localStorage.getItem("loginUser"),
      data: data
    });
  });
});
router.post("/editPass/:id", function(req, res, next) {
  var id = req.params.id;
  var passDetail = req.body.detail;
  var webname = req.body.webname;
  var updatedpass = passNewModel.findByIdAndUpdate(id, {
    website_name: webname,
    password_details: passDetail
  });
  updatedpass.exec(function(err, data) {
    if (err) throw err;
    res.redirect("/viewallpass");
  });
});
router.get("/deletePass/:id", function(req, res, next) {
  var id = req.params.id;
  var passDelete = passNewModel.findByIdAndDelete(id);
  passDelete.exec(function(err, data) {
    if (err) throw err;
    res.redirect("/viewallpass");
  });
});
module.exports = router;
