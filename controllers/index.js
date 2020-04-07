const 
    path = require('path'),
    authConroller = require(path.join(__dirname, 'auth.controller')),
    userController = require(path.join(__dirname, 'user.controller')),
    adminController = require(path.join(__dirname,'admin.controller'));

module.exports = {
    authConroller,
    userController,
    adminController
}