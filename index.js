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
  // console.log("dateMsUTC: ", dateMsUTC);
  let dateObj = {};
  let date = new Date(dateMsUTC * 1000);

  // console.log("date: ", date);

  let options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  let dateGMT = date.toLocaleDateString("uk-UA", options).split('.');
  
  // console.log("dateGMT: ", dateGMT);

  dateObj.year = dateGMT[2];
  dateObj.month = dateGMT[1];

  // console.log("dateObj: ", dateObj);

  return dateObj;
}

// Parse JSON to get photo's creation time
let notJsonArr = [];

let jsonParse = function (jsonFile){
  if (fs.existsSync(jsonFile)) {
    let json = fs.readFileSync(jsonFile);
    let exif = JSON.parse(json);
    // console.log(exif);

    return exif;
  } else {
    notJsonArr.push(jsonFile);
  }


  // try {
  //   if (fs.existsSync(jsonFile)) {
  //     let json = fs.readFileSync(jsonFile);
  //     let exif = JSON.parse(json);
  //     // console.log(exif);

  //     return exif;
  //   }
  // } catch (err) {
  //   console.error(err);
  //   notJsonArr.push(jsonFile);
  // }
  // let json = fs.readFileSync(jsonFile);
  // let exif = JSON.parse(json);
  // // console.log(exif);

  // return exif;
}

let files = getFiles('/Users/tok/GooglePhoto-01.02.2022/Takeout'); // array of files in src directory

let i = 0;

let readAndCopyFiles = function (fileURL){
  let createTimeUTC;
  let fileName = fileURL.split('/').reverse()[0];

  let fileExt = path.extname(fileName).toLowerCase();

  if ((fileExt == '.jpg') || (fileExt == '.png') || (fileExt == '.mp4') || (fileExt == '.3gp')) {
    let jsonFile = fileURL + ".json";
    createTimeUTC = +jsonParse(jsonFile)?.photoTakenTime?.timestamp;
  }


  // console.log(fileName);
  // console.log(jsonFile);


  // console.log("createTimeUTC: ", createTimeUTC);

  // Gets the extension of file
  

  // Exclude files with non specified extensions
  if ((fileExt != '.jpg') && (fileExt != '.png') && (fileExt != '.mp4') && (fileExt != '.3gp')) {
    return;
  }

  // let metadata = fs.statSync(fileURL);
  // console.log(metadata);
  // if (!metadata.mtimeMs){
  //   return;
  // }
  if (!createTimeUTC){
    return;
  }

  let createYear = convertDateToGMT(createTimeUTC).year;
  let createMonth = convertDateToGMT(createTimeUTC).month;
  // let createYear = convertDateToGMT(metadata.mtimeMs).year;
  // let createMonth = convertDateToGMT(metadata.mtimeMs).month;
  let dirUrlYear = '/Users/tok/GooglePhoto-01.02.2022/Sorted/' + createYear; // url for "year directory"
  let dirUrlMonth = '/Users/tok/GooglePhoto-01.02.2022/Sorted/' + createYear + '/' + createMonth; // url for "month directory"
  let destFile = dirUrlMonth + '/' + fileName; //url for destination file

  console.log(i);
  console.log("src: ", fileURL);
  // console.log("createYear: ", createYear);
  // console.log("createMonth: ", createMonth);
  console.log("dest: ", destFile);

  createDirs(dirUrlYear, dirUrlMonth);
  copyFiles(fileURL, destFile);

  i++;
}

files.forEach(file => readAndCopyFiles(file));
// readAndCopyFiles("/Users/tok/GooglePhoto-01.02.2022/Takeout/Google Photos/Photos from 2019/IMG_20191227_222948.jpg");
let dataNotJsonArr = notJsonArr.toString();
fs.writeFileSync('/Users/tok/GooglePhoto-01.02.2022/Sorted/notJSON.txt', dataNotJsonArr);
// console.log(notJsonArr);