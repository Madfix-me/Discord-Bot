import {BaseEntity, Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Embed} from "./embed";
import {EmbedAuthorData} from "discord.js";

@Entity()
export class Author extends BaseEntity {
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

    public toAuthorData(): EmbedAuthorData {
        return {
            name: this.name!,
            iconURL: this.image,
            url: this.url
        };
    }
}
