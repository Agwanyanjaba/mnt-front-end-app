/**
 * Generates a timestamp in the format YYYYMMDDHHmmss.
 * This is commonly used for M-Pesa integrations.
 *
 * @returns {string} The formatted timestamp.
 */
export const getTimestamp = (): string => {
    const now = new Date();
    return (
        now.getFullYear().toString() +
        String(now.getMonth() + 1).padStart(2, "0") +
        String(now.getDate()).padStart(2, "0") +
        String(now.getHours()).padStart(2, "0") +
        String(now.getMinutes()).padStart(2, "0") +
        String(now.getSeconds()).padStart(2, "0")
    );
};
