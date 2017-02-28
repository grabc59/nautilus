'use strict';

const express = require('express');
const knex = require('../knex');
const router = express.Router();

////////////////////////
//////// GET ALL
////////////////////////
router.get('/', function(req, res, next) {
    knex('ip_lookups')
        .select('id', 'logs_id', 'country', 'region_name', 'city', 'zip', 'lat', 'lon', 'isp', 'created_at', 'updated_at')
        .orderBy('id')
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            next(err);
        });
});

////////////////////////
//////// GET SINGLE
////////////////////////
router.get('/:id', function(req, res, next) {
    knex('ip_lookups')
        .select('id', 'logs_id', 'country', 'region_name', 'city', 'zip', 'lat', 'lon', 'isp', 'created_at', 'updated_at')
        .where({
            id: req.params.id
        })
        .first()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            next(err);
        });
});

////////////////////////
//////// POST
////////////////////////
router.post('/', function(req, res, next) {
    knex('ip_lookups')
        .insert({
            logs_id: req.body.logs_id,
            country: req.body.country,
            region_name: req.body.region_name,
            city: req.body.city,
            zip: req.body.zip,
            lat: req.body.lat,
            lon: req.body.lon,
            isp: req.body.isp
        }, '*')
        .then((result) => {
            const return_result = result[0];
            delete return_result.created_at;
            delete return_result.updated_at;
            res.send(return_result);
        })
        .catch((err) => {
            next(err);
        });
});

////////////////////////
//////// PATCH
////////////////////////
router.patch('/:id', function(req, res, next) {
    knex('ip_lookups')
        .where({
            id: req.params.id
        })
        .first()
        .update({
            logs_id: req.body.logs_id,
            country: req.body.country,
            region_name: req.body.region_name,
            city: req.body.city,
            zip: req.body.zip,
            lat: req.body.lat,
            lon: req.body.lon,
            isp: req.body.isp
        }, '*')
        .then((result) => {
            let return_result = result[0];
            delete return_result.created_at;
            delete return_result.updated_at;
            res.send(return_result);
        })
        .catch((err) => {
            next(err);
        });
});

////////////////////////
//////// DELETE
////////////////////////
router.delete('/:id', function(req, res, next) {
    knex('ip_lookups')
        .select('id', 'logs_id', 'country', 'region_name', 'city', 'zip', 'lat', 'lon', 'isp', 'created_at', 'updated_at')
        .where({
            id: req.params.id
        })
        .first()
        .then((delete_item) => {
            let message = delete_item;
            return knex('ip_lookups')
                .del()
                .where({
                    id: req.params.id
                })
                .then((result) => {
                    res.send(message);
                })
                .catch((err) => {
                    next(err);
                });
        })
        .catch((err) => {
            next(err);
        });
});

module.exports = router;
