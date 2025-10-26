let failedOnce = false;

export default async (sourceCode: string, targetDir: string): Promise<string> => {
  if (failedOnce) {
    return sourceCode;
  }
  try {
    const prettier = await import('prettier');
    const options = await prettier.resolveConfig(targetDir);
    return await prettier.format(sourceCode, {
      ...(options ?? {
        printWidth: 120,
        tabWidth: 2,
        singleQuote: true,
        trailingComma: 'es5',
      }),
      filepath: 'generated.ts',
    });
  } catch (e) {
    console.warn('OMG: Prettier not found or not configured correctly', e);
    failedOnce = true;
  }
  return sourceCode;
};
