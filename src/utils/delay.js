
/**
 * Helper function to add artificial delay (simulates network latency)
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise<void>}
 */
export const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Random delay between min and max ms
 * @param {number} min - Minimum delay in ms
 * @param {number} max - Maximum delay in ms
 * @returns {Promise<void>}
 */
export const randomDelay = (min = 200, max = 1200) => {
  const ms = min + Math.random() * (max - min);
  return delay(ms);
};