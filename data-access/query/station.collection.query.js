
module.exports = (stationModel)=>{
    return {
        checkAdminIfNotVerified: async(id)=>{
            try{
              const admin = await stationModel.findOne({"admin._id": id, "admin.verified":true}).select(["admin"]).exec()
              return {data:admin.admin}
            }catch(error){
              return {error}
            }
          },
        isAdminExist: async({gmail, password})=>{
            try{
                const data = await stationModel.findOne({"admin.gmail": gmail}).select(["admin"]).exec();
                return {data}
            }catch(error){
                return {error}
            }

        },
        getAdminGmailIfExisting: async (gmail) => {
            try {
              const email = await stationModel
                .findOne({ "admin.gmail": gmail })
                .select(["admin.gmail"])
                .exec();
      
              return {email}
            } catch (err) {
              console.log(err)
              return {err};
            }
          },
          getStationByID: async(id)=>{
            try{
                const station = await stationModel.findOne({"stations.admin.station_id": id}).exec()
                
                return {success: true, station}
            }catch(err){
                return {success: false, err, station}
            }
        }
    }
}