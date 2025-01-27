import { Role } from "../../constants";
import { prisma } from "../../services/db";

export interface ICreateTest {
  subjectId: number;
  classId: number;
}

export type TGetallSubjectsQuery = Partial<
ICreateTest & {
    page: number;
    perPage: number;
    role: Role;
  }
>;

class Test {
  async getOne(id: number) {
    return await prisma.test.findUnique({
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
    return await prisma.test.findMany({
      skip: page * perPage - perPage,
      take: perPage,
      where,
      // factor in filtering by date created and last modified. see: https://www.prisma.io/docs/orm/reference/prisma-client-reference#gte
    });
  }

  async createOne(data: ICreateTest) {
    return await prisma.test.create({ data });
  }

  async updateOne(data: Partial<ICreateTest> & { id: number }) {
    return prisma.test.update({
      where: {
        id: data.id,
      },
      data: { ...data },
    });
  }

  async deleteOne(id: number) {
    return await prisma.test.delete({
      where: { id },
    });
  }
}

export const test = new Test();
