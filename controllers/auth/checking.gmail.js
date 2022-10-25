module.exports = (query)=>{
    return {
        checkAdminEmail: async(req, res, next)=>{
            const {gmail} = req.body;
            const email = await query.getAdminGmailIfExisting(gmail)
            console.log(email)
            if(email.length){
                res.status(200).send({emailExists: true, message:"the email is already in use", email})
            }else{
                next()
            }
        }
    }
}