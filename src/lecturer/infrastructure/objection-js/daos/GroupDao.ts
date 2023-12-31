import Group from "@core/domain/entities/Group";
import GroupDaoCore from "@core/infrastructure/objection-js/daos/GroupDao";
import IGroupDao from "@lecturer/domain/daos/IGroupDao";
import { injectable } from "inversify";

@injectable()
export default class GroupDao extends GroupDaoCore implements IGroupDao {
  async findByGroupLecturerId(groupLecturerId: number): Promise<Group[]> {
    const query = this.initQuery();
    query.withGraphFetched(
      "[members, members.student_term, members.student_term.student, topic]"
    );

    const whereClause: Record<string, number> = {};

    query.join("assign", "assign.group_id", "=", "group.id");

    whereClause["assign.group_lecturer_id"] = groupLecturerId;

    query.where(whereClause);

    const result = await query.execute();

    return result && result.map((e) => this.convertModelToEntity(e));
  }
  async findOne(studentTermId: number): Promise<Group | null> {
    const query = this.initQuery();

    query.withGraphFetched(
      "[topic, topic.lecturer_term, topic.lecturer_term.lecturer]"
    );

    const whereClause: Record<string, number> = {};

    whereClause["members.student_term_id"] = studentTermId;

    query.joinRelated("members").where(whereClause);

    const result = await query.execute();

    return result[0] ? this.convertModelToEntity(result[0]) : null;
  }
  async findAll(termId?: number, topicId?: number): Promise<Group[]> {
    const query = this.initQuery();

    query.withGraphFetched(
      "[members, members.student_term, members.student_term.student, topic]"
    );

    const whereClause: Record<string, number> = {};

    if (termId) whereClause["term_id"] = termId;
    if (topicId) whereClause["topic_id"] = topicId;

    query.where(whereClause);

    const result = await query.execute();

    return result && result.map((e) => this.convertModelToEntity(e));
  }
}
