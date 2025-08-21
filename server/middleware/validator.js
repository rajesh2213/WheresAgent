const { body, param, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            message: 'Validation failed',
            errors: errors.array() 
        });
    }
    next();
};

const validateGameSession = [
    body('playerName')
        .optional({ nullable: true, checkFalsy: true })
        .if(body('playerName').exists())
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Player name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z0-9\s]*$/)
        .withMessage('Player name can only contain letters, numbers, and spaces'),
    
    body('levelId')
        .isUUID()
        .withMessage('Invalid level ID'),
    
    validate
];

const validateCharacterSelection = [
    body('gameId')
        .isUUID()
        .withMessage('Invalid game ID'),
    
    body('characterId')
        .isUUID()
        .withMessage('Invalid character ID'),
    
    body('clickCoords')
        .isObject()
        .withMessage('Click coordinates must be an object'),
    
    body('clickCoords.x')
        .isFloat({ min: 0, max: 1 })
        .withMessage('X coordinate must be between 0 and 1'),
    
    body('clickCoords.y')
        .isFloat({ min: 0, max: 1 })
        .withMessage('Y coordinate must be between 0 and 1'),
    
    validate
];

const validateLevelId = [
    param('levelId')
        .isUUID()
        .withMessage('Invalid level ID'),
    
    validate
];

module.exports = {
    validateGameSession,
    validateCharacterSelection,
    validateLevelId
}; 