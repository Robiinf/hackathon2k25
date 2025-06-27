import { Service, ServiceType } from '../models/Service';

const services = [
    {
        type: ServiceType.PROVIDER,
        name: `Développeur javascript`,
        description: `Je code`,
        tags: [
            "Javascript",
            "Nodejs",
            "React",
            "Express",
            "Developpeur",
            "Clean-architecture",
            "Clean-code"
        ],
        note: [5, 4, 5, 3, 4, 5, 4, 5, 4, 5],
        inputJSON: [],
    },
    {
        type: ServiceType.SERVICES,
        name: `Traducteur`,
        description: `Traduction de texte en toutes langues`,
        tags: [
            "Traducteur",
            "Langue",
            "Traduction",
            "Reverso",
            "Deepl",
        ],
        note: [5, 4, 3, 5, 4, 4, 5, 4, 3, 5],
        inputJSON: [
            {
                label: "Langue cible",
                type: "select",
                options: ["FR", "EN", "ES", "DE", "IT"]
            }
        ]
    },
    {
        type: ServiceType.SERVICES,
        name: "Génération d'images",
        description: "Création d'images à partir de descriptions textuelles",
        tags: [
            "Image",
            "Création"
        ],
        note: [4, 5, 4, 5, 3, 4, 5, 4, 5, 4],
        inputJSON: [
            { label: "Style de l'image", type: "string", placeholder: "Ex. : vintage, cyberpunk..." }
        ]
    },
    {
        type: ServiceType.PROVIDER,
        name: "Consultant en marketing digital",
        description: "Stratégies de marketing en ligne pour entreprises",
        tags: [
            "Marketing",
            "Digital",
            "Consultant",
            "Communication"
        ],
        note: [5, 3, 4, 5, 4, 5, 4, 3, 5, 4],
        inputJSON: []
    },
    {
        type: ServiceType.SERVICES,
        name: "Créateur de maquettes web",
        description: "Conception de maquettes pour sites web",
        tags: [
            "Web",
            "Maquette",
            "Design",
            "UI/UX",
            "Figma"
        ],
        note: [4, 5, 4, 3, 5, 4, 5, 4, 5, 4],
        inputJSON: [
            { label: "Style de maquette", type: "string", placeholder: "Minimaliste, coloré, etc." }
        ]
    },
    {
        type: ServiceType.PROVIDER,
        name: "Designer UI/UX",
        description: "Création d'interfaces utilisateur intuitives",
        tags: [
            "UX/UI",
            "Adobe",
            "Figma",
        ],
        note: [5, 4, 5, 4, 3, 5, 4, 5, 4, 5],
        inputJSON: []
    },
     {
        type: ServiceType.PROVIDER,
        name: "Développeur web",
        description: "Développement de sites web et applications",
        tags: [
            "Javascript",
            "PHP",
            "Python",
        ],
        note: [5, 4, 5, 4, 3, 5, 4, 5, 4, 5],
        inputJSON: []
    },
    {
        type: ServiceType.SERVICES,
        name: "Rédacteur web",
        description: "Rédaction de contenu optimisé pour le web",
        tags: [
            "Site internet",
            "Blog",
            "Web",
            "SEO",
            "Formattage de texte",
            "Rédactionnel"
        ],
        note: [4, 3, 5, 4, 5, 4, 3, 5, 4, 5],
        inputJSON: [
            { label: "Style rédactionnel", type: "string", placeholder: "Professionnel, amical, etc." }
        ]
    },
    {
        type: ServiceType.PROVIDER,
        name: "Rédacteur",
        description: "Rédaction de contenu pour divers supports",
        tags: [
            "Ecrivain",
            "Rédactionnel"
        ],
        note: [4, 3, 5, 4, 5, 4, 3, 5, 4, 5],
        inputJSON: [
        ]
    },
    {
        type: ServiceType.SERVICES,
        name: "Scribe de contenu",
        description: "IA spécialisée dans la rédaction de contenu",
        tags: [
            "Rédaction",
            "Contenu",
            "Génération texte"
        ],
        note: [5, 4, 3, 5, 4, 5, 4, 3, 5, 4],
        inputJSON: [
            { label: "Style de rédaction", type: "string", placeholder: "Formel, narratif..." }
        ]
    },
    {
        type: ServiceType.PROVIDER,
        name: "Développeur mobile",
        description: "Création d'applications mobiles pour iOS et Android",
        tags: [
            "Apple",
            "Android",
            "iPhone",
            "Samsung",
            "Flutter",
            "Android",
            "React Native"
        ],
        note: [4, 5, 4, 3, 5, 4, 5, 4, 5, 3],
        inputJSON: []
    },
    {
        type: ServiceType.PROVIDER,
        name: "Monteur vidéo",
        description: "Montage et édition de vidéos professionnelles",
        tags: [
            "Vidéo",
            "Montage",
            "Photoshop",
        ],
        note: [5, 4, 3, 5, 4, 5, 4, 5, 3, 4],
        inputJSON: []
    },
    {
        type: ServiceType.PROVIDER,
        name: "Chef de projet IT",
        description: "Gestion de projets informatiques",
        tags: [
            "Gestion de projet",
            "Agile",
            "Scrum",
        ],
        note: [5, 4, 5, 4, 3, 5, 4, 5, 4, 5],
        inputJSON: []
    },
    {
        type: ServiceType.PROVIDER,
        name: "Plombier",
        description: "Services de plomberie",
        tags: [
            "Plomberie",
            "Bricolage",
            "Maintenance",
            "Réparation"
        ],
        note: [5, 4, 5, 4, 3, 5, 4, 5, 4, 5],
        inputJSON: []
    },
    {
        type: ServiceType.PROVIDER,
        name: "Électricien",
        description: "Services d'électricité",
        tags: [
            "Électricité",
            "Bricolage",
            "Maintenance",
            "Réparation"
        ],
        note: [5, 4, 5, 4, 3, 5, 4, 5, 4, 5],
        inputJSON: []
    },
     {
        type: ServiceType.PROVIDER,
        name: "Menuisier",
        description: "Services de menuiserie",
        tags: [
            "Menuiserie",
            "Bricolage",
            "Maintenance",
            "Réparation"
        ],
        note: [5, 4, 5, 4, 3, 5, 4, 5, 4, 5],
        inputJSON: []
    },
    {
        type: ServiceType.PROVIDER,
        name: "Architecte",
        description: "Services d'architecture",
        tags: [
            "Architecture",
            "Bâtiment",
            "Design de bâtiment",
            "Dessin d'interieur"
        ],
        note: [5, 4, 5, 4, 3, 5, 4, 5, 4, 5],
        inputJSON: []
    },
];

// Fonction pour charger les fixtures
export async function loadServiceFixtures() {
    try {
        await Service.deleteMany({});
        await Service.insertMany(services);
        console.log(`${services.length} services fixtures chargées avec succès`);
    } catch (error) {
        console.error('Erreur lors du chargement des fixtures:', error);
        throw error;
    }
}