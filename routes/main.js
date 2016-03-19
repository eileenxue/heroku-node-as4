var router = require('express').Router();

router.get('/', function (req, res) {
    res.render('main/home');

})

router.get('/about', function (req, res) {
    res.render('main/about');
})

/*router.get('/products/:id', function (req, res, next) {
    res.render('main/about');
})*/

router.get('/chat', function (req, res) {
    res.render('main/chat');
})


module.exports = router;