module.exports = (db, Customer, uploadImage) => {
  return {
    createCustomer: async (file, payload, user) => {
      const session = await db.startSession();
      try {
        session.startTransaction();
        // dont know why I have put the cloudinary inside this module. XD.
        if (file) {
          const cloudinary = await uploadImage(
            {
              root: "user-storage/profile/customers",
              userFolder: "sample",
            },
            [file]
          );
          
          
          const display_photo = cloudinary?.uploadResults[0]?.url;
          if (cloudinary?.error && !display_photo) {
            new Error("Error creating customer");
          } else {
            const customer = await new Customer({
              ...payload,
              display_photo,
            });
            await customer.save((error) => {
              if (error) {
                new Error("Error creating customer");
              }
            });
            session.endSession();
            return { data: customer };
          }
        } else {
          const customer = await new Customer(payload);
          await customer.save((error) => {
            if (error) {
              new Error("Error creating customer");
            }
          });
          session.endSession();
          return { data: customer };
        }

        const customer = await new Customer({
          ...payload,
          display_photo: display_photo ? display_photo : "",
        });
        await customer.save((error) => {
          if (error) {
            new Error("Error creating customer");
          }
        });
        session.endSession();
        return { data: customer };
      } catch (error) {
        console.log("error session?", error);
        await session.abortTransaction();
        session.endSession();
        return { error };
      }
    },
  };
};
