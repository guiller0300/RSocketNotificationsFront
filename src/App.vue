<template>
  <v-app>
    <!--v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>-->
<v-main>
      <navbar :user="8188"></navbar>
      <v-btn @click="connect()">Insert</v-btn>
     <router-view></router-view>
</v-main>
      <v-footer class="text-center">
        <span>&copy; 2021</span>
      </v-footer>
  </v-app>
</template>
<script>
import Navbar from "./components/_navbar";
import {
  RSocketClient,
  JsonSerializer,
  IdentitySerializer,
} from "rsocket-core";
import RSocketWebSocketClient from "rsocket-websocket-client";
import TimeAgo from "vue2-timeago";
export default {
  
  name: "websocketdemo",
  components: {
    TimeAgo, Navbar
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
  props: ["user"],
  methods: {
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
            onComplete: insertNotification(socket,this.usuarioService),
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
        console.log(payload.data+"hola");
        
       // this.items.push(payload.data)
      };
      const insertNotification = (socket,usuarioService) => {
        let today = new Date();
        today.setHours(today.getHours()-5)
        let final = new Date();
        final.setDate(final.getDate() + 1);
        console.log(today+" "+final)
        this.dptos.forEach(function (valor) {
          usuarioService.getDpto(valor).then((response) => {
            response.data.forEach(function (retrieveData, indice) {
             socket
                .requestResponse({
                  data: {
                    'id': null,
                    'subscriber': retrieveData.id,
                    'titulo': "Se insertó un nuevo producto",
                    'descripcion':"Aquí se agrega una descripcion breve de lo que se acaba de hacer (opcional)", 
                    'fecha_inicio': today,
                    'fecha_final': final,
                    'leido':false
                  },
                  metadata:
                    String.fromCharCode("insert.notification".length) +
                    "insert.notification",
                })
                .subscribe({
                  onComplete: responseHanlder,
                  onError: errorHanlder,
                  onNext: responseHanlder,
                  onSubscribe: (subscription) => {
                    //subscription.request(100); // set it to some max value
                  },
                });
            });
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
<!--<template>
  <div id="app">
    <v-app id="inspire" dark>
      <v-navigation-drawer clipped fixed v-model="drawer" app>
        <!--<sidebar></sidebar>
      </v-navigation-drawer>

      <navbar :user="user"></navbar>

      <v-content>
        <v-container fluid fill-height>
          <v-layout justify-center>
            <v-flex shrink>
              <router-view></router-view>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
      <v-footer app fixed>
        <span>&copy; 2019</span>
      </v-footer>
    </v-app>
  </div>
</template>

<script>
import Navbar from "./components/_navbar";

export default {
  components: { Navbar },
  data: () => ({
    drawer: null
  }),
  props: ["user"]
};
</script>-->