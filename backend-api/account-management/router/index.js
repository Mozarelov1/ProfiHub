const Router = require('express').Router;
const router = new Router();
const mgmtController = require('../controllers/management-cotroller');
const {upload} = require('../../S3/s3');

router.get('/view-profile/:link',mgmtController.viewProfile);
router.get('/view-my-profile',mgmtController.viewMyProfile);
router.patch('/settings/avatar',upload.single('image'),mgmtController.changeAvatar);
router.patch('/settings/update-bio',mgmtController.updateProfileBio)
router.delete('/settings/avatar',mgmtController.resetAvatar);
router.patch('/settings/password',mgmtController.resetPassword);
router.delete('/settings/delete-profile',mgmtController.deleteProfile);
router.get('/user-avatar',mgmtController.getAvatar);
router.patch('/settings/status',mgmtController.changeStatus);

module.exports = router;
