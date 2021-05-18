import { Account } from "@root/entities/Account";
import {
    MyContext,
    QueryOptions,
    Response,
    PaginatedResponse,
} from "@root/types";
import {
    Arg,
    Ctx,
    Field,
    InputType,
    Mutation,
    ObjectType,
    Query,
    Resolver,
} from "type-graphql";
import { generate as generateRandomPassword } from "generate-password";
import { Driver } from "@root/entities/Driver";
import sendMail from "@root/utils/mail";
import { Role } from "@root/entities/Role";
import argon2 from "argon2";
import { User } from "@root/entities/User";
import { JWT_SECRET, SESSION_NAME } from "@root/config";
import { sign } from "jsonwebtoken";
import { Manager } from "@root/entities/Manager";
import queryBuilder from "@root/utils/queryBuilder";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { deleteImage, getImage, saveImage } from "@root/utils/imageHandler";

@InputType()
class DriverAccountCreateInput {
    @Field()
    email: string;

    @Field()
    driverId: number;

    @Field(() => GraphQLUpload, { nullable: true })
    avatar?: Promise<FileUpload>;
}

@InputType()
class ManagerAccountCreateInput {
    @Field()
    email: string;

    @Field()
    managerId: number;

    @Field()
    password: string;

    @Field(() => GraphQLUpload, { nullable: true })
    avatar?: Promise<FileUpload>;
}

@InputType()
class RootAccountCreateInput {
    @Field()
    email: string;

    @Field()
    password: string;
}

@InputType()
class AccountLoginInput {
    @Field()
    email: string;

    @Field()
    password: string;
}

@InputType()
class AccountDeleteInput {
    @Field()
    id: number;
}

// @ts-ignore
@ObjectType()
// @ts-ignore
class AccountResponse extends Response(Account) {
    @Field({ nullable: true })
    accessToken?: string;
}

// @ts-ignore
@ObjectType()
// @ts-ignore
class AccountTableResponse extends PaginatedResponse(Account) {}

@Resolver()
export class AccountResolver {
    @Query(() => AccountTableResponse)
    async getAccounts(
        @Arg("inputs", { nullable: true }) options: QueryOptions,
        @Ctx() { em }: MyContext
    ) {
        const { filterBy, sortBy, numPage, perPage } = queryBuilder(options);
        const list_data = await em.find(Account, filterBy, {
            // populate: relationPaths,
            limit: perPage,
            offset: perPage * (numPage - 1),
            orderBy: sortBy,
        });
        const total = await em.count(Account);
        return {
            result: {
                list_data,
                total,
                numPage,
                perPage,
            },
        };
    }

    @Query(() => AccountResponse)
    async me(@Ctx() { req, em }: MyContext) {
        // JSON Web Token approach
        if (req.user) {
            const data = await em.findOne(Account, {
                id: req.user.userId,
            });
            return {
                result: data,
            };
        }

        // Session approach
        if (!req.session.userId) {
            return {
                errors: [
                    {
                        message: "Không tìm thấy session",
                    },
                ],
            };
        }
        const account = await em.findOne(Account, { id: req.session.userId });
        return {
            result: account,
        };
    }

    @Mutation(() => AccountResponse)
    async createRootAccount(
        @Arg("inputs") inputs: RootAccountCreateInput,
        @Ctx() { em }: MyContext
    ) {
        const accountCount = await em.count(Account);
        if (accountCount)
            return {
                errors: [
                    {
                        message: "Đã tồn tại tài khoản trong hệ thống",
                    },
                ],
            };
        const password = await argon2.hash(inputs.password);

        const account = new Account();
        for (const [key, value] of Object.entries(inputs)) {
            (account as any)[key] = value;
        }
        account.password = password;
        account.root = true;
        account.verify = true;
        await em.persistAndFlush(account);
        return {
            result: account,
            message: "Tạo tài khoản root thành công",
        };
    }

