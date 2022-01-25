# INSTALLATIONS GLOBALES :

## Téléchargez et installez NodeJS :
https://nodejs.org/en/download/
#####         *(testé avec NodeJS v14.17)*

## Téléchargez et installez MySQL Installer
https://dev.mysql.com/downloads/installer/
#### Avec cet installateur, installez la version 5.7 de SQLServer.
#### Configurez un compte utilisateur avec un mot de passe (indispensable).

## Installez NPM et divers dépendances requises par le serveur et la BDD :
```
npm install -g npm
```
```
npm install -g nodemon
```
```
npm install -g sequelize-cli
```
```
npm install -g @vue/cli
```

# MISE EN PLACE DU SERVEUR :

## Installez les packages :
```
cd backend > npm install
```

## Créez un fichier .env qui doit contenir :
```
DB_USER = Le nom d'utilisateur de votre compte SQLServer
DB_PASS = Le mot de passe de votre compte SQLServer
CRYPTOMAIL = Une clef de cryptage alphanumérique
TOKEN_1 = Une clef de cryptage alphanumérique
TOKEN_2 = Une clef de cryptage alphanumérique
TOKEN_3 = Une clef de cryptage alphanumérique
TOKEN_4 = Une clef de cryptage alphanumérique
```
### Je recommande d'utiliser une chaîne SHA-256 aléatoire et différente pour les cinq clefs.
https://emn178.github.io/online-tools/sha256.html

#### Allez dans `backend/config/config.json` et modifiez les champs 'username' et 'password',<br />pour qu'ils contiennent les identifiants du compte configuré pour SQL Server.

## Dans le dossier `backend`, créez un dossier 'images' ;
#### Dans le dossier `images`, créez un dossier 'posts' ;
#### Dans le dossier `images`, créez un dossier 'profiles'.

## Créez les bases de données :
```
sequelize db:create
```

## Déployez les bases de données :
```
sequelize db:migrate
```

## Lancez l'application serveur :
```
nodemon server
```

# MISE EN PLACE DU CLIENT :

## Installez les packages :
```
cd frontend > npm install
```

## Lancez l'application client :
### A) Pour compiler et lancer l'application client en mode développement :
```
npm run serve
```
### B) Pour compiler, minifier et lancer l'application client en mode production :
```
npm run build
```
#####         *(choissez une des deux commandes ; la première compilation est plus rapide, la seconde application est plus fluide)*

# 

### Note : pour créer un utilisateur disposant des droits administrateurs, il faut d'abord<br />l'inscrire sur le site via le formulaire classique d'inscription. Ensuite, récupérez son id<br />dans l'URL de sa page de profil. Connectez-vous à la base de données pour modifier<br />son entrée manuellement. Par exemple, avec MySQL et un id=5, la commande sera :
```
UPDATE `users` SET `isAdmin`=1 WHERE `id` = 5;
```