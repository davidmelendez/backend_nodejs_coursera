const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const cors = require('./cors');
const Favorites = require('../models/favorite');

const favoriteRouter = express.Router();

var authenticate = require('../authenticate');

//-------------------------------------------------

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        //validacion de usuario
        //para consultar solo los datos del usaurio
        //conectado
        Favorites.findOne({ user: req.user._id })
            .populate('user')
            .populate('dishes')
            .then((favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {


          //vaildaciones de las revisones de los estudiantes
            /// checking if dishes where provided in the body
           // if(!dishes || dishes.length === 0 ){
            //    return res.status(400).json({msg : "You must provide the dishes to add to favorites"})
           // }

          ///
        var resFavorites;
        //validar si existe un documento al usuario
        Favorites.findOne({ user: req.user._id })
            .populate('dishes')
            .populate('user')
            .then((favorite) => {
                // console.log(favorites.dishes);
                //   //si no existe hay que crearlo
                if (favorite == null) {
                    console.log('Documento No existe, se va a crear');
                    //hay que instanciar
                    var favoriteCreate = new Favorites();
                    favoriteCreate.user = req.user._id;
                    favoriteCreate.dishes = req.body;

                    Favorites.create(favoriteCreate)
                        .then((favoriteNew) => {
                            //se consulta para devolver dato con populate
                            Favorites.findOne({ '_id': favoriteNew._id })
                                .populate('dishes')
                                .populate('user')
                                .then((favoriteAux) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favoriteAux);
                                }, (err) => next(err))
                                .catch((err) => next(err));

                        })
                        .catch((err) => next(err));

                } else {
                    console.log('Documento SI existe, se va a actualizar');
                    //si existe, hay que modificarlo
                    //validar si el plato ya esta como favorito
                    var existe = false;
                    req.body.forEach((dish) => {
                        existe = false;


                        favorite.dishes.forEach((dishReg) => {
                            if (dishReg._id == dish._id) {
                                existe = true;
                            }

                        });

                        if (!existe) {

                            //hay que consultar de nuevo el registro
                            //no si, da error de matching
                            Favorites.findOne({ user: req.user._id })
                                .then((favoriteToSave) => {
                                    favoriteToSave.dishes.push(dish);
                                    favoriteToSave.save()
                                        .then(() => {
                                            console.log('Add new favorite');
                                            //
                                            Favorites.findOne({ user: req.user._id })
                                                .populate('dishes')
                                                .populate('user')
                                                .then((favorite) => {
                                                    res.statusCode = 200;
                                                    res.setHeader('Content-Type', 'application/json');
                                                    res.json(favorite);
                                                }, (err) => next(err))
                                                .catch((err) => next(err));
                                        });
                                });


                        } else {
                            for (i = 0; i < req.body.length; i++ )
                            //esto es de las mejoras para integrar el frond-end
                            //en el test el indexof no me funciono
                                if (favorite.dishes.indexOf(req.body[i]._id) < 0)                                  
                                    favorite.dishes.push(req.body[i]);
                            favorite.save()
                            .then((favorite) => {
                                Favorites.findById(favorite._id)
                                .populate('user')
                                .populate('dishes')
                                .then((favorite) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorite);
                                })
                            })
                            .catch((err) => {
                                return next(err);
                            });
                        }
                    });





                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOneAndDelete({ user: req.user._id })
            .populate('user')
            .populate('dishes')
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });
/*.put()*/

favoriteRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, authenticate.verifyUser, (req,res,next) => {
        Favorites.findOne({user: req.user._id})
        .then((favorites) => {
            if (!favorites) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": false, "favorites": favorites});
            }
            else {
                if (favorites.dishes.indexOf(req.params.dishId) < 0) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    return res.json({"exists": false, "favorites": favorites});
                }
                else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    return res.json({"exists": true, "favorites": favorites});
                }
            }
    
        }, (err) => next(err))
        .catch((err) => next(err))
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

        var resFavorites;

        Favorites.findOne({ user: req.user._id })
            .then((favorite) => {

                if (favorite == null) {
                    console.log('Documento No existe');
                    res.statusCode = 403;
                    res.end('Document not exist.');
                } else {
                    console.log('Documento SI existe, se va a actualizar');

                    Favorites.find({ user: req.user._id, dishes: mongoose.Types.ObjectId(req.params.dishId) })
                        .then((favoriteAux) => {


                            if (favoriteAux == null || favoriteAux.length == 0) {


                                favorite.dishes.push(req.params.dishId);
                                favorite.save()
                                    .then(() => {
                                        Favorites.findOne({ user: req.user._id })
                                            .populate('dishes')
                                            .populate('user')
                                            .then((favorite) => {
                                                res.statusCode = 200;
                                                res.setHeader('Content-Type', 'application/json');
                                                res.json(favorite);
                                            }, (err) => next(err))
                                    }, (err) => next(err))
                                    .catch((err) => next(err));
                            } else {
                                res.statusCode = 403;
                                res.end('Dish is favorite yet.');
                            }
                        }, (err) => next(err))
                        .catch((err) => next(err));
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
.delete (cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({ user: req.user._id, dishes: mongoose.Types.ObjectId(req.params.dishId) })
        .then((favorite) => {
            if (favorite != null && favorite.length > 0) {
                var pos = -1;
                var thisIs = false;
                //este filter salio de los alumnos revisados, parece viable.
                //user.dishes = user.dishes.filter((dishid) => dishid._id.toString() !== req.params.dishId);


                while (!thisIs && pos < favorite[0].dishes.length) {
                    ++pos;
                    if (favorite[0].dishes[pos]._id == req.params.dishId) {
                        thisIs = true;
                    }
                }
                console.log(pos);
               console.log(thisIs);
               favorite[0].dishes.splice(pos, 1,null);
                favorite[0].save()
                    .then((favoriteAux) => {
                        Favorites.findOne({ user: req.user._id})
                            .populate('user')
                            .populate('dishes')
                            .then((favorite) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type','application/json');
                                    res.json(favorite);
                            }, (err) => next(err))
                            .catch((err) => next(err));
                    }, (err) => next(err))
                    .catch((err) => next(err));
                       
            } else {
                err = new Error('Favorite ' + req.params.dishId + ' not found');
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
});


module.exports = favoriteRouter;
