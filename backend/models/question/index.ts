import { Role } from "../../constants";
import { prisma } from "../../services/db";

export interface ICreateQuestion {
  text: string;
  subjectId: number;
  explanation: string;
  explanationImageUrl: string;
  options?: {
    id?: number;
    text: string;
    image_url: string;
    correct?: boolean;
  }[];
}

export type TGetallQuestionsQuery = Partial<
  ICreateQuestion & {
    page: number;
    perPage: number;
  }
>;

class Question {
  async getOne(id: number) {
    return await prisma.question.findUnique({
      where: { id },
      include: {
        options: {
          omit: { correct: true },
        },
      },
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
        return {
          ...acc,
          [key]:
            typeof value === "number" ? { equals: value } : { contains: value },
        };
      }
      return acc;
    }, {});
    return await prisma.question.findMany({
      skip: page * perPage - perPage,
      take: perPage,
      where,
      include: {
        options: {
          omit: { correct: true },
        },
      },
      // factor in filtering by date created and last modified. see: https://www.prisma.io/docs/orm/reference/prisma-client-reference#gte
    });
  }

  async createOne(data: ICreateQuestion) {
    console.dir({ data }, { depth: 3 });
    return await prisma.question.create({
      data: {
        text: data.text,
        explanation: data.explanation,
        explanationImageUrl: data.explanationImageUrl,
        options: {
          create: data.options,
        },
        Subject: {
          connect: {
            id: data.subjectId,
          },
        },
      },
    });
  }

  async updateOne(data: Partial<ICreateQuestion> & { id: number }) {
    return prisma.question.update({
      where: {
        id: data.id,
      },
      data: {
        ...data,
        options: data.options
          ? {
              update: data.options.map((option) => ({
                where: { id: option.id },
                data: option,
              })),
            }
          : undefined,
      },
    });
  }

  async deleteOne(id: number) {
    return await prisma.question.delete({
      where: { id },
    });
  }
}

export const question = new Question();
