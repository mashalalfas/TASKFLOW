// Webhook configuration - set these via environment variables or settings
const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL || '';

export async function sendProjectUpdate(project, stageName) {
  if (!WEBHOOK_URL) {
    console.warn('Webhook URL not configured. Set VITE_WEBHOOK_URL in .env');
    return;
  }

  const payload = {
    id: project.id,
    title: project.title,
    client: project.client,
    stage: stageName,
    priority: project.priority || 'Med',
    subtasks: project.subtasks,
    lastUpdate: project.lastUpdate,
    timestamp: new Date().toISOString(),
  };

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'TaskFlow/1.0',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`Webhook failed: ${response.status} ${response.statusText}`);
    } else {
      console.log(`✓ Webhook sent for ${project.title} → ${stageName}`);
    }
  } catch (error) {
    console.error('Webhook error:', error.message);
  }
}

export function shouldTriggerWebhook(stageName) {
  return stageName === 'Won' || stageName === 'Lost';
}
