var User = require('../model/user');

//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('Greetings from the Test controller!');
};



exports.all = function (req, res) {
    User.find(req.params.langage, function (err, user) {
        if (err) return next(err);
        res.send(user);
    })
};

exports.users_canton = function (req, res) {
    User.findByLocation(req.params.location, function (err, user) {
        if (err) return next(err);
        res.send(user);
    })
};

exports.users_langage = function (req, res) {
    User.findByLangage(req.params.langage, function (err, user) {
        if (err) return next(err);
        res.send(user);
    })
};

exports.user_details = function (req, res) {
    User.findByIdGithub(req.params.id_github, function (err, user) {
        if (err) return next(err);
        res.send(user);
    })
};

exports.user_update = function (req, res) {
    User.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, user) {
        if (err) return next(err);
        res.send('User udpated.');
    });
};

exports.user_delete = function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};