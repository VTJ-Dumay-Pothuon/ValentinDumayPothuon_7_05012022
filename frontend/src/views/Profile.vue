<template>
    <section id="profile">
        <section id="profile__upperblock">
            <div><!--empty gridbuilding--></div>
            <picture id="profile__picture">
                <img src="../assets/user-default.svg" alt="" />
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
        data() {return {canEditProfile: null}},
        mounted: async function() {
            this.canEditProfile = await store.state.canEditProfile;
        },
        setup() {
            const router = useRouter();
            const urlParams = new URLSearchParams(window.location.search);
            if (!urlParams.get('id')) router.push(`/profile?id=${store.state.userId}`);
            const id = urlParams.get('id');
            fetch(`http://localhost:3000/api/auth/profile/${id}`,{credentials: "include"})
            .then(obj => obj.json().then(res => {
                if (res.canEdit != store.state.canEditProfile) {
                    store.dispatch("setProfileEdit", res.canEdit);
                    router.go(); // Force view reload only if edit right has changed
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
                res.user.image} // replaces the default picture by user's only if defined
            }))
            .then(
            fetch(`http://localhost:3000/api/post/user/${id}`)
            .then(obj => obj.json().then(res => {
                document.getElementById('profile__posts').innerHTML='';
                for (let post of res.posts) {
                    document.getElementById('profile__posts').insertAdjacentHTML('afterbegin', 
                    '<a href="/post?id='+post.id+'" class="text-dark text-decoration-none">'
                        +'<article class="post post__by-user" id="profile__'+id+'__post__'+post.id+'">'
                            +'<h2>'+post.title+'</h2>'
                            +'<p>'+post.body+'</p>'
                            +'<picture id="post__'+post.id+'__picture">'
                                +'<img src="" alt="" />'
                            +'</picture>'
                    +'</article></a>');
                    if (post.image) {
                    document.getElementById('post__'+post.id+'__picture').firstChild.src = post.image;
                    }
                }
                if (res.posts.length==0) {
                    document.getElementById('profile__posts').innerHTML = 
                    '<p style="margin-top:20px">Ce Groupomaniaque n\'a encore rien posté.</p>';
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
        &__picture img {
            max-height: 200px;
            max-width: 100%;
            border: 2pt solid black;
            border-radius: 10px;
            box-shadow: 5px 4px 3px #0003;
            padding: 10px;
        }
        &__upperblock {
            display: grid;
            grid-template-columns: 20px 200px 20px;
            justify-content: center;
        }
        &--edit {
            margin: 10px;
            :first-child ::after {
                margin-left: 5px;
                content: "Modifier";
                opacity: 0;
                transition: 300ms ease-in;
            }
            &:hover :first-child ::after {
                opacity: 1;
            }
        }
    }
</style>