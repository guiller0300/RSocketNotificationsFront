import axios from 'axios';

export default class UsuarioService{

    getDpto(dpto){
        return axios.get("http://localhost:8080/usuario?dpto="+dpto)
    }
    getSubscriberNotifications(subscriber){
       return axios.get("http://localhost:8080/notificaciones?subscriber="+subscriber);
    }
}