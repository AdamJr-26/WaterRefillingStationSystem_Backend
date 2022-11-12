module.exports = (OTP) => {
  return {
    createOtp: async (data) => {
      const { gmail, token, userId } = data;
      try {
        // await OTP.createIndexes (
        //   { createdAt: 1},
        //   {
        //     expireAfterSeconds: 500,
        //   }
        // );
        await OTP.create({
          userId,
          gmail,
          token,
        });
        const otp = await OTP.findOne(data).exec();
        return {otp}
      } catch (error) {
        return { error };
      }
    },
  };
};
