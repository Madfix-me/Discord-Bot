import {BaseEntity, Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Embed} from "./embed";
import {EmbedFooterData} from "discord.js";


@Entity()
export class Footer extends BaseEntity {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    image?: string;

    @Column()
    text?: string;

    @OneToOne(() => Embed, (embed) => embed.footer)
    embed?: Embed;

    public toEmbed(): EmbedFooterData | null {
        return {
            iconURL: this.image,
            text: this.text!
        };
    }
}
