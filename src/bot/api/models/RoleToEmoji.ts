import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Reaction } from "./Reaction";

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
