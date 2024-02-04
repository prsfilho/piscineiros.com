export const environment = {
    server: {
        port: process.env.SERVER_PORT || 3000
    },    
    db: {
        url: process.env.URL || 'mongodb://localhost/piscineiros'
    },
    security: {
        saltRounds: process.env.SALT_ROUNDS || 10
    }
}