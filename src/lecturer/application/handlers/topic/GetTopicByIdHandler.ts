import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import ITopicDao from '@lecturer/domain/daos/ITopicDao';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';

interface ValidatedInput {
	id: number;
}

@injectable()
export default class GetTopicByIdHandler extends RequestHandler {
	@inject('TopicDao') private topicDao!: ITopicDao;
	@inject('LecturerDao') private lecturerDao!: ILecturerDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const id = this.errorCollector.collect('id', () => EntityId.validate({ value: String(request.params['id']) }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { id };
	}

	async handle(request: Request) {
		const input = await this.validate(request);
		const topic = await this.topicDao.findGraphEntityById(input.id, 'head_lecturer');

		if (!topic) {
			throw new Error('topic not found');
		}
		const lecturer = await this.lecturerDao.findGraphEntityById(topic.lecturerId!, 'user');

		lecturer && topic.updateLecturer(lecturer);

		return topic.toJSON;
	}
}
