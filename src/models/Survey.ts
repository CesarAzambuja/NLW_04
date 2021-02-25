import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from 'uuid'

@Entity("surveys")
class Survey{

    @PrimaryColumn()
    readonly id_surveys: string;

   @Column()
   title: string;

   @Column()
   description: string;

   @CreateDateColumn()
   created_at: Date;

   constructor(){
       if(!this.id_surveys) {
           this.id_surveys = uuid();
       }
   }
 }

 export { Survey }