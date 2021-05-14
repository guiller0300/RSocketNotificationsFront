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
      <navbar :user="user"></navbar>
     
     <router-view></router-view>
</v-main>
      <v-footer class="text-center">
        <span>&copy; 2021</span>
      </v-footer>
  </v-app>
</template>

<script>
import Navbar from "./components/_navbar";
export default {
  name: 'App',

  components: { Navbar
  },

  data: () => ({
    //
  }),
  props: ["user"]
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