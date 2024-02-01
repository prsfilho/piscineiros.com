import * as mongoose from 'mongoose';
import { validateCPF } from '../common/validators';

export interface IProvider extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    gender: string;
    cpf: string;
}

const providersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    },
    password: {
        type: String,
        select: false,
        required: true,
        minlength: 4
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female']
    },
    cpf: {
        type: String,
        required: false,
        validate: {
            validator: validateCPF,
            message: 'invalid CPF ({VALUE})'
        }
    }
}, 
{
    versionKey: false
})

export const Provider = mongoose.model<IProvider>('Provider', providersSchema)
