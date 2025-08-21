const {Router} = require('express')
const gameRouter = Router()
const gameCtrl = require('../controllers/gameController')
const { validateGameSession } = require('../middleware/validator')
const {gameLimiter} = require('../middleware/rateLimiter')

gameRouter.use(gameLimiter)

gameRouter.post('/game',
    validateGameSession,
    gameCtrl.game_session_post
)

gameRouter.put('/game/:gameId',
    gameCtrl.game_session_put
)

gameRouter.post('/game/validate',
    gameCtrl.validate_post
)

gameRouter.get('/game/:gameId/characters',
    gameCtrl.characters_get
)

module.exports = gameRouter 