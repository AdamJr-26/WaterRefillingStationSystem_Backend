module.exports = (mutation)=>{
    return {
        verifyAdmin: async (req, res)=>{
            const {id} =req.query
            const admin = await mutation.verifyAdmin(id)
            res.status(200).send(admin)
        }
    }
}
