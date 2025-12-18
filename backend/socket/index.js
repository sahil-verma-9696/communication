import { Server } from "socket.io";
import { rootNamespaceHandler } from "./namespaces/root.js";
import cookieParser from "cookie-parser";
import { chatNamespaceHandler } from "./namespaces/chat.js";
import { socketAuthAndMapping } from "../middleware/socketAuthMapping.js";

function initialiseSocketServer(httpServer, options) {
  const socketServer = new Server(httpServer, {
    ...options,
    cors: { origin: "http://localhost:5173" },
    pingInterval: 2000,
    pingTimeout: 1000,
  });

  // _id -> socket.id
  const idToSocketMap = new Map();

  // _id -> { status: active | online | offline, lastSeen: Date }
  const idToStatusMap = new Map();

  // [ userId_1, userId_2, userId_3, ... ] status : active
  const activeUsersIds = new Set();

  // [ userId_1, userId_2, userId_3, ... ] status : online
  const onlineUsersIds = new Set();

  const namespaces = ["/ws", "/ws/chat", "/ws/notifications"];

  // Middleware to map sockets to users
  namespaces.forEach((ns) => {
    const namespaceInstance = socketServer.of(ns);
    namespaceInstance.use(
      socketAuthAndMapping(
        namespaceInstance,
        idToSocketMap,
        activeUsersIds,
        onlineUsersIds,
        idToStatusMap
      )
    );
  });

  const rootNamespace = socketServer.of("/ws");
  const chatNamespace = socketServer.of("/ws/chat");
  const notificationNamespace = socketServer.of("/ws/notifications");

  rootNamespace.on("connection", rootNamespaceHandler());
  chatNamespace.on("connection", chatNamespaceHandler(chatNamespace));
  // notificationNamespace.on("connection", notificationNamespaceHandler());

  return socketServer;
}

export default initialiseSocketServer;