    @Mutation(() => AccountResponse)
    async createManagerAccount(
        @Arg("inputs") inputs: ManagerAccountCreateInput,
        @Ctx() { em }: MyContext
    ) {
        const accountCount = await em.count(Account);
        if (!accountCount)
            return {
                errors: [
                    {
                        message: "Chưa tạo tài khoản root cho hệ thống",
                    },
                ],
            };
        const { email, managerId, password: passwordInput, avatar } = inputs;

        const manager = await em.findOne(Manager, {
            id: managerId,
        });
        if (!manager) {
            return {
                errors: [
                    {
                        message: "Không tồn tại quản lý này",
                    },
                ],
            };
        }


        const password = await argon2.hash(passwordInput);

        let role = await em.findOne(Role, { name: "manager" });
        if (!role) {
            role = new Role();
            role.name = "manager";
        }
        let account = new Account();
        account.email = email;
        account.manager = manager;
        account.password = password;
        account.verify = false;
        account.roles.add(role);
		try {
			if(avatar) {

				const avatarPath = await saveImage(avatar);
				account.avatar = avatarPath;
			}
		}
		catch(error) {
			return {
				errors: [
					{
						message: error.message,
					}
				]
			}
		}
        em.persist(account);
        try {
            await em.flush();
        } catch (error) {
            await deleteImage(account.avatar)
            return {
                errors: [
                    {
                        message: "Có lỗi trong quá trình lưu vào cơ sở dữ liệu",
                    },
                ],
            };
        }
        return {
            result: account
        };
    }

    @Mutation(() => AccountResponse)
    async createDriverAccount(
        @Arg("inputs") inputs: DriverAccountCreateInput,
        @Ctx() { em }: MyContext
    ) {
        const accountCount = await em.count(Account);
        if (!accountCount)
            return {
                errors: [
                    {
                        message: "Chưa tạo tài khoản root cho hệ thống",
                    },
                ],
            };
        const { email, driverId, avatar } = inputs;

        const driver = await em.findOne(Driver, {
            id: driverId,
        });
        if (!driver) {
            return {
                errors: [
                    {
                        message: "Không tồn tại tài xế này",
                    },
                ],
            };
        }

        let password = generateRandomPassword();
        try {
            await sendMail({
                from: "Mandevices",
                to: email,
                subject: "Password generated",
                text: `Your password is ${password}`,
            });
        } catch (error) {
            return {
                errors: [
                    {
                        message: "Có lỗi trong quá trình gửi mail",
                    },
                ],
            };
        }

        password = await argon2.hash(password);

        let role = await em.findOne(Role, { name: "driver" });
        if (!role) {
            role = new Role();
            role.name = "driver";
        }
        let account = new Account();
        account.email = email;
        account.driver = driver;
        account.password = password;
        account.verify = false;
        account.roles.add(role);
		try {
			if(avatar) {
				const avatarPath = await saveImage(avatar);
				account.avatar = avatarPath;
			}
		}
		catch(error) {
			return {
				errors: [
					{
						message: error.message,
					}
				]
			}
		}

        em.persist(account);
        try {
            await em.flush();
        } catch (error) {
            await deleteImage(account.avatar)
            return {
                errors: [
                    {
                        message: "Có lỗi trong quá trình lưu vào cơ sở dữ liệu",
                    },
                ],
            };
        }
        // USE CASE: Khi gửi mail thành công nhưng lưu db thất bại
        return {
            result: account
        };
    }

    @Mutation(() => AccountResponse)
    async logout(@Ctx() { res, req }: MyContext) {
        try {
            await new Promise<void>((resolve, reject) => {
                req.session.destroy((error) => {
                    if (error) {
                        reject(error);
                    }
                    res.clearCookie(SESSION_NAME);
                    resolve();
                });
            });
            return {
                message: "Logout thành công",
            };
        } catch (error) {
            return {
                errors: [
                    {
                        message: error,
                    },
                ],
            };
        }
    }

    @Mutation(() => AccountResponse)
    async login(
        @Arg("inputs") inputs: AccountLoginInput,
        @Ctx() { em, req }: MyContext
    ) {
        const user = await em.findOne(Account, { email: inputs.email });
        if (!user) {
            return {
                errors: [
                    { field: "email", message: "Tài khoản không tồn tại" },
                ],
            };
        }

        const isValid = await argon2.verify(user.password, inputs.password);

        if (!isValid) {
            return {
                errors: [
                    { field: "password", message: "Mật khẩu không chính xác" },
                ],
            };
        }

        req.session.userId = user.id;
        const accessToken = sign({ userId: user.id }, JWT_SECRET);

        return {
            accessToken: accessToken,
            message: "Login thành công",
        };
    } // USE CASE: Khi gửi mail thành công nhưng lưu db thất bại

    @Mutation(() => AccountResponse)
    async deleteAccount(
        @Ctx() { em }: MyContext,
        @Arg("inputs") inputs: AccountDeleteInput
    ) {
        const account = await em.findOne(Account, { id: inputs.id });
        if (account) {
            await deleteImage(account.avatar)
            em.remove(account);
            await em.flush();
        } else {
            return {
                errors: {
                    message: "Không tìm thấy tài khoản",
                    field: "id",
                },
            };
        }
        return {
            message: "Đã xoá tài khoản thành công",
        };
    }
}
