
import express from 'express'
import documentController from '../controllers/document.controller'
import documentUpload from '../middlewares/docUpload'

// The router that controls the routes to our API
const documentRouter = express.Router()

// an API that create the document
documentRouter.post('/upload',documentUpload.single('doc'),documentController.documentUpload)

// an API that update the document
documentRouter.put('/document/update/:id',documentUpload.single('doc'),documentController.documentUpdate)

// an API to get all the documents
documentRouter.get('/',documentController.getAllDocuments)

// an API that delete a single document
documentRouter.delete('/document/deleted/:id',documentController.deleteDocument)

// an API that sign a document

export default documentRouter