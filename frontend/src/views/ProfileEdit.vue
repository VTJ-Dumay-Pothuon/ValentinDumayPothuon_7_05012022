<template>
  <form @submit.prevent="submit" class="form-signin">
    <h1 class="h3 mb-3 fw-normal">Mettre à jour le profil</h1>
    <div class="form-floating">
      <input
        v-model="data.name"
        id="floatingInputName"
        type="text"
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
        type="text"
        class="form-control"
        placeholder="Nom"
        maxlength="50"
        required
      />
      <label for="floatingInputSurname">Nom de famille</label>
    </div>
    <div class="form-floating">
      <textarea
        v-model="data.description"
        id="floatingInputDescription"
        type="text"
        class="form-control"
        placeholder="Description"
        maxlength="255"
      />
      <label for="floatingInputDescription">Description</label>
    </div>
    <div class="form-floating upload">
      <input
        type="file"
        role="button"
        aria-label="Ajouter une image"
        class="form-control"
        accept="image/png, image/jpeg, image/jpg"
        placeholder="Image"
        v-on:change="selectFile"
      />
    </div>
    <div id="uploaded" v-if="image"><img :src="image" /></div>
    <div class="form-floating" v-if="ownProfile">
      <input
        v-model="own.password"
        id="floatingInputPassword"
        type="password"
        class="form-control"
        placeholder="Password"
        maxlength="255"
      />
      <label for="floatingInputPassword">Mot de passe</label>
    </div>
    <button class="w-100 btn btn-lg btn-primary" type="submit">Valider</button>
    <button class="w-100 btn btn-lg btn-primary delete"  v-on:click="deleteUser">
      <i class="fas fa-exclamation-triangle"></i>
        Effacer le profil
      <i class="fas fa-exclamation-triangle"></i>
    </button>
  </form>
</template>
<script>
  import {reactive} from 'vue';
  import {useRouter} from 'vue-router';
  import store from '../store/index';
  let uploadedFile;
  export default {
    name: "ProfileEdit",
    data() {return {file:'', image:'', ownProfile:'', router: useRouter()}},
    created: async function() {
        const urlParams = await new URLSearchParams(window.location.search);
        const id = await urlParams.get('id');
        this.ownProfile= await (store.state.userId == id);
    },
    mounted() {
      const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        fetch(`http://localhost:3000/api/auth/profile/${id}`,{credentials: "include"})
            .then(obj => obj.json().then(res => {
              this.data.name = res.user.name;
              this.data.surname = res.user.surname;
              this.data.description = res.user.description;
        }))
      const namebox    = document.getElementsByClassName('form-floating')[0].firstChild;
      const surnamebox = document.getElementsByClassName('form-floating')[1].firstChild;
      const descbox    = document.getElementsByClassName('form-floating')[2].firstChild;
      [namebox, surnamebox, descbox].forEach(textbox =>
        ['keydown','paste','focusout'].forEach(event => 
        textbox.addEventListener( event, () => {
          // Eliminates non-UTF8 characters :
          textbox.value = textbox.value.replace(/[^\u0020-\uFFFF]/g,'')
          // Blacklists many non-letter fancy characters :
          textbox.value = textbox.value.replace(
            /[\u0FD5-\u0FD8\u2500-\u261F\u2639-\u263B\u26B0-\u2775\u2794-\u2BFF]/g,''
          )
          // Blacklists digits from names
          if (textbox!=descbox) textbox.value = textbox.value.replace(/\d/g,'');
          this.data.name        = namebox.value;
          this.data.surname  = surnamebox.value;
          this.data.description = descbox.value;
        }, false)));
    },
    methods: {
      deleteUser(event) {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
          fetch(`http://localhost:3000/api/auth/delete/${id}`, {
              method: "DELETE",
              credentials: "include"
          })
          .catch((error) => {
              console.log(error, event);
          })
          if (this.$data.ownProfile) store.dispatch("setAuthentificated", false);
          this.router.replace('/');
        }
      },
      selectFile(e) {
        this.file = e.target.files[0];
        this.imagePreview(this.file);
        uploadedFile = this.file;
      },
      imagePreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.image = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    setup() {
      const data = reactive({
        name: "",
        surname: "",
        description: ""
      });
      const own = reactive({
        password: ""
      });
      const router = useRouter();
      const submit = async () => {
        if (data.name.match(/[<>|/;{}\d]/g) || data.surname.match(/[<>|/;{}\d]/g) || 
            data.description.match(/[<>|/;{}]/gm) || own.password.match(/[<>|/;{}]/g)) {
          if (!data.description.match(/<br>|<br *\/>/gm) ||
          data.description.match(/(<br>|<br *\/>)(.*<br>|<br *\/>)/gm)) {
            if (data.description.match(/<br/gm)) {
              alert("Vous ne pouvez utiliser <br> qu'une seule fois !");
            } else {
              alert("Un ou plusieurs caractères sont invalides !");
            }
            return;
          }
        }
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("surname", data.surname);
        formData.append("description", data.description);
        formData.append("image", uploadedFile);
        await fetch(`http://localhost:3000/api/auth/update/${id}`, {
          method: "PUT",
          credentials: "include",
          body: formData
        })
        await router.push(`/profile?id=${id}`);
        await router.go(`/profile?id=${id}`); /* force update */
      };
      return { data, own, submit };
    },
  };
</script>

<style scoped lang=scss>
  #uploaded img {
    max-height: 100px;
    margin: auto;
    display: block;
    margin: 10px auto;
  }
  .delete {
    margin-top: 6vw;
    .fa-exclamation-triangle {
      margin: 0 10px;
      color: red;
      text-shadow: 0 0 10px yellow;
    }
  }
</style>