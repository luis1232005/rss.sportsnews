/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('index', { title: 'Index' });
};

exports.login = function(req, res){
    res.render('login', { title: '�û���½'});
};

exports.doLogin = function(req, res){
    var user={
        username:'admin',
        password:'admin'
    }

    if(req.body.username===user.username && req.body.password===user.password){
        req.session.user=user;
        return res.redirect('/home');
    } else {
        req.session.error='�û��������벻��ȷ';
        return res.redirect('/login');
    }

};

exports.logout = function(req, res){
    req.session.user=null;
    res.redirect('/');
};

exports.home = function(req, res){
    res.render('home', { title: 'Home'});
};