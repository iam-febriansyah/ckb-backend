const dotenv = require("dotenv");
dotenv.config();

/**Database */
const db = require("../db/config");
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;

/**Library */
const { QueryTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const { v1: uuidv1 } = require("uuid");
const request = require("request");
const nodemailer = require("nodemailer");

const dateTimeNow = () => {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();
  let hh = String(today.getHours()).padStart(2, "0");
  let ii = String(today.getMinutes()).padStart(2, "0");
  let ss = String(today.getSeconds()).padStart(2, "0");
  today = `${yyyy}-${mm}-${dd} ${hh}:${ii}:${ss}`;
  return today;
};

const sendMail = async function (to, subject, body, attachments) {
  try {
    return new Promise((resolve, reject) => {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
          user: "XXXX",
          pass: "XXXXX",
        },
        secureConnection: "false",
        tls: {
          ciphers: "SSLv3",
        },
      });

      var mailOption = {
        from: "XXXX <xXX@gmail.com>",
        to: to,
        subject: subject,
        html: body,
        attachments: attachments,
      };

      return transporter.sendMail(mailOption, function (error, info) {
        if (error) {
          resolve({ status: 2, remarks: error.message.toString() });
        } else {
          resolve({ status: 1, remarks: info.response });
        }
      });
    });
  } catch (error) {
    return { status: 2, remarks: error.toString() };
  }
};

