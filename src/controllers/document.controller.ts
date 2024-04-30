import { NextFunction, Request, Response } from "express";
import fs from 'fs'
import slugify from "slugify";
import { BadRequestError, NotAllowedError } from "../helpers/apiError";
import { Doc, docDocument } from "../models/doc.model";

// To upload a document to the database
const documentUpload = async (req:Request, res:Response,next:NextFunction) =>{
    try {
        const {title} = req.body
        const fileName = req.file?.originalname
        const slug = slugify(title)

        if(req.file && req.file.size > Math.pow(1024,2)*16){
            throw new BadRequestError("File size must be less than 16MB")
        }

        const isDocExisted = await Doc.findOne({documentType:fileName})
        
        if(isDocExisted && isDocExisted?.documentType === fileName){
            return res.status(200).json({
                ok:true,
                statusCode:200,
                message:'File already existed'
            })
        }

        const newDocument = new Doc({
            document_title:title,
            documentType:fileName,
            slug
        })

        await newDocument.save()

        return res.status(200).json({
            ok:true,
            statusCode:201,
            message:'Document successfully uploaded',
            data:{}
        })

    } catch (error) {
        if (error instanceof Error && error.name == 'ValidationError') {
            next(new BadRequestError('Invalid Request', 400, error))
          } else {
            next(error)
          }
    }
}

// To update a document
const documentUpdate = async (req:Request, res:Response,next:NextFunction) =>{
    try {
        const id = req.params.id
        const {title} = req.body
        const fileName = req.file?.originalname
        const update: Partial<docDocument> = {}

        if(req.file && req.file.size > Math.pow(1024,2)*16){
            throw new BadRequestError("File size must be less than 16MB")
        }

        if(title){
            update.document_title = title
            update.slug = slugify(title)
        }
        if(fileName){
            update.documentType = fileName
            const document = await Doc.findById(id)
            if(document){
                const document_to_delete = `public/doc/${document.documentType}`
                fs.unlink(document_to_delete,(err)=>{
                    if(err){
                        throw new BadRequestError('File is not deleted from your desk')
                    }
                    console.log('File is deleted successfully')
                })
            }

        }

        const updated = await Doc.findByIdAndUpdate(id,update,{new:true})

        if(!updated){
            throw new NotAllowedError(`The document with ${id} is not update`)
        }

        return res.status(201).json({
            ok:true,
            statusCode:201,
            message:`${title} is successfully updated`,
            data:{}
        })
        

        
    } catch (error) {
        if (error instanceof Error && error.name == 'ValidationError') {
            next(new BadRequestError('Invalid Request', 400, error))
          } else {
            next(error)
          }
    }
}
// get all the document
const getAllDocuments = async(req:Request, res:Response, next:NextFunction) =>{
    try {
        
        const Documents = await Doc.find()

        if(!Documents){
            throw new NotAllowedError('There is no documents')
        }

        return res.status(200).json({
            ok:true,
            statusCode:200,
            message:' returns all the documents',
            data:{
                 Documents
            }
        })

    } catch (error) {
        if (error instanceof Error && error.name == 'ValidationError') {
            next(new BadRequestError('Invalid Request', 400, error))
          } else {
            next(error)
          }
    }
}

// delete a document
const deleteDocument = async(req:Request, res:Response, next:NextFunction) =>{
    try {
        const id = req.params.id
        const deletedDocument = await Doc.findByIdAndDelete(id)
        if(!deletedDocument){
            throw new NotAllowedError(`Document with ${id} does not exist`)
        }
        
        const document_to_delete = `public/doc/${deletedDocument.documentType}`

        fs.unlink(document_to_delete,(err)=>{
            if(err){
                throw new BadRequestError('It is difficult to remove the file')
            } 
            console.log(document_to_delete + ' is deleted')

        })
        return res.status(200).json({
            ok:true,
            statusCode:200,
            message:'Document deleted successfully',
            data:{}
        })
    } catch (error) {
        if (error instanceof Error && error.name == 'ValidationError') {
            next(new BadRequestError('Invalid Request', 400, error))
          } else {
            next(error)
          }
    }
}
export default {
    documentUpload,
    documentUpdate,
    getAllDocuments,
    deleteDocument
}