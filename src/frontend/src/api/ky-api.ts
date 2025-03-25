import ky from "ky";

export const api = ky.create({
    prefixUrl: '/api', // Use relative URL to ensure it works on all pages
    throwHttpErrors: false, // Apply globally
    headers: {
        'Content-Type': 'application/json',
    },
});