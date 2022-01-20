<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-dark mb-4">
    <div class="container-fluid">
      <div v-if="!isLoggedIn">
        <router-link to="/" class="navbar-brand">
          <img class="img-logo" src="../assets/icon-left-font-monochrome-white.svg" alt="" />
        </router-link>
      </div>
      <div v-if="isLoggedIn">
        <router-link to="/home" class="navbar-brand">
          <img class="img-logo" src="../assets/icon-left-font-monochrome-white.svg" alt="" />
        </router-link>
      </div>
      <div>
        <ul class="navbar-nav me-auto mb-2 mb-md-0" v-if="!isLoggedIn">
          <li class="nav-item">
            <router-link to="/login" class="nav-link active">Connexion</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/register" class="nav-link active">Inscription</router-link>
          </li>
        </ul>
        <ul class="navbar-nav me-auto mb-2 mb-md-0" v-if="isLoggedIn">
          <li class="nav-item">
            <router-link to="/post/create" class="nav-link active">‹ Nouveau Post ›</router-link>
          </li>
          <div class="navspace"></div>
          <li class="nav-item">
            <router-link to="/profile" class="nav-link active">Profil</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/" class="nav-link active" @click="logout()">Déconnexion</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
  import store from '../store/index';
  import { useRouter } from 'vue-router';

  export default {
    name: "Navbar",
    computed: {
      isLoggedIn() {
        return store.state.authentificated;
      },
    },
    setup() {
      const router = useRouter();
      const logout = () => {
        fetch("http://localhost:3000/api/auth/logout", {credentials: "include"})
          .then((res) => res.json())
          .then((data) => {
            if (data.message) {
              console.log(data.message);
              store.dispatch("setAuthentificated", false);
              router.push("/");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      };
      return { logout };
    },
  };
  document.addEventListener("DOMContentLoaded", () => {
    if (window.matchMedia("(max-width: 335px)").matches) {
      document.getElementsByClassName('navbar-brand')[0].innerHTML =
      '<h1><i class="fas fa-globe"></i><h1>'
    }
  })

</script>

 <style scoped>
  .img-logo {
      max-height: 50px;
  }
  .navbar-nav {
      text-align: center;
      font-size: 1.2em;
  }
  @media screen and (min-width: 645px)  {
      .navbar-nav {
          flex-direction: row;
          font-size: inherit;
      }
      .nav-link {
          padding: .5rem;
      }
  }
</style>