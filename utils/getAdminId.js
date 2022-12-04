// gamit ang req.user kukunin natin ang admin id para gamitin pang fetch.
// ang personel ay may admin id pero iba ang key niya.

const getAdminId = (req) => {
  const role = req.user?.role; // kunin ang role ng naka login
  let adminId;
  if (role) {
    if (role === "Admin") {
      adminId = req.user?._id?.toString();
      return adminId;
    } else if (role === "Personel") {
      adminId = req.user?.admin?.toString();
      return adminId
    }else{
        return false
    }
  }
};

module.exports = getAdminId;