import {Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Author} from "./author";
import {Title} from "./title";
import {Footer} from "./footer";
import {Rule} from "./rule";
import {HexColorString, MessageEmbed} from "discord.js";

@Entity()
export class Embed {
    @PrimaryGeneratedColumn("increment")
    public id?: number;

    @Column({nullable: true})
    public discordId?: string;

    @Column()
    public color?: HexColorString;

    @OneToOne(() => Author, author => author.embed, {cascade: true, onUpdate: "CASCADE"})
    public author?: Author;

    @Column()
    public title: string = "";

    @Column()
    public message: string = "";

    @OneToOne(() => Footer, footer => footer.embed, {cascade: true, onUpdate: "CASCADE"})
    public footer?: Footer;


    @ManyToOne(() => Rule, rule => rule.content)
    public rule?: Rule;



}
