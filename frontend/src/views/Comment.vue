<template>
  <form @submit.prevent="submit" class="form-signin">
    <h1 class="h3 mb-3 fw-normal">Répondre au post :</h1>
    <div class="form-floating">
      <textarea
        v-model="data.comment"
        type="text"
        class="form-control"
        placeholder="Réponse"
        maxlength="255"
        rows="1"
      />
      <label for="floatingInput">Votre réponse</label>
    </div>
    <p>(max. 255 caractères)</p>
    <button class="w-100 btn btn-lg btn-primary" type="submit">Valider</button>
  </form>
</template>

<script>
    import {reactive} from 'vue';
    import {useRouter} from 'vue-router';
    export default {
        name: "Comment",
        setup() {
            const router = useRouter();
            const urlParams = new URLSearchParams(window.location.search);
            const id = urlParams.get('postid');
            const data = reactive({ comment: '', postId: id});
            const submit = async () => {
                if (data.comment.match(/\||<.*>|{.*}/gm)) {
                  alert("Les balises HTML et les accolades sont interdites dans les commentaires !");
                  return;
                }
                await fetch(`http://localhost:3000/api/comment/addto/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(data),
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
    resize: none;
    margin: 10px;
    min-height: 80px !important;
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
    p {
        font-size: 11pt;
        font-style: italic;
        text-align: right;
    }
  }
  @media screen and (min-width: 600px) {
     textarea {
        margin: 10px -25%;
        width: 150%;
        + label {
        margin-left: -25%;
        }
     }
     .form-signin p {
        margin-right: -20%;
     }
}
</style>