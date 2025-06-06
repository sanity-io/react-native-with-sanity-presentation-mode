// app/components/SanityVisualEditing.tsx

import { createSanityClient } from '../sanity/client';
import { useLiveMode } from '@/sanity';
import { useAppStore } from '@/store/app';
import { isPresentationPluginIframe } from '@/utils/preview';
import { enableVisualEditing } from '@sanity/visual-editing';
import { usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';

// This component really only makes sense on the web/in presentation mode, since it provides clickable visual overlays of content for editing in the studio.
// @sanity/visual-editing runs into import/runtime issues in the context of react native, so we import it dynamically.
export default function SanityVisualEditing() {
  const { token } = useAppStore()
  const client = createSanityClient({token})
  const pathname = usePathname()
  const router = useRouter()
  
  useEffect(() => {
    const disable = isPresentationPluginIframe() ? enableVisualEditing({
      history: {
        subscribe: (navigate) => {
          console.log('NAVIGATION EVENT:', pathname)
          // We navigate to Expo Router's current pathname.
          navigate({
            type: 'push',
            url: pathname,
          })

          // Return cleanup function
          return () => {}
        },
        update: (u: any) => {
          console.log('URL UPDATE:', u)
          switch (u.type) {
            case 'push':
              return  router.push(u.url)
            case 'pop':
              return router.back()
            case 'replace':
              return router.replace(u.url)
            default:
              throw new Error(`Unknown update type: ${u.type}`)
          }
        }
      },
      zIndex: 1000,
    }) : () => null
    return () => disable()
  }, [pathname])

  useLiveMode({client})

  return null
}


