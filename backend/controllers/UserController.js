const User = require('../models/User');
const bcrypt = require('bcrypt');
const createUserToken = require('../helpers/create-user-token');
const getToken  = require('../helpers/get-token');
const jwt = require('jsonwebtoken');
require('dotenv').config()

module.exports = class UserController{
    static async register(req, res){
        const { name, email, phone, password, confirmpassword } = req.body;

        // validation is empty
        if(!name){
            res.status(422).json({ message: 'O nome é obrigatório!' });
            return;
        }
        if(!email){
            res.status(422).json({ message: 'O email é obrigatório!' });
            return;
        }
        if(!phone){
            res.status(422).json({ message: 'O telefone é obrigatório!' });
            return;
        }
        if(!password){
            res.status(422).json({ message: 'A senha é obrigatório!' });
            return;
        }
        if(!confirmpassword){
            res.status(422).json({ message: 'A confirmação da senha é obrigatório!' });
            return;
        }
        if(password !== confirmpassword){
            res.status(422).json({ message: 'Senha e confirmação de senha precisam ser iguais!' })
            return
        }


        //check if user exists
        const userExists = await User.findOne({ email: email});

        if(userExists){
            res.status(422).json({ message: 'Por favor, utilize outro e-mail'});
            return;
        }

        
        // create a password
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = new User({
            name: name,
            email: email,
            phone: phone,
            password: passwordHash
        });
         try {
            const newUser = await user.save();
            await createUserToken( newUser, req, res);
         } catch (error) {
            res.status(500).json({message: error});
            
         }
    }

    static async login( req, res ){
        const { email, password } = req.body;
        console.log(req.body);

        if(!email){
            res.status(422).json({ message: 'O e-mail é obrigatório!'});
            return
        }
        if(!password){
            res.status(422).json({ message: 'A senha é obrigatório!'});
            return
        }

        // check if user exists
        const user = await User.findOne({ email: email});

        if(!user){
            res.status(422).json({ message: 'Nâo há usuário cadastrado com este e-mail'});
            return;
        }

        // check if password match with db password
        const checkPassword = await bcrypt.compare(password, user.password);
        if(!checkPassword){
            res.status(422).json({ message: 'Senha invalida' });
            return;
        }

        await createUserToken( user, req, res);
    }

    static async checkUser(req, res){
        let currentUser;
        if(req.headers.authorization){
            const token = getToken(req);
            const decoded = jwt.verify(token, process.env.nossosecret);
            currentUser = await User.findById( decoded.id ).select('-password'); // utilizado para não trazer o campo da senha na resposta
        }else {
            currentUser = null;
        }
        res.status(200).send(currentUser);
    }

    static async getUserById(req, res){
      const id = req.params.id;  
      const user = await User.findById( id ).select('-password');

      if(!user){
        res.status(422).json({
            message: 'Usuário não encontrado!'
        })
        return
      }

      res.status(200).json({ user });
    }
}