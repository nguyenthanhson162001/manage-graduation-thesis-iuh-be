import { NextFunction, Request, Response } from 'express';
import Ioc from '@lecturer/infrastructure/inversify';
import ImportLecturerByExcelHandler from '../handlers/lecturer/ImportLecturerByExcelHandler';
import GetListLecturer from '../handlers/lecturer/GetListLecturer';
import GetLecturerById from '../handlers/lecturer/GetLecturerById';
import ChangeRoleLecturer from '../handlers/lecturer/ChangeRoleLecturer';
import AddLecturerHandler from '../handlers/lecturer/AddLecturerHandler';
import ResetPassword from '../handlers/lecturer/ResetPassword';
import GetListLecturerAvailableGroupHandler from '../handlers/lecturer/GetListLecturerAvailableGroupHandler';

class LecturerController {
	async importLecturerByExcel(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(ImportLecturerByExcelHandler).handle(req);
		return res.status(200).json(data);
	}
	async getListLecturer(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetListLecturer).handle(req);
		return res.status(200).json(data);
	}
	async getListAvailableGroup(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetListLecturerAvailableGroupHandler).handle(req);
		return res.status(200).json(data);
	}
	async getListLecturerById(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetLecturerById).handle(req);
		return res.status(200).json(data);
	}
	async changeRoleLecturer(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(ChangeRoleLecturer).handle(req);
		return res.status(200).json(data);
	}
	async addLecturer(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(AddLecturerHandler).handle(req);
		return res.status(200).json(data);
	}
	async resetPassword(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(ResetPassword).handle(req);
		return res.status(200).json(data);
	}
}

export default new LecturerController();
