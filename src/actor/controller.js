import { ObjectId } from "mongodb"
import client from "../common/db.js"
import { Actor } from './actor.js'

const actorCollection = client.db('cine-db').collection('actores')
const peliculaCollection = client.db('cine-db').collection('peliculas');


async function handleInsertActorRequest(req, res) {
    let data = req.body
    let actor = Actor

    actor.idPelicula = data.idPelicula
    actor.nombre = data.nombre
    actor.edad = data.edad
    actor.estaRetirado = data.estaRetirado
    actor.premios = data.premios


    try{
        let pelicula = await peliculaCollection.findOne({ _id: ObjectId.createFromHexString(actor.idPelicula) })

        if(pelicula === null) return res.status(400).send('La pelicula asociada no existe')

        await actorCollection.insertOne(actor)
        .then((data) => {
            if(data === null) return res.status(400).send('Error al guardar registro')
    
            return res.status(201).send(data)
    
        })
        .catch((e) => { return res.status(500).send({ error: e }) })

    }catch(e){
        return res.status(500).send({ error: 'Error al procesar la solicitud' })
    }
}

async function handleGetActoresRequest(req, res) {
    await actorCollection.find({}).toArray()
        .then((data) => { return res.status(200).send(data) })
        .catch((e) => { return res.status(500).send({ error: e }) })
}

async function handleGetActorByIdRequest(req, res) {
    let id = req.params.id;

    try {
        let oid = ObjectId.createFromHexString(id)

        await actorCollection.findOne({ _id: oid })
            .then((data) => {
                if (data === null) return res.status(404).send(data)
                return res.status(200).send(data)
            })
            .catch((e) => { 
                return res.status(500).send({ error: e.code }) 
            })
    } catch (e) {
        return res.status(400).send('Id mal formado')
    }
}

async function handleGetActoresByPeliculaIdRequest(req, res) {
    let idPelicula = req.params.pelicula;

    try {
        // Validar que el idPelicula sea un string con el formato de un ObjectId
        if (idPelicula.length !== 24 || !/^[a-fA-F0-9]{24}$/.test(idPelicula)) {
            return res.status(400).send('ID de película mal formado');
        }

        // Si pasa la validación, continúa con la búsqueda
        await actorCollection.find({ idPelicula: idPelicula }).toArray()
            .then((data) => { 
                if (data.length === 0) {
                    return res.status(404).send('No se encontraron actores para la película proporcionada');
                }
                return res.status(200).send(data); 
            })
            .catch((e) => { return res.status(500).send({ error: e.code }); });

    } catch (e) {
        return res.status(500).send('Error en el servidor');
    }
}

export default {
    handleInsertActorRequest,
    handleGetActoresRequest,
    handleGetActorByIdRequest,
    handleGetActoresByPeliculaIdRequest
}