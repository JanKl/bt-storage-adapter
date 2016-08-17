'use strict';

var url = require('url');
var crypto = require('crypto');
var config = require('../config');

// TODO: Implement document store here
var tempDocumentStore = {};

// choose implementation for selected storage strategy
var SelectedStorageStrategy = require('./' + config.storageStrategyToUse + 'StorageStrategy');
var selectedStorageStrategyConfig = config['storageStrategySettings'][config.storageStrategyToUse];

// Initialize Storage
SelectedStorageStrategy.initialize(selectedStorageStrategyConfig);

module.exports.baseFolderNameSubFolderNameDELETE = function baseFolderNameSubFolderNameDELETE(req, res, next) {
  // Ensure base folder exists
  if (!req.swagger.params.baseFolderName.value || !tempDocumentStore[req.swagger.params.baseFolderName.value]) {
    res.statusCode = 404;
    res.end('Base folder doesn\'t exist.');
    return;
  }
  
  var baseFolderName = req.swagger.params.baseFolderName.value;
  var baseFolderObjectFromDb = tempDocumentStore[baseFolderName];

  // Ensure folder secret is valid
  if (!req.swagger.params.folderSecret.value || baseFolderObjectFromDb['baseFolderSecret'] !== req.swagger.params.folderSecret.value) {
    res.statusCode = 403;
    res.end('Folder secret not valid.');
    return;
  }

  // Ensure sub folder name variable is set
  var subFolderName = '';

  if (req.swagger.params.subFolderName.value) {
    // Remove ../s to prevent directory traversal
    var subFolderName = String(req.swagger.params.subFolderName.value).replace('../', '');
  }
  
  // concatenate folder name in storage without trailing slashes
  var folderPath = String(baseFolderName + '/' + subFolderName).replace(/\/+$/, "");

  SelectedStorageStrategy.deleteFileOrFolder(selectedStorageStrategyConfig, folderPath).then(function success() {
    res.statusCode = 204;
    res.end('Folder deleted');
  }, function error(err) {
    if (err.message === 'File not found') {
      res.statusCode = 404;
      res.end('Folder not found.');
      return;
    }
    
    res.statusCode = 500;
    res.end('Folder couldn\'t be deleted.');
    console.error(err);
  });
};

module.exports.baseFolderNameSubFolderNameFileNameDELETE = function baseFolderNameSubFolderNameFileNameDELETE(req, res, next) {
  // Ensure base folder exists
  if (!req.swagger.params.baseFolderName.value || !tempDocumentStore[req.swagger.params.baseFolderName.value]) {
    res.statusCode = 404;
    res.end('Base folder doesn\'t exist.');
    return;
  }
  
  var baseFolderName = req.swagger.params.baseFolderName.value;
  var baseFolderObjectFromDb = tempDocumentStore[baseFolderName];

  // Ensure folder secret is valid
  if (!req.swagger.params.folderSecret.value || baseFolderObjectFromDb['baseFolderSecret'] !== req.swagger.params.folderSecret.value) {
    res.statusCode = 403;
    res.end('Folder secret not valid.');
    return;
  }

  // Ensure sub folder name variable is set
  var subFolderName = '';

  if (req.swagger.params.subFolderName.value) {
    // Remove ../s to prevent directory traversal
    var subFolderName = String(req.swagger.params.subFolderName.value).replace('../', '');
  }
  
  // concatenate folder name in storage without trailing slashes
  var folderPath = String(baseFolderName + '/' + subFolderName).replace(/\/+$/, "");

  // Ensure file name is set
  if (!req.swagger.params.fileName.value) {
    res.statusCode = 400;
    res.end('File name may not be empty.');
    return;
  }

  var fileName = req.swagger.params.fileName.value;
  var objectPath = folderPath + '/' + fileName;

  SelectedStorageStrategy.deleteFileOrFolder(selectedStorageStrategyConfig, objectPath).then(function success() {
    res.statusCode = 204;
    res.end('File deleted');
  }, function error(err) {
    if (err.message === 'File not found') {
      res.statusCode = 404;
      res.end('File not found.');
      return;
    }
    
    res.statusCode = 500;
    res.end('File couldn\'t be deleted.');
    console.error(err);
  });
};

module.exports.baseFolderNameDELETE = function baseFolderNameDELETE(req, res, next) {
  // Ensure base folder exists
  if (!req.swagger.params.baseFolderName.value || !tempDocumentStore[req.swagger.params.baseFolderName.value]) {
    res.statusCode = 404;
    res.end('Base folder doesn\'t exist.');
    return;
  }
  
  var baseFolderName = req.swagger.params.baseFolderName.value;
  var baseFolderObjectFromDb = tempDocumentStore[baseFolderName];

  // Ensure folder secret is valid
  if (!req.swagger.params.folderSecret.value || baseFolderObjectFromDb['baseFolderSecret'] !== req.swagger.params.folderSecret.value) {
    res.statusCode = 403;
    res.end('Folder secret not valid.');
    return;
  }

  SelectedStorageStrategy.deleteFileOrFolder(selectedStorageStrategyConfig, baseFolderName).then(function success() {
    delete tempDocumentStore[baseFolderName];
    
    res.statusCode = 204;
    res.end('Base folder deleted');
  }, function error(err) {
    if (err.message === 'File not found') {
      res.statusCode = 404;
      res.end('Base folder not found.');
      return;
    }
    
    res.statusCode = 500;
    res.end('Base folder couldn\'t be deleted.');
    console.error(err);
  });
};

