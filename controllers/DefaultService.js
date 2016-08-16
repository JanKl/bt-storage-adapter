'use strict';

exports.baseFolderNameDELETE = function(args, res, next) {
  /**
   * parameters expected in the args:
  * baseFolderName (String)
  * folderSecret (String)
  **/
  // no response value expected for this operation
  res.end();
}

exports.baseFolderNameGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  * baseFolderName (String)
  * folderSecret (String)
  **/
    var examples = {};
  examples['application/json'] = [ {
  "fileName" : "aeiou",
  "isFolder" : true
} ];
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
}

exports.baseFolderNameSubFolderNameDELETE = function(args, res, next) {
  /**
   * parameters expected in the args:
  * baseFolderName (String)
  * subFolderName (String)
  * folderSecret (String)
  **/
  // no response value expected for this operation
  res.end();
}

exports.baseFolderNameSubFolderNameFileNameDELETE = function(args, res, next) {
  /**
   * parameters expected in the args:
  * baseFolderName (String)
  * subFolderName (String)
  * fileName (String)
  * folderSecret (String)
  **/
  // no response value expected for this operation
  res.end();
}

exports.baseFolderNameSubFolderNameFileNameGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  * baseFolderName (String)
  * subFolderName (String)
  * fileName (String)
  * folderSecret (String)
  **/
    var examples = {};
  examples['application/json'] = "";
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
}

exports.baseFolderNameSubFolderNameFileNamePUT = function(args, res, next) {
  /**
   * parameters expected in the args:
  * baseFolderName (String)
  * subFolderName (String)
  * fileName (String)
  * folderSecret (String)
  * fileData (byte[])
  **/
    var examples = {};
  examples['application/json'] = [ {
  "fileName" : "aeiou",
  "isFolder" : true
} ];
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
}

exports.baseFolderNameSubFolderNameGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  * baseFolderName (String)
  * subFolderName (String)
  * folderSecret (String)
  **/
    var examples = {};
  examples['application/json'] = [ {
  "fileName" : "aeiou",
  "isFolder" : true
} ];
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
}

exports.baseFoldersGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  **/
    var examples = {};
  examples['application/json'] = [ {
  "baseFolderName" : "aeiou",
  "created" : "2000-01-23T04:56:07.000+00:00",
  "lastAccess" : "2000-01-23T04:56:07.000+00:00",
  "remarks" : "aeiou"
} ];
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
}

exports.baseFoldersPOST = function(args, res, next) {
  /**
   * parameters expected in the args:
  * body (BaseFolderCreationData)
  **/
    var examples = {};
  examples['application/json'] = {
  "baseFolderName" : "aeiou",
  "folderSecret" : "aeiou"
};
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
}

