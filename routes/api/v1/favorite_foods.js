var express = require('express');
var router = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);

router.get('/', function(req, res, next){
    database('foods').select()
    .then((foods) => {
      res.status(200).json(foods);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
  });

module.exports = router;
