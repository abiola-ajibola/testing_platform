import { Role } from "../../constants";
import { prisma } from "../../services/db";

export interface ICreateQuestion {
  subjectId: number;
  correctOptionId: number;
  explanation: string;
  explanationImageUrl: string;
}

export type TGetallQuestionsQuery = Partial<
  ICreateQuestion & {
    page: number;
    perPage: number;
    role: Role;
  }
>;

class Question {
  async getOne(id: number) {
    return await prisma.question.findUnique({
      where: { id },
    });
  }

  async getAll(
    { page = 1, perPage = 10, ...restFilters }: TGetallQuestionsQuery = {
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
    return await prisma.question.findMany({
      skip: page * perPage - perPage,
      take: perPage,
      where,
      // factor in filtering by date created and last modified. see: https://www.prisma.io/docs/orm/reference/prisma-client-reference#gte
    });
  }

  async createOne(data: ICreateQuestion) {
    return await prisma.question.create({ data });
  }

  async updateOne(data: Partial<ICreateQuestion> & { id: number }) {
    return prisma.question.update({
      where: {
        id: data.id,
      },
      data: { ...data },
    });
  }

  async deleteOne(id: number) {
    return await prisma.question.delete({
      where: { id },
    });
  }
}

export const question = new Question();
