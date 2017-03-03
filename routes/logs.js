'use strict';

const express = require('express');
const knex = require('../knex');
const router = express.Router();

////////////////////////
//////// GET ALL
////////////////////////
router.get('/', function(req, res, next) {
    knex('logs')
        .select('id', 'remote_address', 'remote_user', 'method', 'url', 'status', 'response_time', 'created_at', 'updated_at')
        .orderBy('id')
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            next(err);
        });
});

///////////////////////////////
//////// CUSTOM 'GET' ROUTES
///////////////////////////////

//////// GEOMAP
router.get('/geomap-data', function (req, res, next) {
    knex('logs')
      .join('ip_lookups', 'logs.id', '=', 'ip_lookups.logs_id')
      .select('logs.id', 'logs.remote_address', 'ip_lookups.region_name', 'ip_lookups.lat', 'ip_lookups.lon', 'logs.created_at', 'logs.updated_at')
    .orderBy('logs.id')
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
        next(err);
    });
});

//////// TOP ROUTES
router.get('/top-routes', function (req, res, next) {
    knex('logs')
      .select('logs.url')
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
    knex('logs')
        .select('id', 'remote_address', 'remote_user', 'method', 'url', 'status', 'response_time', 'created_at', 'updated_at')
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
    knex('logs')
        .insert({
            remote_address: req.body.remote_address,
            remote_user: req.body.remote_user,
            method: req.body.method,
            url: req.body.url,
            status: req.body.status,
            response_time: req.body.response_time
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
    knex('logs')
        .where({
            id: req.params.id
        })
        .first()
        .update({
            remote_address: req.body.remote_address,
            remote_user: req.body.remote_user,
            method: req.body.method,
            url: req.body.url,
            status: req.body.status,
            response_time: req.body.response_time
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
    knex('logs')
        .select('id', 'remote_address', 'remote_user', 'method', 'url', 'status', 'response_time', 'created_at', 'updated_at')
        .where({
            id: req.params.id
        })
        .first()
        .then((delete_item) => {
            let message = delete_item;
            return knex('logs')
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
