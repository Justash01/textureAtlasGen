const fs = require("fs");
var settings = fs.readFileSync(`../settings.json`, 'utf8');
var blockTexturePath = JSON.parse(settings).block_textures_path;
var jsonInd = JSON.parse(settings).indent;
var path = require('path');
const normalize = require('normalize-path');

var data = {};
data.resource_pack_name = "vanilla";
data.texture_name = "atlas.terrain";
data.padding = JSON.parse(settings).padding;
data.num_mip_levels = JSON.parse(settings).num_mip_levels;
data.texture_data = {};

if (fs.existsSync(blockTexturePath)) {
  const getImages = function (dirPath, images) {
    files = fs.readdirSync(dirPath)
    images = images || []
    files.forEach(function (file) {
      if (path.extname(file) == JSON.parse(settings).supportedTextures[0] || JSON.parse(settings).supportedTextures[1]) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
          images = getImages(dirPath + "/" + file, images)
        } else {
          images.push(path.join(__dirname, dirPath, "/", file))
        };
      };
    });
    return images;
  };
  const result = getImages(blockTexturePath);

  for (let i = 0; i < result.length; i++) {
    var pngFiles = result[i];
    var pngFileName = path.basename(result[i]);
    var absPath = /textures(.*)/.exec(normalize(pngFiles))[0];
    data.texture_data[`${pngFileName.split(".")[0]}`] = {};
    data.texture_data[`${pngFileName.split(".")[0]}`]["textures"] = absPath.split(".")[0];
  };

  fs.writeFile(`${blockTexturePath.split("textures")[0]}textures/terrain_texture.json`, JSON.stringify(data, null, jsonInd), function (err) {
    if (err) throw err;
  });
};