import { io } from "socket.io-client";
import { API_BASE } from "./constants/api.js";

export const socket = io(API_BASE);
