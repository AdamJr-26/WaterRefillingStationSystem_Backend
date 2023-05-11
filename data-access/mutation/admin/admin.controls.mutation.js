// updateControls
module.exports = (Controls) => {
  return {
    updateControls: async ({ fields, admin }) => {
      try {
        const data = await Controls.updateOne(
          {
            admin: admin,
          },
          {
            $set: fields,
          },
          { upsert: true }
        ).exec();
        console.log("datadatadata",data)
        return data;
      } catch (error) {
        throw error;
      }
    },
  };
};
