import { hashSync } from "bcrypt";
import { ICreateUser, user } from "../models/user";
import { Role } from "../constants";

const defaultPassword = "/2*pMuy1]U2.";
const defaultHash = hashSync(defaultPassword, 10);

const defaultUser: ICreateUser = {
  username: "admin",
  password: defaultHash,
  first_name: "Default",
  last_name: "User",
  middle_name: "",
  role: Role.ADMIN,
};

console.dir({ t: typeof Role, defaultUser }, { dept: 3 });

async function seedUser(userData: ICreateUser) {
  try {
    await user.createOne(userData);
    console.log("Default user created successfully");
  } catch (e) {
    console.log(e);
  }
}

seedUser(defaultUser);
