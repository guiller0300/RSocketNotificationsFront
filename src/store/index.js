import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
let session = JSON.parse(localStorage.getItem('session'));
export default new Vuex.Store({
  state: {
    items: [],
    unreadNotifications: [],
    usuario: session
  },
  mutations: {
    getNotifications(state, data){
      return state.items = data
    },
    getUnreadNotifications(state, data){
      return state.unreadNotifications = data;
    },
    sendNotification(state, data) {
      console.log(state.usuario.id) //cada que se envia una nueva notificación se ingresa aquí
        //Corrobora que el usuario y el suscriptor sean correctos
        state.items.push(data); //Se añade
        state.unreadNotifications.push(data); //Aumenta el valor de las notificaciones sin leer
    }
  },
  actions: {
  },
  modules: {
  }
})
