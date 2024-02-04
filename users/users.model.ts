import * as mongoose from 'mongoose';
import { validateCPF } from '../common/validators';
import * as bcrypt from 'bcrypt';
import { environment } from '../common/environment';

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

// Auxiliary Functions for Middleware
const hashPassword = (obj, next) => {
    bcrypt.hash(obj.password, environment.security.saltRounds)
        .then(hash => {
            obj.password = hash
            next();
        }).catch(next)
}

const saveMiddleware = function(next) {
    const save: IProvider|any = this;
    if (!save.isModified('password')) {
        next()
    } else {
        hashPassword(save, next)
    }
}

const updateMiddleware = function(next) {
    const update: IProvider|any = this.getUpdate();
    if (!update.password) {
        next()
    } else {
        hashPassword(update, next)
        
    }
}

// Middleware to crypt password
providersSchema.pre('save', saveMiddleware);
providersSchema.pre('findOneAndUpdate', updateMiddleware);
providersSchema.pre('updateOne', updateMiddleware);

export const Provider = mongoose.model<IProvider>('Provider', providersSchema)
