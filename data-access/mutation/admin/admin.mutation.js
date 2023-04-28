module.exports = (Admin) => {
  return {
    updateProfile: async ({ fields, adminId }) => {
      try {
        const data = await Admin.updateOne(
          {
            _id: adminId,
          },
          {
            $set: fields,
          },
          { returnOriginal: false }
        ).exec();
        return data;
      } catch (error) {
        throw error;
      }
    },
  };
};
