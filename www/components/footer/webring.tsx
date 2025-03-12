import clsx from 'clsx';

import { Link } from '../ui/link';
import { Muted } from '../ui/typography';

type WebRingProps = {
  className?: string;
};

export default function WebRing({ className }: WebRingProps) {
  return (
    <div className={clsx('items-center sm:flex', className)}>
      <WebRingLogo />
      <Muted className="mt-1 sm:mt-0">
        <Link href="https://se-webring.xyz/" className="no-underline">
          Current students and alumni of Software Engineering at the University
          of Waterloo.
        </Link>
      </Muted>
    </div>
  );
}

function WebRingLogo() {
  return (
    <svg
      width="960"
      height="960"
      viewBox="0 0 960 960"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-muted-foreground mx-auto h-8 w-auto sm:mx-0 sm:mr-2"
    >
      <rect width="960" height="960" fill="none" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M390.499 272.146V687.477C491.737 672.742 569.501 585.38 569.501 479.811C569.501 374.243 491.737 286.881 390.499 272.146ZM367.396 749.527C364.991 749.591 362.577 749.623 360.157 749.623C211.506 749.623 91 628.824 91 479.811C91 330.799 211.506 210 360.157 210C362.577 210 364.991 210.032 367.396 210.096C368.31 210.032 369.233 210 370.163 210H869V749.623H370.163C369.233 749.623 368.31 749.591 367.396 749.527ZM330.687 687.602V272.021C229.023 286.379 150.813 373.94 150.813 479.811C150.813 585.683 229.023 673.244 330.687 687.602ZM529.346 269.958H809.187V689.665H529.346C590.325 640.201 629.313 564.57 629.313 479.811C629.313 395.053 590.325 319.422 529.346 269.958Z"
        fill="currentColor"
      />
    </svg>
  );
}
