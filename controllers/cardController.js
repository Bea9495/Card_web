const connection = require('../config/db');

class CardControllers {
  showFormAddCard = (req, res) => {
    const collector_id = req.params.id;
    res.render("addCard", {collector_id});
  }


  addCard = (req, res) => {
    const collector_id = req.params.id;
    const {name, acquisition_year, description} = req.body;
    let sql = `INSERT INTO item (name, acquisition_year, description, collector_id) VALUES ("${name}", "${acquisition_year}", "${description}", ${collector_id})`

    if(req.file){
      sql = `INSERT INTO item (name, acquisition_year, description, collector_id, img) VALUES ("${name}", "${acquisition_year}", "${description}", ${collector_id}, "${req.file.filename}")`
    }
    connection.query(sql, (err, result)=> {
      if(err) throw err;
      res.redirect(`/collector/oneCollector/${collector_id}`)
    })
  }
  showEditCard = (req, res) => {
    const {id} = req.params;
    let sql = `SELECT * FROM item WHERE item_id = ${id} AND is_deleted = 0`
    connection.query(sql, (err, result)=> {
      if(err) throw err;
      res.render("editCard", {result: result[0]})
    })
  }
  editCard = (req, res) => {
    const {id, collector_id} = req.params;
    
    const{name, acquisition_year, description} = req.body;
    let sql = `UPDATE item SET name = "${name}", acquisition_year = "${acquisition_year}", description = "${description}" WHERE item_id = ${id}`
    if(req.file){
      sql = `UPDATE item SET name = "${name}", acquisition_year = "${acquisition_year}", description = "${description}", img = "${req.file.filename}" WHERE item_id = ${id}`
    }

    connection.query(sql, (err, result)=>{
      if(err) throw err;
      res.redirect(`/collector/oneCollector/${collector_id}`)
    })
  }

  deleteCard = (req, res) => {
    const {id, collector_id} = req.params;
    let sql = `DELETE from item WHERE item_id = ${id}`
    connection.query(sql, (err, result)=>{
      if(err) throw err;
      res.redirect(`/collector/oneCollector/${collector_id}`)
    })
  }

  deleteLogicCard = (req, res) => {
    const {id, collector_id} = req.params;
    let sql = `UPDATE item SET is_deleted = 1 WHERE item_id = ${id}`
    connection.query(sql, (err, result)=> {
      if(err) throw err;
      res.redirect(`/collector/oneCollector/${collector_id}`);
    })
  }
  showAllCard = (req, res) => {
    let sql = `SELECT * FROM item WHERE is_deleted = 0`
    connection.query(sql, (err, result)=> {
      if(err) throw err;
      res.render('allCard', {result})
    })
  }


};

module.exports = new CardControllers();