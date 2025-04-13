"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client2 = void 0;
const client2_1 = require("../../../prisma/generated/client2");
exports.client2 = globalThis.prisma2 || new client2_1.PrismaClient();
// if (process.env.NODE_ENV !== 'production') globalThis.prisma2 = client2;
