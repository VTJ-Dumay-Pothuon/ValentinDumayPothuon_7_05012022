<template>
  <form @submit.prevent="submit" class="form-signin">
    <h1 class="h3 mb-3 fw-normal">Modifier le post</h1>
    <div class="form-floating">
      <input
        v-model="data.title"
        type="text"
        class="form-control"
        placeholder="Titre"
        maxlength="100"
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
        rows="2"
      />
      <label for="floatingInput">Contenu</label>
    </div>
    <div class="form-floating">
      <input
        type="file"
        class="form-control"
        accept="image/png, image/jpeg, image/jpg, image/gif"
        placeholder="Image"
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
    name: "PostEdit",
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
      document.addEventListener("DOMContentLoaded", () => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        fetch(`http://localhost:3000/api/post/one/${id}`,{credentials: "include"})
            .then(obj => obj.json().then(res => {
              data.title = res.post.title;
              data.body = res.post.body;
        }))
      })
      const router = useRouter();
      const submit = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("body", data.body);
        formData.append("image", uploadedFile);
        for (var p of formData) {
          console.log(p);
        }
        await fetch(`http://localhost:3000/api/post/edit/${id}`, {
          method: "PUT",
          credentials: "include",
          body: formData
        });
        await router.push(`/post?id=${id}`);
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
</style>