import dotenv from 'dotenv';
import { connectDatabase } from '../config/database';
import { loadServiceFixtures } from '../fixtures/serviceFixtures';

// Charger les variables d'environnement
dotenv.config();

async function runFixtures() {
  try {
    // Connexion à la base de données
    console.log('🔌 Connexion à la base de données...');
    await connectDatabase();

    // Chargement des fixtures
    console.log('📦 Chargement des fixtures...');
    await loadServiceFixtures();

    console.log('✅ Fixtures chargées avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du chargement des fixtures:', error);
    process.exit(1);
  }
}

runFixtures();