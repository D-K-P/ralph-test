import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import { z } from "zod";

// Define the expected webhook payload structure
const WebhookPayloadSchema = z.object({
  event: z.string(),
  data: z.object({
    userId: z.string(),
    email: z.string().email(),
    action: z.enum(["user.created", "user.updated", "user.deleted"]),
    timestamp: z.string(),
    metadata: z.record(z.any()).optional(),
  }),
});

type WebhookPayload = z.infer<typeof WebhookPayloadSchema>;

// Sample job: Process incoming webhooks from external services
export const processWebhookJob = client.defineJob({
  id: "process-webhook-job",
  name: "Process Incoming Webhook",
  version: "1.0.0",
  // Trigger on custom events (typically sent via API)
  trigger: eventTrigger({
    name: "webhook.received",
  }),
  run: async (payload: WebhookPayload, io, ctx) => {
    try {
      // Log the webhook reception
      await io.logger.info("Processing incoming webhook", {
        event: payload.event,
        action: payload.data.action,
        userId: payload.data.userId,
        timestamp: new Date().toISOString(),
        runId: ctx.run.id,
      });

      // Validate the payload structure
      const validatedPayload = await io.runTask("validate-payload", async () => {
        try {
          return WebhookPayloadSchema.parse(payload);
        } catch (error) {
          throw new Error(`Invalid webhook payload: ${error instanceof Error ? error.message : "Unknown validation error"}`);
        }
      });

      // Process different types of webhook actions
      let processResult;

      switch (validatedPayload.data.action) {
        case "user.created":
          processResult = await io.runTask("handle-user-created", async () => {
            await io.logger.info("Processing user creation event", {
              userId: validatedPayload.data.userId,
              email: validatedPayload.data.email,
            });

            // Simulate user onboarding tasks
            const tasks = [
              "create-user-profile",
              "send-welcome-email",
              "add-to-mailing-list",
              "create-default-preferences"
            ];

            const results = [];
            for (const task of tasks) {
              try {
                await new Promise(resolve => setTimeout(resolve, 200)); // Simulate processing
                results.push({ task, success: true, completedAt: new Date().toISOString() });

                await io.logger.info(`Completed onboarding task: ${task}`, {
                  userId: validatedPayload.data.userId,
                  task,
                });
              } catch (error) {
                results.push({
                  task,
                  success: false,
                  error: error instanceof Error ? error.message : "Unknown error"
                });

                await io.logger.error(`Failed onboarding task: ${task}`, {
                  userId: validatedPayload.data.userId,
                  task,
                  error: error instanceof Error ? error.message : "Unknown error",
                });
              }
            }

            return {
              action: "user.created",
              userId: validatedPayload.data.userId,
              onboardingTasks: results,
              completedTasks: results.filter(r => r.success).length,
              failedTasks: results.filter(r => !r.success).length,
            };
          });
          break;

        case "user.updated":
          processResult = await io.runTask("handle-user-updated", async () => {
            await io.logger.info("Processing user update event", {
              userId: validatedPayload.data.userId,
              email: validatedPayload.data.email,
            });

            // Simulate profile sync tasks
            await new Promise(resolve => setTimeout(resolve, 500));

            return {
              action: "user.updated",
              userId: validatedPayload.data.userId,
              syncStatus: "completed",
              updatedFields: Object.keys(validatedPayload.data.metadata || {}),
            };
          });
          break;

        case "user.deleted":
          processResult = await io.runTask("handle-user-deleted", async () => {
            await io.logger.info("Processing user deletion event", {
              userId: validatedPayload.data.userId,
              email: validatedPayload.data.email,
            });

            // Simulate cleanup tasks
            const cleanupTasks = [
              "remove-user-data",
              "cancel-subscriptions",
              "delete-user-files",
              "remove-from-mailing-list"
            ];

            const results = [];
            for (const task of cleanupTasks) {
              try {
                await new Promise(resolve => setTimeout(resolve, 300));
                results.push({ task, success: true });

                await io.logger.info(`Completed cleanup task: ${task}`, {
                  userId: validatedPayload.data.userId,
                  task,
                });
              } catch (error) {
                results.push({
                  task,
                  success: false,
                  error: error instanceof Error ? error.message : "Unknown error"
                });
              }
            }

            return {
              action: "user.deleted",
              userId: validatedPayload.data.userId,
              cleanupTasks: results,
              completedTasks: results.filter(r => r.success).length,
              failedTasks: results.filter(r => !r.success).length,
            };
          });
          break;

        default:
          throw new Error(`Unsupported action: ${validatedPayload.data.action}`);
      }

      // Log successful completion
      await io.logger.info("Webhook processing completed successfully", {
        event: validatedPayload.event,
        action: validatedPayload.data.action,
        userId: validatedPayload.data.userId,
        processingTime: Date.now() - ctx.run.startedAt.getTime(),
        result: processResult,
      });

      return {
        success: true,
        processedAt: new Date().toISOString(),
        webhookEvent: validatedPayload.event,
        action: validatedPayload.data.action,
        userId: validatedPayload.data.userId,
        result: processResult,
      };

    } catch (error) {
      // Handle job-level errors with comprehensive logging
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      const errorStack = error instanceof Error ? error.stack : undefined;

      await io.logger.error("Webhook processing failed", {
        error: errorMessage,
        stack: errorStack,
        payload: JSON.stringify(payload, null, 2),
        jobId: ctx.job.id,
        runId: ctx.run.id,
        failedAt: new Date().toISOString(),
      });

      // Re-throw to mark job as failed
      throw error;
    }
  },
});