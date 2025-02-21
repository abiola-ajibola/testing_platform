import { Role } from "../../constants";
import { prisma } from "../../services/db";

export interface ICreateUser {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  _classes?: number[];
}

export type TGetallUsersQuery = Partial<
  Omit<ICreateUser, "password"> & {
    page: number;
    perPage: number;
    role: Role;
  }
>;

class User {
  async getOne(id: number) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        classes: true,
      },
    });
  }

  async getByUsername(username: string) {
    return await prisma.user.findUnique({
      where: { username },
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
    const total = await prisma.user.count({ where });
    return {
      users: await prisma.user.findMany({
        skip: page * perPage - perPage,
        take: perPage,
        where,
        include: {
          classes: true,
        },
        // factor in filtering by date created and last modified. see: https://www.prisma.io/docs/orm/reference/prisma-client-reference#gte
      }),
      total,
      perPage,
      currentPage: total > 0 ? page : 1,
    };
  }

  async getOneWithPassword(username: string) {
    return await prisma.user.findUnique({
      where: { username },
      omit: { password: false },
      include: {
        classes: true,
      },
    });
  }

  async createOne(data: ICreateUser) {
    return await prisma.user.create({ data: { ...data, role: Role.STUDENT } });
  }

  async updateOne(data: Partial<ICreateUser> & { id: number }) {
    return prisma.user.update({
      where: {
        id: data.id,
      },
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        middle_name: data.middle_name,
        username: data.username,
        password: data.password,
        classes: {
          connect: data._classes?.map((id) => ({ id })),
        },
      },
    });
  }

  async deleteOne(id: number) {
    return await prisma.user.delete({
      where: { id },
    });
  }

  async getCount(restFilters?: ICreateUser) {
    const where = Object.entries(restFilters || {}).reduce(
      (acc, [key, value]) => {
        if (value) {
          return { ...acc, [key]: { contains: value } };
        }
        return acc;
      },
      {}
    );
    const total = await prisma.user.count({ where });
    return {
      count: total,
    };
  }
}

export const user = new User();
