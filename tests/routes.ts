import { experiments } from "../src/app/lab/experiments";

export const ROUTES = ["/", "/lab", ...experiments.map((exp) => `/lab/${exp.slug}`)];
