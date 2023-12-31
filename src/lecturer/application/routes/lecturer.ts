import { Router } from 'express';
import uploadMulter from '@core/infrastructure/multer';
import LecturerController from '../controllers/LecturerController';
import LecturerAuth from '../middlewares/LecturerAuth';
const router = Router();

router.get('/', LecturerController.getListLecturer);

router.get('/available-group', LecturerController.getListAvailableGroup);

router.post('/', LecturerAuth.headLecturer, LecturerController.addLecturer);

router.get('/:id', LecturerController.getListLecturerById);

router.patch('/:lecturerId/reset-password', LecturerAuth.headLecturer, LecturerController.resetPassword);

router.put('/:id/role', LecturerAuth.admin, LecturerController.changeRoleLecturer);

router.post('/import-lecturer', LecturerAuth.headLecturer, uploadMulter.single('file'), LecturerController.importLecturerByExcel);

export default router;
