module.exports = (stationModel) => {
  return {
    registerStation: async (data) => {
      try {
        console.log(data)
        const register = new stationModel({admin: data});
        await register.save(err=>{
            if(err){
                return new Error(err)
            }
        });
        return { registered: true, register };
      } catch (err) {
        console.log("./mutation/auth.register.mutation", err);
        return { registered: false, err };
      }
    },
  };
};
