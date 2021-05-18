import { Post } from "@root/entities/Post";
import { MyContext } from "@root/types";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class PostResolver {
	@Query(() => [Post])
	posts(@Ctx() { em }: MyContext): Promise<Post[]> {
		return em.find(Post, {});
	}

	@Mutation(() => Boolean)
	async deletePost(
		@Arg("id") id: number,
		@Ctx() { em }: MyContext
	): Promise<boolean> {
		await em.nativeDelete(Post, { id });
		return true;
	}
}
