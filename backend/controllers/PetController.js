const Pet = require('../models/Pet');

// helpers
const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = class PetController{
    // create a pet
    static async create(req, res){
        const { name, age, weight, color } = req.body;
        
        const available = true;

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
            available,
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

    static async getByid( req, res ){
        const id = req.params.id;

        if(!ObjectId.isValid(id)){
            res.status(422).json({ menssage: 'ID Inválido!' });
            return;
        }
        // check pets exists
        const pet = await Pet.findOne({ _id:id });

        if(!pet){
            res.status(422).json({ message: 'Pet não encontrado' });
            return;
        }

        res.status(200).json({ pet: pet })
    }

    static async removePetByid( req, res ){
        const id = req.params.id;

        if(!ObjectId.isValid(id)){ // função do mongoose para validação de dados.
            res.status(422).json({ menssage: 'ID Inválido!' });
            return;
        }

         // check pets exists
         const pet = await Pet.findOne({ _id:id });

         if(!pet){
             res.status(422).json({ message: 'Pet não encontrado' });
             return;
         }

         // check if logged in user registered the pet
         const token = getToken(req);
         const user = await getUserByToken(token);

        if(pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: 'Houve um problema em processar a sua solicitação, tente novamente mais tarde!'});
            return;
        }

        await Pet.findByIdAndRemove(id);

        res.status(200).json( {message: 'Pet removido com sucesso!'});

    }

    static async updatePet(req, res){
        const id = req.params.id;

        const { name, age, weight, color, available } = req.body;
        
        available = true;

        const images = req.files;

        const updtedData = {};

        const pet = await Pet.findOne( {_id: id});

        if(!pet){
            res.status(404).json({ message: 'Pet não encontrado!'});
            return;
        }

        
         // check if logged in user registered the pet
         const token = getToken(req);
         const user = await getUserByToken(token);

        if(pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: 'Houve um problema em processar a sua solicitação, tente novamente mais tarde!'});
            return;
        }

        // validations
        if(!name){
            res.status(422).json({ message: 'O nome é obrigatorio!' })
            return;
        }else{
            updtedData.name = name;
        }

        if(!age){
            res.status(422).json({ message: 'A idade é obrigatoria!' })
            return;
        }else{
            updtedData.age = age;
        }


        if(!weight){
            res.status(422).json({ message: 'O peso é obrigatorio!' })
            return;
        }else{
            updtedData.weight = weight;
        }


        if(!color){
            res.status(422).json({ message: 'A cor é obrigatoria!' })
            return;
        }else{
            updtedData.color = color;
        }


        if(images.lenght === 0){
            res.status(422).json({ message: 'A imagem é obrigatoria!' })
            return;
        }else{
            updtedData.images = [];
            images.map(( image ) => {
                updtedData.images.push(image.filename);
            })
        }

        try {
            await Pet.findByIdAndUpdate(id, updtedData);
            res.status(200).json( { message: 'Atualizado com sucesso!'});
        } catch (error) {
            res.status(422).json( {error : error});
        }
    }

    static async schedule(req, res){
        const id = req.params.id;

        // check if pet exists
        const pet = await Pet.findOne({ _id:id });
        if(!pet){
            res.status(404).json({ message:'Pet não encontrado!'});
            return;
        }

        // check if user registered the pet
        const token = getToken(req);
        const user = await getUserByToken(token);

        if(pet.user._id.equals(user._id)){
            res.status(422).json({
                menssage: 'Você não pode agendar uma visita com o su próprio Pet'
            })
            return;
        }

        // check if user has already scheduled a vidit
        if(pet.adopter){
            if(pet.adopter._id.equals(user._id)){
                res.status(422).json({
                    message: 'Você ja agendou uma visita para este Pet!'
                })
                return;
            }
        }
        
        // add user to pet
        pet.adopter = {
            _id: user._id,
            name: user.name,
            image: user.image
        }

        await Pet.findByIdAndUpdate(id, pet);

        res.status(200).json({
            message: `A visita foi agendada com sucesso, entre em contato com ${pet.user.name} pelo telefone ${pet.user.phone}!`
        })
    }

    static async concludeAdoption( req, res){
        const id = req.params.id;
       
        // check if pet exists
        const pet = await Pet.findOne({ _id:id });
        if(!pet){
            res.status(404).json({ message:'Pet não encontrado!'});
            return;
        }

        // check if logged in user registered the pet
        const token = getToken(req);
        const user = await getUserByToken(token);

       if(pet.user._id.toString() !== user._id.toString()) {
           res.status(422).json({ message: 'Houve um problema em processar a sua solicitação, tente novamente mais tarde!'});
           return;
       }

       pet.available = false;

        await Pet.findByIdAndUpdate(id, pet);

        res.status(200).json({ message: 'O ciclo de adoção foi completado com sucesso'})
    }
}