const express = require('express');
const router = express.Router();
const multer = require('multer')
const User = require('../models/userModel');
const auth = require('../middleware/auth')

// server ma store krne k lye
// const DIR = './images/';
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, DIR);
//   },
//   filename: (req, file, cb) => {
//     const fileName = file.originalname.toLowerCase().split(' ').join('-');
//     cb(null, Math.random().toFixed(5) + '-' + fileName)
//   }
// });

const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype == 'image/png' || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error({ msg: 'Only .png, .jpg and .jpeg format allowed!' }));
    }
  }
})

router.post('/avatar', auth, upload.single('image'), async (req, res) => {
  try {
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send({ msg: 'upload successfully' })
  }
  catch (e) {
    res.status(400).send({ msg: 'cannot uzzploaded' })
  }
})

//get user details
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      throw new Error
    }
    res.status(200).send(user)
  }
  catch (e) {
    res.status(400).send(e)
  }
})

router.get('/:id/avatar', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    // res.set('Content-Type', 'image/png')
    res.status(200).send(user.avatar)
  }
  catch (e) {
    res.status(400).send({msg:'cannot get image'})
  }
})

router.post('/', async (req, res) => {
  const user = new User(req.body)
  try {
    const token = await user.generateAuthToken()
    res.status(201).send({ user, token })
    await user.save()
  }
  catch (e) {
    res.status(400).json({ msg: 'User already exists' });
  }
})
module.exports = router;