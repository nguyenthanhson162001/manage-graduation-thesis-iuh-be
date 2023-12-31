import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import ConflictError from '@core/domain/errors/ConflictError';
import IMajorsDao from '@student/domain/daos/IMajorsDao';
import IStudentDao from '@student/domain/daos/IStudentDao';
import NotFoundError from '@core/domain/errors/NotFoundError';

interface ValidatedInput {
	id: number;
	role: string;
}

@injectable()
export default class GetMyInfoHandlers extends RequestHandler {
	@inject('StudentDao') private studentDao!: IStudentDao;
	@inject('MajorsDao') private majorsDao!: IMajorsDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const data = request.headers;

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}
		return { id: Number(data.id), role: String(data.role) };
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		let student = await this.studentDao.findEntityById(input.id);

		if (!student) throw new NotFoundError('student not found');

		return student!.toJSON;
	}
}
