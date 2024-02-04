import * as restify from 'restify';

export const handleError = (req: restify.Request, resp: restify.Response, err, done) => {
    switch(err.name) {
        case 'MongoError':
            if(err.code === 11000) {
                err.statusCode = 400
            }
            break;
        case 'ValidationError':
            const messages = [];
            for(let name in err.errors) {
                messages.push({message: err.errors[name].message})
            }
            resp.json(400, {errors: messages})
            break
    }
    done()
}