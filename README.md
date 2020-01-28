# B3 Devops - TP 2

## Info

mail: thomas.flitterman@ynov.com  
github_username: tofl

## Docker compose

Nous définissons 3 services dans docker-compose.yml :

- **Une base de données PostgreSQL** que nous appelons `db_postgres`. Le container est renommé `db` et nous modifions le nom de l'utilisateur, son mot de passe, et la base créée à l'aide des variables d'environnement sur lesquelles se base l'image de postgres. Les données sont persistentes à l'aide d'un volume et le container est exposé au port 5432.

- **Une base de données Redis** que nous appelons `db_redis`. Cette fois le container est renommé `redis` et est exposé au port 6379.

- **L'API Node avec le framework ExpressJS**. Le service et le container s'appellent `app`. Puisque ce fichier docker-compose.yml est utilisé en développement, nous ne créons pas de Dockerfile pour ce service mais créons un volume dans `docker-compose.yml` qui pointe vers les fichiers sources se trouvant dans le dossier *app*. Nous indiquons que ce service dépend du service `db_postgres`, que l'application est exposée au port 3030 et que pour servir l'application, la commande `npm run dev` doit être exécutée dans le container.

- Le reverse proxy avec Nginx. Nous appelons le service ainsi que le container `reverse_proxy`. Ce service dépend du service `app` et est exposé au port 3000, c'est à dire que les utilisateurs pourront accéder à l'API à l'adresse `localhost:3000` (nous aurions aussi pu utiliser le port 80). Cette fois, l'image est définie dans un Dockerfile car le fichier de configuration est copiée dans le container lors de l'étape de build (l'instruction `copy` n'existe pas avec Docker Compose, mais nous aurions tout de même pu créer un volume afin de ne pas avoir à créer un Dockerfile).