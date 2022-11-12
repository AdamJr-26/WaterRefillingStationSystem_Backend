module.exports = (stationModel, Personel) => {
  return {
    registerStation: async (data) => {
      try {
        console.log(data);
        const register = new stationModel({ admin: data });
        await register.save((err) => {
          if (err) {
            throw new Error(err)
          }
        });
        console.log('register', register)
        return { success: true, admin: register?.admin?.gmail, id: register?.admin?._id };
      } catch (err) {
        console.log("./mutation/auth.register.mutation", err);
        return { success: false, err };
      }
    },
    registerPersonel: async(data)=>{
      try{
        const registerData = await new Personel(data)
        await registerData.save(err=>{
          if(err){
            throw new Error(err)
          }
        })
        return {registerData}
      }catch(error){
        return {error}
      }
    }
  };
};
