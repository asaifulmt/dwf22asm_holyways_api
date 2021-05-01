const express = require('express')
const { register, login } = require('../controllers/auth')
const { createUserDonate, updateStatusDonate } = require('../controllers/userdonate')
const { createFund, getAllFunds, getFund, deleteFund, editFund } = require('../controllers/fund')
const { getUser, deleteUser } = require('../controllers/user')
const auth = require('../middlewares/auth')
const uploadImage = require('../middlewares/uploadImage')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/users', getUser)
router.delete('/user/:id', deleteUser)
router.get('/funds', getAllFunds)
router.get('/fund/:id', getFund)
router.post('/fund', auth, uploadImage, createFund)
router.delete('/fund/:id', auth, deleteFund)
router.patch('/fund/:id', auth, editFund)
router.patch('/fund/:fundId/:userId', auth, updateStatusDonate)

router.post('/donate/:fundId', auth, uploadImage, createUserDonate)

module.exports = router
