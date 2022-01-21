<template>
  <picture class="home__logo">
    <img src="../assets/icon-above-font.svg" alt="Logo de Groupomania" />
  </picture>
  <section class="home__content">
      <h1>BİENVENUE CHEZ LES GROUPOMANİAQUES !</h1>
  </section>
</template>

<style scoped lang="scss">
  .home {
    &__logo {
        display: flex;
        justify-content: center;
        filter: grayscale(1) brightness(0.9) contrast(1.3);
        img {
            max-width: 100%;
            max-height: 500px;
        }
    }
    &__content {
        h1 { 
            text-align: center;
            font-weight: bold;
        }
    }
  }
</style>