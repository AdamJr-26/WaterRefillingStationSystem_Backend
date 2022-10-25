
module.exports = (stationModel)=>{
    return {
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