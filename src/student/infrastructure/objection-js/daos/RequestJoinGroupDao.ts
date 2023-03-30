import RequestJoinGroup, { TypeRequestJoinGroup } from '@core/domain/entities/RequestJoinGroup';
import RequestJoinGroupDaoCore from '@core/infrastructure/objection-js/daos/RequestJoinGroupDao';
import IRequestJoinGroupDao from '@student/domain/daos/IRequestJoinGroupDao';
import { injectable } from 'inversify';

@injectable()
export default class RequestJoinGroupDao extends RequestJoinGroupDaoCore implements IRequestJoinGroupDao {
	async deleteByStudent(studentId: number): Promise<any> {
		const query = this.initQuery();
		const whereClause: Record<string, any> = {};

		whereClause['student_id'] = studentId;

		query.where(whereClause);

		const result = query.delete().execute();

		if (!result) {
			throw new Error('Fail to delete entity');
		}

		return result;
	}
	async findAllByStudentIdAndType(studentId: number, type: TypeRequestJoinGroup): Promise<RequestJoinGroup[]> {
		const query = this.initQuery();
		const whereClause: Record<string, any> = {};
		query.withGraphFetched('[student,group]');
		whereClause['type'] = type;
		whereClause['student_id'] = studentId;

		query.where(whereClause);

		const result = await query.execute();
		return result && result.map(e => this.convertModelToEntity(e));
	}
	async findAllByGroupIdAndType(groupId: number, type: TypeRequestJoinGroup): Promise<RequestJoinGroup[]> {
		const query = this.initQuery();
		query.withGraphFetched('[student,group]');

		const whereClause: Record<string, any> = {};
		whereClause.group_id = groupId;
		whereClause.type = type;

		query.where(whereClause);
		const result = await query.execute();

		return result && result.map(e => this.convertModelToEntity(e));
	}

	async findByGroupIdAndStudentId(groupId: number, studentId: number): Promise<RequestJoinGroup | null> {
		const query = this.initQuery();
		query.withGraphFetched('[student,group]');
		const whereClause: Record<string, number> = {};

		whereClause['group_id'] = groupId;
		whereClause['student_id'] = studentId;

		query.where(whereClause);

		const result = await query.execute();

		return result[0] ? this.convertModelToEntity(result[0]) : null;
	}
}
