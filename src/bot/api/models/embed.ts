import {BaseEntity, Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import { Author } from "./author";
import { Title } from "./title";
import {Footer} from "./footer";

@Entity()
export class Embed extends BaseEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    color?: string;

    @OneToOne(() => Author, author => author.embed)
    author?: Author;

    @OneToOne(() => Title, title => title.embed)
    title?: Title;

    @Column()
    message?: String;

    @OneToOne(() => Footer, footer => footer.embed)
    footer?: Footer;

}
