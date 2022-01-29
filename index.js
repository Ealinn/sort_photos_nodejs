let fs = require('fs');
let path = require('path');

// Getting all files from the directory and subdirectories
let getFiles = function (dir, files_){
  files_ = files_ || [];
    let files = fs.readdirSync(dir);
    for (let i in files){
        let name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
};

// Creating directories for year and month
let createDirs = function (dirUrlYear, dirUrlMonth){
  if (!fs.existsSync(dirUrlYear)){
    fs.mkdirSync(dirUrlYear);
  }
  if (!fs.existsSync(dirUrlMonth)){
    fs.mkdirSync(dirUrlMonth);
  }
}

// Copy files from src dirrectory to created directories
let copyFiles = function (srcFile, destFile){
  fs.copyFileSync(srcFile, destFile);
}

// Converts date metadata from UTC time to local 
let convertDateToGMT = function (dateMsUTC){
  let dateObj = {};
  let date = new Date(dateMsUTC);
  let options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  let dateGMT = date.toLocaleDateString("uk-UA", options).split('.');
  
  dateObj.year = dateGMT[2];
  dateObj.month = dateGMT[1];

  return dateObj;
}

let files = getFiles('/Users/ealinn/Samsung_S10_lite'); // array of files in src directory

let readAndCopyFiles = function (fileURL){

  let fileName = fileURL.split('/').reverse()[0];

  // Gets the extension of file
  let fileExt = path.extname(fileName).toLowerCase();

  // Exclude files with non specified extensions
  if ((fileExt != '.jpg') && (fileExt != '.png') && (fileExt != '.mp4')) {
    return;
  }

  let metadata = fs.statSync(fileURL);
  if (!metadata.mtimeMs){
    return;
  }
  
  let createYear = convertDateToGMT(metadata.mtimeMs).year;
  let createMonth = convertDateToGMT(metadata.mtimeMs).month;
  let dirUrlYear = '/Users/ealinn/Sorted_photos/' + createYear; // url for "year directory"
  let dirUrlMonth = '/Users/ealinn/Sorted_photos/' + createYear + '/' + createMonth; // url for "month directory"
  let destFile = dirUrlMonth + '/' + fileName; //url for destination file

  createDirs(dirUrlYear, dirUrlMonth);
  copyFiles(fileURL, destFile);

}

files.forEach(file => readAndCopyFiles(file));