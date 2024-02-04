import * as mongoose from 'mongoose'
import {Router} from './router';
import { NotFoundError } from 'restify-errors';

export abstract class ModuleRouter<D extends mongoose.Document> extends Router {
    constructor(protected model: mongoose.Model<D>) {
        super()
    }

    validateId = (req, resp, next) => {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            next(new NotFoundError('Document not Found'))
        } else {
            next()
        }
    }

    findAll = (req, resp, next) => {
        this.model.find()
            .then(this.renderAll(resp, next))
            .catch(next)
    }
    
    findById = (req, resp, next) => {
        this.model.findById(req.params.id)
            .then(this.render(resp, next))
            .catch(next)
    }

    save = (req, resp, next) => {
        let document = new this.model(req.body)
        document.save().then(this.render(resp, next)).catch(next)
    }

    update = (req, resp, next) => {
        this.model.updateOne({_id: req.params.id}, req.body, { runValidators: true }).then(result => {
            if (result) {
                return this.model.findById(req.params.id)
            } else {
                throw new NotFoundError('Document not found to update')
            }
        }).then(this.render(resp, next)).catch(next)
    }

    delete = (req, resp, next) => {
        this.model.deleteOne({_id: req.params.id}).then(result => {
            if(result) {
                resp.send(204);
            } else {
                throw new NotFoundError('Document not found to delete.')
            }
            return next();
        }).catch(next)
    }
}