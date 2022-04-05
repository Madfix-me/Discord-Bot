import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Rule} from "./rule";

@Entity()
export class RoleToEmoji {
    @PrimaryGeneratedColumn()
    id?: number

    @Column({type: "bigint"})
    role?: number;

    @Column()
    emoji?: string;

    @ManyToOne(type => Rule, rule => rule.accept)
    rule?: Rule;

}
