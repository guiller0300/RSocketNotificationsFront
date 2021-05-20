import axios from 'axios';

export default class UsuarioService{

    getDpto(dpto){
        return axios.get("http://localhost:8080/usuario?dpto="+dpto)
    }
    getSubscriberNotifications(subscriber){
       return axios.get("http://localhost:8080/notificaciones?subscriber="+subscriber);
    }

    setReadNotification(id, subscriber){
        return axios.put("http://localhost:8080/notificaciones/"+id+"/"+subscriber);
    }
}