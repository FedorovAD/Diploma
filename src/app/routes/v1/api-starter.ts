import {Request, Response} from 'express';

export function apiStarter(req: Request, res: Response) {
    res.status(200).send('Hello, App');
}
