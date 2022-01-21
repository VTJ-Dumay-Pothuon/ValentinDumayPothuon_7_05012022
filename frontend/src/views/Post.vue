<template>
    <article class="post">
        <div id="post"></div>
        <picture id="profile__picture">
            <img src="" alt="" />
        </picture>
        <aside v-show="canEditPost" id="post--edit" :key="reload"></aside> 
        <aside v-show="canEditPost" id="post--delete" :key="reload">
            <button v-on:click="deletePost"></button>
        </aside> 
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
            }
        },
        setup () {
            const urlParams = new URLSearchParams(window.location.search);
            const id = urlParams.get('id');
            const router = useRouter();
            fetch(`http://localhost:3000/api/post/one/${id}`,{credentials: "include"})
            .then(obj => obj.json().then(res => {
                if (res.canEdit != store.state.canEditPost) {
                    store.dispatch("setPostEdit", res.canEdit);
                    router.go(); // Force view reload only if edit right has changed
                }
                document.getElementById('post').innerHTML = 
                '<article id=post__'+res.post.id+'>'
                +'<h2>'+res.post.title+'<small id="post__author"></small></h2>'
                +'<p>'+res.post.body+'</p></article>';

                if (res.post.image) {
                document.getElementById('profile__picture').firstChild.src = res.post.image
                }

                fetch(`http://localhost:3000/api/auth/profile/${res.post.UserId}`,{credentials: "include"})
                    .then(obj => obj.json().then(res => {
                        document.getElementById('post__author').innerHTML += 
                        ', par <a class="link-dark" href="/profile?id='+res.user.id+'">'
                        +res.user.name+' '+res.user.surname+'&nbsp;'
                        +'<picture><img src="'+res.user.image+'" alt="" /></picture></a>';
                    }))

                document.getElementById('post--edit').innerHTML =
                '<a href="/post/edit?id='+urlParams.get('id')
                +'" class="link-dark"><i class="fas fa-edit"></i></a>'

                document.getElementById('post--delete').firstChild.innerHTML =
                '<i class="fas fa-trash-alt"></i>';
            }))
            .then(fetch(`http://localhost:3000/api/comment/readfor/${id}`)
            .then(obj => obj.json().then(res => {
                document.getElementById('comment__section').innerHTML='';
                for (let comment of res.comments) {
                    document.getElementById('comment__section').insertAdjacentHTML('afterbegin',
                    '<section class="comment">'
                        
                        +'<article class="comment__content" id="post__'+id+'__comment__'+comment.id+'">'
                            +'<p>'+comment.body+'</p>'
                        +'</article>'
                        +'<section class="comment__author" id="comment__'+comment.id+'__author"></section>'
                    +'</section>');

                    fetch(`http://localhost:3000/api/auth/profile/${comment.UserId}`,{credentials: "include"})
                    .then(obj => obj.json().then(res => {
                        document.getElementById(`comment__${comment.id}__author`).innerHTML = 
                        '<a class="link-dark" href="/profile?id='+res.user.id+'">'
                        +'<picture><img src="'+res.user.image+'" alt="" /></picture>'
                        +'<h3>'+res.user.name+' '+res.user.surname+'</h3></a>';
                }))}
            })));
        },
    }
</script>

<style scoped lang=scss>
    .post { margin: 0 40px }
    #comment__section { margin: 0 20px }
    #post {
        margin: 20px;
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
    #comment__btn {
        font-size: 20pt;
        margin: 10pt;
        text-align: center;
        button {
            padding: 0 20pt;
            border: 1pt solid black;
            box-shadow: 5px 4px 3px #0003;
            border-radius: 10px;
            background: none;
        }
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