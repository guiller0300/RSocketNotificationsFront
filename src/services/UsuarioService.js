import axios from 'axios';

export default class UsuarioService{
    
    dpto = null;

    constructor(dpto){
        this.dpto = dpto;
    }
    getDpto(){
        return axios.get("http://localhost:8080/usuario?dpto="+this.dpto)
    }
}