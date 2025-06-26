import {Service, ServiceType} from '../models/Service';

const services = [
    {
      type: ServiceType.PROVIDER,
      name: `Développeur javascript`,
      description: `Je code`,
      tags: [
        "javascript",
        "nodejs",
        "react",
        "express",
        "developpeur"
      ],
      note: [5, 4, 5, 3, 4, 5, 4, 5, 4, 5],
    },
    {
      type: ServiceType.SERVICES,
      name: `Traducteur`,
      description: `Traduction de texte en toutes langues`,
      tags: [
        "traducteur",
        "langue",
      ],
      note: [5, 4, 3, 5, 4, 4, 5, 4, 3, 5],
    },
    {
        type: ServiceType.SERVICES,
        name: "Génération d'images",
        description: "Création d'images à partir de descriptions textuelles",
        tags: [
            "image",
            "génération",
        ],
        note: [4, 5, 4, 5, 3, 4, 5, 4, 5, 4],
    },
    {
        type : ServiceType.PROVIDER,
        name: "Consultant en marketing digital",
        description: "Stratégies de marketing en ligne pour entreprises",
        tags: [
            "marketing",
            "digital",
            "consultant",
        ],
        note: [5, 3, 4, 5, 4, 5, 4, 3, 5, 4],
    },
    {
        type: ServiceType.SERVICES,
        name: "Créateur de maquettes web",
        description: "Conception de maquettes pour sites web",
        tags: [
            "web",
            "maquette",
            "design",
            "ui/ux"
        ],
        note: [4, 5, 4, 3, 5, 4, 5, 4, 5, 4],
    },
    {
        type: ServiceType.PROVIDER,
        name : "Designer UI/UX",
        description: "Création d'interfaces utilisateur intuitives",
        tags: [
            "web",
            "mobile",
            "ui/ux",
            "design",
            "interface",
        ],
        note: [5, 4, 5, 4, 3, 5, 4, 5, 4, 5],
    },
    {
        type: ServiceType.SERVICES,
        name: "Rédacteur web",
        description: "Rédaction de contenu optimisé pour le web",
        tags:[
            "rédaction",
            "web",
            "SEO",
            "contenu"
        ],
        note: [4, 3, 5, 4, 5, 4, 3, 5, 4, 5],
    },
    {
        type: ServiceType.SERVICES,
        name: "Scribe de contenu",
        description: "Ia spécilisée dans la rédaction de contenu",
        tags: [
            "rédaction",
            "contenu",
            "génération"
        ],
        note: [5, 4, 3, 5, 4, 5, 4, 3, 5, 4],
    },
    {
        type: ServiceType.PROVIDER,
        name: "Développeur mobile",
        description: "Création d'applications mobiles pour iOS et Android",
        tags: [
            "mobile",
            "iOS",
            "Android",
            "développement"
        ],
        note: [4, 5, 4, 3, 5, 4, 5, 4, 5, 3],
    },
    {
        type: ServiceType.PROVIDER,
        name: "Monteur vidéo",
        description: "Montage et édition de vidéos professionnelles",
        tags: [
            "vidéo",
            "montage",
            "édition",
            "professionnel"
        ],
        note: [5, 4, 3, 5, 4, 5, 4, 5, 3, 4],
    }
]

// Fonction pour charger les fixtures
export async function loadServiceFixtures() {
  try {
    await Service.deleteMany({}); // Nettoie la collection avant d'insérer
    await Service.insertMany(services);
    console.log(`${services.length} services fixtures chargées avec succès`);
  } catch (error) {
    console.error('Erreur lors du chargement des fixtures:', error);
    throw error;
  }
}