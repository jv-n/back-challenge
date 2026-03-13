import { UserService } from "./user-service";
import { UserDTO } from "./user-dto";

class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async createUser(data: UserDTO) {
        return await this.userService.createUser(data);
    }

    async getUsers() {
        return await this.userService.getUsers();
    }
    
    async getUserById(id: string) {
        return await this.userService.getUserById(id);
    }
    
    async getUserByEmail(email: string) {
        return await this.userService.getUserByEmail(email);
    }

    async updateUser(id: string, user: Partial<UserDTO>) {
        return await this.userService.updateUser(id, user);
    }

    async deleteUser(id: string) {
        return await this.userService.deleteUser(id);
    }
}

export default UserController;