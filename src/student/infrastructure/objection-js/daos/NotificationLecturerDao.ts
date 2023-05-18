import NotificationLecturer from '@core/domain/entities/NotificationLecturer';
import NotificationLecturerDaoCore from '@core/infrastructure/objection-js/daos/NotificationLecturerDao';
import INotificationLecturerDao from '@student/domain/daos/INotificationLecturerDao';
import { injectable } from 'inversify';

@injectable()
export default class NotificationLecturerDao extends NotificationLecturerDaoCore implements INotificationLecturerDao {
	async findAll(props: { lecturerId: number }): Promise<NotificationLecturer[]> {
		const query = this.initQuery();
		query.withGraphFetched('[lecturer]');

		const whereClause: Record<string, any> = {};

		whereClause['lecturer_id'] = props.lecturerId;

		query.where(whereClause);

		const result = await query.execute();

		return result && result.map(e => this.convertModelToEntity(e));
	}
}
