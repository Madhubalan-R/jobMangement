import { refreshTokenMiddleware } from "../middelware/tokenMiddleware";
import {getAllForms, getFormById, getForms, retryFailedForms} from "../controller/formController"
import { Router } from "express";


const router = Router();
router.use(refreshTokenMiddleware);

router.get('/forms',getForms);
router.post('/retryForms',retryFailedForms);
router.get('/getAllForms',getAllForms);
router.get('/:id', getFormById);

export default router;