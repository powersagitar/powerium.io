'use client';

import Image from 'next/image';
import {
  ComponentPropsWithoutRef,
  ComponentRef,
  forwardRef,
  useState,
} from 'react';

import { ImageIcon } from '@radix-ui/react-icons';

export const ImageWithFallback = forwardRef<
  ComponentRef<typeof Image>,
  ComponentPropsWithoutRef<typeof Image>
>((props, ref) => {
  if (props.onError) {
    throw new Error('onError of ImageWithFallback will not be used.');
  }

  const [isLoaded, setIsLoaded] = useState(true);

  if (isLoaded) {
    return <Image {...props} ref={ref} onError={() => setIsLoaded(false)} />;
  }

  return <ImageIcon width="5em" height="5em" className={props.className} />;
});

ImageWithFallback.displayName = 'ImageWithFallback';
