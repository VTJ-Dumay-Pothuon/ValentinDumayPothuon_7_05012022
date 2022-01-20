<template>
  <form @submit.prevent="submit" class="form-signin">
    <h1 class="h3 mb-3 fw-normal">Connectez-vous</h1>

    <div class="form-floating">
      <input v-model="data.email" type="email" class="form-control" placeholder="name@example.com" required />
      <label for="floatingInput">Adresse email</label>
    </div>
    <div class="form-floating">
      <input v-model="data.password" type="password" class="form-control" placeholder="********" required />
      <label for="floatingPassword">Mot de passe</label>
    </div>
    <button class="w-100 btn btn-lg btn-primary" type="submit">Connexion</button>
  </form>
</template>

<script>
  import {reactive} from 'vue';
  import {useStore} from "vuex";
  import {useRouter} from 'vue-router';

  export default {
    name: "Login",
    setup () {
      const data = reactive({ email: "", password: "" });
      const router = useRouter();
      const store = useStore();
      const submit = async () => {
        await fetch('http://localhost:3000/api/auth/login', {
          method: "POST",
          body: JSON.stringify(data),
          headers: {'Content-Type': "application/json"},
          credentials: "include"
        })
        .then(obj => obj.json().then(res => {
        if (res.error) {
          alert("Identifiants invalides");
          return 0
        } else {
          store.dispatch("setAuthentificated", true);
          store.dispatch("setUserId", res.userId);
          return res.userId;
        }}))
        .then (id => {
          if (id!=0) {
            router.push(`/profile?id=${id}`)
        }});
      }
      return { data, submit };
    },
  };
</script>