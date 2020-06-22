# multer-sharp-resizer

[Multer-sharp-resizer](https://www.npmjs.com/package/multer-sharp-resizer) is a package for Resizing single/multiple images with node.js, express.js, multer.js [Multer documentation](https://www.npmjs.com/package/multer) and sharp.js [sharp documentation](https://www.npmjs.com/package/sharp).

> **Multer-sharp-resizer:** Resize one image or multiple images to multiple sizes with node.js, express.js, multer.js

# Documentation

see more details [Docs](https://github.com/mohammadoftadeh/multer-sharp-resizer).

# Installation

npm:

```
$ npm i multer multer-sharp-resizer
```

yarn:

```
$ yarn add multer multer-sharp-resizer
```

# Usage

```javascript
const express = require("express");
const multer = require("multer");
const MulterSharpResizer = require("multer-sharp-resizer");

    ...

    const today = new Date();
    const year = today.getFullYear();
    const month = `${today.getMonth() + 1}`.padStart(2, "0");

    const filename = `gallery-${Date.now()}`;

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
    await resizeObj.resize();

    // get details of uploaded files
    const images = resizeObj.getData();

    ....
```

#### example for uploading multiple/single images:

```javascript
const express = require("express");
const app = express();
const multer = require("multer");
const MulterSharpResizer = require("multer-sharp-resizer");

app.use(express.static(`${__dirname}/public`));
app.use(express.json());

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

// *****  Multer .fields() *****
const uploadProductImages = upload.fields([
  { name: "cover", maxCount: 2 },
  { name: "gallery", maxCount: 4 },
]);

// *****  Multer .array() *****
// const uploadProductImages = upload.array("gallery", 4);

// *****  Multer .single() *****
// const uploadProductImages = upload.single("cover");

const resizerImages = async (req, res, next) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = `${today.getMonth() + 1}`.padStart(2, "0");

  // Used by multer .array() or .single
  // const filename = `gallery-${Date.now()}`;

  // Used by multer .fields and filename must be same object prop
  const filename = {
    cover: `cover-${Date.now()}`,
    gallery: `gallery-${Date.now()}`,
  };

  const sizes = [
    {
      path: "original",
      width: null,
      height: null,
    },
    {
      path: "large",
      width: 800,
      height: 950,
    },
    {
      path: "medium",
      width: 300,
      height: 450,
    },
    {
      path: "thumbnail",
      width: 100,
      height: 250,
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
  await resizeObj.resize();
  const getDataUploaded = resizeObj.getData();

  // Get details of uploaded files: Used by multer fields
  req.body.cover = getDataUploaded.cover;
  req.body.gallery = getDataUploaded.gallery;

  // Get details of uploaded files: Used by multer .array() or .single()
  // req.body.cover = getDataUploaded;
  // req.body.gallery = getDataUploaded;

  next();
};

const createProduct = async (req, res, next) => {
  res.status(201).json({
    status: "success",
    cover: req.body.cover,
    gallery: req.body.gallery,
  });
};

// route for see results of uploaded images
app.post("/products", uploadProductImages, resizerImages, createProduct);

const port = 8000;
app.listen(port, () => console.log(`app running on port ${port}...`));
```

### Outputs of above examples:

```json
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
            ....
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


// example uploading multer fields
// result: uploaded image with grouping by field and resizing
{
    "status": "success",
    "cover": [
        {
            "originalname": "screencapture-cart-2020-04-28-11_34_35.png",
            "original": {
                "filename": "cover-1592806057900-0-original.png",
                "path": "http://127.0.0.1:8000/uploads/2020/06/original/cover-1592806057900-0-original.png"
            },
            "large": {
                "filename": "cover-1592806057900-0-large.png",
                "path": "http://127.0.0.1:8000/uploads/2020/06/large/cover-1592806057900-0-large.png"
            },
            "medium": {
                "filename": "cover-1592806057900-0-medium.png",
                "path": "http://127.0.0.1:8000/uploads/2020/06/medium/cover-1592806057900-0-medium.png"
            },
            "thumbnail": {
                "filename": "cover-1592806057900-0-thumbnail.png",
                "path": "http://127.0.0.1:8000/uploads/2020/06/thumbnail/cover-1592806057900-0-thumbnail.png"
            }
        },
        ....
    ],
    "gallery": [
        {
            "originalname": "andre-hunter-p-I9wV811qk-unsplash.jpg",
            "original": {
                "filename": "gallery-1592806057900-0-original.jpeg",
                "path": "http://127.0.0.1:8000/uploads/2020/06/original/gallery-1592806057900-0-original.jpeg"
            },
            "large": {
                "filename": "gallery-1592806057900-0-large.jpeg",
                "path": "http://127.0.0.1:8000/uploads/2020/06/large/gallery-1592806057900-0-large.jpeg"
            },
            "medium": {
                "filename": "gallery-1592806057900-0-medium.jpeg",
                "path": "http://127.0.0.1:8000/uploads/2020/06/medium/gallery-1592806057900-0-medium.jpeg"
            },
            "thumbnail": {
                "filename": "gallery-1592806057900-0-thumbnail.jpeg",
                "path": "http://127.0.0.1:8000/uploads/2020/06/thumbnail/gallery-1592806057900-0-thumbnail.jpeg"
            }
        },
        ....
    ]
}
```

### Params

```javascript
/**
 * Constructor method
 * @param  {object} req
 * @param  {string || object} filename
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
| filename     | `String for array/single and Object{ } for multer fields` Set custom filename for storage                 |
| sizes        | Array of objects sizes for storage image with multiple sizes                                              |
| uploadPath   | Set custom path for storage uploaded files                                                                |
| fileUrl      | Set url for access files with url(link)                                                                   |
| sharpOptions | `Default: { }` , Also you can use any sharp options from [sharp.js doc](https://sharp.pixelplumbing.com/) |

### Sizing structure

```javascript
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
