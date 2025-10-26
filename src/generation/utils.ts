export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export const uncapitalize = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

export const getSafeMicrofrontendName = (name: string): string => {
  return name
    .split(' ')
    .map((s) => s.replace(/[^a-zA-Z0-9]/g, ''))
    .map(capitalize)
    .join('');
};
