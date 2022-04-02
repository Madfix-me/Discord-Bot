import {BaseEntity, Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import { Embed } from "./embed";

@Entity()
export class Title extends BaseEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    image?: string;

    @Column()
    name?: string;

    @Column()
    url?: string;

    @OneToOne(() => Embed, embed => embed.title)
    embed?: Embed
}
