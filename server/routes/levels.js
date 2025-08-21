const { Router } = require('express')
const levelRouter = Router()
const levelsCtrl = require('../controllers/levelsController')
const {apiLimiter} = require('../middleware/rateLimiter')

levelRouter.use(apiLimiter)
levelRouter.get('/levels', levelsCtrl.levels_all_get)
levelRouter.get('/level/:levelId', levelsCtrl.level_get)

module.exports = levelRouter