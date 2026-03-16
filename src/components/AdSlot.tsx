"use client";

/**
 * Ezoic ad placeholder.
 * Replace `id` with the real placeholder ID you get from the Ezoic dashboard.
 * When Ezoic is not yet configured, the div is invisible and takes no space.
 */
export default function AdSlot({
  id,
  className = "",
}: {
  id: number;
  className?: string;
}) {
  return (
    <div
      id={`ezoic-pub-ad-placeholder-${id}`}
      className={className}
      aria-hidden="true"
    />
  );
}
