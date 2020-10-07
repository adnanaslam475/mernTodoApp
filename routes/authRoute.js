const express = require('express');
const router = express.Router();
const User = require('../models/userModel')
const auth = require('../middleware/auth')
const bcrypt = require('bcryptjs')
const Todo = require('../models/todoModel')

//login
router.post('/', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(422).json({ msg: "please add all the fields" })
  } User.findOne({ email })
    .then(user => {
      if (!user) return res.status(400).json({ msg: 'user does not exists' });
      bcrypt.compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch) { return res.status(400).json({ msg: 'Invalid password' }) }
          const token = user.generateAuthToken()
            .then(token =>
              res.json({
                user,
                token
              })
            )
        })
    })
})

router.get('/user', auth, (req, res) => {
  User.findById(req.user.id)
    .select('-password')
    .then(user => res.json(user))
})

router.post('/update:/id', auth, (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      bcrypt.compare(req.body.oldPassword, user.password)
        .then(pass => {
          if (!pass)
            res.status().send({ msg: 'change not succesfully' })
        })
    })
})

//delete user require psasword
router.post('/delete/:id', auth, (req, res) => {
  const { password } = req.body
  User.findById(req.params.id)
    .then(user => {
      bcrypt.compare(password, user.password)
        .then(pass => {
          if (!pass)
            return res.status(401).send({ msg: 'Incorrect password' })
          else {
            user.remove()
              .then(r => {
                Todo.deleteMany({ owner: req.user._id })
                  .then(() => {
                    res.status(200).json({ msg: 'user deleted sucefully' })
                  })
              })
          }
        })
    })
})

router.post('/update/:id', auth, (req, res) => {
  const { email, oldPassword, newPassword } = req.body
  User.findById(req.params.id)
    .then(user => {
      if (req.body.email) {
        user.email = email
        user.save()
          .then(() => { res.status(200).send({ msg: 'email has been changed' }) }
          )
      }
    else if (req.body.oldPassword) {
        bcrypt.compare(oldPassword, user.password)
          .then(pass => {
            if (!pass)
              return res.status(401).send({ msg: 'Incorrect old passcxword' })
            user.password = newPassword
            user.save()
              .then(() => { res.status(200).send({ msg: 'password has been changed' }) }
              )
          })
      }
    })
})

//get all users
function getStandardResponse(status, message, data) {
  return {
    status: status,
    message: message,
    data: data
  }
}
router.get('/allusers', async (req, res) => {
  const users = await User.find().sort('-password');
  return res.json(getStandardResponse(true, "", users));
})

router.post('/logout', async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token
    })
    await req.user.save()
    res.status(200).send({ msg: 'logout successfully' })
  }
  catch (e) {
    res.status(500).send({ msg: 'authorization required frm lgout' })
  }
})

module.exports = router;