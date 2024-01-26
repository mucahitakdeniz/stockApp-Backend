"use strict";

const Token = require("../models/token");

module.exports ={
  list: async (req, res) => {
     /*
            #swagger.ignore = true
        */
    const filters = {} 
    // const filters = req.token?.is_superadmin ? {} : { _id: req.token._id };

    const data = await res.getModelList(Token);

    res.status(200).send({data
       });
  },
  create: async (req, res) => {
     /*
            #swagger.ignore = true
        */
 
    const data = await Token.create(req.body);

    res.status(200).send({
      data,
    });
  },
  read: async (req, res) => {
    /*
            #swagger.ignore = true
        */
  
    const data = await Token.findOne({_id: req.params.id});

    res.status(200).send(data);
  },
  update: async (req, res) => {
    /*
            #swagger.ignore = true
        */
    
    const data = await Token.updateOne({_id: req.params.id}, req.body)

    res.status(202).send({
      data,
      new: await Token.findOne(filters),
    })
  },
  delete: async (req, res) => {
    /*
            #swagger.ignore = true
        */
  

    const data = await Token.deleteOne({ _id: req.params.id });

    res.status(data.deletedCount ? 204 : 404).send({
        error: !data.deletedCount,
        data
    });
  },
};
                       