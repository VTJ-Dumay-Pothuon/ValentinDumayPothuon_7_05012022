<template>
  <form @submit.prevent="submit" class="form-signin">
    <h1 class="h3 mb-3 fw-normal">Créer un nouveau post</h1>
    <div class="form-floating">
      <input
        v-model="data.title"
        id="floatingInputTitle"
        type="text"
        class="form-control"
        placeholder="Titre"
        maxlength="100"
        required
      />
      <label for="floatingInputTitle">Titre</label>
    </div>
    <div class="form-floating">
      <textarea
        v-model="data.body"
        id="floatingInputBody"
        type="text"
        class="form-control"
        placeholder="Contenu"
        rows="3"
      />
      <label for="floatingInputBody">Contenu</label>
    </div>
    <div class="form-floating upload">
      <input
        type="file"
        role="button"
        aria-label="Ajouter une image"
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
    mounted() {
      const titlebox = document.getElementsByClassName('form-floating')[0].firstChild;
      const bodybox  = document.getElementsByClassName('form-floating')[1].firstChild;
      [titlebox, bodybox].forEach(textbox =>
        ['keydown','paste','focusout'].forEach(event => 
        textbox.addEventListener( event, () => {
          // Eliminates non-UTF8 characters :
          textbox.value = textbox.value.replace(/[^\s\u0020-\uFFFF]/g,'')
          // Blacklists many non-letter fancy characters :
          textbox.value = textbox.value.replace(
            /[\u0FD5-\u0FD8\u2500-\u261F\u2639-\u263B\u26B0-\u2775\u2794-\u2BFF]/g,''
          )
          this.data.title = titlebox.value;
          this.data.body  = bodybox.value;
        }, false)));
    },
    setup() {
      const data = reactive({
        title: "",
        body: ""
      });
      const router = useRouter();
      const submit = async () => {
        if (data.title.match(/\||<.*>|{.*}/gm)) {
          alert("Les balises HTML et les accolades sont interdites dans le titre !");
          return;
        }
        if (data.title.match(/^[\s!-/:-?[-`{-~¢-¨ª¬-°²-¾×÷ʰ-;]/gm)) {
          alert("Le titre ne doit pas commencer par un signe de ponctuation !");
          return;
        }
        if (data.body.match(/<h1/gm)) {
          alert("Un post ne peut avoir qu'un seul titre de niveau 1 !");
          return;
        }
        if (data.body.match(/<big|<small|font-size/gm)) {
          alert("Il est interdit de modifier la taille du texte !");
          return;
        }
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
</style>