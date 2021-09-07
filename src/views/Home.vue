<template>
  <div class="home" v-if="usuario != null">
    <v-btn id="connect">Insert</v-btn>
    <img alt="Vue logo" src="../assets/logo.png" />

    <v-col cols="12" sm="6">
      <v-select
        v-model="dptos"
        :items="items"
        chips
        label="Departamento"
        multiple
        outlined
      ></v-select>
      {{ dptos }}
    </v-col>
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
  <div v-else-if="usuario == null">
    <v-app id="inspire">
      <v-content>
        <v-container fluid fill-height>
          <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
              <v-card class="elevation-12">
                <v-toolbar dark>
                  <v-toolbar-title>Login</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <v-form>
                    <v-text-field
                      v-model="login"
                      prepend-icon="mdi-account"
                      name="login"
                      label="Login"
                      type="text"
                    ></v-text-field>
                  </v-form>
                  {{ error }}
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" @click="entrar()">Login</v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>


<script>
import { bus } from "../main";
import { mapMutations, mapState } from "vuex";
import UsuarioService from "../services/UsuarioService";
import {
  RSocketClient,
  JsonSerializer,
  IdentitySerializer,
} from "rsocket-core";
import RSocketWebSocketClient from "rsocket-websocket-client"; //El cliente RSocket
import TimeAgo from "vue2-timeago"; //Librería para tomar el tiempo en el que llegó la notificación
export default {
  name: "websocketdemo",
  components: {
    TimeAgo,
  },
  data: () => ({
    dptos: null, //Departamentos a los cuales se les notificará
    subscribers: [19221],
    selected: [],
    login: null,
    error: null,
    items: ["CA", "CO", "CF", "SL", "MP", "MM", "ML"],
    //usuario: null,
    drawer: null,
    allNotifications: [{ name: "yo" }],
    unreadNotifications: [],
    longString: false,
    tooltip: true,
    locale: "en",
  }),
  usuarioService: null,
  created() {
    //this.usuario = JSON.parse(localStorage.getItem("session"));
    console.log(this.usuario);
  },
  methods: {
    ...mapMutations(['sendNotification']),
    entrar() {
      this.usuarioService
        .getUsuariobyId(this.login)
        .then((response) => {
          this.usuario = localStorage.setItem(
            "session",
            JSON.stringify(response.data)
          );
         // console.log(JSON.parse(localStorage.getItem("session")));
          location.reload();
        })
        .catch((response) => {
          this.error = "Usuario inexistente";
        });
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
      
      client.connect().then((sock) => {
        document.getElementById("connect").addEventListener("click", (event) => {
          numberRequester(sock);
        });
      }, errorHanlder);

      /*Aquí comienza el código del primer socket para insertar un producto
      antes de enviar la notificación primero realiza una acción*/
      const numberRequester = (socket) => {
        socket
          .requestResponse({
            //Aqui va la acción a realizar antes de enviar la notificación (Insertar, actualizar, etc.)
            data: {
              id: null,
              description: "insertando producto", //Estos son los datos que se van a enviar en el data.
              price: 230,
              subscriber: "juan",
            },
            metadata:
              String.fromCharCode("insert.product".length) + "insert.product", //Este es el nombre del servicio del RSocket
          })
          .subscribe({
            onComplete: insertNotification(socket, this.usuarioService), //Al resultar éxitosa la operación ingresa aquí
            onError: errorHanlder, //Al haber un error ingresa aquí
            onNext: responseHanlder,
            onSubscribe: (subscription) => {
              //subscription.request(100); // set it to some max value
            },
          });
      };

      // error handler
      const errorHanlder = (e) => console.log(e);
      // response handler
      const responseHanlder = (payload) => {
        //console.log(payload.data);

        //this.items.push(payload.data)
        bus.$emit("jai", payload.data);
        //this.sendNotification(payload.data);
      };
      const insertNotification = (socket, usuarioService) => {
        //Este el bloque de código para insertar una notificación
        let today = new Date(); //la fecha actual
        today.setHours(today.getHours() - 5); //La hora actual
        let final = new Date(); //La fecha final
        final.setDate(final.getDate() + 1);
        console.log(today + " " + final);
        console.log(this.dptos);
        if (this.dptos != null && this.dptos != []) {
          this.dptos.forEach(function (valor) {
            usuarioService.getDpto(valor).then((response) => {
              response.data.forEach(function (retrieveData, indice) {
                console.log(retrieveData);
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
                      subscription.request(100); // set it to some max value
                    },
                  });
              });
            });
          });
        } else if (this.subscribers != null && this.subscribers.length > 0) {
          this.subscribers.forEach(function (valor) {
            socket
              .requestResponse({
                data: {
                  id: null,
                  subscriber: valor,
                  titulo: "Notificación para " + valor,
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
                onComplete: responseHanlder(socket),
                onError: errorHanlder,
                onNext: valor => {
                  console.log(valor)
                },//responseHanlder,
                onSubscribe: (subscription) => {
                  //subscription.request(100); // set it to some max value
                },
              });
          });
        } else {
          socket
            .requestResponse({
              data: {
                id: null,
                subscriber: 0,
                titulo: "Notificación General",
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
        }
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
  computed: {
    ...mapState(['usuario']) 
  }
};
</script>
