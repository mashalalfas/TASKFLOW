export function generateProjectSummary(project, stageName = 'Unknown Stage') {
  const doneCount = project.subtasks.filter((st) => st.done).length;
  const totalCount = project.subtasks.length;
  const completionPercent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const subtasksList = project.subtasks.length > 0
    ? project.subtasks.map((st) => `${st.done ? '✓' : '○'} ${st.text}`).join('\n')
    : '(No subtasks)';

  const summary = `
═══════════════════════════════════
PROJECT SUMMARY
═══════════════════════════════════

Title: ${project.title}
Client: ${project.client}
Stage: ${stageName}
Last Updated: ${new Date(project.lastUpdate).toLocaleDateString()}

PROGRESS: ${doneCount}/${totalCount} (${completionPercent}%)

SUBTASKS:
${subtasksList}

═══════════════════════════════════
  `.trim();

  return summary;
}

export function downloadPDF(project, stageName) {
  const summary = generateProjectSummary(project, stageName);
  const printWindow = window.open('', '', 'height=600,width=800');
  
  printWindow.document.write(`
    <html>
      <head>
        <title>${project.title} - TaskFlow Report</title>
        <style>
          body { font-family: monospace; padding: 40px; background: #0A0A0C; color: #F8F9FA; }
          pre { white-space: pre-wrap; word-wrap: break-word; }
        </style>
      </head>
      <body>
        <pre>${summary}</pre>
      </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.print();
}
