const dbConn = require("../db/mysql_connect")
const bcrypt = require("bcrypt")
const APIError = require("../middleware/errorHandler")
const Response = require("../utils/response")

const add_user = async (req, res) => {
    const username = req.body.kullanici_adi
    const password = await bcrypt.hash(req.body.sifre, 10)
    const email = req.body.eposta
    const first_name = req.body.adi
    const last_name = req.body.soyadi
    const phone_number = req.body.tel_no
    const gender = req.body.cinsiyet
    const birth_date = req.body.dogum_tarihi
    const age = req.body.yas

    dbConn.query("SELECT * FROM users WHERE email=?", email, (error, results) => {
        if (error) {
            throw new APIError("We encountered an error", 401)
        } else {
            if (results > 0) {
                return new Response(data, "Registration Successful").created(res)
            } else {
                dbConn.query(
                    "INSERT INTO users (username, password, email, first_name, last_name, phone_number, gender, birth_date, age) VALUES (?,?,?,?,?,?,?,?,?)",
                    [username, password, email, first_name, last_name, phone_number, gender, birth_date, age],
                    (error, results) => {
                        return res.json({
                            success: true,
                            data: null,
                            message: "Registration Successfully Created"
                        })
                    }
                )
            }
        }
    })
}

const login = async (req, res) => {
    const username = req.body.kullanici_adi
    const password = req.body.sifre

    dbConn.query("SELECT * FROM users WHERE username=? AND password=?", [username, password], (error, results) => {
        if (results > 0) {
            return res.json({
                success: true,
                message: "Login was successful"
            })
        } else {
            return res.json({
                success: false,
                message: "Login failed"
            })
        }
    })
}

module.exports = { add_user }
