const {PrismaClient} = require('../generated/prisma')
const primsa = new PrismaClient()

/**
 * To purge game records which are abandoned for a set time
 * @param {Date} expTime - expiration time
 */
const purgeAbandonedGame = async (expTime) => {
    try{
        const result = await primsa.game.deleteMany({
            where: {
                endedAt: null,
                startedAt: {
                    lt: expTime
                }
            }
        })
        console.log(`[Cleanup] Deleted ${result.count} abandoned games.`)
    }catch(err){
        console.log(`[CleanUp Error] ${err}`)
    }
}

module.exports = {
    purgeAbandonedGame
}