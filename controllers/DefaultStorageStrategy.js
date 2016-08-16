'use strict';

var stream = require('stream');

/**
 * Returns an array with informations on all elements in the folder with the
 * given folderName.
 * @param {Object} strategyConfig Specific configuration settings for this
 *                 provider
 * @param {String} folderName Name of the folder
 * @returns {Array} An array containing objects of the following scheme:
 *                  {fileName: string, isFolder: boolean}
 */
exports.getElementsInFolder = function (strategyConfig, folderName) {
  return [];
};

/**
 * Recursively delete all files and subfolders in a specific folder.
 * @param {Object} strategyConfig Specific configuration settings for this
 *                 provider
 * @param {String} folderName Name of the folder
 * @returns {Boolean} True if deletion successful, false otherwise
 */
exports.deleteElementsAndFolder = function (strategyConfig, folderName) {
  return false;
};

/**
 * Delete a single object from a specific folder.
 * @param {Object} strategyConfig Specific configuration settings for this
 *                 provider
 * @param {String} folderName Name of the folder
 * @param {String} fileName Name of the file
 * @returns {Boolean} True if deletion successful, false otherwise
 */
exports.deleteFileFromFolder = function (strategyConfig, folderName, fileName) {
  return false;
};

/**
 * Retrieves the contents of a file in the folder.
 * @param {Object} strategyConfig Specific configuration settings for this
 *                 provider
 * @param {String} folderName Name of the folder
 * @param {String} fileName Name of the file
 * @returns {ReadStream} Data of the object, equals to null if not found
 */
exports.getFileFromFolder = function (strategyConfig, folderName, fileName) {
  return new stream.Readable({objectMode: true});
  ;
};

/**
 * Stores the contents of a file in the folder.
 * @param {Object} strategyConfig Specific configuration settings for this
 *                 provider
 * @param {String} folderName Name of the folder
 * @param {String} fileName Name of the file
 * @param {ReadStream} fileData Data of the object
 * @returns {Promise}
 */
exports.putFileIntoFolder = function (strategyConfig, folderName, fileName, fileData) {
  return new Promise(function (resolve, reject) {
    // Implementation goes here
    // On success: resolve(data)
    // On error: reject(new Error)
    reject(new Error('Dummy method stub'));
  });
};