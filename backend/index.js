const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const mysql = require ('mysql2');
const { Console } = require('console');

const app = express();

app.use(cors());
app.use(bodyparser.json());


//conectar a base de datos mysql
const db = mysql.createConnection({
      host:'localhost',
      user:'root',
      password:'',
      database:'dosalamosdb',
      port:8111
});

// revisa la coneccion a la base de datos
db.connect(err=>{
  if (err) {console.log('err');}
  console.log('base de datos conectado...');
});

//conseguir todos los datos de los pacientes
app.get('/paciente',(req,res)=>{
    let qr = 'select * from paciente';
    db.query(qr,(err,result)=>{
      if(err)
      {
        console.log(err,'errs');
      }
      if(result.length>0)
      {
        res.send({
          message:'datos de los pacientes',
          data: result
        });
      }
    });
});

//conseguir solo 1 dato paciente
app.get('/paciente/:id',(req, res)=> {
    let gID = req.params.id;
    let qr = `select * from paciente where id = ${gID}`;
  db.query(qr,(err,result)=>{
      if(err){ console.log(err);}
      if(result.length)
      {
            res.send({
              message: 'obtener dato',
              data:result
            });
      }
      else
      {
            res.send({
              message: 'dato no encontrado'
            });
      }
  });
});

// crear dato paciente
app.post('/paciente', (req,res)=>{
    console.log(req.body, 'crea dato');

    let nombre = req.body.nombre;
    let apellido_paterno = req.body.apellido_paterno;
    let apellido_materno = req.body.apellido_materno;
    let email = req.body.email;
    let telefono = req.body.telefono;

    let qr = `insert into paciente(nombre, apellido_paterno, apellido_materno, email, telefono)
                values('${nombre}','${apellido_paterno}','${apellido_materno}',
                '${email}','${telefono}')`;

    console.log(qr, 'qr')
       db.query(qr,(err,result)=>{
            if(err){console.log(err)};
            console.log(result,'result')
            res.send({
              message: 'dato insertado',
            });
    });
});


// Actualizar un dato paciente
app.put('/paciente/:id', (req,res)=>{
    console.log(req.body, 'actualiza dato');
  
    let gID = req.params.id;
    let nombre = req.body.nombre;
    let apellido_paterno = req.body.apellido_paterno;
    let apellido_materno = req.body.apellido_materno;
    let email = req.body.email;
    let telefono = req.body.telefono;
  
    let qr = `update paciente set nombre = '${nombre}', apellido_paterno =' ${apellido_paterno}', apellido_materno = '${apellido_materno}',
                email = '${email}', telefono = '${telefono}'
                where id = ${gID}`;
  
    db.query(qr,(err,result)=>{
            if(err) {console.log(err);}
  
            res.send({
                message:'dato actualizado'
            });
    });
  });


// borrar un dato paciente
app.delete('/paciente/:id', (res,req)=>{
    let gID = res.params.id;
    let qr = `delete from paciente where id = ${gID}`;
  db.query(qr,(err,result)=>{
      if(err){Console.log(err);}

      res.send(
    {
        message: 'dato eliminado'
    }
  )
});
});

//servidor corriendo
app.listen(3000,()=> {
    console.log('servidor corriendo ...');
  });