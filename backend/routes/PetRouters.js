const router  = require('express').Router();

const PetController = require('../controllers/PetController');

// midlewares
const verifyToken = require('../helpers/verify-token');
const { imageUpload } = require('../helpers/image-uploads');


router.post('/create', verifyToken, imageUpload.array('images'), PetController.create);
router.get('/', PetController.getAll);
router.get('/mypets', verifyToken, PetController.getAllUserPets);
router.get('/myadoptions', verifyToken, PetController.getAllUseradoptions);
router.get('/:id', PetController.getByid);
router.delete('/:id', verifyToken ,PetController.removePetByid);
router.patch('/:id', verifyToken , imageUpload.array('images'), PetController.updatePet);
router.patch('/schedule/:id', verifyToken , PetController.schedule);

module.exports = router;