const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
  //identifiant unique MongoDB pour l'utilisateur qui a créé la sauce
  userId: {type: String, required: true},

  // nom de la sauce
  name: {type: String, required: true},

  // fabricant de la sauce
  manufacturer: {type: String, required: true},

  // description de la sauce
  description: { type: String, required: true },

  // principal ingrédien dans la sauce
  mainPepper: { type: String, required: true },

  // string de l'image de la sauce téléchargée par l'utilisateur
  imageUrl: { type: String, required: true },

  // nombre entre 1 et 10 décrivant la sauce
  heat: { type: Number, required: true },

  // nombre d'utilisateurs qui aiment la sauce
  likes: { type: Number, required: true, default: 0  },

  // nombre d'utilisateurs qui n'aiment pas la sauce
  dislikes: { type: Number, required: true, default: 0  },

  // tableau d'identifiants d'utilisateurs ayant aimé la sauce
  usersLiked: [{ type: String, required: true, default: [] }],
  
  // tableau d'identifiants d'utilisateurs n'ayant pas aimé la sauce
  usersDisliked: [{ type: String, required: true, default: [] }]
});

module.exports = mongoose.model('Sauce', sauceSchema);