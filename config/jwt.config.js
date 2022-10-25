
module.exports = {
    secretKey: "123",
    mongoUrl: `mongodb+srv://admin:${process.env.PASSWORD}@cluster0.8jghjix.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
}