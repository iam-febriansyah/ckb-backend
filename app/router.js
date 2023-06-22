var express = require("express");
var router = express.Router();

const { list, add, edit, del, lokasi, barang } = require("./controller");

router.post("/list", list);
router.post("/add", add);
router.post("/edit", edit);
router.post("/delete", del);

router.post("/lokasi", lokasi);
router.post("/barang", barang);

module.exports = router;
