'use client';

import { useState } from 'react';
import Image, { type StaticImageData } from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function ImageCarousel({
  images,
  altPrefix,
  className = '',
}: {
  images: StaticImageData[];
  altPrefix: string;
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  const previous = () => setIndex((current) => (current - 1 + images.length) % images.length);
  const next = () => setIndex((current) => (current + 1) % images.length);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="relative h-[360px] overflow-hidden rounded-[28px] border border-border shadow-sm">
        <Image src={images[index]} alt={`${altPrefix} ${index + 1}`} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />
        <button
          type="button"
          onClick={previous}
          className="absolute left-4 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-primary shadow-sm transition hover:bg-white"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={next}
          className="absolute right-4 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-primary shadow-sm transition hover:bg-white"
          aria-label="Next image"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {images.map((image, imageIndex) => (
          <button
            key={`${altPrefix}-${imageIndex}`}
            type="button"
            onClick={() => setIndex(imageIndex)}
            className={`relative h-16 w-16 overflow-hidden rounded-2xl border transition ${index === imageIndex ? 'border-accent shadow-sm' : 'border-border opacity-80 hover:opacity-100'}`}
            aria-label={`View ${altPrefix} ${imageIndex + 1}`}
          >
            <Image src={image} alt={`${altPrefix} thumbnail ${imageIndex + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
