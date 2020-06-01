# multer-sharp-resizer

[Multer-sharp-resizer](https://www.npmjs.com/package/multer-sharp-resizer) is a package for Resizing single/multiple images with node.js, express.js, multer.js [Multer documentation](https://www.npmjs.com/package/multer) and sharp.js [sharp documentation](https://www.npmjs.com/package/sharp).

> **Multer-sharp-resizer:** Resize one image or multiple images to multiple sizes with node.js, express.js, multer.js

# Documentation

see more details [Docs](https://github.com/mohammadoftadeh/multer-sharp-resizer).

# Installation

npm:

`npm i multer-sharp-resizer`

yarn:

`yarn add multer-sharp-resizer`

# Usage

example for uploading multiple/single images:

```const express = require("express");
const multer = require("multer");
const MulterSharpResizer = require("multer-sharp-resizer");

const app = express();

app.use(express.static(`${__dirname}/public`));

const multerStorage = multer.memoryStorage();

// Filter files with multer
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Not an image! Please upload only images.", false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// upload multiple images example
// resize multiple images function
const resizeImagesGalleryFunc = async (req, res) => {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = `${today.getMonth() + 1}`.padStart(2, "0");

    const filename = `gallery-${Date.now()}.jpeg`;

    const sizes = [
      {
        path: "original",
        width: null,
        height: null,
      },
      {
        path: "large",
        width: 800,
        height: 800,
      },
      {
        path: "medium",
        width: 300,
        height: 300,
      },
      {
        path: "thumbnail",
        width: 100,
        height: 100,
      },
    ];

    const uploadPath = `./public/uploads/${year}/${month}`;

    const fileUrl = `${req.protocol}://${req.get(
      "host"
    )}/uploads/${year}/${month}`;

    // sharp options
    const sharpOptions = {
      fit: "contain",
      background: { r: 255, g: 255, b: 255 },
    };

    // create a new instance of MulterSharpResizer and pass params
    const resizeObj = new MulterSharpResizer(
      req,
      filename,
      sizes,
      uploadPath,
      fileUrl,
      sharpOptions
    );

    // call resize method for resizing files
    resizeObj.resize();

    // get details of uploaded files
    const images = resizeObj.getData();

    res.status(200).json({
      status: "success",
      data: {
        gallery: images,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

// upload single image example
// resize single image function
const resizeImagesSingleFunc = async (req, res) => {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = `${today.getMonth() + 1}`.padStart(2, "0");

    const filename = `profile-${Date.now()}.jpeg`;

    const sizes = [
      {
        path: "original",
        width: null,
        height: null,
      },
      {
        path: "large",
        width: 800,
        height: 800,
      },
      {
        path: "medium",
        width: 300,
        height: 300,
      },
      {
        path: "thumbnail",
        width: 100,
        height: 100,
      },
    ];

    const uploadPath = `./public/uploads/${year}/${month}`;

    const fileUrl = `${req.protocol}://${req.get(
      "host"
    )}/uploads/${year}/${month}`;

    const sharpOptions = {
      fit: "contain",
      background: { r: 255, g: 255, b: 255 },
    };

    const resizeObj2 = new MulterSharpResizer(
      req,
      filename,
      sizes,
      uploadPath,
      fileUrl,
      sharpOptions
    );
    resizeObj2.resize();
    const image = resizeObj2.getData();

    res.status(200).json({
      status: "success",
      data: {
        avatar: image,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

// route for see results of uploaded multiple images
app.post("/bulk", upload.array("galleries", 4), resizeImagesGalleryFunc);

// route for see results of uploaded single image
app.post("/single", upload.single("profile"), resizeImagesSingleFunc);

const port = 8000;
app.listen(port, () => console.log("server running on port 8000..."));
```

### Outputs of above examples:

