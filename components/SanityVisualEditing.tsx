// app/components/SanityVisualEditing.tsx

import { createSanityClient, useLiveMode } from '@/data/sanity';
import { useAppStore } from '@/store/app';
import { isIframe } from '@/utils/preview';
import { enableVisualEditing } from '@sanity/visual-editing';
import { usePathname } from 'expo-router';
import { useEffect } from 'react';

// This component really only makes sense on the web/in presentation mode, since it provides clickable visual overlays of content for editing in the studio.
// @sanity/visual-editing runs into import/runtime issues in the context of react native, so we import it dynamically.
export default function SanityVisualEditing() {
  const { token } = useAppStore()
  const client = createSanityClient({token})
  const pathname = usePathname()
  
  useEffect(() => {
    const disable = isIframe() ? enableVisualEditing({
      history: {
        subscribe: (navigate) => {
          // We navigate to Expo Router's current pathname.
          navigate({
            type: 'push',
            url: pathname,
          })

          // Return cleanup function
          return () => {}
        },
        update: (u: any) => {
          // This doesn't seem to get called in the context of Expo/React Native.
          console.log('UPDATE', u)
        }
      },
      zIndex: 1000,
    }) : () => null
    return () => disable()
  }, [pathname])

  useLiveMode({client})

  return null
}


