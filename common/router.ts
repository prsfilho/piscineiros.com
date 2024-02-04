import * as restify from 'restify'
import { EventEmitter } from 'events';

export abstract class Router extends EventEmitter {
    abstract applyRoutes(application: restify.Server)

    render(response: restify.Response, next: restify.Next) {
        return (document) => {
            if (document) {
                this.emit('beforeRender', document)
                response.json(document)
            } else {
                response.json(404)
            }

            return next();
        }
    }

    renderAll(response: restify.Response, next: restify.Next) {
        return (documents: any[]) => {
            if (documents) {
                documents.forEach(document => {
                    this.emit('beforeREnder', document)
                });
                response.json(documents)
            } else {
                response.json([])
            }
        }
    }
}
