import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import ITermDao from '@lecturer/domain/daos/ITermDao';
import NotFoundError from '@core/domain/errors/NotFoundError';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';
import ILecturerTermDao from '@lecturer/domain/daos/ILecturerTermDao';

interface ValidatedInput {
	majorsId: number;
	lecturerId: number;
}

@injectable()
export default class GetTermByIdHandler extends RequestHandler {
	@inject('TermDao') private termDao!: ITermDao;
	@inject('LecturerTermDao') private lecturerTermDao!: ILecturerTermDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const majorsId = this.errorCollector.collect('majorsId', () => EntityId.validate({ value: request.query['majorsId'] }));
		const lecturerId = Number(request.headers['id']);

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { majorsId, lecturerId };
	}

	async handle(request: Request) {
		const input = await this.validate(request);
		const term = await this.termDao.findNowByMajorsId(input.majorsId);

		if (!term) {
			throw new NotFoundError('term not found');
		}
		const lecturerTerm = await this.lecturerTermDao.findOne(term.id!, input.lecturerId);

		const allow = !!lecturerTerm;

		return { allow, term: term?.toJSON };
	}
}
