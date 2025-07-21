import { Prisma, PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import bcryptjs from "bcryptjs";
import { signInSchema, signUpSchema } from "../utils/userTypes";
import { sign } from "hono/jwt";

export const userRouter = new Hono<{
    Bindings:{
        DATABASE_URL: string
        JWT_SECRET: string
    }
}>()

userRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const body = await c.req.json()
    const correctSignUpBody = signUpSchema.safeParse(body);
    if (!correctSignUpBody.success) {
        const errorMessage = correctSignUpBody.error.errors.map(err => err.message);
        c.status(400);
        return c.json({
            message: errorMessage
        })
    }

    try {
        const userExists = await prisma.user.findUnique({
            where:{
                email: body.email
            }
        })
        if (userExists) {
            c.status(400);
            return c.json({
                message: "User with this email already exists"
            })
        } else {
            const hashedPassword = bcryptjs.hashSync(body.password, 10);
            const user = await prisma.user.create({
                data:{
                    email: body.email,
                    name: body.name,
                    password: hashedPassword
                }
            })
            c.status(200);
            return c.json({
                message: "User created successfully",
                user: {
                    email: user.email,
                    name: user.name
                }
            })
        }
    } catch (e) {
        c.status(500);
        return c.json({
            message: "Internal server error"
        })
    }
})

userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const body = await c.req.json()
    const correctSignInBody = signInSchema.safeParse(body);
    if (!correctSignInBody.success) {
        const errorMessage = correctSignInBody.error.errors.map(err => err.message);
        c.status(400);
        return c.json({
            message: errorMessage
        })
    }
    try {
        const user = await prisma.user.findUnique({
            where:{
                email: body.email
            }
        })
        if (!user) {
            c.status(400);
            return c.json({
                message: "User not found"
            })
        } else {
            const isPasswordValid = bcryptjs.compareSync(body.password, user.password);
            if (!isPasswordValid) {
                c.status(400);
                return c.json({
                    message: "Invalid password"
                })
            } else {
                const token = await sign({
                    id: user.id
                }, c.env.JWT_SECRET)
                c.status(200);
                return c.json({
                    message: "User signed in successfully",
                    user: {
                        email: user.email,
                        name: user.name,
                        token: token
                    }
                })
            }
        }
    } catch (e) {
        c.status(500);
        return c.json({
            message: "Internal server error"
        })
    }
})