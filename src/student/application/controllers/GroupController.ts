import { NextFunction, Request, Response } from 'express';
import Ioc from '@student/infrastructure/inversify';
import CreateGroupHandler from '../handlers/group/CreateGroupHandler';
import GetMyGroupHandler from '../handlers/group/GetMyGroupHandler';
import GetGroupByIdHandler from '../handlers/group/GetGroupByIdHandler';
import GetListGroupHandler from '../handlers/group/GetListGroupHandler';
import OutGroupHandler from '../handlers/group/OutGroupHandler';
import SendRequestJoinGroupHandler from '../handlers/group/request-join-group/SendRequestJoinGroupHandler';
import InviteJoinGroupHandler from '../handlers/group/request-join-group/InviteJoinGroupHandler';
import GetAllRequestJoinGroupHandler from '../handlers/group/request-join-group/GetAllRequestJoinGroupHandler';
import CancelTopicGroupHandler from '../handlers/group/CancelTopicGroupHandler';
import ChooseTopicHandler from '../handlers/group/ChooseTopicGroupHandler';

class GroupController {
	async createGroup(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(CreateGroupHandler).handle(req);
		return res.status(200).json(data);
	}
	async getMyGroup(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetMyGroupHandler).handle(req);
		return res.status(200).json(data);
	}
	async getGroupById(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetGroupByIdHandler).handle(req);
		return res.status(200).json(data);
	}
	async getListGroup(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetListGroupHandler).handle(req);
		return res.status(200).json(data);
	}
	async outGroup(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(OutGroupHandler).handle(req);
		return res.status(200).json(data);
	}

	// topic
	async chooseTopicGroup(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(ChooseTopicHandler).handle(req);
		return res.status(200).json(data);
	}

	async cancelTopicGroup(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(CancelTopicGroupHandler).handle(req);
		return res.status(200).json(data);
	}

	// requestJoinGroup
	async sendRequestJoinGroup(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(SendRequestJoinGroupHandler).handle(req);
		return res.status(200).json(data);
	}
	async sendInviteJoinGroup(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(InviteJoinGroupHandler).handle(req);
		return res.status(200).json(data);
	}
	async getAllRequestJoinMyGroup(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetAllRequestJoinGroupHandler).handle(req);
		return res.status(200).json(data);
	}
}
export default new GroupController();
