const express = require('express')
const { register, login } = require('../controllers/auth')
const { getUser, deleteUser } = require('../controllers/user')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/users', getUser)
router.delete('/user/:id', deleteUser)

module.exports = router
