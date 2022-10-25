module.exports = {
    PORT: ()=>{
        return process.env.STATUS === "production"?
        process.env.PROD_PORT: process.env.DEV_PORT;
    },
    
}
