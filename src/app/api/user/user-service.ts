import { UserDTO } from "./user-dto";
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

export class UserService {
    private prisma: PrismaClient;
    
    constructor() {
        this.prisma = new PrismaClient({ adapter });
    }

    async createUser(data: UserDTO) {

        data.password = await bcrypt.hash(data.password, 10);

        return await this.prisma.user.create({ data: {
                name: data.name,
                email: data.email,
                password: data.password,
                isAdmin: data.isAdmin
            }
          });
    }

    async getUsers() {
        return await this.prisma.user.findMany();
    }
    
    async getUserById(id: string) {
        return await this.prisma.user.findUnique({ where: { id } });
    }
    
    async getUserByEmail(email: string) {  
        return await this.prisma.user.findUnique({ where: { email } });
    }

    async updateUser(id: string, user: Partial<UserDTO>) {
        if (user.password) {
            user.password = await bcrypt.hash(user.password, 10);
        }
        return await this.prisma.user.update({ where: { id }, data: user });
    }

    async deleteUser(id: string) {
        return await this.prisma.user.delete({ where: { id } });
    }
}