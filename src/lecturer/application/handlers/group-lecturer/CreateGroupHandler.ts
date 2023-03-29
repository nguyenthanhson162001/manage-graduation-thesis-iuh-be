import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import { Request } from 'express';
import SortText from '@core/domain/validate-objects/SortText';
import EntityId from '@core/domain/validate-objects/EntityID';
import NotFoundError from '@core/domain/errors/NotFoundError';
import IGroupLecturerDao from '@lecturer/domain/daos/IGroupLecturerDao';
import IGroupLecturerMemberDao from '@lecturer/domain/daos/IGroupLecturerMemberDao';
import ITermDao from '@lecturer/domain/daos/ITermDao';
import ValidationError from '@core/domain/errors/ValidationError';
import GroupLecturer from '@core/domain/entities/GroupLecturer';
import GroupLecturerMember from '@core/domain/entities/GroupLecturerMember';
import Lecturer from '@core/domain/entities/Lecturer';
import Term from '@core/domain/entities/Term';
import EntityIds from '@core/domain/validate-objects/EntityIds';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';

interface ValidatedInput {
	name: string;
	term: Term;
	lecturers: Lecturer[];
}
@injectable()
export default class CreateGroupLecturerHandler extends RequestHandler {
	@inject('TermDao') private termDao!: ITermDao;
	@inject('GroupLecturerDao') private groupLecturerDao!: IGroupLecturerDao;
	@inject('GroupLecturerMemberDao') private groupMemberDao!: IGroupLecturerMemberDao;
	@inject('LecturerDao') private lecturerDao!: ILecturerDao;

	async validate(request: Request): Promise<ValidatedInput> {
		const name = this.errorCollector.collect('name', () => SortText.validate({ value: request.body['name'] }));
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.body['termId'] }));
		const lecturerIds = this.errorCollector.collect('lecturerIds', () => EntityIds.validate({ value: request.body['termId'], required: false }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}
		let term = await this.termDao.findEntityById(termId);
		if (!term) throw new NotFoundError('term not found');

		const lecturers: Lecturer[] = [];

		for (const lecturerId of lecturerIds) {
			const lecturer = await this.lecturerDao.findEntityById(lecturerId);
			if (lecturer) lecturers.push(lecturer);
		}

		return {
			name,
			term,
			lecturers,
		};
	}

	async handle(request: Request) {
		const { name, term, lecturers } = await this.validate(request);

		let group = await this.groupLecturerDao.findOne(term.id!, name);
		if (group) throw new Error(`group name ${name}  already exists in student`);

		group = await this.groupLecturerDao.insertEntity(
			GroupLecturer.create({
				term: term,
				name: name,
			})
		);
		const membersPromise = lecturers.map(async () => {
			return await this.groupMemberDao.insertEntity(GroupLecturerMember.create());
		});

		group.update({ members: await Promise.all(membersPromise) });

		return group?.toJSON;
	}
}
