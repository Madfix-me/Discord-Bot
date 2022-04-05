import {Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Embed} from "./embed";
import {RoleToEmoji} from "./roleToEmoji";
import {jsonMember, jsonObject} from "typedjson";


@Entity()
export class Rule {

    @PrimaryGeneratedColumn()
    id?: number;


    @Column()
    hash?: string;


    @Column()
    path?: string;


    @Column()
    channel?: string;


    @OneToMany(type => Embed, object => object.rule, {cascade: true, onUpdate: "CASCADE"})
    content?: Embed[];


    @OneToMany(type => RoleToEmoji, object => object.rule,{cascade: true, onUpdate: "CASCADE"})
    accept?: RoleToEmoji[] ;
}

