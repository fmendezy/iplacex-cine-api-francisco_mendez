import express from 'express'
import controller from './controller.js'

const autorRoutes = express.Router()

autorRoutes.post('/actor', controller.handleInsertActorRequest)
autorRoutes.get('/actores', controller.handleGetActoresRequest)
autorRoutes.get('/actor/:id', controller.handleGetActorByIdRequest)
autorRoutes.get('/actores/pelicula/:pelicula', controller.handleGetActoresByPeliculaIdRequest)

export default autorRoutes