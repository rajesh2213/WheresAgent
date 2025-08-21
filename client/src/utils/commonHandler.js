
/**
 * 
 * @param {Date|String} value 
 * @returns {Boolean} - true if it is valid date; false if not
 */
const isValidDate = (value) => {
    const date = new Date(value);
    return !isNaN(date.getTime());
};

/**
 * 
 * @param {Date|String} startedAt - Time when the game started
 * @param {Date|String} endedAt - Time when the game ended
 * @returns {String} - Total time the game lasted
 */
export function getTimeTaken(startedAt, endedAt) {
    if (!isValidDate(startedAt) && !isValidDate(endedAt)) return;
    const startTime = new Date(startedAt)
    const endTime = new Date(endedAt)
    const diffMs = endTime - startTime
    const totalSec = diffMs / 1000
    const minutes = Math.floor(totalSec / 60)
    const seconds = Math.floor(totalSec % 60)
    const milliseconds = Math.floor(diffMs % 1000)
    const timeTaken = minutes > 0 ? `${minutes}m ${seconds}s ${milliseconds}ms`
        : seconds > 0 ? `${seconds}s ${milliseconds}ms` 
        : `${milliseconds}ms`
    return timeTaken
}