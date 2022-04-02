import {BaseEntity, Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Embed} from "./embed";


@Entity()
export class Footer extends BaseEntity {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    image?: string;

    @Column()
    profile?: string;

    @Column()
    text?: string;

    @OneToOne(() => Embed, (embed) => embed.footer)
    embed?: Embed;
}
