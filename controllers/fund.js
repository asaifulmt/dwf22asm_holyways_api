const joi = require('joi')
const { sequelize } = require('../models')
const models = require('../models')

exports.createFund = async (req, res) => {
  try {
    const { userId, files, body } = req

    if (!files.thumbnail) {
      return res.status(400).send({
        status: 'failed',
        message: 'thumbnail image field is required'
      })
    }

    const thumbnail = files.thumbnail[0].filename

    const schema = joi.object({
      title: joi.string().required(),
      goal: joi.number().required(),
      description: joi.string().required()
    })

    const { error } = schema.validate({ ...body })

    if (error) {
      return res.status(400).send({
        status: "validation failed",
        message: error.details[0].message
      })
    }

    const fund = await models.fund.create({
      ...body,
      thumbnail,
      userId
    })

    res.status(200).send({ fund })

  } catch (err) {
    console.log(err)
    res.status(500).send({
      status: 'failed',
      message: 'server error'
    })
  }
}

exports.getAllFunds = async (req, res) => {
  try {
    const funds = await models.fund.findAll({
      include: {
        model: models.user,
        as: 'usersDonate',
        attributes: [
          'id',
          'fullName',
          'email',
          [sequelize.literal('`usersDonate->userDonate`.donateAmount'), 'donateAmount'],
          [sequelize.literal('`usersDonate->userDonate`.status'), 'status'],
          [sequelize.literal('`usersDonate->userDonate`.proofAttachment'), 'proofAttachment'],
          [sequelize.literal('`usersDonate->userDonate`.createdAt'), 'donatedAt']
        ],
        through: {
          model: models.userDonate,
          attributes: []
        }
      }
    })

    res.status(200).send({ funds })
  } catch (err) {
    console.log(err)
    res.status(500).send({
      status: 'failed',
      message: 'server error'
    })
  }
}

exports.getFund = async (req, res) => {
  try {
    const { id } = req.params
    const fund = await models.fund.findOne({
      where: { id },
      include: {
        model: models.user,
        as: 'usersDonate',
        attributes: [
          'id',
          'fullName',
          'email',
          [sequelize.literal('`usersDonate->userDonate`.donateAmount'), 'donateAmount'],
          [sequelize.literal('`usersDonate->userDonate`.status'), 'status'],
          [sequelize.literal('`usersDonate->userDonate`.proofAttachment'), 'proofAttachment'],
          [sequelize.literal('`usersDonate->userDonate`.createdAt'), 'donatedAt']
        ],
        through: {
          model: models.userDonate,
          attributes: []
        }
      }
    })

    res.status(200).send({ fund })
  } catch (err) {
    console.log(err)
    res.status(500).send({
      status: 'failed',
      message: 'server error'
    })
  }
}

exports.editFund = async (req, res) => {
  try {
    const { id } = req.params
    // const { title, description, goal } = req.body

    const fund = await models.fund.findOne({
      where: {
        id
      }
    })

    if(!fund) {
      return res.status(404).send({
        status: 'failed',
        message: 'fund not Found'
      })
    }

    await fund.update(req.body, {
      where: {
        id: fund.id
      }
    })
    
    res.status(200).send({
      status: 'update Success',
      fund
    })
  
  } catch (err) {
    console.log(err)
    res.status(500).send({
      status: 'failed',
      message: 'server error'
    })
  }
}

exports.deleteFund = async (req, res) => {
  try {
    const { id } = req.params

    const fund = await models.fund.findOne({
      where: {
        id
      }
    })

    if (!fund) {
      return res.status(404).send({
        status: 'failed',
        message: 'fund not found'
      })
    }

    await models.fund.destroy({
      where: {
        id
      }
    })

    res.status(200).send({
      status: 'success',
      data: {
        id
      }
    })

  } catch (err) {
    console.log(err)
    res.status(500).send({
      status: 'failed',
      message: 'server error'
    })
  }
}
