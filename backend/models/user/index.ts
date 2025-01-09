import { Role } from "../../constants";
import { prisma } from "../../services/db";

export interface ICreateUser {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  middle_name: string;
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
    });
  }

  async getAll(
    { page = 1, perPage = 10, ...restFilters }: TGetallUsersQuery = {
      page: 1,
      perPage: 10,
    }
  ) {
    console.log({ restFilters });
    const where = Object.entries(restFilters).reduce((acc, [key, value]) => {
      if (value) {
        return { ...acc, [key]: { contains: value } };
      }
      return acc;
    }, {});
    return await prisma.user.findMany({
      skip: page * perPage - perPage,
      take: perPage,
      where,
      // factor in filtering by date created and last modified. see: https://www.prisma.io/docs/orm/reference/prisma-client-reference#gte
    });
  }

  async getOneWithPassword(username: string) {
    return await prisma.user.findUnique({
      where: { username },
      omit: { password: false },
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
      data: { ...data },
    });
  }

  async deleteOne(id: number) {
    return await prisma.user.delete({
      where: { id },
    });
  }
}

export const user = new User();
