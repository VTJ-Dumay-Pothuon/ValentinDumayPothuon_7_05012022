<template>
    <section id="userlist" class="userlist">
        <section class="userlist__header">
            <div>Nom</div>
            <div>Inscription le</div>
        </section>
    </section>
</template>

<script>
  //import {useRouter} from 'vue-router';

  export default {
    name: "Memberlist",
    setup () {
        //const router = useRouter();
        fetch(`http://localhost:3000/api/auth/profiles`)
            .then(obj => obj.json().then(res => {
            for (let profile of res.users) {
                document.getElementById('userlist').insertAdjacentHTML('beforeend',
                '<section class="userlist__row">'
                    +'<div>'
                        +'<a href="/profile?id='+profile.id+'" class="text-dark text-decoration-none">'
                            +profile.name+' '+profile.surname
                        +'</a>'
                    +'</div>'
                    +'<div>'
                        +profile.registration
                    +'</div>'
                +'</section>')
            }
        }));
    },
  };
</script>

<style scoped lang="scss">
    .userlist {
        width: 95%;
        max-width: 800px;
        text-align: center;
        font-size: 1.5rem;
        margin: 10px auto;
        border: 2pt solid black;
        &__header {
            font-weight: bolder;
            display: none;
        }
    }
    @media screen and (min-width: 800px) {
        .userlist {
            &__header { 
                display: inline-flex;
            }
        }
    }
</style>