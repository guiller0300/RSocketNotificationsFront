<template v-slot:activator="{ on }">
  <v-app-bar app color="primary" dark>
    <v-app-bar-title>Vue Admin
      Usuario: {{usuario.id}}
    </v-app-bar-title>
    <v-spacer></v-spacer>
    <p style="cursor: pointer" @click="logout()">Cerrar Sesión</p>
<!-- Menu de notificaciones -->
    <v-menu
      offset-y
      origin="center center"
      class="elelvation-1"
      :nudge-bottom="0"
      transition="scale-transition"
    >
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-badge color="red" overlap>
            <span slot="badge">{{ unreadNotifications.length }}</span> <!--Cantidad de notificaciones sin leer -->
            <v-icon medium>mdi-bell</v-icon> <!-- Icono de campana -->
          </v-badge>
        </v-btn>
      </template>
      <v-list three-line max-width="450" class="mx-auto">
        <v-list-item-group v-if="items.length > 0" active-class="pink--text" multiple>
          <!-- Recorrido de notificaciones, se utiliza slice.reverse para mostrar de abajo hacia arriba -->
          <template v-for="(item, index) in items.slice().reverse()"> 
            <v-subheader v-if="item.header" :key="item.header"
              >Notificaciones</v-subheader
            >

            <v-divider
              v-else-if="item.divider"
              :key="index"
              :inset="item.inset"
            ></v-divider> <!--divisor por notificación -->

            <v-list-item
              v-bind:style="[
               item.leido == false || item.subscriber == 0
                  ? { 'background-color': 'rgba(0, 115, 255,0.1)' } //Bloque (color) para cuando la notificación no este leida
                  : '',
              ]"
              v-else
              :key="item.id"
            >
              <v-list-item-avatar>
                <v-img :src="item.avatar"></v-img> <!--Aqui puede llevar una imagen -->
              </v-list-item-avatar>
              <!-- Acción para cuando se le de click a una notificación -->
              <v-list-item-content
                @click="markAsRead(item.id, item.subscriber)" 
              > 
              <!-- Titulo de la notificación -->
                <v-list-item-title
                  v-html="item.titulo"
                  class="select"
                ></v-list-item-title>
                <!--Subtitulo o descripción -->
                <v-list-item-subtitle
                  v-html="item.descripcion"
                ></v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <!-- Fecha que se insertó la notificación (Se usa el complemento TimeAgo) -->
                <v-list-item-action-text>
                  <time-ago
                    :datetime="item.fecha_inicio"
                    refresh
                    :locale="locale"
                    :tooltip="tooltip"
                    :long="longString"
                /></v-list-item-action-text>
              </v-list-item-action>
            </v-list-item>
          </template>
        </v-list-item-group>
        <v-list-item-group v-else-if="items.length == 0" active-class="pink--text" multiple>
          <v-list-item> Sin Notificaciones </v-list-item>
        </v-list-item-group>
      </v-list>
      <!-- <v-list>
        <v-list-tile :class="{'green': notification.read_at==null}" @click="markAsRead" v-for="notification in allNotifications" :key="notification.id">
          <v-list-tile-content>
            <v-list-tile-title>{{notification.name}} has just registered on {{notification.created_at}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list> -->
    </v-menu>
  </v-app-bar>
</template>

<script>
import { bus } from "../main";
import TimeAgo from "vue2-timeago";
import UsuarioService from "../services/UsuarioService";
export default {
  name: "websocketdemo",
  components: {
    TimeAgo,
  },
  data: () => ({
    subscribers: [],
    items: [],
    usuario: null,
    drawer: null,
    unreadNotifications: [],
    longString: false,
    tooltip: true,
    locale: "en",
  }),
  usuarioService: null,
  watch: {
    allNotifications(val) {
      this.unreadNotifications = this.allNotifications.filter(
        (notification) => {
          return notification.read_at == null;
        }
      );
    },
  },
  created() {
    bus.$on("jai", (data) => {
      if (data.subscriber == this.usuario.id || data.subscriber == 0) { //cada que se envia una nueva notificación se ingresa aquí
      //Corrobora que el usuario y el suscriptor sean correctos
        this.items.push(data); //Se añade
        this.unreadNotifications.push(data); //Aumenta el valor de las notificaciones sin leer
      }
    });
    this.usuario = JSON.parse(localStorage.getItem('session')); //Se obtiene el inicio de sesión
  },
  methods: {
    logout() {
      let valor = null;
      localStorage.setItem('session', (valor)) //Se vacia el localStorage para cerrar sesión
       location.reload() //Recarga de página
    },
    chargeNotifications() {
      //Aqui se cargan las notificaciones
      this.usuarioService
        .getSubscriberNotifications(this.usuario.id, this.usuario.departamento) //Este es el servicio donde se traen (id de usuario, departamento) el usuario actual
        .then((response) => {
          this.items = response.data;
          console.log(response.data);

          this.unreadNotifications = this.items.filter((notification) => {
            return notification.leido == false;
          });
        });
    },
    markAsRead(id, subscriber) {
      this.usuarioService
        .setReadNotification(id, subscriber) //Este es el servicio para cuando se lee una notificación (id de la notificación y suscripto
        .then((response) => {
          this.chargeNotifications(); //Se recargan las notificaciones
        });
    },
    send() {
      console.log("Send message:" + this.send_message);
      if (this.connected) {
        const msg = { name: this.send_message };
        console.log(JSON.stringify(msg));
        this.socket.send(JSON.stringify(msg));
      }
    },

    disconnect() {
      console.log("trying to disconnect..");
      this.socket.close();
    },
  },
  mounted() {
    //this.connect();
    this.usuarioService = new UsuarioService();
    this.chargeNotifications(); //Se cargan las notificaciones
  },
  computed: {
  }
};
</script>
<style scoped>
.select {
  color: red;
}
.fondo:hover {
  background-color: rgba(188, 143, 143, 0.1);
}
.v-list {
  height: 500px; /* or any height you want */
  overflow-y: auto;
}
</style>

<!--  { header: "Today" },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
        title: "Brunch this weekend?",
        subtitle: `<span class="text--primary">Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?`,
        date: "2018-08-03 12:35:00",
      },
      { divider: true, inset: true },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
        title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>',
        subtitle: `<span class="text--primary">to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend.`,
        date: new Date(2018, 7, 4, 12, 35),
      },
      { divider: true, inset: true },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/3.jpg",
        title: "Oui oui",
        subtitle:
          '<span class="text--primary">Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?',
        date: new Date(),
      },
      { divider: true, inset: true },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/4.jpg",
        title: "Birthday gift",
        subtitle:
          '<span class="text--primary">Trevor Hansen</span> &mdash; Have any ideas about what we should get Heidi for her birthday?',
        date: new Date(2018, 7, 4, 12, 35),
      },
      { divider: true, inset: true },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/5.jpg",
        title: "Recipe to try",
        subtitle:
          '<span class="text--primary">Britta Holt</span> &mdash; We should eat this: Grate, Squash, Corn, and tomatillo Tacos.',
        date: new Date(2018, 7, 4, 12, 35),
      }, -->
