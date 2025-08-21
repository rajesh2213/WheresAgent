const { PrismaClient } = require('../generated/prisma')
const prisma = new PrismaClient()

/*
const getAllLevels = async () => {
    return await prisma.level.findMany({
        include: {
            characters: true
        }
    })
}
*/

const getAllLevels = async () => {

    const levels = await prisma.level.findMany({
        include: {
            characters: true
        }
    })

    const levelMap = new Map(levels.map(level => [level.id, {...level, leaders: []}]))

    const topGamesPerLevel = await prisma.$queryRaw`
        WITH GamesRanked AS (
            SELECT 
                g.id,
                g."playerName",
                g."startedAt",
                g."endedAt",
                (EXTRACT(EPOCH FROM g."endedAt") - EXTRACT(EPOCH FROM g."startedAt")) * 1000 AS duration,
                g."levelId",
                ROW_NUMBER() OVER (PARTITION BY g."levelId" 
                    ORDER BY ((EXTRACT(EPOCH FROM g."endedAt")) - (EXTRACT(EPOCH FROM g."startedAt"))) ASC) AS rn
            FROM games g
        )
        SELECT 
            id,
            COALESCE("playerName", 'Anonymous') AS name,
            "startedAt",
            "endedAt",
            duration,
            "levelId",
            rn
        FROM GamesRanked		
        WHERE rn <= 10;    
    `

    topGamesPerLevel.forEach(game => {
        const level = levelMap.get(game.levelId)
        if(level){
            level.leaders.push({
                id: game.id,
                name: game.name,
                startedAt: game.startedAt,
                endedAt: game.endedAt,
                duration: game.duration,
            })
        }
    })

    return Array.from(levelMap.values())
}

const getLevelById = async (id) => {
    return await prisma.level.findUnique({
        where: {
            id
        },
        include: {
            characters: true
        }
    })
}

module.exports = {
    getAllLevels,
    getLevelById
}