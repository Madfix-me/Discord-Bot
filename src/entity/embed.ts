import {BaseEntity, Column, Entity, JoinTable, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Author} from "./author";
import {Rule} from "./rule";
import {HexColorString, MessageEmbed} from "discord.js";
import {Footer} from "./footer";

@Entity()
export class Embed extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    public id?: number;

    @Column({nullable: true, unique: true})
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
    @JoinTable()
    public footer?: Footer;


    @ManyToOne(() => Rule, rule => rule.content)
    public rule?: Rule;



}
