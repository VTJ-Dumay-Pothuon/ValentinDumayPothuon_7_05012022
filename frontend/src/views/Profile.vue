<template>
    <div v-show="canEditProfile" id="profile__picture--remove">
        <button aria-label="Supprimer l'image"
        v-on:click="removePicture" v-on:keydown="removePicture">
            <i class="far fa-times-circle"></i>
        </button>
    </div>
    <section class="profile" id="profile">
        <section id="profile__upperblock">
            <div><!--empty gridbuilding--></div>
            <picture id="profile__picture">
                <img src="../assets/user-default.svg" alt="Image de profil par défaut">
            </picture>
            <aside v-show="canEditProfile" id="profile--edit"></aside>
        </section>
    </section>
    <section id="profile__posts"></section>
</template>

<script>
    import store from '../store/index';
    import {useRouter} from 'vue-router';
    export default {
        name: "Profile",
        data() {return {
            canEditProfile: null,
            router: useRouter()
            }},
        mounted: async function() {
            this.canEditProfile = await store.state.canEditProfile;
        },
        methods: {
            removePicture() {
                const profile_picture = document.getElementById('profile__picture').firstChild;
                const getImage = require.context('../assets/', false, /\.svg$/);
                const srcDefault = 'http://localhost:8080'+getImage('./user-default.svg');
                if (profile_picture.src != srcDefault) {
                const urlParams = new URLSearchParams(window.location.search);
                const id = urlParams.get('id');
                const data = { deleteImage: true };
                fetch(`http://localhost:3000/api/auth/update/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(data)
                })
                .then (() => {
                    this.router.go(`/profile?id=${id}`)
                })
                .catch((error) => {
                    console.log( error );
                });
                } else {
                    alert ("Ce Groupomaniaque n'a pas d'image de profil à supprimer !")
                }
            }
        },
        setup() {
            const router = useRouter();
            const urlParams = new URLSearchParams(window.location.search);
            if (!urlParams.get('id')) {
                router.push(`/profile?id=${store.state.userId}`);
                return;
            }
            const id = urlParams.get('id');
            fetch(`http://localhost:3000/api/auth/profile/${id}`,{credentials: "include"})
            .then(obj => obj.json().then(res => {
                if (!res.user) {
                    alert ("Ce groupomaniaque n'existe pas !")
                    router.push('/home');
                    return;
                }
                if (res.canEdit != store.state.canEditProfile) {
                    store.dispatch("setProfileEdit", res.canEdit);
                    router.go(); // Force view reload only if edit right has changed
                    return;
                }
                document.getElementById('profile').innerHTML += 
                '<h1>'
                +res.user.name+' '+res.user.surname
                +'</h1>';

                if (res.user.description) {
                document.getElementById('profile').innerHTML += 
                '<p>'+res.user.description+'</p>'}

                if (res.user.image) {
                    document.getElementById('profile__picture').firstChild.src =
                    res.user.image; // replaces the default picture by user's only if defined
                    document.getElementById('profile__picture').firstChild.alt =
                    'Photo de profil de '+res.user.name+' '+res.user.surname;
                }
            }))
            .then(
            fetch(`http://localhost:3000/api/post/user/${id}`)
            .then(obj => obj.json().then(res => {
                document.getElementById('profile__posts').innerHTML='';
                for (let post of res.posts) {
                    document.getElementById('profile__posts').insertAdjacentHTML('afterbegin', 
                    '<a aria-label="'+post.title+'" href="/post?id='+post.id
                    +'" class="text-dark text-decoration-none">'
                        +'<article class="post post__by-user" id="profile__'+id+'__post__'+post.id+'">'
                            +'<h2>'+post.title+'</h2>'
                            +'<p id=post__'+post.id+'__body></p>'
                            +'<picture id="post__'+post.id+'__picture">'
                                +'<img src="" alt="" />'
                            +'</picture>'
                    +'</article></a>');

                    if (post.body) {
                    document.getElementById('post__'+post.id+'__body').innerHTML = post.body;
                    }
                    if (post.image) {
                    document.getElementById('post__'+post.id+'__picture').firstChild.src = post.image;
                    document.getElementById('post__'+post.id+'__picture').firstChild.alt = "Image du post";
                    }
                }
                if (res.posts.length==0) {
                    document.getElementById('profile__posts').innerHTML = 
                    '<p style="margin-top:20px"><em>Ce Groupomaniaque n\'a encore rien posté.</em></p>';
                }
                
                document.getElementById('profile--edit').innerHTML =
                '<a href="/profile/edit?id='+urlParams.get('id')
                +'" class="link-dark"><i class="fas fa-user-edit"></i></a>';
            })));
        },
    }
</script>

<style scoped lang=scss>
    #profile {
        margin: 0 20%;
        text-align: center;
        &__picture {
            img {
                height: 150px;
                width: 150px;
                object-fit: contain;
                border: 2pt solid black;
                border-radius: 10px;
                box-shadow: 5px 4px 3px #0003;
                padding: 10px;
                &:hover +div { opacity: 1 }
            }
            &--remove {
                position: absolute;
                z-index: 2;
                display: flex;
                justify-content: center;
                margin-left: 124px;
                width: stretch;
                button {
                    opacity: 0;
                    background: none;
                    border: none;
                    transition: 200ms ease;
                    &:hover { opacity: 1 }
                }
            }
        }
        &__upperblock {
            display: grid;
            grid-template-columns: 20px 200px 20px;
            justify-content: center;
        }
        &--edit {
                margin: 10px;
                z-index: 3;
                .fas::before {
                    z-index: 3;
                }
            }
    }

    @media screen and (min-width: 1300px) {
        #profile__picture--remove {
            max-width: 1300px;
            display: grid;
            grid-template-columns: 20px;
            justify-content: center;
            margin-right: -60px;
             margin-left:  60px;
        }
    }
</style>