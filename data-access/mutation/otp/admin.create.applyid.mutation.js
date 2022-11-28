module.exports = (OTP) => {
  return {
    createApplyID: async ({ adminId, token, gmail }) => {
      const payload = {
        userId: adminId, // can use admin id as userId. we use userId for universal that can use also to personel, custoemr.
        token: token,
        gmail: gmail, // gmail of delivery personel.
      };
      try {
        await OTP.create(payload);
        const otp = await OTP.findOne(payload)
          .select(["userId", "token", "gmail"])
          .exec();
        return { otp };
      } catch (error) {
        return { error };
      }
    },
  };
};
