import Entity from './Entity';
import lodash from 'lodash';
import Evaluation from './Evaluation';
import Assign from './Assign';
import Student from './Student';
import Lecturer from './Lecturer';
export interface IProps {
	grade: number;
	student: Student;
	lecturer: Lecturer;
	evaluation: Evaluation;
	createdAt?: Date;
	updatedAt?: Date;
}
export default class Transcript extends Entity<IProps> {
	static create(props?: IProps, id?: number) {
		return new Transcript(props, id);
	}
	static createById(id?: number) {
		return new Transcript(undefined, id);
	}
	get grade() {
		return this.props.grade;
	}
	get studentId() {
		return this.props?.student?.id;
	}
	get student() {
		return this.props?.student;
	}
	get lecturerId() {
		return this.props?.lecturer?.id;
	}
	get lecturer() {
		return this.props?.lecturer;
	}
	get evaluationId() {
		return this.props?.evaluation?.id;
	}
	get evaluation() {
		return this.props?.evaluation;
	}
	get createdAt() {
		return this.props.createdAt || new Date();
	}
	get updatedAt() {
		return this.props.updatedAt || new Date();
	}
	get toJSON() {
		const { student, lecturer, ...props } = lodash.cloneDeep(this._props || {});
		let studentJSON = this.student?.toJSON;
		let lecturerJSON = this.lecturer?.toJSON;
		let evaluationJSON = this.evaluation?.toJSON;

		return { id: this.id, ...props, student: studentJSON, lecturer: lecturerJSON, evaluation: evaluationJSON };
	}
}
