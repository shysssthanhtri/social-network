import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsUUID, MinLength } from 'class-validator';

@InputType()
export class CreatePostInputType {
    @Field()
    @MinLength(5)
    @IsString()
    content: string;

    @Field()
    @IsUUID()
    authorId: string;
}
