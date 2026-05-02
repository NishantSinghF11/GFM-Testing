export interface SEOValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateSEO(meta: any): SEOValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!meta.title) errors.push("Missing title");
  else if (meta.title.length > 60) warnings.push("Title exceeds 60 characters");

  if (!meta.description) errors.push("Missing description");
  else if (meta.description.length > 160) warnings.push("Description exceeds 160 characters");
  else if (meta.description.length < 50) warnings.push("Description is too short (less than 50 characters)");

  if (!meta.openGraph) errors.push("Missing OpenGraph metadata");
  if (!meta.twitter) errors.push("Missing Twitter metadata");
  if (!meta.alternates?.canonical) errors.push("Missing canonical URL");

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
