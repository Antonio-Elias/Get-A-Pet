import { useState } from "react";
import formStyles from './Form.module.css'
import Input from "./input";

function PetFom(handleSubmit, petData, btnText){
    const [ pet, setPet ] = useState(petData || {});
    const [ preview, setPreview ] = useState([]);
    const colors = [ "Branco", "Preto", "Caramelo"];

    function onFileChange(e){

    }

    function handleChange(e){

    }

    return(
        <section>
            <form className={ formStyles.form_container}>
                <Input 
                    text="imagens do Pet"
                    type="file"
                    name="imagens"
                    handleOnChange={onFileChange}
                    multiple={true}
                />
                <Input 
                    text="Nome"
                    type="text"
                    name="name"
                    placeholder="Digite o nom"
                    handleOnChange={handleChange}
                    value={pet.name || ''}
                />
                <Input 
                    text="Idade do Pet"
                    type="text"
                    name="age"
                    placeholder="Digite a idade"
                    handleOnChange={handleChange}
                    value={pet.age || ''}
                />
                <Input 
                    text="Peso do Pet"
                    type="number"
                    name="weight"
                    placeholder="Digite a idade"
                    handleOnChange={handleChange}
                    value={pet.weight || ''}
                />
                <input type="submit" value={ btnText } />
            </form>
        </section>
    )
}

export default PetFom;