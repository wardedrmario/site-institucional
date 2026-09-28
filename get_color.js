const sharp = require('sharp');
sharp('/Users/marcelogomes/.gemini/antigravity/brain/36cd574f-6075-4d97-a3a3-c1d475d92870/.user_uploaded/media_1790624196579.png')
  .resize(1, 1)
  .raw()
  .toBuffer((err, data, info) => {
    if (err) throw err;
    const hex = '#' + data[0].toString(16).padStart(2, '0') + 
                data[1].toString(16).padStart(2, '0') + 
                data[2].toString(16).padStart(2, '0');
    console.log(hex);
  });
