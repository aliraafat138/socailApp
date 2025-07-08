import multer from "multer";
export const fileValidations = {
  image: ["image/png", "image/jpeg", "image/gif", "image/jpg"],
  document: ["application/pdf", "application/msword"],
};
export const uploadCloudFile = (fileValidation = []) => {
  const storage = multer.diskStorage({});

  function fileFilter(req, file, cb) {
    if (fileValidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb("invalid  format", false);
    }
  }

  return multer({fileFilter, storage});
};
