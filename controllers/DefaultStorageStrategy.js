'use strict';

var stream = require('stream');

/**
 * Allows for initialization of the selected storage strategy
 * @param {Object} strategyConfig Specific configuration settings for this
 *                 provider
 * @returns {undefined} No return value
 */
exports.initialize = function (strategyConfig) {
  // Implemetation goes here
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
    // Implementation goes here

    reject(new Error('Dummy method stub'));
  });
};

/**
 * Delete a given object. If the object is a folder, all files and subfolders
 *     will be deleted recursively.
 * @param {String} pathToAndObjectName Path to the file or folder
 * @returns {Promise} On success: resolve()
 *                    On error: reject(new Error())
 */
exports.deleteFileOrFolder = function (pathToAndObjectName) {
  return new Promise(function (resolve, reject) {
    // Implementation goes here

    reject(new Error('Dummy method stub'));
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
    // Implementation goes here

    reject(new Error('Dummy method stub'));
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
    // Implementation goes here

    reject(new Error('Dummy method stub'));
  });
};