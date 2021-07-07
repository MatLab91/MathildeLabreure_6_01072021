const Sauce = require('../models/sauce');
const fs = require('fs');


// Capture et enregistre l'image, analyse la sauce en utilisant une chaîne de caractères 
// et l'enregistre dans la base de données, en définissant correctement son image URL. 
// Remet les sauces aimées et celles détestées à 0, et les sauces usersliked et celles usersdisliked aux tableaux vides.
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
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

// Définit le statut "j'aime" pour userID fourni. 
// Si j'aime = 1, l'utilisateur aime la sauce. 
// Si j'aime = 0, l'utilisateur annule ce qu'il aime ou ce qu'il n'aime pas. 
// Si j'aime = -1, l'utilisateur n'aime pas la sauce. 
//L'identifiant de l'utilisateur doit être ajouté ou supprimé du tableau approprié, 
// en gardant une trace de ses préférences et en l'empêchant d'aimer ou de ne pas aimer la même sauce plusieurs fois. 
//Nombre total de "j'aime" et de "je n'aime pas" à mettre à jour avec chaque "j'aime".
exports.likeSauce = (req, res, next) => {
  console.log(req);
  console.log(req.params.id);
  console.log (req.body.userId);
  console.log(req.body.like);
  // faire des console.log de req, puisque qu'on récupérera des 0 ou 1 et l'id de la sauce (ligne 32, 33, 34), une fois qu'on a la sauce, il faut récupérer les propriétés de la sauce, notamme
  // le tableau des utilisateurs qui ont aimé la sauce https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
  // seulement s'il est pas dedans, alors update de la sauce
  // tous les console.log apparaitront dans le terminal
  // premier console.log(req) quand on like
};

// Renvoie la sauce avec l'ID fourni
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
      .then((sauce) => {res.status(200).json(sauce);})
      .catch((error) => {res.status(404).json({error: error});});
};

// Met à jour la sauce avec l'identifiant fourni. Si une image est téléchargée, 
// capturez-la et mettez à jour l'image URL des sauces. 
// Si aucun fichier n'est fourni, les détails de la sauce figurent 
//directement dans le corps de la demande (req.body.name, req.body.heat etc). 
//Si un fichier est fourni, la sauce avec chaîne est en req.body.sauce.
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};


// Supprime la sauce avec l'ID fourni.
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// Renvoie le tableau de toutes les sauces dans la base de données
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
  .then((sauces) => {res.status(200).json(sauces);})
  .catch((error) => {res.status(400).json({error: error});});
};