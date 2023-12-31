import { Router } from 'express';
import TranscriptController from '../controllers/TranscriptController';

const router = Router();

router.post('/', TranscriptController.createOrUpdateTranscript);
router.get('/groups', TranscriptController.getListTranscriptByGroup);
router.get('/students/:studentId', TranscriptController.getListTranscriptByStudent);
router.get('/summary', TranscriptController.getAVGTranscriptByStudent);

export default router;
