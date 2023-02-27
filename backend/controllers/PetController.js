const Pet = require('../models/Pet');

// helpers
const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token');

module.exports = class PetController{
    // create a pet
    static async create(req, res){
        const { name, age, weight, color } = req.body;
        
        const avaliable = true;

        const images = req.files;

        // imagens upload

        // validations
        if(!name){
            res.status(422).json({ message: 'O nome é obrigatorio!' })
            return;
        }

        if(!age){
            res.status(422).json({ message: 'A idade é obrigatoria!' })
            return;
        }

        if(!weight){
            res.status(422).json({ message: 'O peso é obrigatorio!' })
            return;
        }

        if(!color){
            res.status(422).json({ message: 'A cor é obrigatoria!' })
            return;
        }

        if(images.lenght === 0){
            res.status(422).json({ message: 'A imagem é obrigatoria!' })
            return;
        }

        //get pet owner
        const token = getToken(req);
        const user = await getUserByToken(token);


        // create a pet
        const pet = new Pet({
            name, 
            age,
            weight,
            color,
            avaliable,
            images:[],
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone,
            },
        })
        
        images.map(( image )=>{
            pet.images.push(image.filename);
        })

        try {

            const newPet = await pet.save();
            res.status(201).json({ message: 'Pet Cadastrado com sucesso!', newPet });

        } catch (error) {

            res.status(500).json({ message: error });
        }
    }

    static async getAll( req, res){
        const pets = await Pet.find().sort('-createdAt');
        res.status(200).json({ pets: pets});
    }

    static async getAllUserPets( req, res ){

        const token = getToken(req);
        const user = await getUserByToken(token);
        const pets = await Pet.find({ 'user._id':user._id }).sort('-createdAt');

        res.status(200).json({ pets});
    }

    static async getAllUseradoptions( req, res ){
        const token = getToken(req);
        const user = await getUserByToken(token);
        const pets = await Pet.find({ 'adopter._id':user._id }).sort('-createdAt');

        res.status(200).json({ pets});
    }
}