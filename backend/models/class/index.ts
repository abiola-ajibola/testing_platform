import { prisma } from "../../services/db";

export interface ICreateClass {
  name: string;
  description: string;
}

export type TGetallClassesQuery = Partial<
  ICreateClass & {
    page: number;
    perPage: number;
  }
>;

class Class {
  async getOne(id: number) {
    return await prisma.class.findUnique({
      where: { id },
    });
  }

  async getAll(
    { page = 1, perPage = 10, ...restFilters }: TGetallClassesQuery = {
      page: 1,
      perPage: 10,
    }
  ) {
    const where = Object.entries(restFilters).reduce((acc, [key, value]) => {
      if (value) {
        return { ...acc, [key]: { contains: value } };
      }
      return acc;
    }, {});
    const total = await prisma.class.count({ where });
    return {
      classes: await prisma.class.findMany({
        skip: page * perPage - perPage,
        take: perPage,
        where,
      }),
      total,
      perPage,
      currentPage: total > 0 ? page : 1,
    };
  }

  async createOne(data: ICreateClass) {
    return await prisma.class.create({ data });
  }

  async updateOne(data: Partial<ICreateClass> & { id: number }) {
    return prisma.class.update({
      where: {
        id: data.id,
      },
      data: { ...data },
    });
  }

  async deleteOne(id: number) {
    return await prisma.class.delete({
      where: { id },
    });
  }

  async getCount(restFilters?: ICreateClass) {
    const where = Object.entries(restFilters || {}).reduce(
      (acc, [key, value]) => {
        if (value) {
          return { ...acc, [key]: { contains: value } };
        }
        return acc;
      },
      {}
    );
    const total = await prisma.class.count({ where });
    return {
      count: total,
    };
  }
}

export const classModel = new Class();
