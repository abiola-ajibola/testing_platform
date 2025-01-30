import { Role } from "../../constants";
import { prisma } from "../../services/db";

export interface ICreateSubject {
  name: string;
  classId: number;
  description: string;
}

export type TGetallSubjectsQuery = Partial<
ICreateSubject & {
    page: number;
    perPage: number;
    role: Role;
  }
>;

class Subject {
  async getOne(id: number) {
    return await prisma.subject.findUnique({
      where: { id },
    });
  }

  async getAll(
    { page = 1, perPage = 10, ...restFilters }: TGetallSubjectsQuery = {
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
    return await prisma.subject.findMany({
      skip: page * perPage - perPage,
      take: perPage,
      where,
      // factor in filtering by date created and last modified. see: https://www.prisma.io/docs/orm/reference/prisma-client-reference#gte
    });
  }

  async createOne(data: ICreateSubject) {
    return await prisma.subject.create({ data });
  }

  async updateOne(data: Partial<ICreateSubject> & { id: number }) {
    return prisma.subject.update({
      where: {
        id: data.id,
      },
      data: { ...data },
    });
  }

  async deleteOne(id: number) {
    return await prisma.subject.delete({
      where: { id },
    });
  }

  async getCount(restFilters?: ICreateSubject) {
    const where = Object.entries(restFilters || {}).reduce(
      (acc, [key, value]) => {
        if (value) {
          return { ...acc, [key]: { contains: value } };
        }
        return acc;
      },
      {}
    );
    const total = await prisma.subject.count({ where });
    return {
      count: total,
    };
  }
}

export const subject = new Subject();
