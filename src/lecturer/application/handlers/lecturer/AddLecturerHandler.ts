import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import Username from '@core/domain/validate-objects/Username';
import Password from '@core/domain/validate-objects/Password';
import NotFoundError from '@core/domain/errors/NotFoundError';
import ConflictError from '@core/domain/errors/ConflictError';
import IMajorsDao from '@lecturer/domain/daos/IMajorsDao';
import EntityId from '@core/domain/validate-objects/EntityID';
import { encriptTextBcrypt } from '@core/infrastructure/bcrypt';
import Lecturer, { TypeDegree, TypeGender, TypeRoleLecturer } from '@core/domain/entities/Lecturer';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';
import { faker } from '@faker-js/faker';
import Majors from '@core/domain/entities/Majors';
import ITermDao from '@lecturer/domain/daos/ITermDao';
import ILecturerTermDao from '@lecturer/domain/daos/ILecturerTermDao';
import LecturerTerm from '@core/domain/entities/LecturerTerm';
import PhoneNumber from '@core/domain/validate-objects/PhoneNumber';
import Email from '@core/domain/validate-objects/Email';
import SortText from '@core/domain/validate-objects/SortText';
import Gender from '@core/domain/validate-objects/Gender';
import Degree from '@core/domain/validate-objects/Degree';

interface ValidatedInput {
	username: string;
	password: string;
	termId: number;
	majorsId: number;
	phoneNumber: string;
	email: string;
	name: string;
	gender: TypeGender;
	degree: TypeDegree;
}

@injectable()
export default class AddLecturerHandler extends RequestHandler {
	@inject('LecturerDao') private lecturerDao!: ILecturerDao;
	@inject('MajorsDao') private majorsDao!: IMajorsDao;
	@inject('TermDao') private termDao!: ITermDao;
	@inject('LecturerTermDao') private LecturertermDao!: ILecturerTermDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const majorsId = this.errorCollector.collect('majorsId', () => EntityId.validate({ value: request.body['majorsId'] }));
		const username = this.errorCollector.collect('username', () => Username.validate({ value: request.body['username'] }));
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.body['termId'] }));
		const password = this.errorCollector.collect('password', () => Password.validate({ value: request.body['password'], required: false }));
		const phoneNumber = this.errorCollector.collect('phoneNumber', () => PhoneNumber.validate({ value: request.body['phoneNumber'], required: false }));
		const email = this.errorCollector.collect('email', () => Email.validate({ value: request.body['email'], required: false }));
		const name = this.errorCollector.collect('name', () => SortText.validate({ value: request.body['name'], required: false }));
		const gender = this.errorCollector.collect('gender', () => Gender.validate({ value: request.body['gender'], required: false }));
		const degree = this.errorCollector.collect('degree', () => Degree.validate({ value: request.body['degree'], required: false }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { username, password, majorsId, termId, phoneNumber, email, name, degree, gender };
	}

	async handle(request: Request) {
		const { username, password, majorsId, termId, phoneNumber, email, name, degree, gender } = await this.validate(request);
		let lecturer = await this.lecturerDao.findByUsername(username);
		if (lecturer) throw new ConflictError('username already exists');

		let majors = await this.majorsDao.findEntityById(majorsId);
		if (!majors) throw new NotFoundError('majors not found');

		const term = await this.termDao.findEntityById(termId);
		if (!term) {
			throw new Error('term not found');
		}
		const defaultPassword = '123456';
		const passwordEncript = await encriptTextBcrypt(password || defaultPassword);

		lecturer = Lecturer.create({
			username: username,
			password: passwordEncript,
			phoneNumber,
			majors: majors,
			email,
			name,
			degree,
			gender,
			isAdmin: false,
			role: TypeRoleLecturer.LECTURER,
		});

		await this.LecturertermDao.insertEntity(
			LecturerTerm.create({
				lecturer,
				term,
				role: lecturer.role,
			})
		);
		lecturer = await this.lecturerDao.insertEntity(lecturer);

		return lecturer.toJSON;
	}
}
