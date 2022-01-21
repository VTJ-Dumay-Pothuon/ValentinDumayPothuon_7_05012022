<template>
  <form @submit.prevent="submit" class="form-signin">
    <h1 class="h3 mb-3 fw-normal">Créer un nouveau post</h1>
    <div class="form-floating">
      <input
        v-model="data.title"
        type="text"
        class="form-control"
        placeholder="Titre"
        maxlength="255"
        required
      />
      <label for="floatingInput">Titre</label>
    </div>
    <div class="form-floating">
      <textarea
        v-model="data.body"
        type="text"
        class="form-control"
        placeholder="Contenu"
        rows="3"
      />
      <label for="floatingInput">Contenu</label>
    </div>
    <div class="form-floating">
      <input
        type="file"
        class="form-control"
        placeholder="Description"
        v-on:change="selectFile"
      />
    </div>
    <div id="uploaded" v-if="image"><img :src="image" /></div>
    <button class="w-100 btn btn-lg btn-primary" type="submit">Valider</button>
  </form>
</template>

<script>
  import {reactive} from 'vue';
  import {useRouter} from 'vue-router';
  let uploadedFile;
  export default {
    name: "PostCreate",
    data: function() {return {file:'', image:''}},
    methods: {
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
        title: "",
        body: ""
      });
      const router = useRouter();
      const submit = async () => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("body", data.body);
        formData.append("image", uploadedFile);
        await fetch("http://localhost:3000/api/post/create", {
          method: "POST",
          credentials: "include",
          body: formData
        })
        .then(obj => obj.json().then(res => router.push(`/post?id=${res.postId}`)));
      };
      return { data, submit };
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
    margin: 10px -25%;
    min-height: 100px !important;
    width: 150%;
    + label {
      margin-left: -25%;
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
</style>