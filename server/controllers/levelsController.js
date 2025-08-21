const levelsModel = require('../models/levelsModel')

const levels_all_get = async (req, res, next) => {
    try {
        const levels = await levelsModel.getAllLevels()
        if (!levels || levels.length < 1) {
            return res.status(400).json({
                success: false,
                message: 'Levels not found',
                status: 400
            })
        }
        res.status(200).json({
            success: true,
            message: 'All levels fetched sucessfully',
            levels
        })
    } catch (err) {
        next(err)
    }
}

const level_get = async (req, res, next) => {
    const {levelId} = req.params
    try{
        const level = await levelsModel.getLevelById(levelId)
        if(!level){
            return res.status(400).json({ success: false, messsage: 'Level not found', status: 400})
        }
        res.status(200).json({
            success: true,
            level
        })
    }catch(err){
        next(err)
    }
}

module.exports = {
    levels_all_get,
    level_get
}