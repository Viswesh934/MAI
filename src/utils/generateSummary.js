export default function generateSummary(markdown) {
  if (!markdown) return '';

  // Get first heading
  const headingMatch = markdown.match(/^#+\s*(.*)/m);
  const heading = headingMatch ? headingMatch[1] : 'Summary';

  // Get first 2-3 sentences (rudimentary)
  const sentences = markdown
    .replace(/[\r\n]+/g, ' ')
    .match(/[^.!?]+[.!?]+/g);
  const summaryText = sentences
    ? sentences.slice(0, 3).join(' ')
    : markdown.slice(0, 200);

  return `# ${heading}\n\n${summaryText}`;
}