module.exports = {
  lokasi: async (req, res) => {
    try {
      var data = await db.lokasi.findAll({
        where: { is_deleted: { [Op.eq]: null } },
      });
      res.send({
        status: true,
        remarks: "Successfuly",
        lokasi: data,
      });
    } catch (err) {
      if (err.message) {
        err = err.message;
      }
      res.send({ status: false, remarks: err, data: [] });
    }
  },

  barang: async (req, res) => {
    try {
      var query = `SELECT b.id, b.kode_barang, b.barang_name, b.tipe, tp.tipe_name
                         FROM barangs b 
                         INNER JOIN tipes tp ON tp.id = b.tipe
                         WHERE tp.is_deleted IS NULL AND b.is_deleted IS NULL
                `;
      var data = await sequelize.query(query, {
        type: QueryTypes.SELECT,
      });
      res.send({
        status: true,
        remarks: "Successfuly",
        barang: data,
      });
    } catch (err) {
      if (err.message) {
        err = err.message;
      }
      res.send({ status: false, remarks: err, data: [] });
    }
  },

  tipe: async (req, res) => {
    try {
      var data = await db.tipe.findAll({
        where: { is_deleted: { [Op.eq]: null } },
      });
      res.send({
        status: true,
        remarks: "Successfuly",
        data: data,
      });
    } catch (err) {
      if (err.message) {
        err = err.message;
      }
      res.send({ status: false, remarks: err, data: [] });
    }
  },

  list: async (req, res) => {
    try {
      var query = `SELECT t.id, t.kode_barang, t.kondisi, t.lokasi, l.lokasi_name, tp.tipe_name,
                         b.barang_name, t.qty
                         FROM transactions t 
                         INNER JOIN barangs b ON b.kode_barang = t.kode_barang
                         INNER JOIN tipes tp ON tp.id = b.tipe
                         INNER JOIN lokasis l ON l.id = t.lokasi
                         WHERE t.is_deleted IS NULL AND tp.is_deleted IS NULL AND b.is_deleted IS NULL AND l.is_deleted IS NULL
                `;
      var data = await sequelize.query(query, {
        type: QueryTypes.SELECT,
      });
      res.send({
        status: true,
        remarks: "Successfuly",
        transaction: data,
      });
    } catch (err) {
      if (err.message) {
        err = err.message;
      }
      res.send({ status: false, remarks: err, data: [] });
    }
  },

  add: async (req, res) => {
    try {
      var { kode_barang, kondisi, lokasi, qty } = req.body;

      var dataPost = {
        kode_barang: kode_barang,
        kondisi: kondisi,
        lokasi: lokasi,
        qty: qty,
        created_at: dateTimeNow(),
      };

      var result = await db.transaction.create(dataPost);
      if (result) {
        var query = `SELECT t.id, t.kode_barang, t.kondisi, t.lokasi, l.lokasi_name, tp.tipe_name,
                         b.barang_name
                         FROM transactions t 
                         INNER JOIN barangs b ON b.kode_barang = t.kode_barang
                         INNER JOIN tipes tp ON tp.id = b.tipe
                         INNER JOIN lokasis l ON l.id = t.lokasi
                         WHERE t.is_deleted IS NULL AND tp.is_deleted IS NULL AND b.is_deleted IS NULL AND l.is_deleted IS NULL
                         AND t.id = "${result.id}"
                `;
        var data = await sequelize.query(query, {
          type: QueryTypes.SELECT,
        });
        var to = "febriansyah032@gmail.com";
        var subject = "Informasi Penambahan data barang";
        var body = `
                    Hi, <br>
                    Kamu berhasil menambahkan data barang, berikut detailnya : <br>

                    <table>
                        <tr>
                            <td>Kode</td>
                            <td>:</td>
                            <td>${data[0].kode_barang}</td>
                        </tr>
                        <tr>
                            <td>NAMA</td>
                            <td>:</td>
                            <td>${data[0].barang_name}</td>
                        </tr>
                        <tr>
                            <td>Kondisi</td>
                            <td>:</td>
                            <td>${kondisi}</td>
                        </tr>
                        <tr>
                            <td>Lokasi</td>
                            <td>:</td>
                            <td>${lokasi}</td>
                        </tr>
                        <tr>
                            <td>Tipe</td>
                            <td>:</td>
                            <td>${data[0].tipe_name}</td>
                        </tr>
                        <tr>
                            <td>Kuantiti</td>
                            <td>:</td>
                            <td>${qty}</td>
                        </tr>
                    </table>
                `;
        var mail = await sendMail(to, subject, body, null);
        console.log(mail);
        res.send({
          status: true,
          remarks: "Sukses menambahkan barang",
        });
      } else {
      }
    } catch (err) {
      if (err.message) {
        err = err.message;
      }
      res.send({ status: false, remarks: err });
    }
  },

  edit: async (req, res) => {
    try {
      console.log(req.body);
      var { id, kode_barang, kondisi, lokasi, qty } = req.body;

      var dataPost = {
        kode_barang: kode_barang,
        kondisi: kondisi,
        lokasi: lokasi,
        qty: qty,
        updated_at: dateTimeNow(),
      };

      var result = await db.transaction.update(dataPost, {
        where: { id: id },
      });
      if (result) {
        var query = `SELECT t.id, t.kode_barang, t.kondisi, t.lokasi, l.lokasi_name, tp.tipe_name,
                         b.barang_name
                         FROM transactions t 
                         INNER JOIN barangs b ON b.kode_barang = t.kode_barang
                         INNER JOIN tipes tp ON tp.id = b.tipe
                         INNER JOIN lokasis l ON l.id = t.lokasi
                         WHERE t.is_deleted IS NULL AND tp.is_deleted IS NULL AND b.is_deleted IS NULL AND l.is_deleted IS NULL
                         AND t.id = "${id}"
                `;
        var data = await sequelize.query(query, {
          type: QueryTypes.SELECT,
        });
        var to = "febriansyah032@gmail.com";
        var subject = "Informasi Edit data barang";
        var body = `
                    Hi, <br>
                    Kamu berhasil menambahkan data barang, berikut detailnya : <br>

                    <table>
                        <tr>
                            <td>Kode</td>
                            <td>:</td>
                            <td>${data[0].kode_barang}</td>
                        </tr>
                        <tr>
                            <td>NAMA</td>
                            <td>:</td>
                            <td>${data[0].barang_name}</td>
                        </tr>
                        <tr>
                            <td>Kondisi</td>
                            <td>:</td>
                            <td>${data[0].kondisi}</td>
                        </tr>
                        <tr>
                            <td>Lokasi</td>
                            <td>:</td>
                            <td>${data[0].lokasi_name}</td>
                        </tr>
                        <tr>
                            <td>Tipe</td>
                            <td>:</td>
                            <td>${data[0].tipe_name}</td>
                        </tr>
                        <tr>
                            <td>Kuantiti</td>
                            <td>:</td>
                            <td>${data[0].qty}</td>
                        </tr>
                    </table>
                `;
        var mail = await sendMail(to, subject, body, null);
        res.send({
          status: true,
          remarks: "Sukses update data barang",
        });
      } else {
      }
    } catch (err) {
      if (err.message) {
        err = err.message;
      }
      res.send({ status: false, remarks: err });
    }
  },

  del: async (req, res) => {
    try {
      var { id } = req.body;

      var dataPost = {
        is_deleted: dateTimeNow(),
      };

      var result = await db.transaction.update(dataPost, {
        where: { id: id },
      });
      if (result) {
        var query = `SELECT t.id, t.kode_barang, t.kondisi, t.lokasi, l.lokasi_name, tp.tipe_name,
                         b.barang_name
                         FROM transactions t 
                         INNER JOIN barangs b ON b.kode_barang = t.kode_barang
                         INNER JOIN tipes tp ON tp.id = b.tipe
                         INNER JOIN lokasis l ON l.id = t.lokasi
                         WHERE  tp.is_deleted IS NULL AND b.is_deleted IS NULL AND l.is_deleted IS NULL
                         AND t.id = "${id}"
                `;
        var data = await sequelize.query(query, {
          type: QueryTypes.SELECT,
        });
        var to = "febriansyah032@gmail.com";
        var subject = "Informasi Edit data barang";
        var body = `
                    Hi, <br>
                    Kamu berhasil hapus data barang, berikut detailnya : <br>

                    <table>
                        <tr>
                            <td>Kode</td>
                            <td>:</td>
                            <td>${data[0].kode_barang}</td>
                        </tr>
                        <tr>
                            <td>NAMA</td>
                            <td>:</td>
                            <td>${data[0].barang_name}</td>
                        </tr>
                        <tr>
                            <td>Kondisi</td>
                            <td>:</td>
                            <td>${data[0].kondisi}</td>
                        </tr>
                        <tr>
                            <td>Lokasi</td>
                            <td>:</td>
                            <td>${data[0].lokasi_name}</td>
                        </tr>
                        <tr>
                            <td>Tipe</td>
                            <td>:</td>
                            <td>${data[0].tipe_name}</td>
                        </tr>
                        <tr>
                            <td>Kuantiti</td>
                            <td>:</td>
                            <td>${data[0].qty}</td>
                        </tr>
                    </table>
                `;
        var mail = await sendMail(to, subject, body, null);
        res.send({
          status: true,
          remarks: "Sukses hapus data barang",
        });
      } else {
      }
    } catch (err) {
      if (err.message) {
        err = err.message;
      }
      res.send({ status: false, remarks: err });
    }
  },
};
