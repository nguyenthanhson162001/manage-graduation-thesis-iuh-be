import { NextFunction, Request, Response } from 'express';
import Ioc from '@student/infrastructure/inversify';
import LoginHandlers from '../handlers/authentication/Login';
import RegisterHandlers from '../handlers/authentication/Register';

class AuthenticationController {
	async login(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(LoginHandlers).handle(req);
		return res.status(200).json(data);
	}
	async register(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(RegisterHandlers).handle(req);
		return res.status(200).json(data);
	}
}

export default new AuthenticationController();
