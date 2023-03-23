import { inject, computed, ComputedRef, Ref } from 'vue'
import { VdConfigProviderInjectionKey } from '@/components/config-provider/src/context'
import { VdGlobalComponentConfig } from '@/components/config-provider'

type UseConfigProps = Readonly<{
  bordered?: boolean
  [key: string]: unknown
}>

export const defaultVdClsPrefix = 'vd'

export default function useConfig (
  props: UseConfigProps = {},
  options: {
    defaultBordered?: boolean
  } = {
    defaultBordered: true
  }
): {
    mergedBorderedRef: ComputedRef<boolean>
    mergedClsPrefixRef: ComputedRef<string>
    mergedComponentPropsRef: Ref<VdGlobalComponentConfig | undefined> | undefined
    namespaceRef: ComputedRef<string | undefined>
  } {
  const VdConfigProvider = inject(VdConfigProviderInjectionKey, null)
  return {
    mergedComponentPropsRef: VdConfigProvider?.mergedComponentPropsRef,
    mergedBorderedRef: computed(() => {
      const { bordered } = props
      if (bordered !== undefined) return bordered
      return (
        VdConfigProvider?.mergedBorderedRef.value ??
        options.defaultBordered ??
        true
      )
    }),
    mergedClsPrefixRef: computed(() => {
      const clsPrefix = VdConfigProvider?.mergedClsPrefixRef.value
      return clsPrefix || defaultVdClsPrefix
    }),
    namespaceRef: computed(() => VdConfigProvider?.mergedNamespaceRef.value)
  }
}
