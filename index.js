var fs = require('fs');
// var path = require('path');
var exif = require('exiftool');

var getFiles = function (dir, files_){
    
  files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
};

var files = getFiles('/Users/ealinn/Samsung_S10_lite');


fs.readFile(files[305], function (err, data) {
  if (err) {
    throw err;
  }
  else {
    exif.metadata(data, function (err, metadata) {
      if (err) {
        throw err;
      }
      else {
        console.log(metadata);
      }
    });
  }
});

