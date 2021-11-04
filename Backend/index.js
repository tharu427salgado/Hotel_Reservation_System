const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hotel_reservation_system',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});


app.listen(3000, () => console.log('Express server is runnig at port no : 3000'));


//Get all Customers
app.get('/customer', (req, res) => {
    mysqlConnection.query('SELECT * FROM customer', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Get an customer
app.get('/customer/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM Customer WHERE NIC = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Delete an customer
app.delete('/customer/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM customer WHERE NIC = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Deleted successfully.');
        else
            console.log(err);
    })
});

//Insert an customer
app.post('/customer', (req, res) => {
    let cus = req.body;
    var sql = "SET @NIC = ?;SET @Name = ?;SET  \
    CALL CustomerAddOrEdit(@NIC,@Name);";
    mysqlConnection.query(sql, [cus.NIC,cus.Name],  (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if(element.constructor == Array)
                res.send('Inserted NIC : '+element[0].NIC);
            });
        else
            console.log(err);
    })
});

//Update an customer
app.put('/customer', (req, res) => {
    let cus = req.body;
    var sql = "SET @NIC = ?;SET @Name = ?; \
    CALL CustomerAddOrEdit(@NIC,@Name);";
    mysqlConnection.query(sql, [cus.NIC, cus.Name], (err, rows, fields) => {
        if (!err)
            res.send('Updated successfully');
        else
            console.log(err);
    })
});
