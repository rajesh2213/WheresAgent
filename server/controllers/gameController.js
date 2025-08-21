const { validate } = require('node-cron')
const gameModel = require('../models/gameModel')
const { isWithinTolerance } = require('../utils/coordinateUtils')

const game_session_post = async (req, res, next) => {
    const { playerName, levelId } = req.body
    try {
        const game = await gameModel.createGameSession({ playerName, levelId })
        if (!game) {
            return res.status(400).json({
                success: false,
                message: 'Failed to create a game session',
                status: 400
            })
        }
        console.log(game)
        res.status(200).json({
            success: true,
            game
        })
    } catch (err) {
        next(err)
    }
}

const validate_post = async (req, res, next) => {
    const { gameId, characterId, clickCoords } = req.body;

    try {
        const game = await gameModel.getGameById(gameId);
        const character = await gameModel.validateSelection(characterId);

        if (!game || !character || game.levelId !== character.levelId) {
            return res.status(400).json({
                success: false,
                message: 'Invalid game or character reference',
            });
        }

        const isValidClick = isWithinTolerance(
            clickCoords.x,
            clickCoords.y,
            character.x,
            character.y,
            character.tolerance
        );

        if (!isValidClick) {
            return res.status(200).json({
                success: true,
                validate: false,
                message: 'Character not found at clicked coordinates',
            });
        }

        const foundCharacter = await gameModel.logFoundCharacter(gameId, characterId);
        console.log(foundCharacter)
        return res.status(200).json({
            success: true,
            validate: true,
            foundCharacter,
        });

    } catch (err) {
        next(err);
    }
};

const characters_get = async (req, res, next) => {
    const { gameId } = req.params
    try {
        const characters = await gameModel.getCharactersByGameID(gameId)
        if(!characters){
            return res.status(404).json({
                success: false,
                message: 'Game not found',
                status: 404
            })
        }
        return res.status(200).json({
            success: true,
            characters: characters || null
        })
    } catch (err) {
        if (err.message === 'Game not found') {
            return res.status(404).json({
                success: false,
                message: 'Game not found',
                status: 404
            })
        }
        next(err)
    }
}

const game_session_put = async (req, res, next) => {
    const {gameId} = req.params
    try{
        const game = await gameModel.logGame(gameId)
        if(!game){
            return res.status(400).json({
                success: false,
                message: 'Game not found',
                status: 400
            })
        }
        res.status(200).json({
            success: true,
            game
        })
    }catch(err){
        next(err)
    }
}

module.exports = {
    game_session_post,
    game_session_put,
    validate_post,
    characters_get
}