// app/components/SanityVisualEditing.tsx

import { Platform } from 'react-native';
import { getWebOnlySession } from '@/utils/preview';
import { useEffect, useState } from 'react';

// This component really only makes sense on the web since it provides clickable visual overlays of content for editing in the studio.
// @sanity/visual-editing runs into import/runtime issues in the context of react native, so we import it dynamically.
export default function SanityVisualEditing() {
const isWeb = Platform.OS === 'web' && getWebOnlySession();
const [importedComponent, setImportedComponent] = useState<React.ReactNode>(null);

useEffect(() => {
  const importComponent = async () => {
    if(isWeb){
      const module = await import('@sanity/visual-editing/react');
      const VisualEditing = module.VisualEditing;
      setImportedComponent(<VisualEditing portal={true} />);
    } else {
      setImportedComponent(null)
    }
  };

  importComponent();
}, []);

  if(!isWeb){
    return null;
  }

  return importedComponent
}