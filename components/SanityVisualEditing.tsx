// app/components/SanityVisualEditing.tsx

import { client, useLiveMode } from '@/data/sanity';
import { isWeb } from '@/utils/preview';
import { enableVisualEditing } from '@sanity/visual-editing';
// import { VisualEditing } from '@sanity/visual-editing/react';
import { useEffect } from 'react';

// This component really only makes sense on the web since it provides clickable visual overlays of content for editing in the studio.
// @sanity/visual-editing runs into import/runtime issues in the context of react native, so we import it dynamically.
export default function SanityVisualEditing() {
  

  useEffect(() => {
    console.log('isWeb', isWeb())

    const disable = isWeb() ? enableVisualEditing({
      zIndex: 1000,
    }) : () => null
    console.log('disable', disable)


    return () => disable()
  }, [])


  useLiveMode({client})

  return null
}