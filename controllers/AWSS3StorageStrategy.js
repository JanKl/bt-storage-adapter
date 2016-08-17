/* global process */

'use strict';

var stream = require('stream');
var AWS = require('aws-sdk');
var s3 = null;
var s3config = null;

/**
 * Allows for initialization of the selected storage strategy
 * @param {Object} strategyConfig Specific configuration settings for this
 *                 provider
 * @returns {undefined} No return value
 */
exports.initialize = function (strategyConfig) {
  s3config = strategyConfig;

  // Store acutal config and instantiate the s3 object
  AWS.config.update({
    accessKeyId: strategyConfig.accessKeyId,
    secretAccessKey: strategyConfig.secretAccessKey,
    region: strategyConfig.region
  });

  s3 = new AWS.S3();

  // Try to create the bucket
  var params = {
    Bucket: strategyConfig.bucket
  };

  s3.createBucket(params, function (err, data) {
    if (err && err.code !== 'BucketAlreadyOwnedByYou') {
      console.log(err);
      process.exit(1);
    }

    console.log('AWS S3 bucket ' + strategyConfig.bucket + ' is ready');
  });
};

/**
 * Returns an array with informations on all elements in the folder with the
 * given folderName.
 * @param {String} folderName Name of the folder
 * @returns {Promise} On success: resolve(new Array())
 *                     An array containing objects of the following scheme:
 *                     {fileName: string, isFolder: boolean}
 *                    On error: reject(new Error())
 */
exports.getElementsInFolder = function (folderName) {
  return new Promise(function (resolve, reject) {
    getKeysUnder(folderName, null, reject, function (arrayOfSubkeys) {
      var responseArray = [];
      var lastObjectName = '';
      var folderNameLength = folderName.length;

      for (var i = 0; i < arrayOfSubkeys.length; ++i) {
        // folderNameLength + 1 to catch the / after the folderName
        var objectNameWithoutPrefixPath = arrayOfSubkeys[i]['Key'].substring(folderNameLength + 1);
        var objectNameReleased = objectNameWithoutPrefixPath.replace(/\/(.*)$/, "");

        // prevent duplicates
        if (lastObjectName === objectNameReleased) {
          continue;
        }

        lastObjectName = objectNameReleased;

        responseArray.push({
          fileName: objectNameReleased,
          isFolder: (objectNameReleased !== objectNameWithoutPrefixPath)
        });
      }

      resolve(responseArray);
    });
  });
};

function getKeysUnder(folderName, continuationToken, errorCallback, successCallback) {
  var params = {
    Bucket: s3config.bucket,
    Prefix: folderName,
    MaxKeys: 5
  };

  // The continuation token is used to concatenate truncated returns
  if (continuationToken) {
    params['ContinuationToken'] = continuationToken;
  }

  s3.listObjectsV2(params, function (err, data) {
    if (err) {
      errorCallback(err);
    } else {
      if (data['IsTruncated']) {
        // There are more objects. Reiterate this function and join the results
        getKeysUnder(folderName, data['NextContinuationToken'], errorCallback, function success(nextObjectsArray) {
          successCallback(data['Contents'].concat(nextObjectsArray));
        });
      } else {
        successCallback(data['Contents']);
      }
    }
  });
}

/**
 * Delete a given object. If the object is a folder, all files and subfolders
 *     will be deleted recursively.
 * @param {String} pathToAndObjectName Path to the file or folder
 * @returns {Promise} On success: resolve()
 *                    On error: reject(new Error())
 */
exports.deleteFileOrFolder = function (pathToAndObjectName) {
  return new Promise(function (resolve, reject) {
    var params = {
      Bucket: s3config.bucket,
      Key: pathToAndObjectName
    };

    s3.deleteObject(params, function (err, data) {
      if (err) {
        if (err.code === 'NoSuchKey') {
          reject(new Error('FileNotFound'));
        } else {
          reject(err);
        }
      } else {
        resolve(data.Body);
      }
    });
  });
};

/**
 * Retrieves the contents of a file in the folder.
 * @param {String} folderName Name of the folder
 * @param {String} fileName Name of the file
 * @returns {Promise} On success: resolve(new stream.Readable({objectMode: true}))
 *                    On error: reject(new Error())
 */
exports.getFileFromFolder = function (folderName, fileName) {
  return new Promise(function (resolve, reject) {
    var objectKey = folderName + '/' + fileName;

    var params = {
      Bucket: s3config.bucket,
      Key: objectKey
    };

    s3.getObject(params, function (err, data) {
      if (err) {
        if (err.code === 'NoSuchKey') {
          reject(new Error('FileNotFound'));
        } else {
          reject(err);
        }
      } else {
        resolve(data.Body);
      }
    });
  });
};

/**
 * Stores the contents of a file in the folder.
 * @param {String} folderName Name of the folder
 * @param {String} fileName Name of the file
 * @param {ReadStream} fileData Data of the object
 * @returns {Promise} On success: resolve()
 *                    On error: reject(new Error())
 */
exports.putFileIntoFolder = function (folderName, fileName, fileData) {
  return new Promise(function (resolve, reject) {
    var objectKey = folderName + '/' + fileName;

    if (objectKey.length > 1024) {
      reject(new Error('PathTooLong'));
      return;
    }

    var params = {
      Bucket: s3config.bucket,
      Key: objectKey,
      Body: fileData
    };

    s3.upload(params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};