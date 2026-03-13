import { UserDTO } from "./user-dto";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export class UserService {
    async createUser(data: UserDTO) {

        data.password = await bcrypt.hash(data.password, 10);

        return await prisma.user.create({ data: {
                name: data.name,
                email: data.email,
                password: data.password,
                isAdmin: data.isAdmin
            }
          });
    }

    async getUsers() {
        return await prisma.user.findMany();
    }
    
    async getUserById(id: string) {
        return await prisma.user.findUnique({ where: { id } });
    }
    
    async getUserByEmail(email: string) {  
        return await prisma.user.findUnique({ where: { email } });
    }

    async updateUser(id: string, user: Partial<UserDTO>) {
        if (user.password) {
            user.password = await bcrypt.hash(user.password, 10);
        }
        return await prisma.user.update({ where: { id }, data: user });
    }

    async deleteUser(id: string) {
        return await prisma.user.delete({ where: { id } });
    }
}