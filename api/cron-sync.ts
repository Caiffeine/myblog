import { spawn } from 'child_process';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // Verify the request is from Vercel's cron system
  const authHeader = request.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return response.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Run the sync script
    const syncProcess = spawn('npm', ['run', 'sync:wp'], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        NODE_ENV: 'production',
      },
    });

    let output = '';
    let errorOutput = '';

    syncProcess.stdout?.on('data', (data) => {
      output += data.toString();
    });

    syncProcess.stderr?.on('data', (data) => {
      errorOutput += data.toString();
    });

    await new Promise((resolve, reject) => {
      syncProcess.on('close', (code) => {
        if (code === 0) {
          resolve(code);
        } else {
          reject(new Error(`Process exited with code ${code}`));
        }
      });
    });

    return response.status(200).json({
      success: true,
      message: 'WordPress sync completed',
      output,
    });
  } catch (error) {
    console.error('Sync error:', error);
    return response.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
