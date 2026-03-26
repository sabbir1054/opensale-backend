import multer from 'multer';
const profilePhotoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Use a unique name for each file to avoid conflicts
    const uniqueSuffix = Date.now() + '--' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const uploadProfile = multer({ storage: profilePhotoStorage });

export const FileUploadHelper = {
  uploadProfile,
};
