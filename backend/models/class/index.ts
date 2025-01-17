import { Role } from "../../constants";
import { prisma } from "../../services/db";

export interface ICreateClass {
  name: string;
  description: string;
}

export type TGetallUsersQuery = Partial<
  ICreateClass & {
    page: number;
    perPage: number;
    role: Role;
  }
>;

class Class {
  async getOne(id: number) {
    return await prisma.class.findUnique({
      where: { id },
    });
  }

  async getAll(
    { page = 1, perPage = 10, ...restFilters }: TGetallUsersQuery = {
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
    return await prisma.class.findMany({
      skip: page * perPage - perPage,
      take: perPage,
      where,
      // factor in filtering by date created and last modified. see: https://www.prisma.io/docs/orm/reference/prisma-client-reference#gte
    });
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
}

export const classModel = new Class();
