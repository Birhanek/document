import {Document,Schema,model} from "mongoose";

// defining the document model
export type docDocument = Document &{
    documentType: string,
    document_title:string,
    slug:string
}

// The schema to our database
export const documentSchema = new Schema({
    documentType:{
        type:String,
        required:[true,'document type is required']
    },
    document_title:{
        type:String,
        unique:true,
        required:[true, 'document title is required']
    },
    slug:{
        type:String,
        required:[true, 'document title is required']
    }
},
{
    timestamps:true
})

export const Doc = model<docDocument>('Doc',documentSchema)

