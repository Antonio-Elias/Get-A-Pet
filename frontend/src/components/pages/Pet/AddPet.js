import styles from './AddPet.module.css';
import api from '../../../utils/api';
import { useState } from 'react';

import { useNavigate } from 'react-router-dom'; // no lugar do useHistory

import useFlashMessage from '../../../hooks/useFlashMessage';
import PetForm from '../../form/PetForm';


function AddPet(){
    return(
        <section className={styles.addpet_header}> 
            <div>
                <h1>AddPet</h1>
                <p>Depois ele ficará disponivel para adoção</p>
            </div>
            <PetForm btnText="Cadastrar Pet"/>
        </section>
    )
}

export default AddPet;