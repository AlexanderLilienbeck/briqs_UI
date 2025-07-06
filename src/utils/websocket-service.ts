import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";

import type { NegotiationEvent } from "../types/negotiation";

// WebSocket Event Types
export interface WebSocketMessage {
  type: string;
  data: unknown;
  timestamp: Date;
  id?: string;
}

export interface NegotiationUpdateMessage extends WebSocketMessage {
  type: "negotiation_update";
  data: {
    negotiationId: string;
    event: NegotiationEvent;
    progress: {
      currentRound: number;
      maxRounds: number;
      timeElapsed: number;
      estimatedTimeRemaining: number;
    };
  };
}

export interface NegotiationStatusMessage extends WebSocketMessage {
  type: "negotiation_status";
  data: {
    negotiationId: string;
    status: "active" | "completed" | "failed" | "paused";
    participants: number;
    watchers: number;
  };
}

// WebSocket Service for Real-time Negotiation Updates
export class WebSocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second
  private listeners: Map<string, ((data: unknown) => void)[]> = new Map();
  private negotiationRooms: Set<string> = new Set();

  constructor(private serverUrl: string = "ws://localhost:3001") {
    this.setupEventListeners();
  }

  // Connect to WebSocket server
  async connect(): Promise<boolean> {
    try {
      if (this.socket?.connected) {
        return true;
      }

      this.socket = io(this.serverUrl, {
        transports: ["websocket", "polling"],
        timeout: 10000,
        forceNew: true,
      });

      return new Promise((resolve, reject) => {
        if (!this.socket) {
          reject(new Error("Failed to create socket"));
          return;
        }

        const timeout = setTimeout(() => {
          reject(new Error("Connection timeout"));
        }, 10000);

        this.socket.on("connect", () => {
          clearTimeout(timeout);
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.reconnectDelay = 1000;
          this.setupSocketListeners();
          console.log("✅ WebSocket connected");
          resolve(true);
        });

        this.socket.on("connect_error", (error) => {
          clearTimeout(timeout);
          console.error("❌ WebSocket connection error:", error);
          reject(error);
        });
      });
    } catch (error) {
      console.error("Failed to connect to WebSocket:", error);
      return false;
    }
  }

  // Disconnect from WebSocket server
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.negotiationRooms.clear();
      console.log("🔌 WebSocket disconnected");
    }
  }

  // Join a negotiation room for live updates
  async joinNegotiationRoom(negotiationId: string): Promise<boolean> {
    if (!this.isConnected || !this.socket) {
      console.warn("WebSocket not connected, attempting to connect...");
      const connected = await this.connect();
      if (!connected) {
        console.error("Failed to connect to WebSocket for negotiation room");
        return false;
      }
    }

    return new Promise((resolve) => {
      if (!this.socket) {
        resolve(false);
        return;
      }

      this.socket.emit(
        "join_negotiation",
        { negotiationId },
        (response: { success: boolean }) => {
          if (response.success) {
            this.negotiationRooms.add(negotiationId);
            console.log(`📡 Joined negotiation room: ${negotiationId}`);
            resolve(true);
          } else {
            console.error(`Failed to join negotiation room: ${negotiationId}`);
            resolve(false);
          }
        },
      );
    });
  }

  // Leave a negotiation room
  leaveNegotiationRoom(negotiationId: string): void {
    if (this.socket && this.negotiationRooms.has(negotiationId)) {
      this.socket.emit("leave_negotiation", { negotiationId });
      this.negotiationRooms.delete(negotiationId);
      console.log(`📡 Left negotiation room: ${negotiationId}`);
    }
  }

  // Subscribe to negotiation updates
  onNegotiationUpdate(
    callback: (update: NegotiationUpdateMessage) => void,
  ): () => void {
    return this.on("negotiation_update", (data: unknown) => {
      callback(data as NegotiationUpdateMessage);
    });
  }

  // Subscribe to negotiation status changes
  onNegotiationStatus(
    callback: (status: NegotiationStatusMessage) => void,
  ): () => void {
    return this.on("negotiation_status", (data: unknown) => {
      callback(data as NegotiationStatusMessage);
    });
  }

  // Subscribe to agent thinking events
  onAgentThinking(
    callback: (data: {
      negotiationId: string;
      agentType: "buyer" | "supplier";
      message: string;
    }) => void,
  ): () => void {
    return this.on("agent_thinking", (data: unknown) => {
      callback(
        data as {
          negotiationId: string;
          agentType: "buyer" | "supplier";
          message: string;
        },
      );
    });
  }

  // Subscribe to offer events
  onOfferMade(
    callback: (data: {
      negotiationId: string;
      offer: unknown;
      agentType: "buyer" | "supplier";
    }) => void,
  ): () => void {
    return this.on("offer_made", (data: unknown) => {
      callback(
        data as {
          negotiationId: string;
          offer: unknown;
          agentType: "buyer" | "supplier";
        },
      );
    });
  }

  // Generic event subscription
  on(eventType: string, callback: (data: unknown) => void): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }

    this.listeners.get(eventType)!.push(callback);

    // Set up socket listener if connected
    if (this.socket) {
      this.socket.on(eventType, callback);
    }

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(eventType);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }

      if (this.socket) {
        this.socket.off(eventType, callback);
      }
    };
  }

  // Send negotiation event to server
  emitNegotiationEvent(negotiationId: string, event: NegotiationEvent): void {
    if (this.socket && this.isConnected) {
      this.socket.emit("negotiation_event", {
        negotiationId,
        event,
        timestamp: new Date(),
      });
    }
  }

  // Broadcast negotiation progress
  broadcastProgress(
    negotiationId: string,
    progress: {
      currentRound: number;
      maxRounds: number;
      timeElapsed: number;
      estimatedTimeRemaining: number;
    },
  ): void {
    if (this.socket && this.isConnected) {
      this.socket.emit("negotiation_progress", {
        negotiationId,
        progress,
        timestamp: new Date(),
      });
    }
  }

  // Get connection status
  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  // Get active negotiation rooms
  getActiveRooms(): string[] {
    return Array.from(this.negotiationRooms);
  }

  // Setup event listeners for connection management
  private setupEventListeners(): void {
    // Will be set up when socket is created
  }

  // Setup socket event listeners
  private setupSocketListeners(): void {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      console.log("✅ WebSocket reconnected");

      // Re-join all negotiation rooms
      this.negotiationRooms.forEach((negotiationId) => {
        this.socket?.emit("join_negotiation", { negotiationId });
      });
    });

    this.socket.on("disconnect", (reason) => {
      this.isConnected = false;
      console.log("🔌 WebSocket disconnected:", reason);

      if (reason === "io server disconnect") {
        // Server initiated disconnect, don't reconnect
        return;
      }

      // Attempt to reconnect
      this.attemptReconnect();
    });

    this.socket.on("error", (error) => {
      console.error("❌ WebSocket error:", error);
    });

    // Set up all registered listeners
    this.listeners.forEach((callbacks, eventType) => {
      callbacks.forEach((callback) => {
        this.socket?.on(eventType, callback);
      });
    });
  }

  // Attempt to reconnect with exponential backoff
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("❌ Max reconnection attempts reached");
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(
      `🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms...`,
    );

    setTimeout(() => {
      this.connect().catch((error) => {
        console.error("Reconnection failed:", error);
        this.attemptReconnect();
      });
    }, delay);
  }
}

