'use strict';

var url = require('url');


var Default = require('./DefaultService');


module.exports.baseFolderNameDELETE = function baseFolderNameDELETE (req, res, next) {
  Default.baseFolderNameDELETE(req.swagger.params, res, next);
};

module.exports.baseFolderNameGET = function baseFolderNameGET (req, res, next) {
  Default.baseFolderNameGET(req.swagger.params, res, next);
};

module.exports.baseFolderNameSubFolderNameDELETE = function baseFolderNameSubFolderNameDELETE (req, res, next) {
  Default.baseFolderNameSubFolderNameDELETE(req.swagger.params, res, next);
};

module.exports.baseFolderNameSubFolderNameFileNameDELETE = function baseFolderNameSubFolderNameFileNameDELETE (req, res, next) {
  Default.baseFolderNameSubFolderNameFileNameDELETE(req.swagger.params, res, next);
};

module.exports.baseFolderNameSubFolderNameFileNameGET = function baseFolderNameSubFolderNameFileNameGET (req, res, next) {
  Default.baseFolderNameSubFolderNameFileNameGET(req.swagger.params, res, next);
};

module.exports.baseFolderNameSubFolderNameFileNamePUT = function baseFolderNameSubFolderNameFileNamePUT (req, res, next) {
  Default.baseFolderNameSubFolderNameFileNamePUT(req.swagger.params, res, next);
};

module.exports.baseFolderNameSubFolderNameGET = function baseFolderNameSubFolderNameGET (req, res, next) {
  Default.baseFolderNameSubFolderNameGET(req.swagger.params, res, next);
};

module.exports.baseFoldersGET = function baseFoldersGET (req, res, next) {
  Default.baseFoldersGET(req.swagger.params, res, next);
};

module.exports.baseFoldersPOST = function baseFoldersPOST (req, res, next) {
  Default.baseFoldersPOST(req.swagger.params, res, next);
};
