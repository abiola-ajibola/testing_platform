import { prisma } from "../../services/db";

enum Role {
  STUDENT = "STUDENT",
  ADMIN = "ADMIN",
}

export interface ICreateUser {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  middle_name: string;
}

class User {
  async getOne(username: string) {
    return await prisma.user.findUnique({
      where: { username },
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

  async updateOne(
    data: Partial<ICreateUser> & { username: string }
  ) {
    return prisma.user.update({
      where: {
        username: data.username,
      },
      data: { ...data },
    });
  }
}

export const user = new User();