// Mock WebSocket Service for development (when no real server available)
export class MockWebSocketService extends WebSocketService {
  private mockConnected = false;
  private mockListeners: Map<string, ((data: unknown) => void)[]> = new Map();

  constructor() {
    super("mock://localhost");
  }

  async connect(): Promise<boolean> {
    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    this.mockConnected = true;
    console.log("✅ Mock WebSocket connected");
    return true;
  }

  disconnect(): void {
    this.mockConnected = false;
    console.log("🔌 Mock WebSocket disconnected");
  }

  async joinNegotiationRoom(negotiationId: string): Promise<boolean> {
    if (!this.mockConnected) {
      await this.connect();
    }
    console.log(`📡 Mock: Joined negotiation room: ${negotiationId}`);
    return true;
  }

  leaveNegotiationRoom(negotiationId: string): void {
    console.log(`📡 Mock: Left negotiation room: ${negotiationId}`);
  }

  on(eventType: string, callback: (data: unknown) => void): () => void {
    if (!this.mockListeners.has(eventType)) {
      this.mockListeners.set(eventType, []);
    }

    this.mockListeners.get(eventType)!.push(callback);

    return () => {
      const callbacks = this.mockListeners.get(eventType);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  emitNegotiationEvent(negotiationId: string, event: NegotiationEvent): void {
    console.log(
      `📡 Mock: Emitting negotiation event for ${negotiationId}:`,
      event.type,
    );

    // Simulate real-time broadcast to listeners
    setTimeout(() => {
      const listeners = this.mockListeners.get("negotiation_update");
      if (listeners) {
        listeners.forEach((callback) => {
          callback({
            type: "negotiation_update",
            data: {
              negotiationId,
              event,
              progress: {
                currentRound: event.type === "session_started" ? 1 : 0,
                maxRounds: 8,
                timeElapsed: Math.random() * 5,
                estimatedTimeRemaining: Math.random() * 10,
              },
            },
            timestamp: new Date(),
          });
        });
      }
    }, 100);
  }

  broadcastProgress(
    negotiationId: string,
    progress: {
      currentRound: number;
      maxRounds: number;
      timeElapsed: number;
      estimatedTimeRemaining: number;
    },
  ): void {
    console.log(
      `📡 Mock: Broadcasting progress for ${negotiationId}:`,
      progress,
    );
  }

  isSocketConnected(): boolean {
    return this.mockConnected;
  }

  getActiveRooms(): string[] {
    return ["mock-room-1", "mock-room-2"];
  }
}

// Create appropriate service based on environment
const createWebSocketService = (): WebSocketService => {
  // In development, use mock service unless WS_SERVER_URL is provided
  const wsServerUrl = process.env.NEXT_PUBLIC_WS_SERVER_URL;

  if (!wsServerUrl || wsServerUrl === "mock") {
    console.log("🔧 Using Mock WebSocket Service for development");
    return new MockWebSocketService();
  }

  console.log(`🔧 Using Real WebSocket Service: ${wsServerUrl}`);
  return new WebSocketService(wsServerUrl);
};

// Export singleton instance
export const webSocketService = createWebSocketService();

// Types are already exported above with the interface declarations
