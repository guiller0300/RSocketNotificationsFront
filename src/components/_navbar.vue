<template v-slot:activator="{on}">
  <v-app-bar app color="primary" dark>
    <v-app-bar-title>Vue Admin</v-app-bar-title>
    <v-spacer></v-spacer>

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
            <span slot="badge">{{ unreadNotifications.length }}</span>
            <v-icon medium>mdi-bell</v-icon>
          </v-badge>
        </v-btn>
      </template>
      <v-list three-line max-width="450" class="mx-auto">
        <v-list-item-group
          active-class="pink--text"
          multiple
        >
          <template v-for="(item, index) in items.slice().reverse()">
            <v-subheader v-if="item.header" :key="item.header"
              >Notificaciones</v-subheader
            >

            <v-divider
              v-else-if="item.divider"
              :key="index"
              :inset="item.inset"
            ></v-divider>

            <v-list-item
              v-bind:style="[
                item.leido == false
                  ? { 'background-color': 'rgba(0, 115, 255,0.1)' }
                  : '',
              ]"
              v-else
              :key="item.id">
              <v-list-item-avatar>
                <v-img :src="item.avatar"></v-img>
              </v-list-item-avatar>

              <v-list-item-content
                @click="markAsRead(item.id, item.subscriber)"
              >
                <v-list-item-title
                  v-html="item.titulo"
                  class="select"
                ></v-list-item-title>
                <v-list-item-subtitle
                  v-html="item.descripcion"
                ></v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
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
  props: ["user"],
  data: () => ({
    subscribers: [],
    items: [],
    drawer: null,
    unreadNotifications: [],
    longString: false,
    tooltip: true,
    locale: "en",
  }),
  usuarioService: null,
  props: ["user"],
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
      if (data.subscriber == this.user) {
        this.items.push(data);
        this.unreadNotifications.push(data);
      }
    });
  },
  methods: {
    logout() {
      axios.post("/logout").then((response) => window.location.reload());
    },
    chargeNotifications(){
     this.usuarioService
      .getSubscriberNotifications(this.user)
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
        .setReadNotification(id, subscriber)
        .then((response) => {
          this.chargeNotifications();
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
    this.chargeNotifications();
  },
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
