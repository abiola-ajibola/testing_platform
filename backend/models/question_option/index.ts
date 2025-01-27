import { Role } from "../../constants";
import { prisma } from "../../services/db";

export interface ICreateQuestionOption {
  text: string;
  image_url: string;
  questionId: number;
}

export type TGetallQuestionOptionsQuery = Partial<
ICreateQuestionOption & {
    page: number;
    perPage: number;
    role: Role;
  }
>;

class QuestionOption {
  async getOne(id: number) {
    return await prisma.question_Option.findUnique({
      where: { id },
    });
  }

  async getAll(
    { page = 1, perPage = 10, ...restFilters }: TGetallQuestionOptionsQuery = {
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
    return await prisma.question_Option.findMany({
      skip: page * perPage - perPage,
      take: perPage,
      where,
      // factor in filtering by date created and last modified. see: https://www.prisma.io/docs/orm/reference/prisma-client-reference#gte
    });
  }

  async createOne(data: ICreateQuestionOption) {
    return await prisma.question_Option.create({ data });
  }

  async updateOne(data: Partial<ICreateQuestionOption> & { id: number }) {
    return prisma.question_Option.update({
      where: {
        id: data.id,
      },
      data: { ...data },
    });
  }

  async deleteOne(id: number) {
    return await prisma.question_Option.delete({
      where: { id },
    });
  }
}

export const questionOption = new QuestionOption();
