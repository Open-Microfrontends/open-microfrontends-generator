let failedOnce = false;

export default async (sourceCode: string): Promise<string> => {
  if (failedOnce) {
    return sourceCode;
  }
  try {
    const prettier = await import('prettier');
    return await prettier.format(sourceCode, {
      filepath: 'generated.ts'
    });
  } catch (e) {
    console.warn('OMG: Prettier not found or not configured correctly', e);
    failedOnce = true;
  }
  return sourceCode;
};
