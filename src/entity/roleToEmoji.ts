import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Rule} from "./rule";

@Entity()
export class RoleToEmoji extends BaseEntity {
    @PrimaryGeneratedColumn()
    id?: number

    @Column()
    role?: string;

    @Column()
    emoji?: string;

    @ManyToOne(type => Rule, rule => rule.accept)
    rule?: Rule;

}
