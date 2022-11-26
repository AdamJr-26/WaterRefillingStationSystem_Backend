module.exports = (OTP) => {
  return {
    deleteOneOTP: async (payload) => {
      const filter = {
        userId: payload.userId,
      };
      try {
        const deleteOTPDoc = await OTP.deleteOne(filter).exec();
        return { deleteOTPDoc };
      } catch (error) {
        return { error };
      }
    },
  };
};
