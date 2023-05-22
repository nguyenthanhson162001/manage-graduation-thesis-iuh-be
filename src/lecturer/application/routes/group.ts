import { Router } from "express";
import GroupController from "../controllers/GroupController";

const router = Router();

// group
router.get("/", GroupController.getListGroup);
router.get(
  "/group-lecturer/:groupLecturerId",
  GroupController.getListGroupByGroupLecturer
);
router.get("/:id", GroupController.getGroupById);

export default router;
