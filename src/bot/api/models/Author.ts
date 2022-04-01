import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Embed } from "./Embed";

@Entity()
export class Author {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    image?: string;

    @Column()
    name?: string;

    @Column()
    url?: string;

    @OneToOne(() => Embed, embed => embed.author)
    embed?: Embed
}
