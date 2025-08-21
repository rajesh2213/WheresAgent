/**
 * @param {Number}x - x coordinate in pixel
 * @param {Number}y - y coordinate in pixel
 * @param {Number}imgWidth - width of the image in pixels
 * @param {Number}imgHeight - height of the image in pixels
 * @returns {{x: number, y: number}} normalized coordinates between 0 and 1
 */
function normalizeCoordinates(x, y, imgWidth, imgHeight) {
    return {
        x: (x / imgWidth).toFixed(4),
        y: (y / imgHeight).toFixed(4)
    }
}

/**
 * Convert normalized coordinates (0 to 1) back to pixel values
 * @param {number} normX - normalized x between 0 and 1
 * @param {number} normY - normalized y between 0 and 1
 * @param {number} imageWidth - width of the image in pixels
 * @param {number} imageHeight - height of the image in pixels
 * @returns {{x: number, y: number}} pixel coordinates
 */
function denormalizeCoordinates(normX, normY, imageWidth, imageHeight) {
    return {
        x: Math.round(normX * imageWidth),
        y: Math.round(normY * imageHeight),
    };
}

/**
 * Calculate Euclidean distance between two points
 * @param {number} x1 - x coordinate of first point  (user-clicked)
 * @param {number} y1 - y coordinate of first point  (user-clicked)
 * @param {number} x2 - x coordinate of second point (character-stored)
 * @param {number} y2 - y coordinate of second point (character-stored)
 * @returns {number} distance between the two points
 */
function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

/**
 * @param {number} clickX - x normalized coordinate of first point  (user-clicked)
 * @param {number} clickY - y normalized coordinate of first point  (user-clicked)
 * @param {number} charX - x normalized coordinate of second point (character-stored)
 * @param {number} charY - y normalized coordinate of second point (character-stored)
 * @param {Number} tolerance - tolerance (e.g., 0.02 for 2%)
 * @returns {boolean} true if click is inside tolerance radius else false
 */
function isWithinTolerance(clickX, clickY, charX, charY, tolerance) {
    const dist = distance(clickX, clickY, charX, charY)
    return dist <= tolerance
}

module.exports = {
    normalizeCoordinates,
    denormalizeCoordinates,
    distance,
    isWithinTolerance
};