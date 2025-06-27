import { Request, Response } from "express";
import {
  ServiceService,
  CreateServiceDto,
  UpdateServiceDto,
  SaveServiceDto,
} from "../services/ServiceService";
import { ServiceType } from "../models/Service";

export class ServiceController {
  private serviceService: ServiceService;

  constructor() {
    this.serviceService = new ServiceService();
  }

  // POST /api/services
  createService = async (req: Request, res: Response): Promise<void> => {
    try {
      const createServiceDto: CreateServiceDto = req.body;
      const service = await this.serviceService.createService(createServiceDto);

      res.status(201).json({
        success: true,
        message: "Service créé avec succès",
        data: service,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Erreur lors de la création du service",
        data: null,
      });
    }
  };

  saveService = async (req: Request, res: Response): Promise<void> => {
    try {

    } catch (error) {

    }
  }

  // GET /api/services
  getAllServices = async (req: Request, res: Response): Promise<void> => {
    try {
      const services = await this.serviceService.getAllServices();

      res.status(200).json({
        success: true,
        message: "Services récupérés avec succès",
        data: services,
        count: services.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Erreur lors de la récupération des services",
        data: null,
      });
    }
  };

  // GET /api/services/:id
  getServiceById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.serviceService.getServiceWithAverageNote(id);

      res.status(200).json({
        success: true,
        message: "Service récupéré avec succès",
        data: {
          ...result.service,
          averageNote: result.averageNote,
        },
      });
    } catch (error) {
      const statusCode =
        error instanceof Error && error.message === "Service non trouvé"
          ? 404
          : 500;
      res.status(statusCode).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Erreur lors de la récupération du service",
        data: null,
      });
    }
  };

  // GET /api/services/type/:type
  getServicesByType = async (req: Request, res: Response): Promise<void> => {
    try {
      const { type } = req.params;

      if (!Object.values(ServiceType).includes(type as ServiceType)) {
        res.status(400).json({
          success: false,
          message:
            "Type de service invalide. Types acceptés: services, provider",
          data: null,
        });
        return;
      }

      const services = await this.serviceService.getServicesByType(
        type as ServiceType
      );

      res.status(200).json({
        success: true,
        message: `Services de type "${type}" récupérés avec succès`,
        data: services,
        count: services.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Erreur lors de la récupération des services",
        data: null,
      });
    }
  };

  // GET /api/services/search?q=...
  searchServices = async (req: Request, res: Response): Promise<void> => {
    try {
      const { q } = req.query;

      if (!q || typeof q !== "string") {
        res.status(400).json({
          success: false,
          message: 'Le paramètre de recherche "q" est requis',
          data: null,
        });
        return;
      }

      const services = await this.serviceService.searchServices(q);

      res.status(200).json({
        success: true,
        message: "Recherche effectuée avec succès",
        data: services,
        count: services.length,
        query: q,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Erreur lors de la recherche",
        data: null,
      });
    }
  };

  // GET /api/services/tags?tags=tag1,tag2
  getServicesByTags = async (req: Request, res: Response): Promise<void> => {
    try {
      const { tags } = req.query;

      if (!tags || typeof tags !== "string") {
        res.status(400).json({
          success: false,
          message: 'Le paramètre "tags" est requis (format: tag1,tag2,tag3)',
          data: null,
        });
        return;
      }

      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
      const services =
        await this.serviceService.getServicesByTagsWithMatchPercentage(
          tagArray
        );

      res.status(200).json({
        success: true,
        message: "Services trouvés par tags avec pourcentage de match",
        data: services,
        count: services.length,
        tags: tagArray,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Erreur lors de la recherche par tags",
        data: null,
      });
    }
  };

  // PUT /api/services/:id
  updateService = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updateServiceDto: UpdateServiceDto = req.body;

      const service = await this.serviceService.updateService(
        id,
        updateServiceDto
      );

      res.status(200).json({
        success: true,
        message: "Service mis à jour avec succès",
        data: service,
      });
    } catch (error) {
      const statusCode =
        error instanceof Error && error.message === "Service non trouvé"
          ? 404
          : 400;
      res.status(statusCode).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Erreur lors de la mise à jour du service",
        data: null,
      });
    }
  };

  // DELETE /api/services/:id
  deleteService = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.serviceService.deleteService(id);

      res.status(200).json({
        success: true,
        message: "Service supprimé avec succès",
        data: null,
      });
    } catch (error) {
      const statusCode =
        error instanceof Error && error.message === "Service non trouvé"
          ? 404
          : 500;
      res.status(statusCode).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Erreur lors de la suppression du service",
        data: null,
      });
    }
  };

  // POST /api/services/:id/notes
  addNoteToService = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { note } = req.body;

      if (typeof note !== "number") {
        res.status(400).json({
          success: false,
          message: "La note doit être un nombre",
          data: null,
        });
        return;
      }

      const service = await this.serviceService.addNoteToService(id, note);

      res.status(200).json({
        success: true,
        message: "Note ajoutée avec succès",
        data: service,
      });
    } catch (error) {
      const statusCode =
        error instanceof Error && error.message === "Service non trouvé"
          ? 404
          : 400;
      res.status(statusCode).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Erreur lors de l'ajout de la note",
        data: null,
      });
    }
  };
}
