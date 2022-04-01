import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Author } from "./Author";
import { Title } from "./Title";

@Entity()
export class Embed {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    color?: string;

    @OneToOne(() => Author, author => author.embed)
    author?: Author

    @OneToOne(() => Title, title => title.embed)
    title?: Title
}
