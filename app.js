import  { stat, readdir, writeFile } from 'fs';
const fileWrite = {files: []};

init();

/**
 * Initialize application
 * 
 */
async function init () {
  const directory = `${process.argv[2]}/`;

  const filesInDir = await readDirectory(directory);
  const filesDetails = await readFiles(directory, filesInDir);
  await writeToFile('filesDetails.json', fileWrite);
  console.log('complete');
}
/**
 * Reads file list in Directory
 * 
 * @param {String} dir 
 * @returns {Array} files list
 */
function readDirectory(dir) {
  return new Promise((res, rej) => {
    readdir(dir, (err, files) => {
      if(err) rej(err);
      res(files);
    });
  });
}

/**
 * Handles Multiple File Reads
 * 
 * @param {String} directory 
 * @param {Array} files
 * @returns {Array} files
 */
function readFiles(directory, files) {
    const filesToRead = [];
    files.forEach((file) => {
      const setFile = `./${directory}${file}`;
      const readSingleFile = readFile(setFile);
      filesToRead.push(readSingleFile);
    });

  return Promise.all(filesToRead);
}

/**
 * Reads details of specific File
 * 
 * @param {String} file 
 * @returns {Object} file details
 */
function readFile(file) {
  return new Promise((res, rej) => {
    stat(file, (err, fileDetails) => {
      if(err) rej(err);

      const properFileName = file.substring(file.lastIndexOf('/')  + 1);
      fileWrite.files.push({ file: file, size: fileDetails.size  });
      return res(fileDetails);
    });
  });
}

/**
 * Writes an object to file
 * 
 * @param {String} file 
 * @param {Object} data 
 * @returns {null}
 */
function writeToFile(file, data) {
  return new Promise((res, rej) => {
    writeFile(file, JSON.stringify(data, null, 2), (err, fileDetails) => {
      if(err) rej(err);
      
      return res();
    });
  });
}