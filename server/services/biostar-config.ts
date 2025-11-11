export interface BioStarConfig {
  host: string;
  port: number;
  apiKey?: string;
}

export const defaultBioStarConfig: BioStarConfig = {
  host: "127.0.0.1",
  port: 51212,
  apiKey: "",
};
