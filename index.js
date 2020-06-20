const fs = require("fs-extra");
const sharp = require("sharp");

module.exports = class MulterSharpResizer {
  /**
   * Constructor method
   * @param  {object} req
   * @param  {string} filename
   * @param  {array} sizes
   * @param  {string} uploadPath
   * @param  {string} fileUrl
   * @param  {Object} sharpOptions
   */
  constructor(req, filename, sizes, uploadPath, fileUrl, sharpOptions) {
    this.req = req;
    this.filename = filename;
    this.sizes = sizes;
    this.uploadPath = uploadPath;
    this.sharpOptions = sharpOptions || {};
    this.fileUrl = fileUrl;
    this.filesUploaded = [];
    this.imageExt = null;
    this.imageFilename = null;
    this.imageUploadPath = null;
    this.data = [];
    this.tmpOriginalname = null;
  }

  /**
   * Resize files method
   */
  async resize() {
    // Check multiple files
    if (!this.req.files) {
      return await this.promiseAllResize(this.req.file);
    }

    // Promise.all() multiple files for resizing
    await Promise.all(
      this.req.files.map(async (file, i) => {
        await this.promiseAllResize(file, i);
      })
    );
  }

  /**
   * Get Data method
   * Data transform, preparation and return
   */
  getData() {
    // Check multiple files
    // Categorize files by size
    if (this.req.files) {
      for (let i = 0; i < this.req.files.length - 1; i++) {
        this.data.push({
          ...this.filesUploaded.splice(0, this.sizes.length),
        });
      }
    }

    this.data.push(this.filesUploaded);

    return this.data.map((file) =>
      this.renameKeys({ ...this.sizes.map((size, i) => size.path) }, file)
    );
  }

  /**
   * Change keys name method
   * @param  {object} keysMap
   * @param  {object} obj
   */
  renameKeys(keysMap, obj) {
    return Object.keys(obj).reduce((acc, key) => {
      this.tmpOriginalname = obj[key].originalname;
      delete obj[key].originalname;
      return {
        ...acc,
        originalname: this.tmpOriginalname,
        ...{ [keysMap[key] || key]: obj[key] },
      };
    }, {});
  }

  /**
   * Promise.all() for resize files method
   * @param  {object} file
   * @param  {number} i
   */
  promiseAllResize(file, i) {
    Promise.all(
      this.sizes.map((size) => {
        this.imageExt = file.mimetype.split("/")[1];
        this.imageFilename = `${this.filename.split(/\.([^.]+)$/)[0]}${
          i != undefined ? `-${i}` : ""
        }-${size.path}.${this.imageExt}`;
        this.imageUploadPath = this.uploadPath.concat(`/${size.path}`);
        fs.mkdirsSync(this.imageUploadPath);
        this.filesUploaded.push({
          originalname: file.originalname,
          filename: this.imageFilename,
          path: `${this.fileUrl}/${size.path}/${this.imageFilename}`,
        });
        return sharp(file.buffer)
          .resize(size.width, size.height, this.sharpOptions)
          .toFile(`${this.imageUploadPath}/${this.imageFilename}`);
      })
    );
  }
};
