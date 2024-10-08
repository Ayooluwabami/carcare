export interface IUpdateServiceInput {
  name?: string;            // Name of the service
  description?: string;     // Description of the service
  price?: number;           // Price of the service
  duration?: number;        // Duration for which the service is provided (in minutes, for example)
  category?: string;        // Category to which the service belongs (e.g., Maintenance, Repair)
  isAvailable?: boolean;    // Indicates whether the service is currently available
}
