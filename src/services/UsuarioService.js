import axios from 'axios';

export default class UsuarioService{

    url = "http://localhost:8080/"
    getDpto(dpto){
        return axios.get(this.url+"usuario?dpto="+dpto)
    }
    getUser(){
        return axios.get(this.url+"usuario/all")
    }
    getSubscriberNotifications(subscriber, departamento){
       return axios.get(this.url+"notificaciones?subscriber="+subscriber+"&departamento="+departamento);
    }
    getUsuariobyId(id){
        return axios.get(this.url+"usuario/"+id);
    }

    setReadNotification(id, subscriber){
        return axios.put(this.url+"notificaciones/"+id+"/"+subscriber);
    }
}