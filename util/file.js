const fs = require('fs');
const deletePath = (deleteFile) => {
    fs.unlink(deleteFile,(err) => {
        if(err){
            throw err;
        }
    });
}

exports.deletePath = deletePath;