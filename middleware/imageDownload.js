const download = require('image-downloader');
const path = require('path');
const fs = require('fs');
var resizeImg = require('resize-img');

module.exports = (req,res,next) => {
    let ext = path.extname(req.body.url);
    const options = {
        url: req.body.url,
        dest: './public/images/'
    };
    if(ext === '.jpeg' || ext === '.jpg' || ext ==='.png' || ext === '.bmp' ) {
        download.image(options)
            .then(({ filename, image }) => {
                resizeImg(
                    fs.readFileSync(filename),
                    {width: 50, height: 50}
                ).then(buf => {
                    fs.writeFileSync("./public/images/thumbnails/new1.png", buf);
                    var image = fs.readFileSync(buf);
                    res.setHeader('content-Type', 'image/png');
                    res.end(image);
                    next();
                })
                .catch((err) => {
                    res.json({
						messsage : err
					});
                })
            })
    } else {
        res.json ({
            Message : "Image extensions allowed -> jpg,jpeg,bmp,png"
        })
    }
};