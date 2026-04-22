type SocketEventHandler = (...args: never[]) => void;

export type SocketClient = {
  emit: (event: string, payload?: unknown) => void;
  on: (event: string, handler: SocketEventHandler) => void;
  off: (event: string, handler?: SocketEventHandler) => void;
  disconnect: () => void;
};

type SocketFactory = (
  url?: string,
  options?: Record<string, unknown>,
) => SocketClient;

declare global {
  interface Window {
    io?: SocketFactory;
    __dotsSocketIoLoader?: Promise<SocketFactory>;
  }
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(
  /\/$/,
  "",
);

function getSocketOrigin() {
  return API_BASE_URL || window.location.origin;
}

async function loadSocketIoFactory(): Promise<SocketFactory> {
  if (window.io) {
    return window.io;
  }

  if (!window.__dotsSocketIoLoader) {
    window.__dotsSocketIoLoader = new Promise<SocketFactory>(
      (resolve, reject) => {
        const script = document.createElement("script");
        script.src = `${getSocketOrigin()}/socket.io/socket.io.js`;
        script.async = true;
        script.onload = () => {
          if (window.io) {
            resolve(window.io);
            return;
          }

          reject(new Error("Socket.IO client failed to initialize"));
        };
        script.onerror = () => {
          reject(new Error("Socket.IO client script failed to load"));
        };
        document.head.appendChild(script);
      },
    );
  }

  return window.__dotsSocketIoLoader;
}

export async function createGameSocket(): Promise<SocketClient> {
  const io = await loadSocketIoFactory();

  return io(getSocketOrigin(), {
    withCredentials: true,
    transports: ["websocket", "polling"],
  });
}
