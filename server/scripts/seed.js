const { PrismaClient } = require('../generated/prisma')
const prisma = new PrismaClient()
const coordinateUtils = require('../utils/coordinateUtils')

const seed = async () => {
    const IMG_WIDTH = 1988
    const IMG_HEIGHT = 3708
    try {

        const level = await prisma.level.create({
            data: {
                name: 'Multiverse',
                imgUrl: 'https://res.cloudinary.com/dhasbbkmn/image/upload/v1748849898/waldoMultiverse_q86cqh.jpg'
            }
        })
        console.log(`Level Inserted: ${JSON.stringify(level)}`)

        const ashPixelCoords = { x: 50, y: 2647 }
        const ferbPixelCoords = { x: 1919, y: 1886 }
        const spideyPixelCoords = { x: 1278, y: 3135 }

        const ashNormalizedCoords = coordinateUtils.normalizeCoordinates(ashPixelCoords.x, ashPixelCoords.y, IMG_WIDTH, IMG_HEIGHT)
        const ferbNormalizedCoords = coordinateUtils.normalizeCoordinates(ferbPixelCoords.x, ferbPixelCoords.y, IMG_WIDTH, IMG_HEIGHT)
        const spideyNormalizedCoords = coordinateUtils.normalizeCoordinates(spideyPixelCoords.x, spideyPixelCoords.y, IMG_WIDTH, IMG_HEIGHT)
        console.log(`Coorinates of ash: ${JSON.stringify(ashNormalizedCoords)}`)
        console.log(`Coorinates of ferb: ${JSON.stringify(ferbNormalizedCoords)}`)
        console.log(`Coorinates of spidey: ${JSON.stringify(spideyNormalizedCoords)}`)

        const characters = [
            {
                name: 'Ash Ketchum',
                potrait: 'https://res.cloudinary.com/dhasbbkmn/image/upload/v1748850433/waldoMultiverse_ash_bsrile.png',
                x: parseFloat(ashNormalizedCoords.x),
                y: parseFloat(ashNormalizedCoords.y),
                tolerance: 0.03,
                level: {
                    connect: {
                        id: level.id
                    }
                }
            },
            {
                name: 'Ferb',
                potrait: 'https://res.cloudinary.com/dhasbbkmn/image/upload/v1748850433/waldoMultiverse_ferb_t0d89w.png',
                x: parseFloat(ferbNormalizedCoords.x),
                y: parseFloat(ferbNormalizedCoords.y),
                tolerance: 0.03,
                level: {
                    connect: {
                        id: level.id
                    }
                }
            },
            {
                name: 'Spiderman',
                potrait: 'https://res.cloudinary.com/dhasbbkmn/image/upload/v1748850433/waldoMultiverse_spiderMan_fjwycc.png',
                x: parseFloat(spideyNormalizedCoords.x),
                y: parseFloat(spideyNormalizedCoords.y),
                tolerance: 0.03,
                level: {
                    connect: {
                        id: level.id
                    }
                }
            }
        ]

        for(const char of characters){
            const charInserted = await prisma.character.create({
                data: char
            })
            console.log(`Inserted character: ${JSON.stringify(charInserted)}`)
        }

        console.log('Seeding completed')
    } catch (err) {
        console.log(`Error seeding: ${err}`)
    } finally {
        await prisma.$disconnect()
    }
}

seed()