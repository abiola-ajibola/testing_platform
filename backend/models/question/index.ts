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
    id: number;
    ids: number[];
    omitCorrect: boolean;
    page: number;
    perPage: number;
  }
>;

class Question {
  async getOne(id: number, omitCorrect = true) {
    return await prisma.question.findUnique({
      where: { id },
      include: {
        options: {
          omit: { correct: omitCorrect },
        },
        subject: true,
      },
    });
  }

  async getMany(
    { page = 1, perPage = 10, omitCorrect = true, ...restFilters }: TGetallQuestionsQuery = {
      page: 1,
      perPage: 10,
      omitCorrect: true,
    }
  ) {
    const where = Object.entries(restFilters).reduce((acc, [key, value]) => {
      if (value) {
        if (key === "ids") {
          return { ...acc, id: { in: value } };
        }
        return {
          ...acc,
          [key]:
            typeof value === "number" ? { equals: value } : { contains: value },
        };
      }
      return acc;
    }, {});
    const total = await prisma.question.count({ where });
    return {
      questions: await prisma.question.findMany({
        skip: page * perPage - perPage,
        take: perPage,
        where,
        include: {
          options: {
            omit: { correct: omitCorrect },
          },
          subject: true,
        },
        // factor in filtering by date created and last modified. see: https://www.prisma.io/docs/orm/reference/prisma-client-reference#gte
      }),
      total,
      perPage,
      currentPage: total > 0 ? page : 1,
    };
  }

  async getBySubjectId(
    { page = 1, perPage = 10, subjectId }: TGetallQuestionsQuery = {
      page: 1,
      perPage: 10,
    }
  ) {
    const total = await prisma.question.count({ where: { subjectId } });
    return {
      questions: await prisma.question.findMany({
        skip: page * perPage - perPage,
        take: perPage,
        where: { subjectId },
        include: {
          options: {
            omit: { correct: true },
          },
          // subject: true,
        },
      }),
      total,
      perPage,
      currentPage: total > 0 ? page : 1,
    };
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
        subject: {
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
                data: {
                  correct: option.correct,
                  text: option.text,
                  image_url: option.image_url,
                },
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

  async getCount(restFilters?: ICreateQuestion) {
    const where = Object.entries(restFilters || {}).reduce(
      (acc, [key, value]) => {
        if (value) {
          return { ...acc, [key]: { contains: value } };
        }
        return acc;
      },
      {}
    );
    const total = await prisma.question.count({ where });
    return {
      count: total,
    };
  }
}

export const question = new Question();
