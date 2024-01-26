"use strict";

const Sale = require("../models/sale");
const Product = require("../models/product");
const { Error } = require("mongoose");

module.exports = {
  list: async (req, res) => {
    /*
            #swagger.tags = ["Sales"]
            #swagger.summary = "List Sales"
            #swagger.description = `
                You can send query with endpoint for search[], sort[], page and limit.
                <ul> Examples:
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                    <li>URL/?<b>page=2&limit=1</b></li>
                </ul>
            `
        */

    const data = await res.getModelList(Sale, {}, ["brand_id", "product_id"]);

    res.status(200).send(data);
  },
  create: async (req, res) => {
    /*
            #swagger.tags = ["Sales"]
            #swagger.summary = "Create Sale"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: { $ref: '#/definitions/Sale' }
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

    const currentProduct = await Product.findOne({ _id: req.body.product_id });

    if (currentProduct.stock >= req.body.quantity) {
      const updataProduct = await Product.updateOne(
        { _id: req.body.product_id },
        { $inc: { stock: -req.body.quantity } }
      );
      const data = await Sale.create(req.body);

      res.status(200).send(data);
    } else {
      res.errorStatusCode = 422;
      throw new Error(
        `There are not enough products in stock. Available stock : ${currentProduct.stock} `,
        {
          cause: currentProduct,
        }
      );
    }
  },
  read: async (req, res) => {
    /*
            #swagger.tags = ["Sales"]
            #swagger.summary = "Get Single Sale"
        */

    const data = await Sale.findOne({ _id: req.params.id }).populate([
      "brand_id",
      "product_id",
    ]);

    res.status(200).send(data);
  },
  update: async (req, res) => {
    /*
            #swagger.tags = ["Sales"]
            #swagger.summary = "Update Sale"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: { $ref: '#/definitions/Sale' }
            }
        */
    if (req.user?.is_superadmin || req.user._id == req.body.user_id) {
      if (req.body?.price < 0) {
        res.errorStatusCode = 400;
        throw new Error("The price must be greater than 0");
      }

      if (req.body?.quantity) {
        if (req.body?.quantity < 0) {
          res.errorStatusCode = 400;
          throw new Error("The quantity must be greater than 0");
        }

        const currentSale = await Sale.findOne({ _id: req.params.id });

        const quantity = req.body.quantity - currentSale.quantity;

        const updateProduct = await Product.updateOne(
          { _id: currentSale.product_id, stock: { $gte: quantity } },
          { $inc: { stock: -quantity } }
        );
        if (updateProduct.modifiedCount == 0) {
          res.errorStatusCode = 422;
          throw new Error(
            `There are not enough products in stock. Available stock : ${currentSale.quantity} `,
            {
              cause: currentSale,
            }
          );
        }
      }
      const data = await Sale.updateOne({ _id: req.params.id }, req.body);

      res.status(202).send({
        data,
        new: await Sale.findOne({ _id: req.params.id }),
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
            #swagger.tags = ["Sales"]
            #swagger.summary = "Delete Sale"
        */

    const currentSale = await Sale.findOne({ _id: req.params.id });

    if (
      req.user?.is_superadmin ||
      req.user._id == currentSale?.user_id.toString()
    ) {
      const data = await Sale.deleteOne({ _id: req.params.id });
      const updataProduct = await Product.updateOne(
        { _id: currentSale.product_id },
        { $inc: { stock: currentSale.quantity } }
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
