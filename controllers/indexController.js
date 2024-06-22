const connection = require('../config/db');


class IndexControllers {
  showHome = (req, res) => {
    let sql = `SELECT * FROM collector WHERE collector_is_deleted = 0`;
    connection.query(sql, (err, result)=>{
      if(err) throw err;
      return res.render('index', {result});
    })
  }
 
  
}

module.exports = new IndexControllers();