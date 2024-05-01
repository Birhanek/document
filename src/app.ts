import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import morgan from 'morgan'


// User defined function
import apiContentType from './middlewares/apiContentType'
import apiErrorHandler from './middlewares/apiErrorHandler'
import documentRouter from './routes/document.route'

dotenv.config({ path: '.env' })
const app = express()

// Express configuration
app.set('port', process.env.PORT)
app.use(morgan('dev'))

// Global middlewares
app.use(apiContentType)
app.use('/public', express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine",'ejs')


app.get('/api',(req,res,nex)=>{
    res.render("index")
})

app.use('/api/v1',documentRouter)

app.use(apiErrorHandler)

export default app
