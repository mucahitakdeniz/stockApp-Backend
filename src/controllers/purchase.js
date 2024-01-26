"use strict";

const Purchase = require("../models/purchase");
const Product = require("../models/product");

module.exports = {
  list: async (req, res) => {
    /*
            #swagger.tags = ["Purchases"]
            #swagger.summary = "List Purchases"
            #swagger.description = `
                You can send query with endpoint for search[], sort[], page and limit.
                <ul> Examples:
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                    <li>URL/?<b>page=2&limit=1</b></li>
                </ul>
            `
        */

    const data = await res.getModelList(Purchase, {}, [
      "firm_id",
      "brand_id",
      "product_id",
    ]);

    res.status(200).send(data);
  },
  create: async (req, res) => {
    /*
            #swagger.tags = ["Purchases"]
            #swagger.summary = "Create Purchase"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: { $ref: '#/definitions/Purchase' }
            }
        */
    req.body.user_id = req.user?._id;

    if (req.body?.price < 0) {
      res.errorStatusCode = 400;
      throw new Error("The price must be greater than 0");
    }
    if (req.body?.quantity < 0) {
      res.errorStatusCode = 400;
      throw new Error("The quantity must be greater than 0");
    }

    const data = await Purchase.create(req.body);
    const updateProduct = await Product.updateOne(
      { _id: req.body.product_id },
      { $inc: { stock: data.quantity } }
    );

    res.status(200).send(data);
  },
  read: async (req, res) => {
    /*
            #swagger.tags = ["Purchases"]
            #swagger.summary = "Get Single Purchase"
        */

    const data = await Purchase.findOne({ _id: req.params.id }).populate([
      "firm_id",
      "brand_id",
      "product_id",
    ]);

    res.status(200).send(data);
  },
  update: async (req, res) => {
    /*
            #swagger.tags = ["Purchases"]
            #swagger.summary = "Update Purchase"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: { $ref: '#/definitions/Purchase' }
            }
        */
    if (req.user?.is_superadmin || req.user._id == req.body.user_id) {
      if (req.body.price && req.body.price < 0) {
        res.errorStatusCode = 400;
        throw new Error("The price must be greater than 0");
      }

      if (req.body?.quantity) {
        if (req.body.quantity < 0) {
          res.errorStatusCode = 400;
          throw new Error("The quantity must be greater than 0");
        }
        const currentPurchase = await Purchase.findOne({ _id: req.params.id });
        const quantity = req.body.quantity - currentPurchase.quantity;
        const updateProduct = await Product.updateOne(
          { _id: currentPurchase.product_id },
          { $inc: { stock: +quantity } }
        );
      }

      const data = await Purchase.updateOne({ _id: req.params.id }, req.body);

      // const updateProduct = await Product.updateOne(
      //   { _id: req.body.product_id },
      //   { $inc: { stock: data.quantity } }
      // );

      res.status(202).send({
        data,
        new: await Purchase.findOne({ _id: req.params.id }),
      });
    } else {
      res.errorStatusCode = 403;
      throw new Error(
        "You must either be an admin for this update or you had to create this process"
      );
    }
  },
  delete: async (req, res) => {
    /*
            #swagger.tags = ["Purchases"]
            #swagger.summary = "Delete Purchase"
        */
    const currentPurchase = await Purchase.findOne({ _id: req?.params?.id });
    if (
      req.user?.is_superadmin ||
      req.user._id == currentPurchase?.user_id.toString()
    ) {
      const data = await Purchase.deleteOne({ _id: req.params.id });
      const updateProduct = await Product.updateOne(
        { _id: currentPurchase.product_id },
        { $inc: { stock: -currentPurchase.quantity } }
      );

      res.status(data.deletedCount ? 204 : 404).send({
        error: !data.deletedCount,
        data,
      });
    } else {
      res.errorStatusCode = 403;
      throw new Error(
        "You must either be an admin for this update or you had to delete this process"
      );
    }
  },
};
