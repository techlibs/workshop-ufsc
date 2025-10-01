import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { ProviderManager, providerInfo } from "../utils/provider-manager";

export const manageProvidersTool = createTool({
  id: "manage-providers",
  description:
    "Manage user's streaming provider preferences. Set which streaming services the user has access to for filtering recommendations.",
  inputSchema: z.object({
    action: z
      .enum(["set", "get", "info"])
      .describe(
        "Action to perform: set providers, get current providers, or get provider info"
      ),
    providers: z
      .array(z.enum(["Netflix", "Apple TV", "HBO Max", "Stremio"]))
      .optional()
      .describe("List of providers to set (only for 'set' action)"),
    userId: z.string().describe("User ID"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    action: z.string(),
    currentProviders: z.array(z.string()),
    providerDetails: z
      .array(
        z.object({
          name: z.string(),
          description: z.string(),
          monthlyPrice: z.number(),
          features: z.array(z.string()),
        })
      )
      .optional(),
    message: z.string(),
  }),
  execute: async ({ context }) => {
    const { action, providers, userId } = context;
    const providerManager = new ProviderManager(userId);

    switch (action) {
      case "set":
        if (!providers || providers.length === 0) {
          return {
            success: false,
            action: "set",
            currentProviders: providerManager.getProviders(),
            message:
              "No providers specified. Please provide at least one provider.",
          };
        }

        providerManager.setProviders(providers);
        return {
          success: true,
          action: "set",
          currentProviders: providers,
          message: `Updated your streaming providers to: ${providers.join(", ")}`,
        };

      case "get":
        const currentProviders = providerManager.getProviders();
        return {
          success: true,
          action: "get",
          currentProviders,
          message: `Your current streaming providers: ${currentProviders.join(", ")}`,
        };

      case "info":
        const allProviders = [
          "Netflix",
          "Apple TV",
          "HBO Max",
          "Stremio",
        ] as const;
        const providerDetails = allProviders.map((name) => ({
          name,
          ...providerInfo[name],
        }));

        return {
          success: true,
          action: "info",
          currentProviders: providerManager.getProviders(),
          providerDetails,
          message: "Here are details about available streaming providers",
        };

      default:
        return {
          success: false,
          action,
          currentProviders: providerManager.getProviders(),
          message: "Invalid action specified",
        };
    }
  },
});


