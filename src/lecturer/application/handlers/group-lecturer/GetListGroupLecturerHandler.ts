import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import IGroupLecturerDao from '@lecturer/domain/daos/IGroupLecturerDao';

interface ValidatedInput {
	termId: number;
}

@injectable()
export default class GetListGroupLecturerHandler extends RequestHandler {
	@inject('GroupLecturerDao') private groupLecturerDao!: IGroupLecturerDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.query['termId'] }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { termId };
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		// const term = await this.termDao.findEntityById(input.termId);

		const groupLecturers = await this.groupLecturerDao.findAll(input.termId);

		return groupLecturers.map(e => e.toJSON);
	}
}