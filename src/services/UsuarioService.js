import axios from 'axios';

export default class UsuarioService{

    url = "http://localhost:8080/"
    getDpto(dpto){ //Usuarios por departamento
        return axios.get(this.url+"usuario?dpto="+dpto)
    }
    getUser(){// Usuarios en general
        return axios.get(this.url+"usuario/all")
    }
    getSubscriberNotifications(subscriber, departamento){ // Notificaciones por usuario y por departamento
       return axios.get(this.url+"notificaciones?subscriber="+subscriber+"&departamento="+departamento);
    }
    getUsuariobyId(id){ //Usuarios por ID
        return axios.get(this.url+"usuario/"+id);
    }

    setReadNotification(id, subscriber){ //Actualizar notificación cuando es leída
        return axios.put(this.url+"notificaciones/"+id+"/"+subscriber);
    }
}