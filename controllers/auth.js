const joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { user } = require('../models')

const secretKey = 'inikuncirahasia'

exports.register = async (req, res) => {
  try {
    const { email, password, fullName } = req.body
    const checkEmail = await user.findOne({
      where: {
        email
      }
    })


    const schema = joi.object({
      fullName: joi.string().min(3).required(),
      email: joi.string().email().required(),
      password: joi.string().required(),
    })

    const { error } = schema.validate(req.body);

    if (error) {
      return res.send({
        status: "Validation Failed",
        message: error.details[0].message
      })
    }

    if (checkEmail) {
      return res.send({
        status: "Failed",
        message: "Email Already Registered",
      })
    }

    const hashStrength = 10
    const hashedPassword = await bcrypt.hash(password, hashStrength)

    const dataUser = await user.create({
      fullName,  
      email,
      password: hashedPassword
    })

    const token = jwt.sign({
      id: dataUser.id,
      fullName: dataUser.fullName,
      email: dataUser.email
    }, secretKey)

    res.send({
      status: "Success",
      data: {
        user: {
            fullName: dataUser.fullName,
            token
        }
      }
    })
  } catch(err) {
    console.log(err)
    res.status(500).send({
      status: "failed",
      message: "server error"
    })
  }
}