```
// example uploading multiple files
// result: uploaded multiple images with resizing
{
    "status": "success",
    "data": {
        "gallery": [
            {
                "originalname": "kal-visuals-b1Hg7QI-zcc-unsplash.jpg",
                "original": {
                    "filename": "gallery-1590999763786-0-original.jpeg",
                    "path": "http://127.0.0.1:8000/uploads/2020/06/original/gallery-1590999763786-0-original.jpeg"
                },
                "large": {
                    "filename": "gallery-1590999763786-0-large.jpeg",
                    "path": "http://127.0.0.1:8000/uploads/2020/06/large/gallery-1590999763786-0-large.jpeg"
                },
                "medium": {
                    "filename": "gallery-1590999763786-0-medium.jpeg",
                    "path": "http://127.0.0.1:8000/uploads/2020/06/medium/gallery-1590999763786-0-medium.jpeg"
                },
                "thumbnail": {
                    "filename": "gallery-1590999763786-0-thumbnail.jpeg",
                    "path": "http://127.0.0.1:8000/uploads/2020/06/thumbnail/gallery-1590999763786-0-thumbnail.jpeg"
                }
            },
            {
                "originalname": "lesly-juarez-RukI4qZGlQs-unsplash.jpg",
                "original": {
                    "filename": "gallery-1590999763786-1-original.jpeg",
                    "path": "http://127.0.0.1:8000/uploads/2020/06/original/gallery-1590999763786-1-original.jpeg"
                },
                "large": {
                    "filename": "gallery-1590999763786-1-large.jpeg",
                    "path": "http://127.0.0.1:8000/uploads/2020/06/large/gallery-1590999763786-1-large.jpeg"
                },
                "medium": {
                    "filename": "gallery-1590999763786-1-medium.jpeg",
                    "path": "http://127.0.0.1:8000/uploads/2020/06/medium/gallery-1590999763786-1-medium.jpeg"
                },
                "thumbnail": {
                    "filename": "gallery-1590999763786-1-thumbnail.jpeg",
                    "path": "http://127.0.0.1:8000/uploads/2020/06/thumbnail/gallery-1590999763786-1-thumbnail.jpeg"
                }
            },
            {
                "originalname": "michael-dam-mEZ3PoFGs_k-unsplash.jpg",
                "original": {
                    "filename": "gallery-1590999763786-2-original.jpeg",
                    "path": "http://127.0.0.1:8000/uploads/2020/06/original/gallery-1590999763786-2-original.jpeg"
                },
                "large": {
                    "filename": "gallery-1590999763786-2-large.jpeg",
                    "path": "http://127.0.0.1:8000/uploads/2020/06/large/gallery-1590999763786-2-large.jpeg"
                },
                "medium": {
                    "filename": "gallery-1590999763786-2-medium.jpeg",
                    "path": "http://127.0.0.1:8000/uploads/2020/06/medium/gallery-1590999763786-2-medium.jpeg"
                },
                "thumbnail": {
                    "filename": "gallery-1590999763786-2-thumbnail.jpeg",
                    "path": "http://127.0.0.1:8000/uploads/2020/06/thumbnail/profile-1590999763786-2-thumbnail.jpeg"
                }
            }
        ]
    }
}

------------------------------------------------------------------------------------------------------

// example uploading single file
// result: uploaded single image with resizing
{
    "status": "success",
    "data": {
        "avatar": [
            {
                "originalname": "nicolas-horn-MTZTGvDsHFY-unsplash.jpg",
                "original": {
                    "filename": "profile-1590999720386-original.jpeg",
                    "path": "http://127.0.0.1:8000/uploads/2020/06/original/profile-1590999720386-original.jpeg"
                },
                "large": {
                    "filename": "profile-1590999720386-large.jpeg",
                    "path": "http://127.0.0.1:8000/uploads/2020/06/large/profile-1590999720386-large.jpeg"
                },
                "medium": {
                    "filename": "profile-1590999720386-medium.jpeg",
                    "path": "http://127.0.0.1:8000/uploads/2020/06/medium/profile-1590999720386-medium.jpeg"
                },
                "thumbnail": {
                    "filename": "profile-1590999720386-thumbnail.jpeg",
                    "path": "http://127.0.0.1:8000/uploads/2020/06/thumbnail/profile-1590999720386-thumbnail.jpeg"
                }
            }
        ]
    }
}
```

### Params

```
/**
* Constructor method
* @param  {object} req
* @param  {string} filename
* @param  {array} sizes
* @param  {string} uploadPath
* @param  {string} fileUrl
* @param  {Object} sharpOptions
*/
const resizeObj = new MulterSharpResizer(
    req,
    filename,
    sizes,
    uploadPath,
    fileUrl,
    sharpOptions
);
```

| param        | role                                                                                                      |
| ------------ | --------------------------------------------------------------------------------------------------------- |
| req          | Express request object                                                                                    |
| filename     | Set custom filename for storage                                                                           |
| sizes        | Array of objects sizes for storage image with multiple sizes                                              |
| uploadPath   | Set custom path for storage uploaded files                                                                |
| fileUrl      | Set url for access files with url(link)                                                                   |
| sharpOptions | `Default: { }` , Also you can use any sharp options from [sharp.js doc](https://sharp.pixelplumbing.com/) |

### Sizing structure

```
const sizes = [
    {
        path: "original",
        width: null,
        height: null,
    },
    {
        path: "large",
        width: 800,
        height: 800,
    },
    {
        path: "medium",
        width: 300,
        height: 300,
    },
    {
        path: "thumbnail",
        width: 100,
        height: 100,
    },
];
```

| property | value                                                                |
| -------- | -------------------------------------------------------------------- |
| path     | Set any name of directory and suffix for storage file after uploaded |
| width    | Set `width` for resizing                                             |
| height   | Set `height` for resizing                                            |

> If `set` **`width: null`** and **`height: null`** , **The original size is saved by default**

## License

[MIT](https://opensource.org/licenses/MIT)
