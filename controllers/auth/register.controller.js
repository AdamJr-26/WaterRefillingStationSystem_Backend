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
  encryptPassword,
  sendOTP,
  crypto,
  query
) => {
  return {
    // Admin-------
    registerAdmin: async (req, res) => {
      const {
        wrs_name,
        gmail,
        nickname,
        contact_number,
        firstname,
        lastname,
        gender,
        birthday,
        password,
      } = req.body;
      const { geolocation } = req.body;
      console.log("geolocation",geolocation)
      const { region, province, city, barangay, street_building } = req.body;
      // --------------
      const hashed_password = await encryptPassword(password, 10);
      const location = {
        type: "Point",
        coordinates: [geolocation?.lng, geolocation?.lat],
      };
      const mutationResponse = await mutation.registerStation({
        wrs_name,
        gmail,
        nickname,
        contact_number,
        firstname,
        lastname,
        gender,
        birthday: Math.floor(new Date(birthday).getTime() / 1000),
        password: hashed_password,
        geolocation,
        location,
        address: { region, province, city, barangay, street_building },
      });
      //   receiver, link, subject, title, content, description
      console.log("mutationResponse", mutationResponse);
      const id = mutationResponse?.id?.toString();
      const referer = req?.headers?.referer;
      const link = `${referer}redirect-verify?id=${id}`;
      if (mutationResponse.success) {
        try {
          await sendEmail({
            receiver: gmail,
            firstname: firstname,
            link: link,
            subject: "Verify Account",
            title: "Thank you for registering!",
            content:
              "By clicking verify now button below your account will be verified.",
            description: "",
            buttonLabel: "Verify Now",
          });
          responseUtil.generateServerResponse(
            res,
            200,
            "register admin success",
            "mesage from register admin",
            mutationResponse,
            "register-admin"
          );
        } catch (err) {
          console.log("errrrrrrrrr from register.ctlr", err);
          responseUtil.generateServerResponse(
            res,
            409,
            "Registration failed",
            "Something went wrong",
            "register-admin"
          );
        }

        // res.status(200).send(mutationResponse);
      } else {
        responseUtil.generateServerResponse(
          res,
          409,
          "Registration failed",
          "Something went wrong",
          "register-admin"
        );
      }
    },

    // personel--------------- ########################################################################
    registerPersonel: async (req, res) => {
      const {
        wrs_id,
        gmail,
        nickname,
        firstname,
        lastname,
        birthday,
        gender,
        contact_number,
        address,
        password,
      } = req.body;
      // console.log(req.body)
      const { personel, personel_error } =
        await query.checkIfPersonelIsExisting({
          gmail: gmail,
        });
      // if not existing - create and sendOTP.
      // if verified - do not proceed.
      // if not verified resend verification otp.
      if (personel?.verified && !personel_error) {
        // if verified message that this email is existing and verified.
        responseUtil.generateServerResponse(
          res,
          200,
          "register as a personel failed",
          `Email ${gmail} is already in use, Please try again`,
          { isExist: true, verified: true, success: false },
          "register_personel"
        );
      } else if (personel?.verified === false && !personel_error) {
        // not verified
        // redirect to enter otp or verification page.
        responseUtil.generateServerResponse(
          res,
          200,
          "register as a personel failed",
          `We are sent you a OTP to verify your account.`,
          { isExist: true, verified: false, success: false, gmail },
          "register_personel"
        );

        // const token = crypto.randomBytes(3).toString("hex");
        // const { otp, error } = await mutation.createOtp({
        //   gmail: gmail,
        //   token: token,
        // });
        // if (otp && !error) {
        //   console.log("personel", personel);
        //   try {
        //     // send otp
        //     await sendOTP({
        //       receiver: otp?.gmail,
        //       firstname: firstname,
        //       subject: "One Time Password",
        //       title: "Registering as Delivery Personel",
        //       content:
        //         "This is your one time password, it will be expired in 3 minutes.",
        //       otp: otp?.token,
        //     });
        //     responseUtil.generateServerResponse(
        //       res,
        //       200,
        //       "register as a personel failed",
        //       `We are sent you a OTP to verify your account.`,
        //       { isExist: true, verified: false, success: false },
        //       "register_personel"
        //     );
        //   } catch (err) {
        //     responseUtil.generateServerErrorCode(
        //       res,
        //       400,
        //       err,
        //       "Something went wrong while sending you OTP, please try again.",
        //       "register_personel"
        //     );
        //   }
        // }
      } else if (!personel?.gmail && !personel_error) {
        // if gmail is not existing
        // then register the user then send otp
        const hashed_password = await encryptPassword(password, 10);
        const { registerData, error } = await mutation.registerPersonel({
          wrs_id,
          gmail,
          nickname,
          firstname,
          lastname,
          birthday,
          gender,
          contact_number,
          address,
          password: hashed_password,
        });
        if (registerData && !error) {
          //  send otp and response success:true.
          const token = crypto.randomBytes(3).toString("hex");
          const { otp, error } = await mutation.createOtp({
            gmail: registerData?.gmail,
            token,
          });
          if (otp && !error) {
            try {
              await sendOTP({
                receiver: otp?.gmail,
                firstname: firstname,
                subject: "One Time Password",
                title: "Registering as Delivery Personel",
                content:
                  "This is your one time password, it will be expired in 3 minutes.",
                otp: otp?.token,
              });
              await responseUtil.generateServerResponse(
                res,
                200,
                "register as a personel success",
                `We are sent you a OTP to verify your account.`,
                {
                  isExist: false,
                  verified: false,
                  success: true,
                  gmail: gmail,
                },
                "register_personel"
              );
            } catch (err) {
              responseUtil.generateServerErrorCode(
                res,
                400,
                "OTP ERROR ",
                "Something went wrong while sending you OTP, please try again.",
                "register_personel"
              );
            }
          }
        } else {
          responseUtil.generateServerErrorCode(
            res,
            400,
            "OTP ERROR ",
            "Something went wrong while sending you OTP, please try again.",
            "register_personel"
          );
          // register error
        }
      } else {
        console.log("errrrrrrrrrrrrr");
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Ooops",
          "Sorry, something went wrong",
          "register_personel"
        );
        // error
      }
    },
  };
};
