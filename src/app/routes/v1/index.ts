import {Router} from 'express';
import {apiStarter} from './api-starter';
import { dataPush } from './data-push';
import { afishaDataPush } from './afisha-data-push';


export const v1Router: Router = Router();

v1Router.get('/api-starter', apiStarter);
v1Router.post('/data-push', dataPush);
v1Router.post('/afisha-data-push', afishaDataPush);
