import { experiments } from "../src/app/lab/experiments";

export const ROUTES = ["/", "/lab", "/work", "/about", ...experiments.map((exp) => `/lab/${exp.slug}`)];
