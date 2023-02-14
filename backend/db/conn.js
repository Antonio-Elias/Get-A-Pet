const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
require('dotenv').config();

async function main(){
    await mongoose.connect( process.env.urlConection,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
      }); 
    console.log('Conectou ao Mogoose');
}

main().catch( (err) => console.log('Erro ao conectar ao banco de dados'));

module.exports = mongoose;

