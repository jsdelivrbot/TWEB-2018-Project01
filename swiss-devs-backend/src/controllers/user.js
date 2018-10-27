var User = require('../model/user');

//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('Greetings from the Test controller!');
};

/**
 * In order to have a better User Experience, all requests are done with
 * case insensitive. Because: VaUd and Vaud should return the same users.
 */

exports.all = function (req, res) {
    return User.find({});
};

exports.users_canton_count = function (canton) {
    return User.count({"canton": { $regex:  canton, $options: 'i'}});
}

exports.users_count_language = function (language) {
    return User.count({"languages": { $regex:  language, $options: 'i'}});
}

exports.users_canton = function (canton) {
    return User.find({"canton": { $regex: canton, $options: 'i'}});
};

exports.users_language = function (language) {
    return User.find({"languages": { $regex:  language, $options: 'i'}});
};

exports.users_canton_and_language = function (canton, langage) {
    console.log("Langage: " + canton + " - Canton: " + langage);
    return User.find({
        "canton": { $regex: canton, $options: 'i'},
        "languages": { $regex: langage, $options: 'i'}
    });
};

/*
Not used for the moment.
exports.user_details = function (req, res) {
    return User.find({ "id_github": req.params.id_github});
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
};*/