module.exports.baseFolderNameGET = function baseFolderNameGET(req, res, next) {
  return module.exports.baseFolderNameSubFolderNameGET(req, res, next);
};

module.exports.baseFolderNameSubFolderNameFileNameGET = function baseFolderNameSubFolderNameFileNameGET(req, res, next) {
  // Ensure base folder exists
  if (!req.swagger.params.baseFolderName.value || !tempDocumentStore[req.swagger.params.baseFolderName.value]) {
    res.statusCode = 404;
    res.end('Base folder doesn\'t exist.');
    return;
  }
  
  var baseFolderName = req.swagger.params.baseFolderName.value;
  var baseFolderObjectFromDb = tempDocumentStore[baseFolderName];

  // Ensure folder secret is valid
  if (!req.swagger.params.folderSecret.value || baseFolderObjectFromDb['baseFolderSecret'] !== req.swagger.params.folderSecret.value) {
    res.statusCode = 403;
    res.end('Folder secret not valid.');
    return;
  }

  // Ensure sub folder name variable is set
  var subFolderName = '';

  if (req.swagger.params.subFolderName.value) {
    // Remove ../s to prevent directory traversal
    var subFolderName = String(req.swagger.params.subFolderName.value).replace('../', '');
  }
  
  // concatenate folder name in storage without trailing slashes
  var folderPath = String(baseFolderName + '/' + subFolderName).replace(/\/+$/, "");

  // Ensure file name is set
  if (!req.swagger.params.fileName.value) {
    res.statusCode = 400;
    res.end('File name may not be empty.');
    return;
  }

  var fileName = req.swagger.params.fileName.value;

  SelectedStorageStrategy.getFileFromFolder(selectedStorageStrategyConfig, folderPath, fileName).then(function success(fileDataStream) {
    res.statusCode = 200;
    fileDataStream.pipe(res);
    res.end();
  }, function error(err) {
    if (err.message === 'File not found') {
      res.statusCode = 404;
      res.end('File not found.');
      return;
    }
    
    res.statusCode = 500;
    res.end('File couldn\'t be retrieved.');
    console.error(err);
  });
};

module.exports.baseFolderNameSubFolderNameFileNamePUT = function baseFolderNameSubFolderNameFileNamePUT(req, res, next) {
  // Ensure base folder exists
  if (!req.swagger.params.baseFolderName.value || !tempDocumentStore[req.swagger.params.baseFolderName.value]) {
    res.statusCode = 404;
    res.end('Base folder doesn\'t exist.');
    return;
  }
  
  var baseFolderName = req.swagger.params.baseFolderName.value;
  var baseFolderObjectFromDb = tempDocumentStore[baseFolderName];

  // Ensure folder secret is valid
  if (!req.swagger.params.folderSecret.value || baseFolderObjectFromDb['baseFolderSecret'] !== req.swagger.params.folderSecret.value) {
    res.statusCode = 403;
    res.end('Folder secret not valid.');
    return;
  }

  // Ensure sub folder name variable is set
  var subFolderName = '';

  if (req.swagger.params.subFolderName.value) {
    // Remove ../s to prevent directory traversal
    var subFolderName = String(req.swagger.params.subFolderName.value).replace('../', '');
  }
  
  // concatenate folder name in storage without trailing slashes
  var folderPath = String(baseFolderName + '/' + subFolderName).replace(/\/+$/, "");

  // Ensure file name is set
  if (!req.swagger.params.fileName.value) {
    res.statusCode = 400;
    res.end('File name may not be empty.');
    return;
  }

  var fileName = req.swagger.params.fileName.value;
  
  if (!req.swagger.params.fileData.value) {
    res.statusCode = 400;
    res.end('No file content present.');
    return;
  }

  SelectedStorageStrategy.putFileIntoFolder(selectedStorageStrategyConfig, folderPath, fileName, req.swagger.params.fileData.value).then(function success() {
    res.statusCode = 200;
    res.end('File stored.');
  }, function error(err) {
    res.statusCode = 500;
    res.end('File couldn\'t be stored.');
    console.error(err);
  });
};

module.exports.baseFolderNameSubFolderNameGET = function baseFolderNameSubFolderNameGET(req, res, next) {
// Ensure base folder exists
  if (!req.swagger.params.baseFolderName.value || !tempDocumentStore[req.swagger.params.baseFolderName.value]) {
    res.statusCode = 404;
    res.end('Base folder doesn\'t exist.');
    return;
  }
  
  var baseFolderName = req.swagger.params.baseFolderName.value;
  var baseFolderObjectFromDb = tempDocumentStore[baseFolderName];

  // Ensure folder secret is valid
  if (!req.swagger.params.folderSecret.value || baseFolderObjectFromDb['baseFolderSecret'] !== req.swagger.params.folderSecret.value) {
    res.statusCode = 403;
    res.end('Folder secret not valid.');
    return;
  }

  // Ensure sub folder name variable is set
  var subFolderName = '';

  if (req.swagger.params.subFolderName.value) {
    // Remove ../s to prevent directory traversal
    var subFolderName = String(req.swagger.params.subFolderName.value).replace('../', '');
  }
  
  // concatenate folder name in storage without trailing slashes
  var folderName = String(baseFolderName + '/' + subFolderName).replace(/\/+$/, "");
  
  SelectedStorageStrategy.getElementsInFolder(selectedStorageStrategyConfig, folderName).then(function success(elementsInFolderArray) {
    res.statusCode = 200;
    res.end(JSON.stringify(elementsInFolderArray));
  }, function error(err) {
    res.statusCode = 500;
    res.end('Couldn\'t retrieve elements in folder.');
    console.error(err);
  });
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
