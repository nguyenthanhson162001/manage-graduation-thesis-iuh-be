import { NextFunction, Request, Response } from 'express';
import Ioc from '@student/infrastructure/inversify';
import CreateGroupHandler from '../handlers/group/CreateGroupHandler';
import GetMyGroupHandler from '../handlers/group/GetMyGroupHandler';
import GetGroupByIdHandler from '../handlers/group/GetGroupByIdHandler';
import GetListGroupHandler from '../handlers/group/GetListGroupHandler';
import OutGroupHandler from '../handlers/group/OutGroupHandler';
import SendRequestJoinGroupHandler from '../handlers/group/request-join-group/SendRequestJoinGroupHandler';
import InviteJoinGroupHandler from '../handlers/group/request-join-group/SendInviteJoinGroupHandler';
import GetRequestJoinMyGroupHandler from '../handlers/group/request-join-group/GetRequestJoinMyGroupHandler';
import GetMyRequestJoinGroupHandler from '../handlers/group/request-join-group/GetMyRequestJoinGroupHandler';
import CancelTopicGroupHandler from '../handlers/group/CancelTopicGroupHandler';
import ChooseTopicHandler from '../handlers/group/ChooseTopicGroupHandler';
import RefuseRequestJoinGroupHandler from '../handlers/group/request-join-group/RefuseRequestJoinGroupHandler';
import accepRequestJoinGroupHandler from '../handlers/group/request-join-group/AccepRequestJoinGroupHandler';

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
	async refuseRequestJoinGroup(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(RefuseRequestJoinGroupHandler).handle(req);
		return res.status(200).json(data);
	}
	async accepRequestJoinGroup(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(accepRequestJoinGroupHandler).handle(req);
		return res.status(200).json(data);
	}
	async getRequestJoinMyGroup(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetRequestJoinMyGroupHandler).handle(req);
		return res.status(200).json(data);
	}
	async getMyRequestJoinGroup(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetMyRequestJoinGroupHandler).handle(req);
		return res.status(200).json(data);
	}
}
export default new GroupController();
