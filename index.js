let fs = require('fs');
// let path = require('path');
let exif = require('exiftool');

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

let createDirs = function (dirUrlYear, dirUrlMonth){

  if (!fs.existsSync(dirUrlYear)){
    fs.mkdirSync(dirUrlYear);
  }
  if (!fs.existsSync(dirUrlMonth)){
    fs.mkdirSync(dirUrlMonth);
  }
}

let files = getFiles('/Users/ealinn/Samsung_S10_lite');
let file = files[305];

let readFiles = function (file){
  fs.readFile(file, function (err, data) {
    if (err) {
      throw err;
    }
    else {
      exif.metadata(data, function (err, metadata) {
        if (err) {
          throw err;
        }
        else {
          let createDate = metadata.createDate.split(' ')[0];
          let createYear = createDate.split(':')[0];
          let createMonth = createDate.split(':')[1];
          let dirUrlYear = '/Users/ealinn/Samsung_S10_lite/Sorted_photos/' + createYear;
          let dirUrlMonth = '/Users/ealinn/Samsung_S10_lite/Sorted_photos/' + createYear + '/' + createMonth;
          // console.log(createDate, createYear, createMonth);
          // console.log(file);
          createDirs(dirUrlYear, dirUrlMonth);
        }
      });
    }
  });
}

readFiles(file);