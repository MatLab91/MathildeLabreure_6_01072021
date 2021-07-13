const mongoDBSauce = require('../models/sauce');
const fs = require('fs');


// Capture et enregistre l'image  et l'enregistre dans la base de données
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new mongoDBSauce({
    ...sauceObject,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
    .catch(error => res.status(400).json({ error }));
};

/* Définit le statut "j'aime" ou "je n'aime pas" pour userID fourni. 
L'identifiant de l'utilisateur doit être ajouté ou supprimé du tableau approprié,
Nombre total de "j'aime" et de "je n'aime pas" à mettre à jour avec chaque "j'aime". */
exports.likeSauce = (req, res, next) => {
  mongoDBSauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      let message = "Préférences acceptées";
      if (req.body.like == 1) {
        sauce.usersLiked.push(req.body.userId);
        sauce.likes += 1;
        message = "Sauce likée !";
      } else if (req.body.like == -1) {
        sauce.usersDisliked.push(req.body.userId);
        sauce.dislikes += 1;
        message = "Sauce dislikée !";
      } else {
        // je vérifie que l'utilisateur est dans le tableau usersLiked
        let index = sauce.usersLiked.indexOf(req.body.userId);
        if (index > -1) {
          // Si oui, je le supprime
          sauce.usersLiked.splice(index, 1);
          sauce.likes -= 1;
          message = "Le like a été supprimé !";
        } else {
          // je vérifie que l'utilisateur est dans le tableau usersDisliked
          index = sauce.usersDisliked.indexOf(req.body.userId);
          if (index > -1) {
            // Si oui, je le supprime
            sauce.usersDisliked.splice(index, 1);
            sauce.dislikes -= 1;
            message = "Le dislike a été supprimé !";
          }
        }
      }
      // sauce représente le document de la sauce en question dans MongoDB + d'autres infos utilisées par Mongo
      // ...sauce.toObject() représente réelement l'objet sauce
      mongoDBSauce.updateOne({ _id: req.params.id }, { ...sauce.toObject(), _id: req.params.id })
        .then(() => res.status(200).json({ message }))
        .catch(error => { console.log(error); return error; });
    })
    .catch((error) => { console.log(error) });
}

// Renvoie la sauce avec l'ID fourni
exports.getOneSauce = (req, res, next) => {
  mongoDBSauce.findOne({ _id: req.params.id})
    .then((sauce) => { res.status(200).json(sauce); })
    .catch((error) => { res.status(404).json({ error: error }); });
};

// Permet de modifier la sauce avec l'identifiant fourni.
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  mongoDBSauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
    .catch(error => res.status(400).json({ error }));
};


// Supprime la sauce avec l'ID fourni.
exports.deleteSauce = (req, res, next) => {
  mongoDBSauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        mongoDBSauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// Renvoie le tableau de toutes les sauces dans la base de données
exports.getAllSauces = (req, res, next) => {
  mongoDBSauce.find()
    .then((sauces) => { res.status(200).json(sauces); })
    .catch((error) => { res.status(400).json({ error: error }); });
};