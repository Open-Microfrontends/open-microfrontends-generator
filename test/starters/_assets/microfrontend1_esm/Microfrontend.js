export const startMyFirstMicrofrontend = () => {
  window.__started2__ = true;
  return {
    onRemove: async () => {
      window.__removed2__ = true;
    },
  };
};
