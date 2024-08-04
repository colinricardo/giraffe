import { CLERK_SECRET_KEY } from "@/config";
import {
  generateCorrelationId,
  getFromStore,
  initializeStore,
  runWithStore,
} from "@/lib/store";
import { schema } from "@/schemas/schema";
import { verifyToken } from "@clerk/backend";
import { createYoga, Plugin, YogaInitialContext } from "graphql-yoga";

interface ContextWithCorrelationId extends YogaInitialContext {
  correlationId: string;
  userId?: string;
  user?: any;
}

const createCorrelationIdPlugin = (): Plugin => ({
  onRequest: ({ request }) => {
    const correlationId = generateCorrelationId(request.headers);
    request.headers.set("x-internal-correlation-id", correlationId);
    initializeStore(correlationId);
  },
  onResponse: ({ response, request }) => {
    const correlationId = request.headers.get("x-internal-correlation-id");
    if (correlationId) {
      response.headers.set("x-correlation-id", correlationId);
    }
  },
});

const getAuthToken = (headers: Headers) => {
  return (
    headers.get("x-auth-token") ||
    headers.get("Authorization")?.split("Bearer ")[1]
  );
};

const verifyAuthToken = async (authToken: string | undefined) => {
  if (!authToken) return { userId: undefined, sessionClaims: undefined };

  try {
    const sessionClaims = await verifyToken(authToken, {
      secretKey: CLERK_SECRET_KEY,
    });
    return { userId: sessionClaims.sub, sessionClaims };
  } catch (error) {
    console.error("Authentication error:", error);
    return { userId: undefined, sessionClaims: undefined };
  }
};

const createContext =
  () =>
  async (
    initialContext: YogaInitialContext
  ): Promise<ContextWithCorrelationId> => {
    const correlationId =
      initialContext.request.headers.get("x-internal-correlation-id") ||
      generateCorrelationId(initialContext.request.headers);

    const authToken = getAuthToken(initialContext.request.headers);
    const { userId } = await verifyAuthToken(authToken);

    initializeStore(correlationId, userId);
    const storeContext = getFromStore("context");

    return {
      ...initialContext,
      ...storeContext,
      correlationId,
      userId,
      user: undefined,
    };
  };

const createYogaServer = () =>
  createYoga({
    schema,
    plugins: [createCorrelationIdPlugin()],
    cors: {
      origin: "*",
      credentials: true,
      allowedHeaders: ["*"],
      methods: ["*"],
    },
    context: createContext(),
    landingPage: false,
    graphqlEndpoint: "/graphql",
  });

const yoga = createYogaServer();

const server = Bun.serve({
  fetch: (req, server) => runWithStore(() => yoga.fetch(req, server)),
  port: 4000,
});

console.info(
  `Server is running on ${new URL(
    yoga.graphqlEndpoint,
    `http://${server.hostname}:${server.port}`
  )}`
);
