<template>
  <form @submit.prevent="submit" class="form-signin">
    <h1 class="h3 mb-3 fw-normal">Inscription</h1>
    <div class="form-floating">
      <input
        v-model="data.email"
        type="email"
        class="form-control"
        placeholder="name@example.com"
        maxlength="255"
        required
      />
      <label for="floatingInput">Adresse email</label>
    </div>
    <div class="form-floating">
      <input
        v-model="data.password"
        type="password"
        class="form-control"
        placeholder="Password"
        maxlength="255"
        required
      />
      <label for="floatingPassword">Mot de passe</label>
    </div>
    <div class="form-floating">
      <input
        v-model="data.name"
        type="test"
        class="form-control"
        placeholder="Prénom"
        maxlength="50"
        required
      />
      <label for="floatingInput">Prénom</label>
    </div>
    <div class="form-floating">
      <input
        v-model="data.surname"
        type="test"
        class="form-control"
        placeholder="Nom"
        maxlength="50"
        required
      />
      <label for="floatingInput">Nom de famille</label>
    </div>
    <button class="w-100 btn btn-lg btn-primary" type="submit">Valider</button>
  </form>
</template>

<script>
  import {reactive} from 'vue';
  import {useRouter} from 'vue-router';
  export default {
    name: "Register",
    setup() {
      const data = reactive({
        email: "",
        password: "",
        name: "",
        surname: "",
        description: "",
      });
      const router = useRouter();
      const submit = async () => {
        await fetch('http://localhost:3000/api/auth/signup', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        });
        await router.push('/');
      };
      return { data, submit };
    },
  };
</script>