const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


// Renvoie le tableau de toutes les sauces dans la base de données
router.get('/', auth, sauceCtrl.getAllSauces);

// Capture et enregistre l'image, analyse la sauce en utilisant une chaîne de caractères 
// et l'enregistre dans la base de données, en définissant correctement son image URL. 
//Remet les sauces aimées et celles détestées à 0, et les sauces usersliked et celles usersdisliked aux tableaux vides.
router.post('/', auth, multer, sauceCtrl.createSauce);

// Définit le statut "j'aime" pour userID fourni. 
// Si j'aime = 1, l'utilisateur aime la sauce. 
// Si j'aime = 0, l'utilisateur annule ce qu'il aime ou ce qu'il n'aime pas. 
// Si j'aime = -1, l'utilisateur n'aime pas la sauce. 
//L'identifiant de l'utilisateur doit être ajouté ou supprimé du tableau approprié, 
// en gardant une trace de ses préférences et en l'empêchant d'aimer ou de ne pas aimer la même sauce plusieurs fois. 
//Nombre total de "j'aime" et de "je n'aime pas" à mettre à jour avec chaque "j'aime".
router.post('/:id/like', auth, multer, sauceCtrl.likeSauce);

// Renvoie la sauce avec l'ID fourni
router.get('/:id', auth, sauceCtrl.getOneSauce);

// Met à jour la sauce avec l'identifiant fourni. Si une image est téléchargée, 
// capturez-la et mettez à jour l'image URL des sauces. 
// Si aucun fichier n'est fourni, les détails de la sauce figurent 
//directement dans le corps de la demande (req.body.name, req.body.heat etc). 
//Si un fichier est fourni, la sauce avec chaîne est en req.body.sauce.
router.put('/:id', auth, multer, sauceCtrl.modifySauce);

// Supprime la sauce avec l'ID fourni.
router.delete('/:id', auth, sauceCtrl.deleteSauce);

module.exports = router;