/* global process, Promise */

'use strict';

var stream = require('stream');
var azure = require('azure-storage');
var blobService = null;
var azureConfig = null;

/**
 * Allows for initialization of the selected storage strategy
 * @param {Object} strategyConfig Specific configuration settings for this
 *                 provider
 * @returns {undefined} No return value
 */
exports.initialize = function (strategyConfig) {
  azureConfig = strategyConfig;

  blobService = azure.createBlobService(strategyConfig.storageAccount, strategyConfig.storageAccessKey);
  blobService.createContainerIfNotExists(strategyConfig.container, function (err) {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    console.log('Azure blob container ' + strategyConfig.container + ' is ready');
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
        var objectNameWithoutPrefixPath = arrayOfSubkeys[i]['name'].substring(folderNameLength + 1);
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
  // The continuation token is used to concatenate truncated returns
  blobService.listBlobsSegmentedWithPrefix(azureConfig.container, folderName, continuationToken, function (err, data, response) {
    if (err) {
      errorCallback(err);
    } else {
      if (data.continuationToken) {
        // There are more objects. Reiterate this function and join the results
        getKeysUnder(folderName, data['continuationToken'], errorCallback, function success(nextObjectsArray) {
          successCallback(data['entries'].concat(nextObjectsArray));
        });
      } else {
        successCallback(data.entries);
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
    blobService.deleteBlob(azureConfig.container, pathToAndObjectName, function (err) {
      if (err) {
        if (err.code === 'BlobNotFound') {
          // azure cannot delete folders ... very sad. We'll have to do this
          // ourselves. For this to complete, we assume that this is a folder.
          deleteRecursively(pathToAndObjectName).then(resolve, reject);
        } else {
          reject(err);
        }
      } else {
        resolve();
      }
    });
  });
};

function deleteRecursively(folderName) {
  return new Promise(function (resolve, reject) {
    getKeysUnder(folderName, null, reject, function (data) {
      var deleteFilePromises = [];

      for (var i = 0; i < data.length; ++i) {
        deleteFilePromises.push(deleteFile(data[i].name));
      }

      Promise.all(deleteFilePromises).then(resolve, reject);
    });
  });
}

function deleteFile(pathAndFileName) {
  return new Promise(function (resolve, reject) {
    blobService.deleteBlob(azureConfig.container, pathAndFileName, function (err) {
      if (err) {
        if (err.code === 'BlobNotFound') {
          reject(new Error('FileNotFound'));
        } else {
          reject(err);
        }
      } else {
        resolve();
      }
    });
  });
}

/**
 * Retrieves the contents of a file in the folder.
 * @param {String} folderName Name of the folder
 * @param {String} fileName Name of the file
 * @returns {Promise} On success: resolve(new stream.Readable({objectMode: true}))
 *                    On error: reject(new Error())
 */
exports.getFileFromFolder = function (folderName, fileName) {
  return new Promise(function (resolve, reject) {
    var blobName = folderName + '/' + fileName;

    blobService.getBlobToText(azureConfig.container, blobName, function (err, serverBlob) {
      if (err) {
        if (err.code === 'BlobNotFound') {
          reject(new Error('FileNotFound'));
        } else {
          reject(err);
        }
      } else {
        resolve(serverBlob);
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
    var blobName = folderName + '/' + fileName;

    if (blobName.length > 1024) {
      reject(new Error('PathTooLong'));
      return;
    }

    blobService.createBlockBlobFromText(azureConfig.container, blobName, fileData, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};