export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      const status = error?.status;
      if (status !== 429 && !(status >= 500)) { // ------> solo reintenta si es 429 = rate limit, 500 = server error
        throw error;
      }

      if (attempt === maxRetries) {
        throw error;
      }

      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.error(`⏳ Reintento ${attempt}/${maxRetries} en ${delay}ms...`); //tiempo de espera entre intentos 
      await new Promise((resolve) => setTimeout(resolve, delay)); //espera el tiempo necesario
    }
  }

  throw lastError;
}