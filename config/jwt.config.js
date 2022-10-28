const config = {
    secretKey: "12345-67890-09876-54321",
    mongoUrl: `mongodb+srv://admin:${process.env.PASSWORD}@cluster0.8jghjix.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
}
const underscoreId = '_id';

module.exports = {
    config,
    underscoreId,
}
