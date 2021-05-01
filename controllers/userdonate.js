const joi = require('joi')
const models = require('../models')

exports.createUserDonate = async (req, res) => {
  try {
    const { userId, files, body, params } = req

    if (!files.proofAttachment) {
      return res.status(400).send({
        status: 'failed',
        message: 'proofAttachment image field is required'
      })
    }

    const proofAttachment = files.proofAttachment[0].filename

    const schema = joi.object({
      donateAmount: joi.number().required()
    })

    const { error } = schema.validate({ ...body })

    if (error) {
      return res.status(400).send({
        status: "validation failed",
        message: error.details[0].message
      })
    }

    const userDonate = await models.userDonate.create({
      ...body,
      status: 'pending',
      proofAttachment,
      userId,
      fundId: Number(params.fundId)
    })

    res.status(200).send({ userDonate })

  } catch (err) {
    console.log(err)
    res.status(500).send({
      status: 'failed',
      message: 'server error'
    })
  }
}

exports.updateStatusDonate = async (req, res) => {
  try {
    const { fundId, userId } = req.params
    const { status } = req.body

    const userDonate = await models.userDonate.findOne({
      where: {
        userId,
        fundId
      }
    })

    if (!userDonate) {
      res.status(404).send({
        status: 'failed',
        message: 'userDonate not found'
      })
    }

    await userDonate.update({ status }, {
      where: {
        fundId,
        userId
      }
    })

    res.status(200).send({
      status: 'success',
      userDonate
    })
  } catch(err) {
    console.log(err)
    res.status(500).send({
      status: 'failed',
      message: 'server error'
    })
  }
}
