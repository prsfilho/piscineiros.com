import * as restify from 'restify'
import * as mongoose from 'mongoose';
import { environment } from '../common/environment';
import { Router } from '../common/router';
import { handleError } from './handler-error';

export class Server {
	// attributes
	application:  restify.Server

	// methods
	initDB() {
		(<any>mongoose).Promise = global.Promise
		return mongoose.connect(environment.db.url)
	}

	initRoutes(routers: Router[]): Promise<any> {
		return new Promise((resolve, reject) => {
			try {
				this.application = restify.createServer({
					name: 'brum-api',
					version: '1.0.0'
				})

				// plugins
				this.application.use(restify.plugins.queryParser())
				this.application.use(restify.plugins.bodyParser())

				for (let router of routers) {
					router.applyRoutes(this.application)
				}

				this.application.listen(environment.server.port, () => {
					resolve(this.application)
				})
				
				this.application.on('restifyError', handleError)
			} catch (error) {
				reject(error)
			}
		})
	}

	bootstrap(routers: Router[] = []): Promise<Server>{
		return this.initDB().then(() => this.initRoutes(routers).then(() => this))
	}
}