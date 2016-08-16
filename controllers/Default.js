'use strict';

var url = require('url');
var crypto = require('crypto');
var config = require('../config');

// TODO: Implement document store here
var tempDocumentStore = {};

// choose implementation for selected storage strategy
var SelectedStorageStrategy = require('./' + config.storageStrategyToUse + 'StorageStrategy');

module.exports.baseFolderNameDELETE = function baseFolderNameDELETE(req, res, next) {
  SelectedStorageStrategy.baseFolderNameDELETE(req.swagger.params, res, next);
};

module.exports.baseFolderNameGET = function baseFolderNameGET(req, res, next) {
  SelectedStorageStrategy.baseFolderNameGET(req.swagger.params, res, next);
};

module.exports.baseFolderNameSubFolderNameDELETE = function baseFolderNameSubFolderNameDELETE(req, res, next) {
  SelectedStorageStrategy.baseFolderNameSubFolderNameDELETE(req.swagger.params, res, next);
};

module.exports.baseFolderNameSubFolderNameFileNameDELETE = function baseFolderNameSubFolderNameFileNameDELETE(req, res, next) {
  SelectedStorageStrategy.baseFolderNameSubFolderNameFileNameDELETE(req.swagger.params, res, next);
};

module.exports.baseFolderNameSubFolderNameFileNameGET = function baseFolderNameSubFolderNameFileNameGET(req, res, next) {
  SelectedStorageStrategy.baseFolderNameSubFolderNameFileNameGET(req.swagger.params, res, next);
};

module.exports.baseFolderNameSubFolderNameFileNamePUT = function baseFolderNameSubFolderNameFileNamePUT(req, res, next) {
  // Ensure base folder exists
  if (!req.swagger.params.baseFolderName.path.value || !tempDocumentStore[req.swagger.params.baseFolderName.path.value]) {
    res.statusCode = 404;
    res.end('Base folder doesn\'t exist.');
    return;
  }

  var baseFolderName = req.swagger.params.path.value.baseFolderName;
  var baseFolderObjectFromDb = tempDocumentStore[baseFolderName];

  // Ensure folder secret is valid
  if (!req.swagger.params.folderSecret.path.value || baseFolderObjectFromDb['baseFolderSecret'] !== req.swagger.params.folderSecret.path.value) {
    res.statusCode = 403;
    res.end('Folder secret not valid.');
    return;
  }

  // Ensure sub folder name variable is set
  var subFolderName = '';

  if (req.swagger.params.subFolderName.path.value) {
    // Remove ../s to prevent directory traversal
    var subFolderName = String(req.swagger.params.subFolderName.path.value).replace('../', '');
  }

  // Ensure file name is set
  if (!req.swagger.params.fileName.path.value) {
    res.statusCode = 400;
    res.end('File name may not be empty.');
    return;
  }

  var fileName = req.swagger.params.fileName.path.value;

  if (!req.swagger.params.fileData.body.value) {
    res.statusCode = 400;
    res.end('No file content present.');
    return;
  }

  //SelectedStorageStrategy.baseFolderNameSubFolderNameFileNamePUT(req.swagger.params, res, next);
};

module.exports.baseFolderNameSubFolderNameGET = function baseFolderNameSubFolderNameGET(req, res, next) {
  SelectedStorageStrategy.baseFolderNameSubFolderNameGET(req.swagger.params, res, next);
};

module.exports.baseFoldersGET = function baseFoldersGET(req, res, next) {
  // this will be the array that is returned to the client
  var arrayForClient = [];

  // retrieve all base folders from database
  var allBaseFolderNames = Object.keys(tempDocumentStore);

  // concatenate the base folder objects to an array
  for (var i = 0; i < allBaseFolderNames.length; ++i) {
    var currentBaseFolderObject = tempDocumentStore[allBaseFolderNames[i]];

    arrayForClient.push({
      baseFolderName: currentBaseFolderObject['baseFolderName'],
      remarks: currentBaseFolderObject['baseFolderRemarks'],
      created: currentBaseFolderObject['baseFolderCreated'],
      lastAccess: currentBaseFolderObject['baseFolderLastAccess']
    });
  }

  // response to client
  res.statusCode = 200;
  res.end(JSON.stringify(arrayForClient));
};

module.exports.baseFoldersPOST = function baseFoldersPOST(req, res, next) {
  var uuid = require('uuid');

  // get a unique name for the new base folder
  var newBaseFolderName = String(uuid.v4());

  // get a folder secret
  var newBaseFolderSecret = crypto.randomBytes(32).toString('hex');

  // store the remark if it was given
  var remarks = '';

  if (req.swagger.params.body.value.remarks) {
    if (String(req.swagger.params.body.value.remarks).length > 50) {
      res.statusCode = 400;
      res.end('Field "remarks" may not exceed 50 characters.');
      return;
    }

    remarks = String(req.swagger.params.body.value.remarks);
  }

  var objectForDatabase = {
    baseFolderName: newBaseFolderName,
    baseFolderSecret: newBaseFolderSecret,
    baseFolderRemarks: remarks,
    baseFolderCreated: new Date(),
    baseFolderLastAccess: new Date()
  };

  var objectForClient = {
    baseFolderName: newBaseFolderName,
    folderSecret: newBaseFolderSecret
  };

  // create database entry for this
  tempDocumentStore[newBaseFolderName] = objectForDatabase;

  // response to client
  res.statusCode = 201;
  res.end(JSON.stringify(objectForClient));
};
