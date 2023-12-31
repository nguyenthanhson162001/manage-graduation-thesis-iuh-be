import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import NotFoundError from '@core/domain/errors/NotFoundError';
import ValidationError from '@core/domain/errors/ValidationError';
import Evaluation, { TypeEvaluation } from '@core/domain/entities/Evaluation';
import IGroupLecturerDao from '@lecturer/domain/daos/IGroupLecturerDao';
import TranscriptDetails, { ITranscriptDetail } from '@core/domain/validate-objects/TranscriptDetails';
import Student from '@core/domain/entities/Student';
import IStudentDao from '@lecturer/domain/daos/IStudentDao';
import Assign from '@core/domain/entities/Assign';
import IGroupMemberDao from '@lecturer/domain/daos/IGroupMemberDao';
import IGroupLecturerMemberDao from '@lecturer/domain/daos/IGroupLecturerMemberDao';
import Transcript from '@core/domain/entities/Transcript';
import ITranscriptDao from '@lecturer/domain/daos/ITranscriptDao';
import Lecturer from '@core/domain/entities/Lecturer';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';
import ILecturerTermDao from '@lecturer/domain/daos/ILecturerTermDao';
import IStudentTermDao from '@lecturer/domain/daos/IStudentTermDao';
import IGroupDao from '@lecturer/domain/daos/IGroupDao';
import LecturerTerm from '@core/domain/entities/LecturerTerm';
import StudentTerm from '@core/domain/entities/StudentTerm';
import IAssignDao from '@lecturer/domain/daos/IAssignDao';
import IEvaluationDao from '@lecturer/domain/daos/IEvaluationDao';
import ErrorCode from '@core/domain/errors/ErrorCode';
import Group, { TypeStatusGroup } from '@core/domain/entities/Group';
import GroupMember from '@core/domain/entities/GroupMember';
import GroupLecturer from '@core/domain/entities/GroupLecturer';
import { forIn, sum } from 'lodash';
import ITopicDao from '@lecturer/domain/daos/ITopicDao';
import NotificationLecturerService from '@core/service/NotificationLecturerService';
import { TypeStatusTopic } from '@core/domain/entities/Topic';

interface ValidatedInput {
	assign: Assign;
	group: Group;
	transcriptDetails: ITranscriptDetail[];
	lecturerTerm: LecturerTerm;
	studentTerm: StudentTerm;
}
interface IGraderByLecturerTerm {
	lecturerTerm: LecturerTerm;
	grade: number;
}
interface IGradeByTypeEluvation {
	avgGrader: number;
	sumGrade: number;
	count: number;
	lecturerTermIds: number[];
}
@injectable()
export default class CreateOrUpdateTranscriptHandler extends RequestHandler {
	@inject('GroupLecturerDao') private groupLecturerDao!: IGroupLecturerDao;
	@inject('StudentDao') private studentDao!: IStudentDao;
	@inject('GroupDao') private groupDao!: IGroupDao;
	@inject('GroupMemberDao') private groupMemberDao!: IGroupMemberDao;
	@inject('GroupLecturerMemberDao') private groupLecturerMemberDao!: IGroupLecturerMemberDao;
	@inject('AssignDao') private assignDao!: IAssignDao;
	@inject('EvaluationDao') private evaluationDao!: IEvaluationDao;
	@inject('LecturerDao') private lecturerDao!: ILecturerDao;
	@inject('TranscriptDao') private transcriptDao!: ITranscriptDao;
	@inject('LecturerTermDao') private lecturerTermDao!: ILecturerTermDao;
	@inject('StudentTermDao') private studentTermDao!: IStudentTermDao;
	@inject('TopicDao') private topic!: ITopicDao;

	async validate(request: Request): Promise<ValidatedInput> {
		const assignId = this.errorCollector.collect('assignId', () => EntityId.validate({ value: request.body['assignId'] }));
		const studentId = this.errorCollector.collect('studentId', () => EntityId.validate({ value: request.body['studentId'] }));
		const lecturerId = Number(request.headers['id']);
		const transcriptDetails = this.errorCollector.collect('transcripts', () => TranscriptDetails.validate({ value: request.body['transcripts'] }));
		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}
		let assign = await this.assignDao.findEntityById(assignId);
		if (!assign) throw new NotFoundError('assign not found');

		const groupStudent = await this.groupDao.findEntityById(assign.groupId);
		if (!groupStudent) throw new NotFoundError('group student not found');

		const groupLecturer = await this.groupLecturerDao.findEntityById(assign.groupLecturerId);
		if (!groupLecturer) throw new NotFoundError('group lecturer not found');

		let student = await this.studentDao.findEntityById(studentId);
		if (!student) throw new NotFoundError('student not found');

		let studentTerm = await this.studentTermDao.findOne(groupStudent?.termId!, studentId);
		if (!studentTerm) throw new NotFoundError('studentTerm not found');

		let lecturer = await this.lecturerDao.findEntityById(lecturerId);
		if (!lecturer) throw new NotFoundError('lecturer not found');

		let lecturerTerm = await this.lecturerTermDao.findOne(groupStudent?.termId!, lecturerId);
		if (!lecturerTerm) throw new NotFoundError('lecturer Term not found');

		const groupMembertudents = await this.groupMemberDao.findOne({
			studentTermId: studentTerm.id!,
			groupId: groupStudent.id!,
		});

		if (!groupMembertudents) {
			throw new ErrorCode('STUDENT_NOT_IN_THIS_GROUP', `Student not in group ${assign.groupId}`);
		}

