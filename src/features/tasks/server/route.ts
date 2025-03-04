import { sessionMiddleware } from "@/features/auth/middleware/sessionMiddleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createTaskSchema } from "../schema";
import { getMember } from "@/features/members/utils";
import { DATABASE_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { TaskStatus } from "../types";
import { createAdminClient } from "@/lib/appwrite/appwrite";
import { ProjectTypes } from "@/features/projects/types";

const app = new Hono()
    .get(
        "/",
        sessionMiddleware,
        zValidator(
            "query",
            z.object({
                workspaceId: z.string(),
                projectId: z.string().nullish(),
                assigneedId: z.string().nullish(),
                status: z.nativeEnum(TaskStatus).nullish(),
                search: z.string().nullish(),
                dueData: z.string().nullish(),
            }),
        ),
        async (c) => {
            const { users } = await createAdminClient();
            const databases = c.get("databases");
            const user = c.get("user");

            const {
                workspaceId,
                projectId,
                status,
                search,
                assigneedId,
                dueData,
            } = c.req.valid("query")

            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id
            });

            if (!member) {
                return c.json({ error: "Unauthorized" }, 401)
            }

            const query = [
                Query.equal("workspaceId", workspaceId),
                Query.orderDesc("$createdAt")
            ]

            if (projectId) {
                console.log("ProjectId: ", projectId);
                query.push(Query.equal("projectId", projectId))
            }

            if (status) {
                console.log("status: ", status);
                query.push(Query.equal("status", status))
            }

            if (assigneedId) {
                console.log("assigneedId: ", assigneedId);
                query.push(Query.equal("assigneedId", assigneedId))
            }

            if (dueData) {
                console.log("dueData: ", dueData);
                query.push(Query.equal("dueData", dueData))
            }

            if (search) {
                console.log("search: ", search);
                query.push(Query.search("search", search))
            }

            const tasks = await databases.listDocuments(
                DATABASE_ID,
                TASKS_ID,
                query,
            );

            const projectIds = tasks.documents.map((task) => task.projectId);
            const assigneedIds = tasks.documents.map((task) => task.assigneedId);

            const projects = await databases.listDocuments<ProjectTypes>(
                DATABASE_ID,
                PROJECTS_ID,
                projectIds.length > 0 ? [Query.contains("$id", projectIds)] : [],
            )

            const members = await databases.listDocuments(
                DATABASE_ID,
                PROJECTS_ID,
                assigneedIds.length > 0 ? [Query.contains("$id", assigneedIds)] : [],
            )

            const assignees = await Promise.all(
                members.documents.map(async (member) => {
                    const user = await users.get(member.userId)

                    return {
                        ...member,
                        name: user.name,
                        email: user.email,
                    }
                })
            )

            const populatedTasks = tasks.documents.map((task) => {
                const project = projects.documents.find(
                    (project) => project.$id === task.projectId
                )

                const assignee = assignees.find(
                    (assignee) => assignee.$id === task.assigneedId
                )

                return {
                    ...task,
                    project,
                    assignee,
                }
            });

            return c.json({
                data: {
                    ...tasks,
                    documents: populatedTasks,
                }
            });
        }
    )
    .post(
        "/",
        sessionMiddleware,
        zValidator("json", createTaskSchema),
        async (c) => {
            const user = c.get("user");
            const databases = c.get("databases");
            const {
                name,
                status,
                workspaceId,
                projectId,
                dueData,
                assigneedId                
            } = c.req.valid("json")

            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id
            })

            if (!member) {
                return c.json({ error: "Unauthorized" }, 401)
            }

            const highestPositionTask = await databases.listDocuments(
                DATABASE_ID,
                TASKS_ID,
                [
                    Query.equal("status", status),
                    Query.equal("workspaceId", workspaceId),
                    Query.orderAsc("position"),
                    Query.limit(1),
                ]
            )

            const newPosition = 
                highestPositionTask.documents.length > 0
                ? highestPositionTask.documents[0].position + 1000
                : 1000;

            const task = await databases.createDocument(
                DATABASE_ID,
                TASKS_ID,
                ID.unique(),
                {
                    name,
                    status,
                    workspaceId,
                    projectId,
                    dueData,
                    assigneedId,
                    position: newPosition,
                }
            );

            return c.json({ data: task })

        }

    )

export default app;