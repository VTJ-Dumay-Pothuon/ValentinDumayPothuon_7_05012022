<template>
  <Navbar />
  <main>
    <router-view :key="$route.fullPath" />
  </main>
</template>

<script>
  import Navbar from './components/Navbar.vue';
  export default {
    components: { Navbar },
    data() {
      return {
        componentKey: 0,
      };
    },
    methods: {
      forceRerender() {
        this.componentKey += 1;
      }
    }
  };
</script>


<style lang=scss>
  main {
    max-width: 1300px;
    margin: auto;
    p {font-size: 14pt}
  }
  .navbar-brand h1 {
    font-size: 2.5em;
  }
  .form-signin {
    width: 100%;
    max-width: 400px;
    padding: 15px;
    margin: auto;
    .checkbox {
      font-weight: 400;
    }
    .form-floating:focus-within {
      z-index: 2;
    }
  }
  .home__post {
    display: grid;
    margin: 10px auto;
    grid-template-columns: 15% auto;
    &__author {
      padding-top: 5pt;
      h3 { text-align: center }
      a {
        display: block;
        text-align: center;
      }
      img {
        height: 60px !important;
        width:  60px !important;
        border: 1.5pt solid black;
        border-radius: 10px;
        padding: 5px;
      }
    }
  }
  .post {
    position: relative;
    border: 1pt solid black;
    border-radius: 10px;
    padding: 10px;
    margin: 10px auto;
    box-shadow: 5px 4px 3px #0003;
    &:before {
      content: "";
      position: absolute;
      margin-top: -6px;
      margin-left: -5px;
      border-left: 20pt solid transparent;
      border-right: 15pt solid transparent;
      border-bottom: 15pt solid black;
      transform: rotate(45deg);
      left: -28px;
      top: 20px;
    }
    &:after {
        content: "";
        position: absolute;
        margin-top: -6px;
        margin-left: -5px;
        border-left: 20pt solid transparent;
        border-right: 15pt solid transparent;
        border-bottom: 15pt solid white;
        transform: rotate(45deg);
        left: -26px;
        top: 21px;
    }
    &__by-user {
        width: fit-content;
    }
    img {
        max-height: 200px;
        display: flex;
        margin: 0 auto;
    }
    .fas {
        font-size: 1.2em;
    }
  }
  #profile {
    &__posts {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      a {
        display: block;
        margin: 10pt 30pt;
        max-width: 49%;
      }
    }
    &--edit .fas {
      font-size: 2em;
    }
  }
  #post {
    &__author {
      img {
        display: inline;
        position: absolute;
        max-height: 45px;
        border: 1.5pt solid black;
        border-radius: 10px;
        padding: 5px;
      }
    }
  }
  @media screen and (min-width: 800px) {
    .navspace { width: 30pt }
  }
</style>
