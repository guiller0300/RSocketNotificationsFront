<template>
  <v-app>
    <v-main>
      <navbar :user="8188"></navbar>
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
  components: {
    Navbar,
  },
  data: () => ({}),
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