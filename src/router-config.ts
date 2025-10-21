// Configuration pour React Router avec les futurs drapeaux
// Ce fichier configure les options futures pour éviter les avertissements

export const routerConfig = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
};

// Configuration pour le navigateur
export const browserRouterConfig = {
  window: window,
  ...routerConfig,
};
