import { inject, injectable } from "inversify";
import RequestHandler from "@core/application/RequestHandler";
import ValidationError from "@core/domain/errors/ValidationError";
import { Request } from "express";
import ITopicDao from "@student/domain/daos/ITopicDao";
import ILecturerDao from "@student/domain/daos/ILecturerDao";
import EntityId from "@core/domain/validate-objects/EntityID";
import ILecturerTermDao from "@student/domain/daos/ILecturerTermDao";
import withRedisCache from "@core/utils/WithRedisCache";
import Topic from "@core/domain/entities/Topic";
import IGroupDao from "@student/domain/daos/IGroupDao";

interface ValidatedInput {
  termId: number;
  lecturerId: number;
}

@injectable()
export default class GetListTopicHandler extends RequestHandler {
  @inject("TopicDao") private topicDao!: ITopicDao;
  @inject("LecturerDao") private lecturerDao!: ILecturerDao;
  @inject("GroupDao") private groupDao!: IGroupDao;
  @inject("LecturerTermDao") private lecturerTermDao!: ILecturerTermDao;
  async validate(request: Request): Promise<ValidatedInput> {
    const termId = this.errorCollector.collect("termId", () =>
      EntityId.validate({ value: request.query["termId"], required: false })
    );
    const lecturerId = this.errorCollector.collect("lecturerId", () =>
      EntityId.validate({ value: request.query["lecturerId"], required: false })
    );

    if (this.errorCollector.hasError()) {
      throw new ValidationError(this.errorCollector.errors);
    }

    return { termId, lecturerId };
  }

  async handle(request: Request) {
    const input = await this.validate(request);
    let listJSONTopic = await this.getListTopic(input);

    return listJSONTopic;
  }
  @withRedisCache(60)
  private async getListTopic(input: ValidatedInput) {
    const props: any = { termId: input.termId };
    if (input.termId && input.lecturerId) {
      const lecturerTerm = await this.lecturerTermDao.findOne(
        input.termId,
        input.lecturerId
      );
      if (lecturerTerm) props.lecturerTermId = lecturerTerm?.id;
    }
    const listTopic = await this.topicDao.findAll(props);
    const reponsePromise = listTopic.map(async (topic) => {
      const groups = await this.groupDao.findAll({ topicId: topic.id });
      return {
        ...topic.toJSON,
        totalGroupChoose: groups?.length | 0,
      };
    });
    return await Promise.all(reponsePromise);
  }
}
