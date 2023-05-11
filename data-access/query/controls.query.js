module.exports = (Controls) => {
  return {
    getControls: async ({ admin }) => {
      try {
        const data = await Controls.findOne({
          admin: admin,
        }).exec();
        return data;
      } catch (error) {
        throw error;
      }
    },
  };
};
    