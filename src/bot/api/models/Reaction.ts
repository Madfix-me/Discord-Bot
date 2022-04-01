import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoleToEmoji } from "./RoleToEmoji";

@Entity()
export class Reaction {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    channel?: number;

    @Column()
    mode?: String;

    @OneToMany(() => RoleToEmoji, rte => rte.reaction)
    reactions?: RoleToEmoji[];
}
