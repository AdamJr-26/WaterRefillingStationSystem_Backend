const mongoose = require("mongoose");

module.exports = (Customer) => {
  return {
    getCustomerByFirstname: async (payload) => {
      try {
        const filter = {
          firstname: { $regex: payload?.searchText, $options: "i" },
        };
        const data = await Customer.find(filter).limit(5).exec(); // nag add ako ng password para sa future kung magkaroon ng customer that haas password.
        return { data };
      } catch (error) {
        return { error };
      }
    },
    getCustomersPlaces: async (payload) => {
      try {
        const field = payload?.place;
        const query = { admin: payload?.admin };
        const data = await Customer.distinct(field, query);
        return { data };
      } catch (error) {
        return { error };
      }
    },
    searchCustomerByNameAndPlace: async ({ search_text, admin }) => {
      try {
        const stages = [
          {
            $search: {
              index: "customer",
              text: {
                query: search_text,
                path: {
                  wildcard: "*",
                },
              },
            },
          },
          {
            $match: {
              admin: mongoose.Types.ObjectId(admin),
            },
          },
          {
            $limit: 10
          }
        ];
        const data = await Customer.aggregate(stages);
        return { data };
      } catch (error) {
        console.log("sdfsdfsdf", error);
        return { error };
      }
    },
  };
};
