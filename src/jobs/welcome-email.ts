import { schedules } from "@trigger.dev/sdk";
import { client } from "../trigger";

// Sample job: Send welcome emails to new users
export const welcomeEmailJob = client.defineJob({
  id: "welcome-email-job",
  name: "Send Welcome Email",
  version: "1.0.0",
  // Run every day at 9 AM UTC
  trigger: schedules.cron("0 9 * * *"),
  run: async (payload, io, ctx) => {
    try {
      // Log the job start
      await io.logger.info("Starting welcome email job", {
        timestamp: new Date().toISOString(),
        jobId: ctx.job.id,
        runId: ctx.run.id,
      });

      // Simulate fetching new users from the past 24 hours
      const newUsers = await io.runTask("fetch-new-users", async () => {
        // In a real application, you would query your database here
        // For demonstration, we'll simulate some users
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

        return [
          { id: 1, email: "user1@example.com", name: "Alice Johnson" },
          { id: 2, email: "user2@example.com", name: "Bob Smith" },
          { id: 3, email: "user3@example.com", name: "Carol Williams" },
        ];
      });

      await io.logger.info(`Found ${newUsers.length} new users to send welcome emails`, {
        userCount: newUsers.length,
      });

      // Send welcome emails to each new user
      const emailResults = [];
      for (const user of newUsers) {
        try {
          const result = await io.runTask(
            `send-welcome-email-${user.id}`,
            async () => {
              // In a real application, you would use an email service like SendGrid, Resend, etc.
              await new Promise(resolve => setTimeout(resolve, 500)); // Simulate email sending delay

              const emailData = {
                to: user.email,
                subject: "Welcome to our platform!",
                template: "welcome",
                variables: {
                  name: user.name,
                  loginUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login`,
                },
              };

              // Simulate successful email sending
              return {
                success: true,
                messageId: `msg_${Date.now()}_${user.id}`,
                recipient: user.email,
              };
            }
          );

          emailResults.push({
            userId: user.id,
            email: user.email,
            success: true,
            messageId: result.messageId,
          });

          await io.logger.info(`Successfully sent welcome email to user ${user.id}`, {
            userId: user.id,
            email: user.email,
            messageId: result.messageId,
          });

        } catch (error) {
          // Handle individual email sending errors
          emailResults.push({
            userId: user.id,
            email: user.email,
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          });

          await io.logger.error(`Failed to send welcome email to user ${user.id}`, {
            userId: user.id,
            email: user.email,
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }

      // Log final results
      const successCount = emailResults.filter(r => r.success).length;
      const failureCount = emailResults.filter(r => !r.success).length;

      await io.logger.info("Welcome email job completed", {
        totalUsers: newUsers.length,
        successfulEmails: successCount,
        failedEmails: failureCount,
        duration: Date.now() - ctx.run.startedAt.getTime(),
      });

      // Return job results
      return {
        success: true,
        processedUsers: newUsers.length,
        successfulEmails: successCount,
        failedEmails: failureCount,
        emailResults,
        completedAt: new Date().toISOString(),
      };

    } catch (error) {
      // Handle job-level errors
      await io.logger.error("Welcome email job failed", {
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        jobId: ctx.job.id,
        runId: ctx.run.id,
      });

      // Re-throw the error to mark the job as failed
      throw error;
    }
  },
});