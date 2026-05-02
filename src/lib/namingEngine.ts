/**
 * GFM Quantum Naming Engine (System 42)
 * Standardizes file organization across the ecosystem.
 */

export interface NamingParams {
  projectName: string;
  version: number;
  isFinal?: boolean;
  isRevision?: boolean;
  extension: string;
}

export function generateQuantumFileName({
  projectName,
  version,
  isFinal = false,
  isRevision = false,
  extension
}: NamingParams): string {
  // Clean project name (remove spaces and special chars, lowercase)
  const cleanProject = projectName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 30);

  let suffix = `v${version}`;

  if (isFinal) {
    suffix = 'final';
  } else if (isRevision) {
    suffix = `revision${version}`;
  }

  return `${cleanProject}_${suffix}.${extension}`;
}

export function getPredictedVersion(existingFiles: any[]): number {
  if (!existingFiles || existingFiles.length === 0) return 1;
  
  const versions = existingFiles.map(f => f.version || 0);
  return Math.max(...versions) + 1;
}
