import NotificationStudent from '@core/domain/entities/NotificationStudent';
import NotificationStudentDaoCore from '@core/infrastructure/objection-js/daos/NotificationStudentDao';
import INotificationStudentDao from '@student/domain/daos/INotificationStudentDao';
import { injectable } from 'inversify';

@injectable()
export default class NotificationStudentDao extends NotificationStudentDaoCore implements INotificationStudentDao {
	async readAll(props: { studentId: number }): Promise<boolean> {
		const query = this.initQuery();

		query.update({ read: true }).where({ student_id: props.studentId });

		const result = await query.execute();
		return !!result;
	}
	async findAll(props: { studentId: number }): Promise<NotificationStudent[]> {
		const query = this.initQuery();
		query.withGraphFetched('[student]');

		const whereClause: Record<string, any> = {};

		whereClause['student_id'] = props.studentId;

		query.where(whereClause);

		const result = await query.execute();

		return result && result.map(e => this.convertModelToEntity(e));
	}
}
