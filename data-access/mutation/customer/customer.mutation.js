module.exports = (Customer) => {
  return {
    customerUpdateAddress: async ({ gmail, updatePayload }) => {
      try {
        const data = await Customer.findOneAndUpdate(
          {
            gmail: gmail,
          },
          {
            $set: {
              address: updatePayload,
            },
          },
          { returnOriginal: false }
        );
        return data;
      } catch (error) {
        throw error;
      }
    },
  };
};
