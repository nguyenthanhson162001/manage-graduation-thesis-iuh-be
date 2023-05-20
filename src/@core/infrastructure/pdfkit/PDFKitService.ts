import Evaluation, { TypeEvaluation } from "@core/domain/entities/Evaluation";
import PDFDocument from "pdfkit";
import fs from "fs";
import GenerateEvalutionPDF from "./GenerateEvalutionPDF";
import Assign from "@core/domain/entities/Assign";
import GenerateEvalutionPDFByAssign from "./GenerateEvalutionPDFDetail";
import LecturerDao from "@lecturer/infrastructure/objection-js/daos/LecturerDao";
import GroupMemberDao from "@lecturer/infrastructure/objection-js/daos/GroupMemberDao";
import EvaluationDao from "../objection-js/daos/EvaluationDao";
import Lecturer from "@core/domain/entities/Lecturer";
import GroupMember from "@core/domain/entities/GroupMember";
export default class PDFKitService {
  static generateEvalutionPDF(evaluations: Array<Evaluation>) {
    const generateEvalutionPDF = new GenerateEvalutionPDF(evaluations);
    return generateEvalutionPDF.excute();
  }
  static generateEvalutionPDFDetail(
    evaluations: Array<Evaluation>,
    groupMembers: Array<GroupMember>,
    lecturer: Lecturer
  ) {
    const generateEvalutionPDF = new GenerateEvalutionPDFByAssign(
      evaluations,
      groupMembers,
      lecturer
    );
    return generateEvalutionPDF.excute();
  }
  static convertHTMLToPDFBuffer() {}
}
