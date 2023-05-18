const formidable = require("formidable");

const formidableMiddleware = (req, res, next) => {
  const form = formidable({});
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    Object.assign(req, { fields, files });
    next();
  });
};

module.exports = formidableMiddleware;
exports.formidableMiddleware = formidableMiddleware;
