import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Reaction } from "./reaction";

@Entity()
export class RoleToEmoji {
    @PrimaryGeneratedColumn()
    id?: number

    @Column()
    role?: number;

    @Column()
    emoji?: string;

    @ManyToOne(() => Reaction, reaction => reaction.reactions)
    reaction?: Reaction;
}
