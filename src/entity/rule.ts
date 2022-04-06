import {BaseEntity, Column, Entity, JoinTable, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Embed} from "./embed";
import {RoleToEmoji} from "./roleToEmoji";
import {jsonMember, jsonObject} from "typedjson";


@Entity()
export class Rule extends BaseEntity {

    @PrimaryGeneratedColumn()
    id?: number;


    @Column()
    hash?: string;


    @Column()
    path?: string;


    @Column()
    channel?: string;


    @OneToMany(() => Embed, object => object.rule, {cascade: true, onUpdate: "CASCADE"})
    @JoinTable()
    content?: Embed[];


    @OneToMany(() => RoleToEmoji, object => object.rule,{cascade: true, onUpdate: "CASCADE"})
    @JoinTable()
    accept?: RoleToEmoji[] ;
}

