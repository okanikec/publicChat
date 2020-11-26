const express = require('express')
const router = express.Router()


router.get('/', (req, res ) => {
    res.render('home', {
        name: 'Ikechukwu Okanu'
    })
})

router.get('/about', (req, res ) => {
    res.render('about', {
        name: 'Ikechukwu Okanu'
    })
})

router.get('/chat', (req, res ) => {
    res.render('chat', {
        name: 'Ikechukwu Okanu'
    })
})

router.get('/contact', (req, res ) => {
    res.render('contact', {
        name: 'Ikechukwu Okanu'
    })
})
   

router.get('*', (req, res ) => {
    res.render('404', {
        title: '404',
        name: 'Ikechukwu Okanu',
        errorMessage: 'Page not Found'
    })
})

module.exports = router