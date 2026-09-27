import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { Redis } from "@upstash/redis";

function redisFromEnv() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

function localPath(key: string) {
  return path.join(process.cwd(), "data", `${key}.json`);
}

export function hasDurableStore() {
  return Boolean(redisFromEnv()) || !process.env.VERCEL;
}

export async function readDurableJson<T>(key: string): Promise<T | null> {
  const redis = redisFromEnv();
  if (redis) {
    const value = await redis.get<T>(`hey-mursal:${key}`);
    return value ?? null;
  }

  try {
    const raw = await readFile(localPath(key), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function writeDurableJson<T>(key: string, value: T): Promise<void> {
  const redis = redisFromEnv();
  if (redis) {
    await redis.set(`hey-mursal:${key}`, value);
    return;
  }

  if (process.env.VERCEL) {
    throw new Error(
      "Saves need Upstash Redis on Vercel. Open Storage → Create Database → Redis (Upstash), connect this project, then redeploy."
    );
  }

  const filePath = localPath(key);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(value, null, 2));
}
