import multer from "multer";
import { Request } from 'express'
import { NotAllowedError } from "../helpers/apiError";


// Determines the maximum allowed file size and what type of files are allowed in the system
const MAX_FILE_SIZE = Math.pow(1024, 2) * 16
const whiteList = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

const storage = multer.diskStorage({
    destination:(req:Request,file:Express.Multer.File,cb) =>{
        cb(null,'public/doc')
    },
    filename:(req:Request,file:Express.Multer.File,cb) =>{
        //const suffix = Date.now() + '-'+ Math.round(Math.random() * 1e9)
        cb(null, file.originalname)
        
    }
})

// check whether our specified file type is fulfilled or not
const fileType = (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    if (!whiteList.includes(file.mimetype )) {
      return cb(new NotAllowedError('The file you input is not acceptable!'))
    }
    if(file.size > MAX_FILE_SIZE){
        return cb(new NotAllowedError('Maximum file size is 16MB'))
    }
    return cb(null, true)
  }


// document upload

const documentUpload = multer({
    storage:storage,
    limits:{fileSize:MAX_FILE_SIZE},
    fileFilter:fileType
})

export default documentUpload
