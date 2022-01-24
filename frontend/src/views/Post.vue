<template>
    <article class="post">
        <div id="post"></div>
        <picture id="post__picture">
            <img src="" alt="" />
        </picture>
        <aside v-show="canEditPost" id="post--edit"></aside> 
        <aside v-show="canEditPost" id="post--delete">
            <button v-on:click="deletePost"></button>
        </aside>
        <section id="post__likes">
            <p id="post__likes__nb">0</p>
            <button v-on:click="likePost"><i class="far fa-heart"></i></button>
        </section>
    </article>
    <div id="comment__btn"><button v-on:click="commentPost">Répondre</button></div>
    <section id="comment__section"></section>
</template>

<script>
    import store from '../store/index';
    import {useRouter} from 'vue-router';
    export default {
        name: "Post",
        data() {return {
            canEditPost: null,
            router: useRouter()
            }},
        mounted: async function() {
            this.canEditPost = await store.state.canEditPost;
        },
        methods: {
            deletePost(event) {
                const urlParams = new URLSearchParams(window.location.search);
                const id = urlParams.get('id');
                fetch(`http://localhost:3000/api/post/delete/${id}`, {
                    method: "DELETE",
                    credentials: "include"
                })
                .then(() => {
                    this.router.push(`/profile?id=${store.state.userId}`);
                })
                .catch((error) => {
                    console.log(error, event);
                });
            },
            commentPost() {
                const urlParams = new URLSearchParams(window.location.search);
                const id = urlParams.get('id');
                this.router.push(`/comment?postid=${id}`);
            },
            likePost() {
                const btn = document.getElementById('post__likes').children[1];
                const nb_likes = document.getElementById('post__likes__nb');
                const urlParams = new URLSearchParams(window.location.search);
                const id = urlParams.get('id');
                if (btn.classList.contains('btn--pressed')) {
                    btn.classList.remove('btn--pressed');
                    nb_likes.innerText = parseInt(nb_likes.innerText)-1;
                    fetch(`http://localhost:3000/api/like/remove/${id}`, {
                        method: "DELETE",
                        credentials: "include"
                    })
                    .catch((error) => {
                        console.log(error, event);
                    });
                } else {
                    btn.classList.add('btn--pressed');
                    nb_likes.innerText = parseInt(nb_likes.innerText)+1;
                    fetch(`http://localhost:3000/api/like/add/${id}`, {
                        method: "POST",
                        credentials: "include"
                    })
                    .catch((error) => {
                        console.log(error, event);
                    });
                }
            }
        },
        setup () {
            const getImage = require.context('../assets/', false, /\.svg$/);
            const urlParams = new URLSearchParams(window.location.search);
            const id = urlParams.get('id');
            const router = useRouter();
            if (id=="undefined") {
                alert ("Une erreur s'est produite lors de la création du post !")
                router.push('/home');
                return;
            }
            fetch(`http://localhost:3000/api/post/one/${id}`,{credentials: "include"})
            .then(obj => obj.json().then(res => {
                if (!res.post) {
                    alert ("Ce post n'existe pas !")
                    router.push('/home');
                    return;
                }
                if (res.canEdit != store.state.canEditPost) {
                    store.dispatch("setPostEdit", res.canEdit);
                    router.go(); // Force view reload only if edit right has changed
                    return;
                }
                document.getElementById('post').innerHTML = 
                '<article id=post__'+res.post.id+'>'
                +'<h2>'+res.post.title+'<small id="post__author"></small></h2>'
                +'<p id=post__'+res.post.id+'__body></p></article>';

                if (res.post.body) {
                document.getElementById('post__'+res.post.id+'__body').innerHTML = res.post.body;
                }
                if (res.post.image) {
                document.getElementById('post__picture').firstChild.src = res.post.image;
                document.getElementById('post__picture').firstChild.alt = "Image du post";
                }

                fetch(`http://localhost:3000/api/auth/profile/${res.post.UserId}`,{credentials: "include"})
                    .then(obj => obj.json().then(res => {
                        document.getElementById('post__author').innerHTML += 
                        ', par <a class="link-dark" href="/profile?id='+res.user.id+'">'
                        +res.user.name+' '+res.user.surname+'&nbsp;'
                        +'<picture><img src="'+res.user.image+'" alt="Photo de profil de '
                    +res.user.name+' '+res.user.surname+'" /></picture></a>';
                        if (!res.user.image) {
                            document.getElementById('post__author')
                            .children[0].children[0].firstChild.src =
                            getImage('./user-default.svg');
                        }
                    }))

                document.getElementById('post--edit').innerHTML =
                '<a href="/post/edit?id='+urlParams.get('id')
                +'" class="link-dark"><i class="fas fa-edit"></i></a>'

                document.getElementById('post--delete').firstChild.innerHTML =
                '<i class="fas fa-trash-alt"></i>';
            }))
    /* From here, we're counting likes and setup the button */
            .then(fetch(`http://localhost:3000/api/like/readfor/${id}`)
            .then(obj => obj.json().then(res => {
                if (res.likes) {
                    const nb_likes = document.getElementById('post__likes__nb');
                    nb_likes.innerText = res.likes.nb_likes;
                }
            })))
            .then(fetch(`http://localhost:3000/api/like/hasliked/${id}`,{credentials: "include"})
            .then(obj => obj.json().then(res => {
                 const btn = document.getElementById('post__likes').children[1];
                if (res.hasLiked) {
                    console.l
                    btn.classList.add('btn--pressed');
                }
            })))
    /* From here, we're adding the comments under the post */
            .then(fetch(`http://localhost:3000/api/comment/readfor/${id}`)
            .then(obj => obj.json().then(res => {
                document.getElementById('comment__section').innerHTML='';
                for (let comment of res.comments) {
                    document.getElementById('comment__section').insertAdjacentHTML('afterbegin',
                    '<section class="comment">'
                        +'<article class="comment__content" id="post__'+id+'__comment__'+comment.id+'">'
                            +'<button class="comment--delete"><i class="fas fa-times"></i></button>'
                            +'<p>'+comment.body+'</p>'
                        +'</article>'
                        +'<section class="comment__author" id="comment__'+comment.id+'__author"></section>'
                    +'</section>');

                    fetch(`http://localhost:3000/api/auth/profile/${comment.UserId}`,{credentials: "include"})
                    .then(obj => obj.json().then(res => {
                        document.getElementById(`comment__${comment.id}__author`).innerHTML = 
                        '<a class="link-dark" href="/profile?id='+res.user.id+'">'
                        +'<picture><img src="'+res.user.image+'" alt="Photo de profil de '
                        +res.user.name+' '+res.user.surname+'" /></picture>'
                        +'<h3>'+res.user.name+' '+res.user.surname+'</h3></a>';
                        if (!res.user.image) {
                            document.getElementById(`comment__${comment.id}__author`)
                            .children[0].children[0].firstChild.src =
                            getImage('./user-default.svg');
                        }

                        /* The eventListener is here so that we can use both comment's and author's infos */
                        const deleteComment = document.getElementById('post__'+id+'__comment__'+comment.id).firstChild;
                        deleteComment.addEventListener("click", () => {
                            if ( !res.canEdit ) return;
                            const urlParams = new URLSearchParams(window.location.search);
                            const id = urlParams.get('id');
                            fetch(`http://localhost:3000/api/comment/delete/${comment.id}`, {
                                method: "DELETE",
                                credentials: "include"
                            })
                            .then(() => {
                                router.go(`/post?id=${id}`);
                            })
                            .catch((error) => {
                                console.log(error, event);
                            });
                        })
                }))}
            })));
        },
    }
