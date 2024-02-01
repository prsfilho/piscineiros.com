import * as restify from 'restify'
import { Router } from '../common/router';
import { Provider } from './users.model';
import { NotFoundError } from 'restify-errors';

class UsersRouter extends Router {
    
    constructor() {
        super()
        this.on('beforeRender', document => {
            document.password = undefined;
        })
    }

    applyRoutes(application: restify.Server) {
        application.get('/users', (req, resp, next) => {
            Provider.find().then(this.render(resp, next)).catch(next)
        })

        application.get('/users/:id', (req, resp, next) => {
            Provider.findById(req.params.id).then(this.render(resp, next)).catch(next)
        })

        application.post('/users', (req, resp, next) => {
            let user = new Provider(req.body)
            user.save().then(this.render(resp, next)).catch(next)
        })

        application.put('/users/:id', (req, resp, next) => {
            Provider.updateOne({_id: req.params.id}, req.body).then(result => {
                if (result) {
                    return Provider.findById(req.params.id)
                } else {
                    throw new NotFoundError('Document not found to update')
                }
            }).then(this.render(resp, next)).catch(next)
        })

        application.del('/users/:id', (req, resp, next) => {
            Provider.deleteOne({_id: req.params.id}).then(result => {
                if(result) {
                    resp.send(204);
                } else {
                    throw new NotFoundError('Document not found to delete.')
                }
                return next();
            }).catch(next)
        })
    }
}

export const usersRouter = new UsersRouter();