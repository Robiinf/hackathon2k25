import { Service, IService, ServiceType } from "../models/Service";

export class ServiceRepository {
  async create(serviceData: Partial<IService>): Promise<IService> {
    const service = new Service(serviceData);
    return await service.save();
  }

  async findAll(): Promise<IService[]> {
    return await Service.find().sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<IService | null> {
    return await Service.findById(id);
  }

  async findByType(type: ServiceType): Promise<IService[]> {
    return await Service.find({ type }).sort({ createdAt: -1 });
  }

  async findByTags(tags: string[]): Promise<IService[]> {
    return await Service.find({ tags: { $in: tags } }).sort({ createdAt: -1 });
  }

  async findByTagsWithMatchPercentage(
    searchTags: string[]
  ): Promise<Array<any>> {
    const services = await Service.find({ tags: { $in: searchTags } }).sort({
      createdAt: -1,
    });

    return services.map((service) => {
      const matchingTags = service.tags.filter((tag) =>
        searchTags.some(
          (searchTag) => searchTag.toLowerCase() === tag.toLowerCase()
        )
      );
      const matchPercentage = Math.round(
        (matchingTags.length / searchTags.length) * 100
      );

      // Calculer la moyenne des notes
      const averageNote =
        service.note.length > 0
          ? Number(
              (
                service.note.reduce(
                  (acc: number, note: number) => acc + note,
                  0
                ) / service.note.length
              ).toFixed(2)
            )
          : null;

      const serviceObject = service.toObject();
      // Extraire toutes les propriétés sauf note
      const { note, ...serviceWithoutNote } = serviceObject;

      return {
        ...serviceWithoutNote,
        matchPercentage: `${matchPercentage}%`,
        averageNote: averageNote,
      };
    });
  }

  async update(
    id: string,
    updateData: Partial<IService>
  ): Promise<IService | null> {
    return await Service.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string): Promise<IService | null> {
    return await Service.findByIdAndDelete(id);
  }

  async search(query: string): Promise<IService[]> {
    const searchRegex = new RegExp(query, "i");
    return await Service.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { tags: { $in: [searchRegex] } },
      ],
    }).sort({ createdAt: -1 });
  }

  async addNote(id: string, note: number): Promise<IService | null> {
    if (note < 0 || note > 5) {
      throw new Error("La note doit être comprise entre 0 et 5");
    }

    return await Service.findByIdAndUpdate(
      id,
      { $push: { note: note } },
      { new: true, runValidators: true }
    );
  }

  async getAverageNote(id: string): Promise<number | null> {
    const service = await Service.findById(id);
    if (!service || service.note.length === 0) {
      return null;
    }

    const sum = service.note.reduce(
      (acc: number, note: number) => acc + note,
      0
    );
    return Number((sum / service.note.length).toFixed(2));
  }

  async getAllUniqueTags(): Promise<{ IA: string[]; human: string[] }> {
    const services = await Service.find({}, { tags: 1, type: 1 });

    const iaTags: string[] = [];
    const humanTags: string[] = [];

    services.forEach((service) => {
      if (service.type === ServiceType.PROVIDER) {
        humanTags.push(...service.tags);
      } else {
        iaTags.push(...service.tags);
      }
    });

    return {
      IA: [...new Set(iaTags)].sort(),
      human: [...new Set(humanTags)].sort(),
    };
  }
}