</script>

<style scoped lang=scss>
    %button {
        padding: 0 20pt;
        border: 1pt solid black;
        box-shadow: 5px 4px 3px #0003;
        border-radius: 10px;
        background: none;
        &:hover { background-color: #EEE }
    }
    
    .post { margin: 0 40px }
    #post {
        margin: 20px;
        &__likes {
            margin-top: 8px;
            text-align: right;
            &__nb {
                display: inline;
                margin-right: 10px;
            }
            button {
                @extend %button;
                padding: 5pt 8pt;
                font-size: 1.5rem;
            }
        }
        &--edit {
            position: absolute;
            margin-left: 5pt;
            top: 2px;
            :first-child ::after {
                margin-left: 5px;
                content: "Modifier";
                opacity: 0;
                transition: 300ms ease-in;
            }
            &:hover {
                :first-child ::after {
                    opacity: 1;
                }
                + #post--delete {
                    margin-left: 85pt;
                }
            }
        }
        &--delete {
            position: absolute;
            margin-left: 30pt;
            top: 2px;
            transition: 300ms ease-out;
            button {
                border: none;
                background: none;
            }
            :first-child ::after {
                margin-left: 5px;
                content: "Supprimer";
                opacity: 0;
                z-index: 9;
                transition: 300ms ease-in;
            }
            &:hover :first-child ::after {
                opacity: 1;
            }
        }
    }
    #comment {
        &__section { margin: 0 35px 20px 0 }
        &__btn {
            font-size: 20pt;
            margin: 10pt;
            text-align: center;
            button {
                @extend %button;
            }
        }
    }
    @media screen and (min-width: 600px) {
        #comment__section { margin-right: 20px }
        #post__likes { margin-top: -50px }
    }
    @media screen and (min-width: 1000px) {
        .post { margin-right: 20% }
        #comment__section { margin-left: 20% }
        #comment__btn {
            text-align: left;
            margin-left: 10%;
        }
    }
</style>