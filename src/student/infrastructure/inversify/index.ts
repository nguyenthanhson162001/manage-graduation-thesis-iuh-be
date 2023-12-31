import { Container } from 'inversify';
import 'reflect-metadata';
import ErrorCollector from '@core/infrastructure/utilities/ErrorCollector';
import Nodemailer from '@core/infrastructure/nodemailer';
import IMajorsDao from '@student/domain/daos/IMajorsDao';
import MajorsDao from '@student/infrastructure/objection-js/daos/MajorsDao';
import IStudentDao from '@student/domain/daos/IStudentDao';
import StudentDao from '@student/infrastructure/objection-js/daos/StudentDao';
import TermDao from '../objection-js/daos/TermDao';
import ITermDao from '@student/domain/daos/ITermDao';
import ILecturerDao from '@student/domain/daos/ILecturerDao';
import LecturerDao from '../objection-js/daos/LecturerDao';
import TopicDao from '../objection-js/daos/TopicDao';
import ITopicDao from '@student/domain/daos/ITopicDao';
import IGroupDao from '@student/domain/daos/IGroupDao';
import GroupDao from '../objection-js/daos/GroupDao';
import GroupMemberDao from '../objection-js/daos/GroupMemberDao';
import IGroupMemberDao from '@student/domain/daos/IGroupMemberDao';
import IRequestJoinGroupDao from '@student/domain/daos/IRequestJoinGroupDao';
import RequestJoinGroupDao from '../objection-js/daos/RequestJoinGroupDao';
import LecturerTermDao from '../objection-js/daos/LecturerTermDao';
import IStudentTermDao from '@student/domain/daos/IStudentTermDao';
import ILecturerTermDao from '@student/domain/daos/ILecturerTermDao';
import StudentTermDao from '../objection-js/daos/StudentTermDao';
import ITranscriptDao from '@student/domain/daos/ITranscriptDao';
import TranscriptDao from '../objection-js/daos/TranscriptDao';
import AchievementDao from '../objection-js/daos/AchievementDao';
import IAchievementDao from '@student/domain/daos/IAchievementDao';
import GroupLecturerDao from '../objection-js/daos/GroupLecturerDao';
import IGroupLecturerDao from '@student/domain/daos/IGroupLecturerDao';
import GroupLecturerMemberDao from '../objection-js/daos/GroupLecturerMemberDao';
import IGroupLecturerMemberDao from '@student/domain/daos/IGroupLecturerMemberDao';
import AssignDao from '../objection-js/daos/AssignDao';
import IAssignDao from '@student/domain/daos/IAssignDao';
import INotificationStudentDao from '@student/domain/daos/INotificationStudentDao';
import NotificationStudentDao from '../objection-js/daos/NotificationStudentDao';

const container = new Container({
	autoBindInjectable: true,
	skipBaseClassChecks: true,
});

// Utilities
container.bind<ErrorCollector>('ErrorCollector').to(ErrorCollector);

// Mail
container.bind<Nodemailer>('Nodemailer').to(Nodemailer);

// Daos
container.bind<IMajorsDao>('MajorsDao').to(MajorsDao);
container.bind<IStudentDao>('StudentDao').to(StudentDao);
container.bind<ITermDao>('TermDao').to(TermDao);
container.bind<ITopicDao>('TopicDao').to(TopicDao);
container.bind<ILecturerDao>('LecturerDao').to(LecturerDao);
container.bind<IGroupDao>('GroupDao').to(GroupDao);
container.bind<IGroupMemberDao>('GroupMemberDao').to(GroupMemberDao);
container.bind<IRequestJoinGroupDao>('RequestJoinGroupDao').to(RequestJoinGroupDao);

container.bind<ILecturerTermDao>('LecturerTermDao').to(LecturerTermDao);
container.bind<IGroupLecturerDao>('GroupLecturerDao').to(GroupLecturerDao);
container.bind<IGroupLecturerMemberDao>('GroupLecturerMemberDao').to(GroupLecturerMemberDao);
container.bind<IStudentTermDao>('StudentTermDao').to(StudentTermDao);
container.bind<ITranscriptDao>('TranscriptDao').to(TranscriptDao);
container.bind<IAchievementDao>('AchievementDao').to(AchievementDao);
container.bind<IAssignDao>('AssignDao').to(AssignDao);
container.bind<INotificationStudentDao>('NotificationStudentDao').to(NotificationStudentDao);
export default container;
