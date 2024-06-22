const {body} = require('express-validator');

const validateCollectorRules = [
  body('collector_name', 'El campo no está bien cumplimentado').isLength({min:3, max:20}),
  body('interest_in', 'El campo no está bien cumplimentado').isLength({min:4, max:20}),
  body('email', 'Email no correcto').exists().isEmail(),
  body('password', 'Contraseña no válida').exists().custom(value => {
    if(!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(value)){
      throw new Error('La contraseña debe contener al menos una minúscula, una mayúscula, un número y al menos 8 carácteres')
    }
    return true
  })
]

module.exports = validateCollectorRules;