const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const config = require('config')
const app = express()
const mongoose = require('mongoose');
require('./services/passport')
app.use(bodyParser.json())
const path = require("path")
const cookieSession = require('cookie-session')
app.use(cors())
const passport = require("passport");
app.use(passport.initialize())


app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [config.get('cookieKey')]
    })
)
app.use(passport.initialize())
app.use(passport.session())

app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}))
app.get("/auth/google/callback", passport.authenticate('google'), (req, res) => {
    res.redirect('http://localhost:3000/')
})
app.get('/api/user', (req, res) => {
    res.send(req.user)
})

app.get('/api/logout', (req, res) => {
    req.logout() // logout() passport functionality h
    res.redirect('/')
})
app.use(express.static(path.join(__dirname, "client", "build")))
app.use('/api/todos', require('./routes/todoRoute'))
app.use('/api/users', require('./routes/userRoute'))
app.use('/api/auth', require('./routes/authRoute'))

const db = config.get('mongoURI');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
    .then(() => console.log("local MongoDB connected..."))
    .catch(() => console.log('error to connect db'));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    }
    )
}
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server is running on Port: " + PORT);
});

// taskkill /f /im node.exe
// mongodb://127.0.0.1:27017/task-manager-api
// const db = config.get('mongoURI');


// require('./services/passport')
// const cookieSession = require('cookie-session')
// const passport = require("passport");
// app.use(passport.initialize())
// app.use(express.static(__dirname + './public/'));

// app.use(
//     cookieSession({
//         maxAge: 30 * 24 * 60 * 60 * 1000,
//         keys: [config.get('cookieKey')]
//     })
// )
// app.use(passport.initialize())
// app.use(passport.session())

// app.get('/auth/google', passport.authenticate('google', {
//     scope: ['profile', 'email']
// }))
// app.get("/auth/google/callback", passport.authenticate('google'), (req, res) => {
//     res.redirect('http://localhost:3000/')
// })

// app.get('/auth/facebook', passport.authenticate('facebook'));


// app.get("/auth/facebook/callback", passport.authenticate('facebook'), (req, res) => {
//     res.redirect('http://localhost:3000/')

// })
// app.get('/auth/github', passport.authenticate('github', {
//     scope: ['profile', 'email']
// }))

// app.get('/auth/github/callback',
//     passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
//         res.redirect('http://localhost:3000/')
//     });

// app.get('/api/current_user', (req, res) => {
//     res.send(req.user)
// })

// app.get('/api/logout', (req, res) => {
//     req.logout() // logout() passport functionality h
//     res.redirect('/')
// })