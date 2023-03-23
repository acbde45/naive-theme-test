import { createInjectionKey } from "naive-ui/es/_utils";
import type { VdConfigProviderInjection } from "./internal-interface";

export const VdConfigProviderInjectionKey =
  createInjectionKey<VdConfigProviderInjection>("vd-config-provider");
