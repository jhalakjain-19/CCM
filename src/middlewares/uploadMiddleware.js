const multer = require("multer");

const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log("Received file:", file); // Debugging line
    if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed"), false);
    }
  },
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
});

module.exports = upload;
