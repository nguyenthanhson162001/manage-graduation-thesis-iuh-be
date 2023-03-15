import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import SortText from '@core/domain/validate-objects/SortText';
import EntityId from '@core/domain/validate-objects/EntityID';
import ITopicDao from '@lecturer/domain/daos/ITopicDao';
import NotFoundError from '@core/domain/errors/NotFoundError';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';
import Topic, { TypeStatusTopic } from '@core/domain/entities/Topic';
import PositiveNumber from '@core/domain/validate-objects/PositiveNumber';
import Text from '@core/domain/validate-objects/Text';
import Lecturer from '@core/domain/entities/Lecturer';
import Term from '@core/domain/entities/Term';
import ITermDao from '@lecturer/domain/daos/ITermDao';
import StatusTopic from '@core/domain/validate-objects/StatusTopic';
import Majors from '@core/domain/entities/Majors';

interface ValidatedInput {
	name: string;
	quantityGroupMax: number;
	description: string;
	note?: string;
	target: string;
	standradOutput: string;
	requireInput: string;
	comment?: string;
	termId: number;
	lecturerId: number;
}
@injectable()
export default class CreateTopicHandler extends RequestHandler {
	@inject('TopicDao') private topicDao!: ITopicDao;
	@inject('TermDao') private termDao!: ITermDao;
	@inject('LecturerDao') private lecturerDao!: ILecturerDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const name = this.errorCollector.collect('name', () => SortText.validate({ value: request.body['name'] }));
		const quantityGroupMax = this.errorCollector.collect('quantityGroupMax', () => PositiveNumber.validate({ value: request.body['quantityGroupMax'] }));
		const description = this.errorCollector.collect('description', () => Text.validate({ value: request.body['description'] }));
		const note = this.errorCollector.collect('note', () => SortText.validate({ value: request.body['note'], required: false }));
		const target = this.errorCollector.collect('target', () => SortText.validate({ value: request.body['target'] }));
		const standradOutput = this.errorCollector.collect('standradOutput', () => SortText.validate({ value: request.body['standradOutput'] }));
		const requireInput = this.errorCollector.collect('requireInput', () => SortText.validate({ value: request.body['requireInput'] }));
		const comment = this.errorCollector.collect('comment', () => Text.validate({ value: request.body['comment'] }));
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.body['termId'] }));
		const lecturerId = Number(request.headers['id']);
		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return {
			name,
			lecturerId,
			quantityGroupMax,
			description,
			note,
			target,
			standradOutput,
			requireInput,
			comment,
			termId,
		};
	}

	async handle(request: Request) {
		const input = await this.validate(request);
		const term = await this.termDao.findEntityById(input.termId);
		if (!term) {
			throw new Error('Term not found');
		}

		const isExistName = !!(await this.topicDao.findByNameLecturAndTerm(input.name, input.lecturerId, input.termId));
		if (isExistName) {
			throw new Error('name already exists');
		}

		const topic = await this.topicDao.insertEntity(
			Topic.create({
				name: input.name,
				quantityGroupMax: input.quantityGroupMax,
				description: input.description,
				note: input.note,
				target: input.target,
				standradOutput: input.standradOutput,
				requireInput: input.requireInput,
				comment: input.comment,
				status: TypeStatusTopic.PEDING,
				lecturer: Lecturer.createById(input.lecturerId),
				term: Term.createById(input.termId),
			})
		);
		if (!topic) throw new Error('Create Topic fail');

		return topic.toJSON;
	}
}
