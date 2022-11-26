module.exports = (OTP) => {
  return {
    createApplyID: async ({ adminId, token, gmail }) => {
      const userId = adminId; // can use admin id as userId. we use userId for universal that can use also to personel, custoemr.
      const token = token;
      const gmail = gmail; // gmail of delivery personel.
      try {
        await OTP.create({
          userId,
          token,
          gmail,
        });
        const otp = await OTP.findOne({ userId, token, gmail });
        return { otp };
      } catch (error) {
        return { error };
      }
    },
  };
};
