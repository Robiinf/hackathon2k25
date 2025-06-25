import { ServiceService } from "../services/ServiceService";
import { Request, Response } from "express";

export class TagController {
  private serviceService: ServiceService;

  constructor() {
    this.serviceService = new ServiceService();
  }

  getAllUniqueTags = async (req: Request, res: Response): Promise<void> => {
    try {
      const tags = await this.serviceService.getAllUniqueTags();
      res.status(200).json(tags);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération des tags" });
    }
  };
}
