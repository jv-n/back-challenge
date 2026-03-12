import { Task, TaskSchema } from "./task";
import { User, UserSchema } from "./user";
import { mockUsers, initialTasks } from "./mock";
import { UserInterface, TaskInterface } from "./mock";


export type { Task, User };
export { TaskSchema, UserSchema };

export { type TaskStatus, type TaskPriority} from "./mock";

export { mockUsers, initialTasks } 
export type { UserInterface, TaskInterface }