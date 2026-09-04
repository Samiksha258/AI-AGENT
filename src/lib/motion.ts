/**
 * Shared, type-safe Framer Motion variant factories.
 * Using `as const` ensures the `ease` string is treated as an Easing literal.
 */
import type { Variants } from 'framer-motion';

export const fadeUpVariants: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.45, ease: 'easeOut' as const } },
};

export const containerVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export const pageVariants: Variants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0,   transition: { duration: 0.3, ease: 'easeOut' as const } },
  exit:    { opacity: 0, x: -40, transition: { duration: 0.2, ease: 'easeIn'  as const } },
};
