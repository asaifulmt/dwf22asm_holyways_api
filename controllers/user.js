const { user } = require ('../models')

exports.getUser = async (req, res) => {
  try {
    const users = await user.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'password'] 
      }
    })

    res.status(200).send({
      data: { users }
    })
  } catch (err) {
    console.log (err)
    res.status(500).send({
      status: 'failed',
      message: 'server error'
    })

  }
}

exports.deleteUser = async (req, res) => {
  try {

    const { id } = req.params

    const userSelected = await user.findOne({
      where: {
        id
      }
    })

    if (!userSelected) {
      return res.status(404).send({
        status: "failed",
        message: "user doesn't exist"
      })
    }

    await user.destroy({
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
