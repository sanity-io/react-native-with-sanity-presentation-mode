// app/components/SanityVisualEditing.tsx

import { isWeb } from '@/utils/preview';
import { enableVisualEditing } from '@sanity/visual-editing';
// import { VisualEditing } from '@sanity/visual-editing/react';
import { createSanityClient, useLiveMode } from '@/data/sanity';
// import { useSanityHooks } from '@/hooks/useSanityHooks';
import { useContext, useEffect } from 'react';
import TokenContext from './TokenContext';

// This component really only makes sense on the web since it provides clickable visual overlays of content for editing in the studio.
// @sanity/visual-editing runs into import/runtime issues in the context of react native, so we import it dynamically.
export default function SanityVisualEditing() {
  const token = useContext(TokenContext) as string
  const client = createSanityClient({token})
  
  useEffect(() => {
    const disable = isWeb() ? enableVisualEditing({
      zIndex: 1000,
    }) : () => null


    return () => disable()
  }, [])


  useLiveMode({client})

  return null
}