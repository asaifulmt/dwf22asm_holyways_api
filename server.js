const express = require('express')
const router = require('./routers')

const app = express()

app.use(express.json())

app.get('/', (_, res) => res.send('server is alive!'))
app.use('/api/v1', router)

const port = 5000

app.listen(port, () => console.log(`Running on port ${port}`))
