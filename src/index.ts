import { SwapApi } from "../generated/apis/SwapApi";
import { ConfigurationParameters, Configuration } from "../generated/runtime";

// Define server URLs
// Using the staccattac Jupiter endpoint without version suffix
const PUBLIC_SERVER_URL = "https://jup.staccattac.fun";
const API_KEY_SERVER_URL = "https://jup.staccattac.fun";

/**
 * Creates a Jupiter API client with optional API key support
 * @param config Configuration parameters
 * @returns SwapApi instance
 */
export const createJupiterApiClient = (config?: ConfigurationParameters) => {
  // Determine which server URL to use based on whether an API key is provided
  const hasApiKey = config?.apiKey !== undefined;
  
  // Create a new configuration with the appropriate base path
  const configWithServer: ConfigurationParameters = {
    ...config,
    basePath: hasApiKey ? API_KEY_SERVER_URL : PUBLIC_SERVER_URL,
    headers: hasApiKey ? { 'x-api-key': config?.apiKey as string } : undefined
  };
  
  return new SwapApi(new Configuration(configWithServer));
};

export * from "../generated";
