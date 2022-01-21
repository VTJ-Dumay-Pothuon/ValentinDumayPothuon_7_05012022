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

 <style scoped lang=scss>
  nav .container-fluid div + div {
    width: 90%;
  }
  .img-logo {
    max-height: 50px;
  }
  .nav {
    &bar-nav {
      font-size: 1.2em;
      width: 100%;
    }
    &-item {
      padding: 0 10px;
      margin: 5px;
      border: 1pt solid white;
      border-radius: 10px;
    }
  }
  @media screen and (min-width: 524px) {
    nav .container-fluid div + div {
      width: initial;
    }
  }
  @media screen and (min-width: 524px) and (max-width: 735px) {
    .navbar-nav {
        text-align: right;
        margin-right: 10px;
    }
  }
  @media screen and (min-width: 735px)  {
    .nav {
      &bar-nav {
          flex-direction: row;
          font-size: inherit;

      }
      &-link {
          padding: .5rem;
      }
      &-item {
        border: none;
      }
    }
      
  }
</style>