export interface Metadata {
  limit: number; // Número de elementos que se mostrarán en cada página.
  page: number; // Número de la página actual solicitada por el cliente.
  totalItems: number; // Número total de elementos disponibles en la colección completa.
  totalPages: number; // Cantidad total de páginas disponibles, calculada en función del número total de elementos y el tamaño de cada página.
}
