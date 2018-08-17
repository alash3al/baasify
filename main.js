#!/usr/bin/env node
/**
 * BaaSify a parse-server based backend-as-a-service with multi-apps feature.
 * 
 * @author Mohamed Al Ashaal <m7medalash3al@gmail.com>
 * @version 1.0.0
 */
const conf = {
    HTTP_PORT: process.env.HTTP_PORT || 7000,
    MONGO_DSN: process.env.MONGO_DSN || "mongodb://localhost:27017",
    REDIS_DSN: process.env.REDIS_DSN || "redis://localhost/1",
    BASE_URL: process.env.BASE_URL || "http://localhost:7000"
};
const express = require('express');
const ParseServer = require('parse-server').ParseServer;
const redis = require('redis').createClient(conf.REDIS_DSN);
const fs = require('fs');
const mux = express();

/**
 * Available deployed apps
 */
var deployments = {};

/**
 * Deploy the specified app
 * 
 * @param {Object} config 
 * @param {Closure} fn 
 */
function deployApp(config, fn) {
    fs.mkdir('./cloud-functions/'+config.appId, function(){
        fs.writeFile('./cloud-functions/'+config.appId+'/main.js', '', function(){
            var api = new ParseServer({
                databaseURI: conf.MONGO_DSN+"/baas_"+config.appId,
                cloud: './cloud-functions/'+config.appId+'/main.js',
                appId: config.appId,
                masterKey: config.appSecret
            })
            deployments[config.appId] = {
                api: api,
                config: config
            }
            fn && fn(api);
        })
    })
}

/**
 * Start serving the registered apps
 */
mux.use('/parse', function(req, res, next){
    var appId = req.get("X-Parse-Application-Id")

    var success = function(api){
        api(req, res, next)
    }

    var reject = function(){
        res.status(404).json({
            error: "invalid application specified"
        })
    }

    if ( deployments[appId] ) {
        success(deployments[appId].api)
    } else {
        redis.hget("apps", appId, function(_, val){
            if ( ! val ) {
                reject()
                return
            }
            var info = JSON.parse(val)
            deployApp(info, function(api){
                success(api)
            })
        })
    }
})

/**
 * Start listening on the configured port
 */
mux.listen(parseInt(conf.HTTP_PORT), function() {
  console.log('⇨ http server started on port '+conf.HTTP_PORT);
});