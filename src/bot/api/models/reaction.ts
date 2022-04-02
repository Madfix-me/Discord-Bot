import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { RoleToEmoji } from "./roleToEmoji";

@Entity()
export class Reaction extends BaseEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    channel?: number;

    @Column()
    mode?: String;

    @OneToMany(() => RoleToEmoji, rte => rte.reaction)
    reactions?: RoleToEmoji[];
}
