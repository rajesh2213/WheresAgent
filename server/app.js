require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const cron = require('node-cron')
const helmet = require('helmet')

const errorHandler = require('./middleware/errorHandler')
const {purgeAbandonedGame} = require('./utils/purge')
const levels = require('./routes/levels')
const game = require('./routes/game')

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"]
        }
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: { policy: 'same-site' },
    dnsPrefetchControl: true,
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    },
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xssFilter: true
}))

// Body parsing middleware
app.use(express.json({ limit: '40mb' }))
app.use(cookieParser())
app.use(express.urlencoded({ extended: true, limit: '40mb' }))

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400 // 24 hours
}))

// Purge abandoned games
const exp_date_one_hour = new Date(Date.now() - 1000 * 60 * 60)
cron.schedule('*/10 * * * *', () => {
    purgeAbandonedGame(exp_date_one_hour)
})

// Routes
app.use('/', levels, game)

// Error handling
app.use(errorHandler)

if (require.main === module) {
    app.listen(process.env.PORT_URL, () => {
        console.log(`Server is running on port ${process.env.PORT_URL}`)
    })
}

module.exports = app;