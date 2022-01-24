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
  @keyframes content--appear {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        80% {opacity: 1;}
        to {
            opacity: 1;
            transform: translateY(0) ;
        }
    }
  
  @mixin block-shadow($color: #0003){
    box-shadow: 5px 4px 3px $color;
  }

  main {
    max-width: 1300px;
    margin: auto;
    p {font-size: 14pt}
  }
  big, small {
    font-size: inherit;
  }
  .navbar-brand h1 {
    font-size: 2.5em;
    text-align: center;
  }
  .form-control.valid {
    border-color: rgb(25, 180, 0);
    outline: 0;
    box-shadow: 0 0 0 .25rem rgba(25, 180, 0, 0.25);
    + *::after {
      content:" valide";
    }
  }
  .form-control.error {
    border-color: rgb(255, 10, 10);
    outline: 0;
    box-shadow: 0 0 0 .25rem rgba(255, 10, 10, 0.25);
    margin-right: 200px;
    + *::after {
      content:" invalide !";
    }
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
  .btn-primary {
    margin-top: 10pt;
    color: black;
    background: none;
    border: 1pt solid black;
    border-radius: 10px;
    @include block-shadow();
    &:hover {
      color: black;
      background-color: #EEE;
      border: 1pt solid black;
    }
  }
  .home__post {
    display: grid;
    margin: 10px auto;
    grid-template-columns: 25% auto;
    a { margin: 0 2px }
    p {
      overflow: auto;
      max-height: 200px;
    }
    &__author {
      padding-top: 5pt;
      animation: content--appear 1s 500ms both;
      h3 { 
        text-align: center;
        font-size: 5vw;
        overflow: hidden;
        text-overflow: ellipsis;
      }
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
    margin: 10px 5px 0 0;
    @include block-shadow();
    animation: content--appear 1s 500ms both;
    &::before {
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
    &::after {
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
        max-width: 100%;
        display: flex;
        margin: 0 auto;
    }
    .fas {
        font-size: 1.2em;
    }
  }
  #profile {
            animation: content--appear 1s 550ms both;
    &__posts {
      > p { animation: content--appear 1s 550ms both }
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      a {
        display: block;
        margin: 10pt 30pt;
        p {
          overflow: auto;
          max-height: 200px;
        }
      }
    }
    &--edit .fas {
      font-size: 2em;
    }
  }
  #post {
    &__picture img { 
      width: 100%;
      max-width: 350px;
    }
    &__author {
      font-size: 0.75em;
      img {
        display: inline;
        position: absolute;
        max-height: 45px;
        border: 1.5pt solid black;
        border-radius: 10px;
        padding: 5px;
      }
    }
    &__likes button.btn--pressed {
      color: crimson;
      text-shadow: 0 -1px 0 #D25C;
      border: 1pt solid crimson !important;
    }
  }
  .comment {
    display: grid;
    margin: 10px auto;
    grid-template-columns: auto 15%;
    &__content {
      position: relative;
      border: 1pt solid black;
      @include block-shadow();
      margin: 0 15px;
      border-radius: 10px;
      padding: 20px;
      width: fit-content;
      height: fit-content;
      align-self: center;
      justify-self: end;
      &::before {
        content: "";
        position: absolute;
        margin-top: -6px;
        margin-left: -5px;
        border-left: 15pt solid transparent;
        border-right: 20pt solid transparent;
        border-bottom: 15pt solid black;
        transform: rotate(-45deg);
        right: -33px;
        top: 20px;
      }
      &::after {
          content: "";
          position: absolute;
          margin-top: -6px;
          margin-left: -5px;
          border-left: 15pt solid transparent;
          border-right: 20pt solid transparent;
          border-bottom: 15pt solid white;
          box-shadow: 0 8px 3px -3px #0003;
          transform: rotate(-45deg);
          right: -31px;
          top: 21px;
      }
    }
    &__author {
      padding-top: 5pt;
      h3 { 
        text-align: center;
        font-size: 4.5vw;
      }
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
    &--delete {
      position: absolute;
      background: none;
      border: none;
      left: 5px;
      top: 0;
      opacity: 0;
      transition: 200ms ease;
      &:hover  { opacity: 1 }
    }
  }
  #comment {
        &__btn { animation: content--appear 1s  500ms both }
    &__section { animation: content--appear 1s 1000ms both }
  }
  .userlist {
    &__row {
      border-top: 1pt dotted black;
      :first-child { font-weight: bold }
    }
  }

  @media screen and (max-width: 335px) {
    .container-fluid div {
      display: inline-block;
      width: 100%;
    }
  }
  @media screen and (min-width: 500px) {
    .home__post__author h3 { font-size: revert }
       .comment__author h3 { font-size: revert }
  }
  @media screen and (min-width: 800px) {
    .post { margin: 10px auto }
    .home__post { 
      grid-template-columns: min-content auto;
      &__author { min-width: 130px }
      .post:hover { 
        text-shadow: 0 0 1pt lightgrey;
        @include block-shadow(#0007);
      }
      a { width: fit-content }
    }
    .navspace { width: 30pt }
    .userlist {
      &__header, &__row {
        display: inline-flex;
        width: 100%;
        :first-child {
          width: 79%;
          font-weight: inherit;
          &:hover { text-shadow: 0 0 1pt lightgrey }
        }
        :first-child + div {width: 20% }
      }
    }
    #post__picture { max-width: 500px }
    #profile__posts {
      h2 { text-align: center }
      a { max-width: 49% }
      .post:hover { 
        text-shadow: 0 0 1pt silver;
        @include block-shadow(#0007);
      }
      /* arbitrarily high maximum value ; 
      will stop at last (or 999th) post */
      @for $i from 1 to 1000 {
        a:nth-child(#{$i}) {
          align-self: center;
          margin-top: -20 + random(40) +px;
        }
      }
    }
  }
</style>