		const groupMemberLecturer = await this.groupLecturerMemberDao.findOne({
			groupLecturerId: groupLecturer.id!,
			lecturerTermId: lecturerTerm.id!,
		});

		if (!groupMemberLecturer) {
			throw new ErrorCode('LECTURER_NOT_IN_THIS_GROUP', `Lecturer not in group ${assign.groupLecturerId}`);
		}
		//  Check time term

		return {
			transcriptDetails,
			assign,
			lecturerTerm,
			studentTerm,
			group: groupStudent,
		};
	}

	async handle(request: Request) {
		const { transcriptDetails, assign, lecturerTerm, studentTerm, group } = await this.validate(request);
		const groupLecturer = await this.groupLecturerDao.findEntityById(assign.groupLecturerId);
		const evaluations = await this.evaluationDao.findAll(groupLecturer?.termId, assign.typeEvaluation);
		const evaluationMap = new Map<number, Evaluation>();
		evaluations.forEach(evaluation => {
			evaluationMap.set(evaluation.id!, evaluation);
		});
		const transcripts = [];
		for (const transcriptDetail of transcriptDetails) {
			// check evaluation correct
			const evaluation = evaluationMap.get(transcriptDetail.idEvaluation);
			if (!evaluation || transcriptDetail.grade > evaluation.gradeMax) {
				continue;
			}
			let transcript = await this.transcriptDao.findOne({
				lecturerTermId: lecturerTerm.id!,
				evaluationId: evaluation.id!,
				studentTermId: studentTerm.id!,
			});

			if (transcript) {
				// update grade
				transcript.update({ grade: transcriptDetail.grade });
				transcript = await this.transcriptDao.updateEntity(transcript);
			} else {
				// insert grade
				transcript = await this.transcriptDao.insertEntity(
					Transcript.create({
						lecturerTerm,
						evaluation,
						grade: transcriptDetail.grade,
						studentTerm,
					})
				);
			}
			transcripts.push(transcript);
		}
		const topic = (await this.topic.findEntityById(group.topicId))!;
		group.update({ topic });
		await this.updateStatusGroup(group, groupLecturer!, assign.typeEvaluation);
		if (topic) {
			await NotificationLecturerService.send({
				user: topic.lecturerTerm,
				message: `Nhóm sinh viên '${group.name}' vừa được chấm điểm`,
				type: 'GROUP_STUDENT',
			});
		}

		return transcripts.map(e => e.toJSON);
	}
	async updateStatusGroup(group: Group, groupLecturer: GroupLecturer, type: TypeEvaluation) {
		const members = await this.groupMemberDao.findByGroupId({ groupId: group.id! });
		const groupLecturerMember = await this.groupLecturerMemberDao.findAll({ groupLecturerId: groupLecturer.id! });
		const gradeMinPass = 5;
		let pass = true;
		for (const member of members) {
			const transcripts = await this.transcriptDao.findByStudentAndType({ studentTermId: member.studentTermId!, type });
			if (transcripts.length == 0) return; // stop

			const summary = this.caculateAVGGrade(transcripts);

			// checll all lecturer was have transcripts with this student
			for (const lecturerMember of groupLecturerMember) {
				//Stop the function so someone hasn't transcript it yet
				if (!summary.lecturerTermIds.find(e => e == lecturerMember.lecturerTermId)) return;
			}
			// if someone in member have grade < 5 => fail all group
			if (summary.avgGrader < gradeMinPass) pass = false;
		}
		let message = `Nhóm sinh viên '${group.name}' đã ${pass ? ' VƯỢT QUA ' : ' RỚT '} vòng `;
		if (type == TypeEvaluation.ADVISOR) {
			group.update({ status: pass ? TypeStatusGroup.PASS_ADVISOR : TypeStatusGroup.FAIL_ADVISOR });
			message += `Giáo viên hướng dẫn`;
		} else if (type == TypeEvaluation.REVIEWER) {
			group.update({ status: pass ? TypeStatusGroup.PASS_REVIEWER : TypeStatusGroup.FAIL_REVIEWER });
			message += `Phản biện`;
		} else {
			// SESSION_HOST
			group.update({ status: pass ? TypeStatusGroup.PASS_SESSION_HOST : TypeStatusGroup.FAIL_SESSION_HOST });
			message += `Hội đồng`;
		}
		await NotificationLecturerService.send({
			user: group.topic?.lecturerTerm!,
			message,
			type: 'GROUP_STUDENT',
		});

		await this.groupDao.updateEntity(group);
	}

	caculateAVGGrade(transcripts: Array<Transcript>): IGradeByTypeEluvation {
		const gradeByLecturer = new Map<number, IGraderByLecturerTerm>();
		let sumGrade = 0;
		for (const transcript of transcripts) {
			sumGrade += transcript.grade;
			const oldGrade = gradeByLecturer.get(transcript.lecturerTermId!);
			if (!oldGrade) {
				// const lecturerTerm = await this.lecturerTermDao.findEntityById(transcript.lecturerTermId);
				gradeByLecturer.set(transcript.lecturerTermId!, {
					grade: transcript.grade,
					lecturerTerm: transcript.lecturerTerm!,
				});
			} else {
				gradeByLecturer.set(transcript.lecturerTermId!, {
					grade: oldGrade.grade + transcript.grade,
					lecturerTerm: oldGrade.lecturerTerm,
				});
			}
		}
		const lecturerTermIds = Array.from(gradeByLecturer.keys());
		return {
			avgGrader: sumGrade / lecturerTermIds.length,
			sumGrade: sumGrade,
			count: gradeByLecturer.values.length,
			lecturerTermIds,
		};
	}
}
