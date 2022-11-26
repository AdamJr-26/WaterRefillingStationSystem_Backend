module.exports = (query, mutation, crypto, responseUtil) => {
  return {
    createApplyID: async (req, res) => {
      const adminId = req.user?._id;
      const gmail = req.body?.gmail;
      if (gmail && adminId) {
      }
      console.log("admin from createApplyID", adminId);
    },
  };
};
