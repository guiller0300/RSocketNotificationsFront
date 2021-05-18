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
        <v-btn id="connect" @click="markAsRead" icon v-on="on">
          <v-badge color="red" overlap>
            <span slot="badge">{{ items.length }}</span>
            <v-icon medium>mdi-bell</v-icon>
          </v-badge>
        </v-btn>
      </template>
      <v-list three-line max-width="450" class="mx-auto">
        <v-list-item-group
          v-model="selected"
          active-class="pink--text"
          multiple
        >
          <template v-for="(item, index) in items">
            <v-subheader v-if="item.header" :key="item.header"
              >Notificaciones</v-subheader
            >

            <v-divider
              v-else-if="item.divider"
              :key="index"
              :inset="item.inset"
            ></v-divider>

            <v-list-item v-else :key="item.title" v-model="selected">
              <v-list-item-avatar>
                <v-img :src="item.avatar"></v-img>
              </v-list-item-avatar>

              <v-list-item-content class="fondo">
                <v-list-item-title
                  v-html="item.title"
                  class="select"
                ></v-list-item-title>
                <v-list-item-subtitle
                  v-html="item.subtitle"
                ></v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-list-item-action-text>
                  <time-ago
                    :datetime="item.date"
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
import {
  RSocketClient,
  JsonSerializer,
  IdentitySerializer,
} from "rsocket-core";
import RSocketWebSocketClient from "rsocket-websocket-client";
import TimeAgo from "vue2-timeago";
import UsuarioService from "../services/UsuarioService";
export default {
  name: "websocketdemo",
  components: {
    TimeAgo,
  },
  props: ["user"],
  data: () => ({
    websocketUrl: "ws://localhost:6565/rsocket",
    dato: "ca",
    dptos: ["ca", "cf"],
    subscribers: [],
    selected: [],
    items: [],
    drawer: null,
    allNotifications: [{ name: "yo" }],
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
    /*this.allNotifications = this.user.notifications;
    this.unreadNotifications =  this.allNotifications.filter(notification => {
        return notification.read_at == null;
      });
     Echo.private("App.User." + this.user.id).notification(notification => {
       this.allNotifications.unshift(notification.notification);
     });*/
  },
  methods: {
    logout() {
      axios.post("/logout").then((response) => window.location.reload());
    },
    markAsRead() {
      /*axios.get("/mark-all-read/" + this.user.id).then((response) => {
        this.unreadNotifications = [];
      });*/
    },
    send() {
      console.log("Send message:" + this.send_message);
      if (this.connected) {
        const msg = { name: this.send_message };
        console.log(JSON.stringify(msg));
        this.socket.send(JSON.stringify(msg));
      }
    },
    connect() {
      // backend ws endpoint
      const wsURL = "ws://localhost:6565/rsocket";

      // rsocket client
      const client = new RSocketClient({
        serializers: {
          data: JsonSerializer,
          metadata: IdentitySerializer,
        },
        setup: {
          keepAlive: 60000,
          lifetime: 180000,
          dataMimeType: "application/json",
          metadataMimeType: "message/x.rsocket.routing.v0",
        },
        transport: new RSocketWebSocketClient({
          url: wsURL,
        }),
      });

      const numberRequester = (socket) => {
        socket
          .requestResponse({
            data: {
              id: null,
              description: "insertando producto",
              price: 230,
              subscriber: "juan",
            },
            metadata:
              String.fromCharCode("insert.product".length) + "insert.product",
          })
          .subscribe({
            onComplete: insertNotification,
            onError: errorHanlder,
            onNext: responseHanlder,
            onSubscribe: (subscription) => {
              //subscription.request(100); // set it to some max value
            },
          });
      };
      client.connect().then((sock) => {
        document.getElementById("connect").addEventListener("click", () => {
          numberRequester(sock, this.dato);
        });
      }, errorHanlder);

      // error handler
      const errorHanlder = (e) => console.log(e);
      // response handler
      const responseHanlder = (payload) => {
        console.log(payload.data);
      };
     const insertNotification = (socket, payload) => {
        this.dptos.forEach(function (valor, indice) {
          this.usuarioService = new UsuarioService(valor);
          this.usuarioService.getDpto().then(response => {
            console.log(response.data)
           /* socket
              .requestResponse({
                data: {
                  'id': null,
                  valor.
                },
                metadata: String.fromCharCode("insert.notificacion".length) + "insert.notificacion",
              })
              .subscribe({
                onComplete: console.log(payload.data),
                onError: errorHanlder,
                onNext: responseHanlder,
                onSubscribe: (subscription) => {
                  //subscription.request(100); // set it to some max value
                },
              });*/
              console.log(response.data + " "+ valor)
          });
        });
      };
    },
    disconnect() {
      console.log("trying to disconnect..");
      this.socket.close();
    },
  },
  mounted() {
    this.connect();
    
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
