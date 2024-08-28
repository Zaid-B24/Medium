import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { createPostInput, updatePostInput } from "@zaid_24/medium-common";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  },
  Variables: {
    userId: string;
  }
}>();

blogRouter.use("/*", async (c, next) => {
  const authHeader = c.req.header("Authorization") || "";
  const token = authHeader.split(" ")[1];
  if (!authHeader) {
    c.status(401);
    return c.json({ error: "Unauthorized, no token provided" });
  }

  try {
    const user = await verify(token, c.env.JWT_SECRET);

    if (user) {
      c.set("userId", user.id as string);
      await next();
    } else {
      c.status(403);
      return c.json({ error: "Forbidden, invalid token" });
    }
  } catch (error) {
    console.error("Authentication Error:", error);
    c.status(500);
    return c.json({ error: "Internal Server Error" });
  }
});

blogRouter.post("/", async (c) => {
  const body = await c.req.json();
  const { success } = createPostInput.safeParse(body);

  if (!success) {
    c.status(400);
    return c.json({ error: "Invalid input data" });
  }

  const userId = c.get("userId");

  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId,
      },
    });

    return c.json({ id: post.id });
  } catch (error) {
    console.error("Create Post Error:", error);
    c.status(500);
    return c.json({ error: "Failed to create post" });
  }
});

blogRouter.put("/", async (c) => {
  const body = await c.req.json();
  const { success } = updatePostInput.safeParse(body);

  if (!success) {
    c.status(400);
    return c.json({ error: "Invalid input data" });
  }

  const userId = c.get("userId");

  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    await prisma.post.update({
      where: {
        id: body.id,
        authorId: userId,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });

    return c.text("Post updated successfully");
  } catch (error) {
    console.error("Update Post Error:", error);
    c.status(500);
    return c.json({ error: "Failed to update post" });
  }
});

blogRouter.get("/bulk", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    const posts = await prisma.post.findMany({
      select: {
        content:true,
        title:true,
        id:true,
        author:{
          select:{
            name:true
          }
        }
      }
    });
    return c.json({blogs:posts});
  } catch (error) {
    console.error("Fetch Posts Error:", error);
    c.status(500);
    return c.json({ error: "Failed to fetch posts" });
  }
});

blogRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    const post = await prisma.post.findFirst({
      where: {
        id: id,
      },
      select:{
        id:true,
        title:true,
        content:true,
      author:{
        select:{
          name:true
        }
      }
      }
    });

    if (!post) {
      c.status(404);
      return c.json({ error: "Post not found" });
    }

    return c.json(post);
  } catch (error) {
    console.error("Fetch Post Error:", error);
    c.status(500);
    return c.json({ error: "Failed to fetch post" });
  }
});
