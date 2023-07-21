# bot-mascotte

Voici comment installer et lancer le bot.
Ce bot est spécialement conçu pour faciliter la gestion de serveur discord classe.


## Installation du bot

1. Cloner ce répertoire avec la commande `git clone https://github.com/Guscraftin/bot-mascotte.git`.  
*Vous devez avoir installé git sur votre machine. Si votre machine ne reconnait la commande **git**, installez la via ce lien : https://git-scm.com/download/. Une fois git installé, ouvrez **Git Bash** pour exécuter les commandes git.*

2. Allez à la racine du répertoire que vous venez de télécharger (avec la commande `cd bot-mascotte`) et tapez la commande : `npm i`.  
*Vous devez avoir installé nodejs sur votre machine. Si votre machine ne reconnait la commande **npm**, installez la via ce lien : https://nodejs.org/fr/download/*.

3. Renommer le fichier `.env.example` en `.env`.

4. Ouvrez le fichier `.env` et remplacez les `...` par vos propres valeurs.

5. Pour obtenir ces valeurs, suivez ces étapes :
   1. Rendez-vous sur https://discord.com/developers/applications et créez une nouvelle application en cliquant sur le bouton en haut à droite. Entrez le nom de votre bot et acceptez les conditions d'utilisation, puis cliquez sur "Create".
   2. Dans la section "Bot", cliquez sur "Reset Token", puis sur le bouton "Copier" pour copier le token du bot qui s'affiche. Remplacez les `...` par ce token dans la variable `TOKEN=` du fichier `.env`.
   3. Dans la section "OAuth2", cliquez sur "Copier" sous l'identifiant client. Remplacez les `...` par cet identifiant dans la variable `CLIENT_ID=` du fichier `.env`.
   4. Activez le mode développeur dans vos paramètres Discord en allant dans les paramètres utilisateur, puis dans la section "Avancés". Faites un clic droit sur le serveur où vous souhaitez inviter le bot, puis cliquez sur "Copier l'identifiant". Remplacez les `...` par cet identifiant dans la variable `GUILD_ID=` du fichier `.env`.

6. Pour inviter le bot sur votre serveur, suivez ces étapes :
   1. Retournez sur https://discord.com/developers/applications et sélectionnez votre application bot.
   2. Cliquez sur la section "OAuth2" et ensuite sur "URL Generator". Dans le champ "Scope", sélectionnez "bot". Choisissez les permissions que vous souhaitez accorder au bot lorsqu'il rejoint un serveur Discord. Si vous voulez lui accorder toutes les permissions, vous pouvez lui donner la permission d'administrateur.
   3. Une fois vos choix effectués, copiez l'URL générée et collez-la dans votre navigateur pour ajouter le bot au serveur dont vous avez copié l'identifiant précédemment.

## Lancement du bot

- Exécuter la commmande `node .` dans le dossier précédemment clone.
