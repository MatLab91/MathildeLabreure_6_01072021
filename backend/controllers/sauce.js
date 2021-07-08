const mongoDBSauce = require('../models/sauce');
const fs = require('fs');


// Capture et enregistre l'image, analyse la sauce en utilisant une chaîne de caractères 
// et l'enregistre dans la base de données, en définissant correctement son image URL. 
// Remet les sauces aimées et celles détestées à 0, et les sauces usersliked et celles usersdisliked aux tableaux vides.
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
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
};

/* Définit le statut "j'aime" pour userID fourni. 
Si j'aime = 1, l'utilisateur aime la sauce. 
Si j'aime = 0, l'utilisateur annule ce qu'il aime ou ce qu'il n'aime pas. 
Si j'aime = -1, l'utilisateur n'aime pas la sauce. 
L'identifiant de l'utilisateur doit être ajouté ou supprimé du tableau approprié, 
en gardant une trace de ses préférences et en l'empêchant d'aimer ou de ne pas aimer la même sauce plusieurs fois. 
Nombre total de "j'aime" et de "je n'aime pas" à mettre à jour avec chaque "j'aime". */
exports.likeSauce = (req, res, next) => {
  mongoDBSauce.findOne({_id: req.params.id})
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
    .catch((error) => {console.log(error)});
}

// Renvoie la sauce avec l'ID fourni
exports.getOneSauce = (req, res, next) => {
    mongoDBSauce.findOne({_id: req.params.id})
      .then((sauce) => {res.status(200).json(sauce);})
      .catch((error) => {res.status(404).json({error: error});});
};

/* Met à jour la sauce avec l'identifiant fourni. Si une image est téléchargée, 
capturez-la et mettez à jour l'image URL des sauces. 
Si aucun fichier n'est fourni, les détails de la sauce figurent 
directement dans le corps de la demande (req.body.name, req.body.heat etc). 
Si un fichier est fourni, la sauce avec chaîne est en req.body.sauce. */
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  mongoDBSauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};


// Supprime la sauce avec l'ID fourni.
exports.deleteSauce = (req, res, next) => {
  mongoDBSauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        mongoDBSauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// Renvoie le tableau de toutes les sauces dans la base de données
exports.getAllSauces = (req, res, next) => {
  mongoDBSauce.find()
  .then((sauces) => {res.status(200).json(sauces);})
  .catch((error) => {res.status(400).json({error: error});});
};