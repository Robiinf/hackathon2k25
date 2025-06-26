import { z } from "zod";
import { IService } from "../models/Service";
import { GeminiIA } from "../services/GeminiIA";
import { ServiceService } from "../services/ServiceService";

export interface WorkflowOutput {
  jobTitle: string; // titre du job
  order: number; // ordre pour le parallélisme (int)
  tags: string[]; // tags associés à la tache
  services: IService[]; // services possible pour la tache
  prompt?: string; // action claire à faire sur les données d'entrée (optionnel, pour les IA)
  params?: Record<string, any>; // paramètres spécifiques pour la tâche (doit corespondre à l'inputJSON du IService)
}

const workflowOutputSchema = z.array(
  z.object({
    jobTitle: z.string(), // titre du job
    order: z.number(),
    tags: z.array(z.string()),
    inputParams: z.any(),
    prompt: z.string().optional()
  })
);

const workflowPrompt = `
Tu es un architecte de workflows d’automatisation IA. Ton rôle est de lire une description de projet fournie par un utilisateur, puis de générer un fichier JSON représentant un pipeline de tâches à accomplir pour mener à bien ce projet.

Chaque tâche sera représentée comme un nœud dans un workflow, et chaque nœud est un service, un service peut être d'un point de vue base de données deux types :
IA : une IA autonome capable de réaliser une tâche précise (ex: traduction, résumé, génération d’image, classification, etc.)
humain : une intervention humaine avec des compétences spécifiques et pour des tache complexe non realisable par une ia

C'est le client qui va choisir le type de service, tu dois donc générer un workflow avec seuelemnt les tags et possiblement le prompt pour les IA.

Les tâches peut être faites en parallèle ou en série, et tu dois ordonner les tâches de manière logique pour que le projet puisse être réalisé efficacement, bien parraléliser les taches similaires.

Le resultat de sortie d'un noeud est forcement unique met peut être de tout type (texte, image, audio, vidéo, etc.), et peut être utilisé comme entrée pour d’autres nœuds.

Le fichier final sera une liste ordonnée d’objets JSON représentant les étapes du projet, sous ce format :

\`\`\`json
{
  "jobTitle": "Titre du job (string) permet de savoir rapide de quoi il s'agit pas plus de 30-50 caractères", 
  "order": "Ordre pour le parrallélisme (int)",
  "tags": "la liste des tags utile pour la tache",
  "prompt": "ACTION claire à faire sur les données d'entrée" // au cas ou c'est une IA
  "inputParams": "paramètres spécifiques pour la tâche (peut être vide)"
}
\`\`\`

Tu dois choisir automatiquement les bons tags selon parmi ceux listés dans la liste des services disponibles (voir ci-dessous), et formuler un prompt clair dans la clé prompt, en t’appuyant sur les données d’entrée disponibles (file, text, video, audio).
`

export function generatorWorkflow(
  prompt: string,
  tags: { IA: string[]; human: string[] },
  generator: GeminiIA

): Promise<WorkflowOutput[]> {
  return new Promise(async (resolve, reject) => {
    try {
      prompt = '\n TAGS Disponible : ' + tags.IA.join(', ') + ',' + tags.human.join(', ') + '\n\n Le projet est : ' + prompt;
      const model = generator.getModel();
      const structuredLlm = model.withStructuredOutput(workflowOutputSchema)

      const response = await structuredLlm
        .invoke(workflowPrompt + prompt);

      const serviceService = new ServiceService();

      const jobs = response.map(async (item) => {
        const services = await serviceService.getServicesByTagsWithMatchPercentage(item.tags)
        return {
          ...item,
          services,
        }
      });

      const results = await Promise.all(jobs);
      resolve(results);

    } catch (error) {
      reject(error);
    }
  });
}