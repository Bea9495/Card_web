const nodemailer = require('nodemailer');
require('dotenv').config();



const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
})


const sendMail = (collector_name, email) => {

  let msgHTML = `<!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
      .cuerpo {
        border: 1px solid black;
        padding: 20px;
      }
    </style>
  </head>
  <body>
    <div class="cuerpo">
      <h1>Bienvenid@ ${collector_name} a nuestra web</h1>
      <h5>Te has registrado correctamente</h5>
      <hr>
      <p>Esperamos que disfrute del contenido y podamos disfrutar de su colección</p>
      <img style="width: 200px" src="cid:foto" alt="imagen logo" />
    </div>
    
  </body>
  </html>`

  transporter.verify().then(console.log()).catch(console.error)

  const info = transporter.sendMail({
    from: `"Cartones Mágicos" <beajarautavillaclara@gmail.com>`,
    to: email,
    subject: "Bienvenid@ a nuestra comunidad",
    text:"Te has registrado a nuestra web",
    html: msgHTML,
    attachments: [
      {
        filename: "logo_email.png",
        path: './public/images/logo_email.png',
        cid: 'foto'
      }
    ]
  })

  info.then(res=>console.log(res)).catch(err=>console.log(err))
}

module.exports = sendMail;