require("dotenv").config()

module.exports = (mutation, sendEmail, clientCofing, encryptPassword) => {
  return {
    registerStation: async (req, res) => {
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
      const {geolocation} = req.body;
      const { region, province, city, barangay, street_building_house_no } =
        req.body;
// --------------
      const hashed_password =await encryptPassword(password, 10)
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
      const id = mutationResponse.register.admin._id.toString();
      const link = `${req.protocol}://${req.hostname}:${clientCofing.port}/redirect-verify?id=${id}`;
    // const link = `http://localhost:${require("../../config/server.config").PORT()}/redirect-verify`;
      console.log("controllers/register/admin" ,req.body)
      if(mutationResponse.registered){
        await sendEmail(
            gmail,
            link,
            "Verify Account",
            "Thank you for registering!",
            "By clicking verify now button below your account will be verified."
          );
          res.status(200).send(mutationResponse);
      }
      else{
        res.status(400).send(mutationResponse)
      }
    },
  };
};
