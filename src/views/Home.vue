<template>
  <div class="home">
    <v-btn id="connect">Insert</v-btn>
    <img alt="Vue logo" src="../assets/logo.png" />
    <!--<v-card class="mx-auto" max-width="500">
      <v-list two-line>
        <v-list-item-group
          v-model="selected"
          active-class="pink--text"
          multiple
        >
          <template v-for="(item, index) in items">
            <v-list-item :key="item.title">
              <template v-slot:default="{ active }">
                <v-list-item-content>
                  <v-list-item-title v-text="item.title"></v-list-item-title>

                  <v-list-item-subtitle
                    class="text--primary"
                    v-text="item.headline"
                  ></v-list-item-subtitle>

                  <v-list-item-subtitle
                    v-text="item.subtitle"
                  ></v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-list-item-action-text
                    v-text="item.action"
                  ></v-list-item-action-text>

                  <v-icon v-if="!active" color="grey lighten-1">
                    mdi-star-outline
                  </v-icon>

                  <v-icon v-else color="yellow darken-3"> mdi-star </v-icon>
                </v-list-item-action>
              </template>
            </v-list-item>

            <v-divider v-if="index < items.length - 1" :key="index"></v-divider>
          </template>
        </v-list-item-group>
      </v-list>
    </v-card>-->
  </div>
</template>


<script>
import { bus } from "../main";
import UsuarioService from "../services/UsuarioService";
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
    TimeAgo,
  },
  data: () => ({
    dptos: ["ca", "cf"], //Departamentos a los cuales se les notificará
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
  items: [],
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
            onComplete: insertNotification(socket, this.usuarioService),
            onError: errorHanlder,
            onNext: responseHanlder,
            onSubscribe: (subscription) => {
              //subscription.request(100); // set it to some max value
            },
          });
      };
      client.connect().then((sock) => {
        document.getElementById("connect").addEventListener("click", () => {
          numberRequester(sock);
        });
      }, errorHanlder);

      // error handler
      const errorHanlder = (e) => console.log(e);
      // response handler
      const responseHanlder = (payload) => {
        // console.log(payload.data);

        //this.items.push(payload.data)
        bus.$emit("jai", payload.data);
      };
      const insertNotification = (socket, usuarioService) => {
        let today = new Date();
        today.setHours(today.getHours() - 5);
        let final = new Date();
        final.setDate(final.getDate() + 1);
        console.log(today + " " + final);
        this.dptos.forEach(function (valor) {
          usuarioService.getDpto(valor).then((response) => {
            response.data.forEach(function (retrieveData, indice) {
              socket
                .requestResponse({
                  data: {
                    id: null,
                    subscriber: retrieveData.id,
                    titulo: "Se insertó un nuevo producto",
                    descripcion:
                      "Aquí se agrega una descripcion breve de lo que se acaba de hacer (opcional)",
                    fecha_inicio: today,
                    fecha_final: final,
                    leido: false,
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
    this.usuarioService = new UsuarioService();
  },
};
</script>
