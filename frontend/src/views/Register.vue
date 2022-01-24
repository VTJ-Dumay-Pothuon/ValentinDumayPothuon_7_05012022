<template>
  <form @submit.prevent="submit" class="form-signin">
    <h1 class="h3 mb-3 fw-normal">Inscription</h1>
    <div class="form-floating">
      <input
        v-model="data.email"
        id="floatingInputEmail"
        type="email"
        class="form-control"
        placeholder="name@example.com"
        maxlength="255"
        required
      />
      <label for="floatingInputEmail">Adresse email</label>
    </div>
    <div class="form-floating">
      <input
        v-model="data.password"
        id="floatingInputPassword"
        type="password"
        class="form-control"
        placeholder="Password"
        maxlength="255"
        required
      />
      <label for="floatingInputPassword">Mot de passe</label>
    </div>
    <div class="form-floating">
      <input
        v-model="data.name"
        id="floatingInputName"
        type="test"
        class="form-control"
        placeholder="Prénom"
        maxlength="50"
        required
      />
      <label for="floatingInputName">Prénom</label>
    </div>
    <div class="form-floating">
      <input
        v-model="data.surname"
        id="floatingInputSurname"
        type="test"
        class="form-control"
        placeholder="Nom"
        maxlength="50"
        required
      />
      <label for="floatingInputSurname">Nom de famille</label>
    </div>
    <button class="w-100 btn btn-lg btn-primary" type="submit">Valider</button>
  </form>
</template>

<script>
  import {reactive} from 'vue';
  import {useRouter} from 'vue-router';
  export default {
    name: "Register",
    mounted() {
      const emailbox   = document.getElementsByClassName('form-floating')[0].firstChild;
      const passbox    = document.getElementsByClassName('form-floating')[1].firstChild;
      const namebox    = document.getElementsByClassName('form-floating')[2].firstChild;
      const surnamebox = document.getElementsByClassName('form-floating')[3].firstChild;
      [emailbox, passbox, namebox, surnamebox].forEach(textbox =>
        ['keydown','paste','focusout'].forEach(event => 
        textbox.addEventListener( event, () => {
          // Eliminates non-UTF8 characters :
          textbox.value = textbox.value.replace(/[^\u0020-\uFFFF]/g,'')
          // Blacklists many non-letter fancy characters :
          textbox.value = textbox.value.replace(
            /[\u0FD5-\u0FD8\u2500-\u261F\u2639-\u263B\u26B0-\u2775\u2794-\u2BFF]/g,''
          )
          this.data.email     = emailbox.value;
          this.data.password   = passbox.value;
          this.data.name       = namebox.value;
          this.data.surname = surnamebox.value;
        }, false)));

      // Email pattern : Exámplɛ_12.3@example-123.abc
      emailbox.addEventListener( 'focusout', () => {
        if (/^[0-9A-Za-zÀ-ÖØ-öø-ſ+-._]+@[0-9a-z-]+.[a-z]+$/.test(emailbox.value)) {
          emailbox.classList.add('valid');
          emailbox.classList.remove('error');
        } else {
          emailbox.classList.add('error');
          emailbox.classList.remove('valid');
        }
      }, false)

      // Password pattern : Min_8-Chars_With_1-Cap_&_1-Digit!
      passbox.addEventListener( 'focusout', () => {
        if (/^(?=.{8,})(?:.*(?:[A-Z]|[0-9]).*(?:[A-Z]|[0-9]).*)$/.test(passbox.value) &&
        /* No whitespace in password */
        !(/\s+/.test(passbox.value))) {
          passbox.classList.add('valid');
          passbox.classList.remove('error');
        } else {
          passbox.classList.add('error');
          passbox.classList.remove('valid');
        }
      }, false);

      // (Sur)name pattern : At least two characters, no digit
      [namebox, surnamebox].forEach(namesbox =>
      namesbox.addEventListener( 'focusout', () => {
        if (/^\D\D+$/.test(namesbox.value)) {
          namesbox.classList.add('valid');
          namesbox.classList.remove('error');
        } else {
          namesbox.classList.add('error');
          namesbox.classList.remove('valid');
        }
      }, false));
    },
    setup() {
      const data = reactive({
        email: "",
        password: "",
        name: "",
        surname: ""
      });
      const router = useRouter();
      const submit = async () => {
        if (data.name.match(/[<>|/;{}\d]/g) || data.surname.match(/[<>|/;{}\d]/g) || 
            data.email.match(/[<>|/;{}]/g) || data.password.match(/[<>|/;{}]/g)) {
          alert("Un ou plusieurs caractères sont invalides !");
          return;
        }
        await fetch('http://localhost:3000/api/auth/signup', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        }).then(obj => obj.json().then(res => {
          if (res.id) {
            alert ('Bienvenue chez les Groupomaniaques !\nVous pouvez vous connecter dès maintenant.');
            router.push('/');
          } else {
            alert ('Les informations sont erronées !');
          }
        }));
      };
      return { data, submit };
    },
  };
</script>