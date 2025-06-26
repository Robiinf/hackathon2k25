import { ServiceRepository } from "../repositories/ServiceRepository";
import { IService, ServiceType } from "../models/Service";

export interface CreateServiceDto {
  type: ServiceType;
  name: string;
  description: string;
  tags?: string[];
}

export interface UpdateServiceDto {
  type?: ServiceType;
  name?: string;
  description?: string;
  tags?: string[];
}

export class ServiceService {
  private serviceRepository: ServiceRepository;

  constructor() {
    this.serviceRepository = new ServiceRepository();
  }

  async createService(createServiceDto: CreateServiceDto): Promise<IService> {
    // Validation métier
    this.validateServiceData(createServiceDto);

    // Vérifier si un service avec le même nom existe déjà
    const existingServices = await this.serviceRepository.search(
      createServiceDto.name
    );
    const exactMatch = existingServices.find(
      (service) =>
        service.name.toLowerCase() === createServiceDto.name.toLowerCase()
    );

    if (exactMatch) {
      throw new Error("Un service avec ce nom existe déjà");
    }

    return await this.serviceRepository.create(createServiceDto);
  }

  async getAllServices(): Promise<IService[]> {
    return await this.serviceRepository.findAll();
  }

  async getServiceById(id: string): Promise<IService> {
    const service = await this.serviceRepository.findById(id);
    if (!service) {
      throw new Error("Service non trouvé");
    }
    return service;
  }

  async getServicesByType(type: ServiceType): Promise<IService[]> {
    return await this.serviceRepository.findByType(type);
  }

  async getServicesByTags(tags: string[]): Promise<IService[]> {
    if (!tags || tags.length === 0) {
      throw new Error("Au moins un tag doit être fourni");
    }
    return await this.serviceRepository.findByTags(tags);
  }

  async getServicesByTagsWithMatchPercentage(tags: string[]): Promise<IService[]> {
    if (!tags || tags.length === 0) {
      throw new Error("Au moins un tag doit être fourni");
    }
    return await this.serviceRepository.findByTagsWithMatchPercentage(tags);
  }

  async updateService(
    id: string,
    updateServiceDto: UpdateServiceDto
  ): Promise<IService> {
    const existingService = await this.getServiceById(id);

    // Si le nom change, vérifier l'unicité
    if (
      updateServiceDto.name &&
      updateServiceDto.name !== existingService.name
    ) {
      const existingServices = await this.serviceRepository.search(
        updateServiceDto.name
      );
      const exactMatch = existingServices.find(
        (service) =>
          service.name.toLowerCase() === updateServiceDto.name!.toLowerCase() &&
          service._id.toString() !== id
      );

      if (exactMatch) {
        throw new Error("Un service avec ce nom existe déjà");
      }
    }

    const updatedService = await this.serviceRepository.update(
      id,
      updateServiceDto
    );
    if (!updatedService) {
      throw new Error("Erreur lors de la mise à jour du service");
    }

    return updatedService;
  }

  async deleteService(id: string): Promise<void> {
    const deletedService = await this.serviceRepository.delete(id);
    if (!deletedService) {
      throw new Error("Service non trouvé");
    }
  }

  async searchServices(query: string): Promise<IService[]> {
    if (!query || query.trim().length < 2) {
      throw new Error("La recherche doit contenir au moins 2 caractères");
    }
    return await this.serviceRepository.search(query.trim());
  }

  async addNoteToService(id: string, note: number): Promise<IService> {
    if (!Number.isInteger(note) || note < 0 || note > 5) {
      throw new Error("La note doit être un entier entre 0 et 5");
    }

    const updatedService = await this.serviceRepository.addNote(id, note);
    if (!updatedService) {
      throw new Error("Service non trouvé");
    }

    return updatedService;
  }

  async getServiceWithAverageNote(
    id: string
  ): Promise<{ service: IService; averageNote: number | null }> {
    const service = await this.getServiceById(id);
    const averageNote = await this.serviceRepository.getAverageNote(id);

    return { service, averageNote };
  }

  async getAllUniqueTags(): Promise<{ IA: string[]; human: string[] }> {
    return await this.serviceRepository.getAllUniqueTags();
  }

  private validateServiceData(data: CreateServiceDto | UpdateServiceDto): void {
    if ("name" in data && data.name) {
      if (data.name.trim().length < 2) {
        throw new Error("Le nom doit contenir au moins 2 caractères");
      }
      if (data.name.length > 100) {
        throw new Error("Le nom ne peut pas dépasser 100 caractères");
      }
    }

    if ("description" in data && data.description) {
      if (data.description.trim().length < 10) {
        throw new Error("La description doit contenir au moins 10 caractères");
      }
      if (data.description.length > 1000) {
        throw new Error("La description ne peut pas dépasser 1000 caractères");
      }
    }

    if ("tags" in data && data.tags) {
      if (data.tags.length > 10) {
        throw new Error("Un service ne peut pas avoir plus de 10 tags");
      }
      data.tags.forEach((tag) => {
        if (tag.length > 50) {
          throw new Error("Un tag ne peut pas dépasser 50 caractères");
        }
      });
    }
  }
}
