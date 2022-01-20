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
                document.getElementById('post').innerHTML += 
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
        },
    }
</script>

<style scoped lang=scss>
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
    .post { margin: 0 20% 0 10% }
</style>