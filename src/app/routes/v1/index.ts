import {Router} from 'express';
import {apiStarter} from './api-starter';
import { dataPush } from './data-push';
import { afishaDataPush } from './afisha-data-push';
import { afishaDataPushCinema } from './afisha-data-push-cinema';
import { afishaDataPushTheatre } from './afisha-data-push-theatre';
import { parsePrice } from './parser-afisha-pricelist-theatre-museum';
import { coords } from './geo-coding';
import { workTimePush } from './time-of-work-push';
import { bestPlaces } from './main-function';
import bodyParser from 'body-parser';







export const v1Router: Router = Router();

v1Router.get('/api-starter', apiStarter);
v1Router.use(bodyParser.json())
v1Router.post('/data-push', dataPush);
v1Router.post('/afisha-data-push', afishaDataPush);
v1Router.post('/afisha-data-push-cinema', afishaDataPushCinema);
v1Router.post('/afisha-data-push-theatre', afishaDataPushTheatre)
v1Router.post('/price-update', parsePrice)
v1Router.post('/coords-get', coords)
v1Router.post('/work-time-push', workTimePush)
v1Router.post('/result', bestPlaces)
