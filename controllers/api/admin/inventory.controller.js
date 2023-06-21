const mongoose = require("mongoose");
module.exports = (query, mutation, responseUtil, uploadImage, getAdminId) => {
  return {
    addGallon: async (req, res) => {
      var { name, liter, price, total, containerPrice } = JSON.parse(
        req.body.data
      );
      var gallon_image = req.body?.image; // from static link from frontend
      const files = req.files;
      const user = req.user;

      const serverResponse = (doc) => {
        if (doc.data && !doc.error) {
          responseUtil.generateServerResponse(
            res,
            201,
            "success",
            "Gallon Added",
            "no data to show",
            "add_gallon_admin"
          );
        } else {
          responseUtil.generateServerErrorCode(
            res,
            400,
            "Error",
            "Add Gallon Failed",
            "add_gallon_admin"
          );
        }
      };
      if (files.length) {
        const cloudinary = await uploadImage(
          {
            root: "user-storage/inventory/gallons/",
            userFolder: user?.gmail,
          },
          files
        );
        if (cloudinary?.uploadResults && !cloudinary?.error) {
          gallon_image = cloudinary?.uploadResults[0]?.url;
          const doc = await mutation.addGallon(
            {
              gallon_image,
              name,
              liter,
              price,
              containerPrice,
              total,
              cloudinary,
            },
            user?._id.toString()
          );
          serverResponse(doc);
        } else {
          responseUtil.generateServerErrorCode(
            res,
            400,
            "Error",
            "Add gallon failed, please try again",
            "add_gallon_admin"
          );
        }
      } else if (gallon_image && !files.length) {
        const doc = await mutation.addGallon(
          { gallon_image, name, liter, containerPrice, price, total },
          user?._id.toString()
        );

        serverResponse(doc);
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "Add gallon failed, please try again.Check the file format",
          "add_gallon_admin"
        );
      }
    },

    // add vehicle

    addVehicle: async (req, res) => {
      var vehicle_image = req.body?.image; // from static link from frontend
      const files = req.files;
      var { vehicle_name, vehicle_id, loadLimit } = JSON.parse(req.body.data);
      const user = req.user;

      const serverResponse = (doc) => {
        if (doc.data && !doc.error) {
          responseUtil.generateServerResponse(
            res,
            201,
            "success",
            "Vehicle Added",
            "no data to show",
            "add_vehicle_admin"
          );
        } else {
          responseUtil.generateServerErrorCode(
            res,
            400,
            "Error",
            "Add vehicle failed, please try again",
            "add_vehicle_admin"
          );
        }
      };
      if (files.length) {
        const cloudinary = await uploadImage(
          {
            root: "user-storage/inventory/vehicles/",
            userFolder: user?.gmail,
          },
          files
        );
        if (cloudinary?.uploadResults && !cloudinary?.error) {
          const vehicle_image = cloudinary?.uploadResults[0]?.url;
          const doc = await mutation.addVehicle(
            { vehicle_image, vehicle_name, vehicle_id, cloudinary,loadLimit },
            user?._id,
            
          );
          serverResponse(doc);
        } else {
          responseUtil.generateServerErrorCode(
            res,
            400,
            "Error",
            "Add vehicle failed, please try again",
            "add_vehicle_admin"
          );
        }
      } else if (vehicle_image && !files.length) {
        const doc = await mutation.addVehicle(
          { vehicle_image, vehicle_name, vehicle_id, loadLimit },
          user?._id,
          
        );
        serverResponse(doc);
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "Add vehicle failed, please try again",
          "add_vehicle_admin"
        );
      }
    },

    // get gallons
    getAllGallons: async (req, res) => {
      const adminId = getAdminId(req);
      const { limit, page } = req.params;
      console.log(" limit, page------>", limit, page);
      const { data, error } = await query.getGallons({
        adminId,
        limit,
        page,
      });
      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          201,
          "success",
          "fetching gallon",
          data,
          "get_gallons"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "Oops something went wrong, please try again",
          "get_gallons"
        );
      }
    },
    getVehicles: async (req, res) => {
      const adminId = getAdminId(req);
      const { limit, page } = req.params;
      const { data, error } = await query.getVehicles({ adminId, limit, page });

      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "fetching vehicles",
          data,
          "inventory"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "get vehicles failed, please try again",
          "inventory"
        );
      }
    },

    getGallon: async (req, res) => {
      const { id, admin } = req.params;
      const { data, error } = await query.getGallon({ id, admin });
      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "fetching gallon",
          data,
          "inventory"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "get gallon failed, please try again",
          "inventory"
        );
      }
    },
    getAvailableVehicles: async (req, res) => {
      const adminId = getAdminId(req);

      const { data, error } = await query.getAvailableVehicles({ adminId });
      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "fetching availble vehicle",
          data,
          "inventory"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "get vehicle failed, please try again",
          "inventory"
        );
      }
    },
    updateGallonPrice: async (req, res) => {
      const { admin, id } = req.params;
      const { price } = req.body;

      const updatedGallon = await mutation.updateGallonPrice({
        admin,
        id,
        price,
      });
      if (updatedGallon?.data && !updatedGallon?.error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "updating gallon",
          { data: updatedGallon?.data },
          "inventory"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          { error: updatedGallon?.error },
          "inventory"
        );
      }
    },
    updateAddCountGallon: async (req, res) => {
      const { admin, id } = req.params;
      const { add_count } = req.body;

      const updatedGallon = await mutation.updateAddCountGallon({
        admin,
        id,
        add_count,
      });
      if (updatedGallon?.data && !updatedGallon?.error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "updating gallon",
          { data: updatedGallon?.data },
          "inventory"
        );
      } else {
        console.log("error from updating gallon", updatedGallon?.error);
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          { error: updatedGallon?.error },
          "inventory"
        );
      }
    },
    updateReduceCountGallon: async (req, res) => {
      const { admin, id } = req.params;
      const { reduce_count } = req.body;

      const updatedGallon = await mutation.updateReduceCountGallon({
        admin,
        id,
        reduce_count,
      });
      if (updatedGallon?.data && !updatedGallon?.error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "updating gallon",
          { data: updatedGallon?.data },
          "inventory"
        );
      } else {
        console.log("error from updating gallon", updatedGallon?.error);
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          { error: updatedGallon?.error },
          "inventory"
        );
      }
    },
    updateContainerPrice: async (req, res) => {
      const { admin, id } = req.params;
      const { containerPrice } = req.body;

      const updatedGallon = await mutation.updateContainerPrice({
        admin,
        id,
        containerPrice,
      });
      if (updatedGallon?.data && !updatedGallon?.error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "updating gallon",
          { data: updatedGallon?.data },
          "inventory"
        );
      } else {
        console.log("error from updating gallon", updatedGallon?.error);
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          { error: updatedGallon?.error },
          "inventory"
        );
      }
    },
    getAllGallonsNotInProducts: async (req, res) => {
      try {
        //
        const admin = getAdminId(req);
        const data = await query.getAllGallonsNotInProducts({ admin });
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "updating gallon",
          data,
          "get_gallon_not_in_products"
        );
      } catch (error) {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          error,
          "get_gallon_not_in_products"
        );
      }
    },
  };
};
