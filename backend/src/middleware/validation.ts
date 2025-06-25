import { Request, Response, NextFunction } from "express";
import { ServiceType } from "../models/Service";

export const validateObjectId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { id } = req.params;

  // Vérification basique de l'ObjectId MongoDB (24 caractères hexadécimaux)
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;

  if (!objectIdRegex.test(id)) {
    res.status(400).json({
      success: false,
      message:
        "ID invalide. L'ID doit être un ObjectId MongoDB valide (24 caractères hexadécimaux)",
      data: null,
    });
    return;
  }

  next();
};
