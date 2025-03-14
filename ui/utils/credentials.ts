export const Credentials = {
    VALID_USER: {
        username: process.env.STANDARD_USER || 'standard_user',
        password: process.env.STANDARD_PASSWORD || 'secret_sauce'
    },
    INVALID_USER: {
        username: 'invalid_user',
        password: 'wrong_password'
    }
};