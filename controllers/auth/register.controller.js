require("dotenv").config();
// checks if the gmail is existing from middleware if false then next()
// check if all requirements are in req.body ex. gmail and password else response bad request.
// addd register admin or insert data to database
//

module.exports = (
  mutation,
  sendEmail,
  clientCofing,
  responseUtil,
  constantUtils,
  validationResult,
  encryptPassword
) => {
  return {
    registerAdmin: async (req, res) => {
      const {
        wrs_name,
        gmail,
        contact_number,
        firstname,
        lastname,
        gender,
        age,
        password,
      } = req.body;
      const { geolocation } = req.body;
      const { region, province, city, barangay, street_building_house_no } =
        req.body;
      // --------------
      const hashed_password = await encryptPassword(password, 10);
      const mutationResponse = await mutation.registerStation({
        wrs_name,
        gmail,
        contact_number,
        firstname,
        lastname,
        gender,
        age,
        password: hashed_password,
        geolocation,
        address: { region, province, city, barangay, street_building_house_no },
      });
      //   receiver, link, subject, title, content, description
      console.log("mutationResponse",mutationResponse)
      const id = mutationResponse.id.toString();
      const link = `${req.protocol}://${req.hostname}:${clientCofing.port}/redirect-verify?id=${id}`;
      if (mutationResponse.success) {
        await sendEmail(
          gmail,
          link,
          "Verify Account",
          "Thank you for registering!",
          "By clicking verify now button below your account will be verified."
        );
        responseUtil.generateServerResponse(res, 200, "register admin success", "mesage from register admin",mutationResponse,'register-admin')
        // res.status(200).send(mutationResponse);
      } else {
        responseUtil.generateServerResponse(res, 409, "Registration failed", "Something went wrong",'register-admin')
      }
    },
  };
};
