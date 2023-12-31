import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import Username from '@core/domain/validate-objects/Username';
import Password from '@core/domain/validate-objects/Password';
import NotFoundError from '@core/domain/errors/NotFoundError';
import { compareTextBcrypt } from '@core/infrastructure/bcrypt';
import ForbiddenError from '@core/domain/errors/ForbiddenError';
import JWTService from '@core/infrastructure/jsonwebtoken/JWTService';
import IStudentDao from '@student/domain/daos/IStudentDao';
import { TypeRoleUser } from '@core/domain/entities/Lecturer';

interface ValidatedInput {
	username: string;
	password: string;
}

@injectable()
export default class LoginHandlers extends RequestHandler {
	@inject('StudentDao') private studentDao!: IStudentDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const username = this.errorCollector.collect('username', () => Username.validate({ value: request.body['username'] }));
		const password = this.errorCollector.collect('password', () => Password.validate({ value: request.body['password'] }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { username, password };
	}

	async handle(request: Request) {
		const input = await this.validate(request);
		const student = await this.studentDao.findByUsername(input.username);
		if (!student) throw new NotFoundError('username not found');

		const isCorrectPassword = await compareTextBcrypt(input.password, student.password);

		if (!isCorrectPassword) throw new ForbiddenError('incorect password');

		const { accessToken, refreshToken } = JWTService.signAccessAndRefreshToken(student.id!, TypeRoleUser.STUDENT);

		return { accessToken, refreshToken, user: student?.toJSON };
	}
}
