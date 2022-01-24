<template>
  <picture class="home__logo">
    <img src="../assets/icon-above-font.svg" alt="Logo de Groupomania" />
  </picture>
  <section id="home__content"></section>
</template>

<script>
export default {
  setup() {
    fetch(`http://localhost:3000/api/post/all`)
      .then(obj => obj.json().then(res => {
          document.getElementById('home__content').innerHTML='';
          for (let post of res.posts) {
              document.getElementById('home__content').insertAdjacentHTML('afterbegin', 
              '<section class="home__post">'
                +'<section class="home__post__author" id="post__'+post.id+'__author"></section>'
                +'<a href="/post?id='+post.id+'" class="text-dark text-decoration-none">'
                  +'<article class="post post__home" id="post__'+post.id+'">'
                      +'<h2>'+post.title+'</h2>'
                      +'<p id="post__'+post.id+'__body"></p>'
                      +'<picture id="post__'+post.id+'__picture">'
                          +'<img src="" alt="" />'
                      +'</picture>'
                  +'</article>'
                +'</a>'
              +'</section>');

              if (post.body) {
              document.getElementById('post__'+post.id+'__body').innerHTML = post.body;
              }
              if (post.image) {
              document.getElementById('post__'+post.id+'__picture').firstChild.src = post.image;
              }
              fetch(`http://localhost:3000/api/auth/profile/${post.UserId}`,{credentials: "include"})
                .then(obj => obj.json().then(res => {
                    document.getElementById(`post__${post.id}__author`).innerHTML = 
                    '<a class="link-dark" href="/profile?id='+res.user.id+'">'
                    +'<picture><img src="'+res.user.image+'" alt="" /></picture>'
                    +'<h3>'+res.user.name+' '+res.user.surname+'</h3></a>';
                    if (!res.user.image) {
                            document.getElementById(`post__${post.id}__author`)
                            .children[0].children[0].firstChild.src =
                            "/img/user-default.1fab100a.svg";
                        }
              }))
          }
        }));
  },
}
</script>

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
  }
</style>