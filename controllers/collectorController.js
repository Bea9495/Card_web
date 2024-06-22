const connection = require('../config/db');
const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');
const sendMail = require('../services/emailService');


class CollectorControllers {
  oneCollector = (req, res) => {
    const id = req.params.id;
    let sql = `SELECT collector.*, item.* FROM
    collector LEFT JOIN item ON collector.collector_id = item.collector_id
    AND item.is_deleted = 0
    WHERE collector.collector_is_deleted = 0
    AND collector.collector_id = ${id}`

    connection.query(sql, (err, result) => {
      if(err) throw err;
      let finalResult = {};
      let items = [];
      let item = {};

      result.forEach((elem)=>{
        if(elem.item_id){
          item = {
            item_id: elem.item_id,
            name: elem.name,
            acquisition_year: elem.acquisition_year,
            description: elem.description,
            img: elem.img
          }
          items.push(item)
        }
      })

      finalResult = {
        collector_id: id,
        collector_name: result[0].collector_name,
        interest_in: result[0].interest_in,
        email: result[0].email,
        collection_description: result[0].collection_description,
        phone: result[0].phone,
        collector_img: result[0].collector_img,
        items
      }
      console.log(finalResult);
      res.render("oneCollector", {finalResult})
    })
  }
  formAddCollector = (req, res) => {
    res.render("addCollector", {validations: [], values: {}})
  }
  showPost = (req, res)=>{
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
      const values = req.body;
      const validations = errors.array();
      return res.render("addCollector", {validations, values})
    }

    const{collector_name, interest_in, email, password, collection_description, phone} = req.body;
    if(
      collector_name == "" || interest_in == "" || email == "" || password == ""){
        return res.render('addCollector', {message: "Debes rellenar todos los campos"})
      }
    let img;
    if(req.file != undefined){
      img = req.file.filename;
    }
    else{
      img = "sinrostro.jpg" 
    }
    let salt = 10;
    bcrypt.hash(password, salt, (err, hash)=> {
      let sql = `INSERT INTO collector (collector_name, interest_in, email, password, collection_description, phone, collector_img) VALUES ("${collector_name}", "${interest_in}", "${email}", "${hash}", "${collection_description}", "${phone}", "${img}")`
      
      connection.query(sql, (errSql, result)=> {
        if(errSql){
          if(errSql.errno == 1062){
            res.render("addCollector", {message: "Email duplicado, introduzca otro"})
          }
          else {
            res.render("addCollector", {message:"Hay algun error con la db"})
          }
        } 
        else {
          sendMail(collector_name, email);
          res.redirect("/");
        }
        
      })

    })
    
  }

  editCollector = (req, res) => {
    const {id} = req.params;
    let sql = `SELECT * FROM collector WHERE collector_id = ${id} AND collector_is_deleted = 0`
    connection.query(sql, (err, result)=> {
      if (err) throw err;
      res.render("editCollector", {result: result[0]});
    })
  }
  showEditPost = (req, res) => {
    const {id} = req.params;
    const{collector_name, interest_in, collection_description, phone} = req.body;
    let sql = `UPDATE collector SET collector_name = "${collector_name}", interest_in = "${interest_in}", collection_description = "${collection_description}", phone = "${phone}" WHERE collector_id = ${id}`
    if(req.file){
      sql = `UPDATE collector SET collector_name = "${collector_name}", interest_in = "${interest_in}", collection_description = "${collection_description}", phone = "${phone}", collector_img = "${req.file.filename}" WHERE collector_id = ${id}`
    }
    connection.query(sql, (err, result)=> {
      if(err) throw err;
      res.redirect(`/collector/oneCollector/${id}`)
    })
  }
  deleteLogicCollector = (req, res) => {
    const {id} = req.params;
    let sql = `UPDATE collector LEFT JOIN item ON collector.collector_id = item.collector_id
    SET collector.collector_is_deleted = 1, item.is_deleted = 1
    WHERE collector.collector_id = ${id}`

    connection.query(sql, (err, result)=> {
      if(err) throw err;
      res.redirect('/')
    })
  }

  showLogin = (req, res) => {
    res.render('login', {message: ""})
  }

  login = (req, res) => {
    const {email, password} = req.body;
    let sql = `SELECT * FROM collector WHERE email = ? AND collector_is_deleted = 0`
    if(email == "" || password == ""){
      return res.render("login", {message: "Debes rellenar todos los campos"})
    }
    connection.query(sql, [email], (err, result)=> {
      if(err) throw err;
      if(result.length > 0){
        let hash = result[0].password;
        bcrypt.compare(password, hash, (err, resultCompare)=>{
          if(resultCompare){
            res.redirect(`/collector/oneCollector/${result[0].collector_id}`)
          }
          else {
            res.render("login", {message: "Credenciales incorrectas"})
          }
        })
      }
      else{
        res.render("login", {message: "Credenciales incorrectas"})
      }
    })
  }
  

}

module.exports = new CollectorControllers();