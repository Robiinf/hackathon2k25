import { z } from "zod";
import { GeminiIA } from "../services/GeminiIA";
import { ServiceType } from "../models/Service";

const workflowOutputSchema = z.array(
    z.object({
      type: z.enum([ServiceType.PROVIDER, ServiceType.SERVICES]),
      order: z.number(),
      tags: z.array(z.string()),
      params: z.any(),
      prompt: z.string().optional()
    })
  );

const workflowPrompt = `
Tu es un architecte de workflows d’automatisation IA. Ton rôle est de lire une description de projet fournie par un utilisateur, puis de générer un fichier JSON représentant un pipeline de tâches à accomplir pour mener à bien ce projet.

Chaque tâche sera représentée comme un nœud dans un workflow, et chaque nœud est de deux types :
IA : une IA autonome capable de réaliser une tâche précise (ex: traduction, résumé, génération d’image, classification, etc.)
humain : une intervention humaine avec des compétences spécifiques et pour des tache complexe non realisable par une ia

Les tâches peut être faites en parallèle ou en série, et tu dois ordonner les tâches de manière logique pour que le projet puisse être réalisé efficacement.

Le resultat de sortie d'un noeud est forcement unique met peut être de tout type (texte, image, audio, vidéo, etc.), et peut être utilisé comme entrée pour d’autres nœuds.

Le fichier final sera une liste ordonnée d’objets JSON représentant les étapes du projet, sous ce format :

\`\`\`json
{
  "type": "IA" | "humain",
  "order": "Ordre pour le parrallélisme (int)",
  "job": "Nom du de l'agent ia liste ci dessous ou tag préstataire",
  "tags": "la liste des tags préstataire ou IA qui justifie ton choix",
  "params": { "clé": "valeur", ... }, // paramètres spécifiques à l'agent IA UNIQUEMENT qui sera ajouter au prompt de l'IA lors de l'exécution du workflow
  "prompt": "ACTION claire à faire sur les données d'entrée" // seulement si IA
}
\`\`\`

Tu dois choisir automatiquement les bons tags selon si il faut une ia ou un prestatire parmi ceux listés dans la liste des services disponibles (voir ci-dessous), et formuler pour chaque agent IA un prompt clair dans la clé prompt, en t’appuyant sur les données d’entrée disponibles (file, text, video, audio).
`


export function generatorWorkflow(
  prompt: string,
  tags : { IA: string[]; human: string[] },
  generator : GeminiIA
  
): Promise<z.infer<typeof workflowOutputSchema>> {
  return new Promise(async (resolve, reject) => {
    try {
      prompt ='\n TAG IA : ' + tags.IA.join(', ') + '\n TAG humain : ' + tags.human.join(', ') + '\n\n Le projet est : ' + prompt;
      const model = generator.getModel();
      const structuredLlm =  model.withStructuredOutput(workflowOutputSchema)
    
      const response = await structuredLlm
        .invoke(workflowPrompt + prompt);        
        resolve(response);
    } catch (error) {
      reject(error);
    }
  });
}