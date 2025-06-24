# Utiliser l'image Node.js 18
FROM node:18

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json (si disponible)
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code source
COPY . .

# Exposer le port 5173 (port par défaut de Vite)
EXPOSE 5173

# Commande pour lancer l'application en mode développement
CMD ["npm", "run", "dev"] 