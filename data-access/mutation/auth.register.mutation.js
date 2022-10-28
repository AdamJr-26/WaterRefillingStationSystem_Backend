module.exports = (stationModel) => {
  return {
    registerStation: async (data) => {
      // try{

      //     await stationModel.register(new stationModel({username:data.gmail, admin:data}), data.password , (err, user)=>{
      //         if(err){
      //             console.log('errrrrrrrrrr', err)
      //             return {registered: false, err}
      //         }else{
      //             return {registered: true, user}
      //         }
      //     });
      //     return {registered: true}
      // }catch(err){
      //     return { registered: false, err, message:"error from else" };
      // }

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
  };
};
