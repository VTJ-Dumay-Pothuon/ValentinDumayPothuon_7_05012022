<template>
  <form @submit.prevent="submit" class="form-signin">
    <h1 class="h3 mb-3 fw-normal">Mettre à jour le profil</h1>
    <div class="form-floating">
      <input
        v-model="data.name"
        type="text"
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
        type="text"
        class="form-control"
        placeholder="Nom"
        maxlength="50"
        required
      />
      <label for="floatingInput">Nom de famille</label>
    </div>
    <div class="form-floating">
      <textarea
        v-model="data.description"
        type="text"
        class="form-control"
        placeholder="Description"
        maxlength="255"
      />
      <label for="floatingInput">Description</label>
    </div>
    <div class="form-floating">
      <input
        type="file"
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
        type="password"
        class="form-control"
        placeholder="Password"
        maxlength="255"
        required
      />
      <label for="floatingInput">Mot de passe</label>
    </div>
    <button class="w-100 btn btn-lg btn-primary" type="submit">Valider</button>
  </form>
</template>
<script>
  import {reactive} from 'vue';
  import {useRouter} from 'vue-router';
  import store from '../store/index';
  let uploadedFile;
  export default {
    name: "ProfileEdit",
    data() {return {file:'', image:'', ownProfile:''}},
    created: async function() {
        const urlParams = await new URLSearchParams(window.location.search);
        const id = await urlParams.get('id');
        this.ownProfile= await (store.state.userId == id);
    },
    methods: {
      selectFile(e) {
        this.file = e.target.files[0];
        this.imagePreview(this.file);
        // console.log(this.file);
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
      document.addEventListener("DOMContentLoaded", () => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        fetch(`http://localhost:3000/api/auth/profile/${id}`,{credentials: "include"})
            .then(obj => obj.json().then(res => {
              data.name = res.user.name;
              data.surname = res.user.surname;
              data.description = res.user.description;
        }))
      })
      const router = useRouter();
      const submit = async () => {
        if (data.name.match(/[<>|/;{}]/g) || data.surname.match(/[<>|/;{}]/g) || 
            data.description.match(/[<>|/;{}]/gm) || own.password.match(/[<>|/;{}]/g)) {
          if (!data.description.match(/<br>|<br *\/>/gm) ||
          data.description.match(/(<br>|<br *\/>)(.*<br>|<br *\/>)/gm)) {
            if (data.description.match(/<br/gm)) {
              alert("La description ne peut pas dépasser deux paragraphes !");
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
        });
        await router.push(`/profile?id=${id}`);
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
  textarea {
    overflow: auto;
    resize: vertical;
    min-height: max-content !important;
  }

  @media screen and (min-width: 600px) {
      textarea {
        margin: 10px -25%;
        width: 150%;
        + label {
          margin-left: -25%;
        }
    }
  }
</style>