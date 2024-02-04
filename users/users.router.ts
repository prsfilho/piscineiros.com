import * as restify from 'restify'
import { ModuleRouter } from '../common/model-router';
import { Provider, IProvider } from './users.model';

class UsersRouter extends ModuleRouter<IProvider> {
    
    constructor() {
        super(Provider)
        this.on('beforeRender', document => {
            document.password = undefined;
        })
    }

    applyRoutes(application: restify.Server) {
        application.get('/users', this.findAll)
        application.get('/users/:id', [this.validateId, this.findById])
        application.post('/users', this.save)
        application.put('/users/:id', [this.validateId, this.update])
        application.del('/users/:id', [this.validateId, this.delete])
    }
}

export const usersRouter = new UsersRouter();