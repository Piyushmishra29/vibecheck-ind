'use client';

import { useId } from 'react';
import './Logo.css';

/*
 * VibeCheck animated logo.
 *
 * The markup below is a faithful inline copy of /public/logo.svg — same viewBox,
 * same three groups (#vc-v, #vc-sparkle, #vc-word), same potrace transform on each
 * ("translate(0,565) scale(0.1,-0.1)"). It is inlined rather than <img src>'d so the
 * groups are individually animatable.
 *
 * COORDINATE WARNING for anyone editing Logo.css: every <path> lives inside a group
 * whose y-axis is FLIPPED and scaled 10x (scale(0.1,-0.1)). Inside those groups,
 * 1px === 0.1 viewBox units and a POSITIVE translateY moves UP on screen. The
 * per-element wrappers that carry no transform (.vcl__wipe, and the <svg> itself)
 * are in plain viewBox units. Do not re-trace or flatten the transforms.
 *
 * Measured geometry, viewBox units (916 x 565):
 *   V        x 273    y 95     w 179  h 311
 *   sparkle  x 443    y 10     w 219  h 230
 *   wordmark x 0      y 470    w 916  h 95
 */

const VIEWBOX_FULL = '0 0 916 565';
// Cropped to the V + sparkle only, with even optical padding.
const VIEWBOX_MARK = '253 -5 430 430';

function LogoSvg({ mark, size = '100%', animate = true, className = '', ...rest }) {
  // Sanitised: React's useId contains characters that are unsafe in a url(#id) reference.
  const uid = 'vcl' + useId().replace(/[^a-zA-Z0-9]/g, '');
  const wipeId = uid + '-wipe';

  return (
    <svg
      viewBox={mark ? VIEWBOX_MARK : VIEWBOX_FULL}
      className={`vcl${mark ? ' vcl--mark' : ''}${animate ? ' vcl--play' : ''}${className ? ' ' + className : ''}`}
      style={{ width: size }}
      fill="currentColor"
      role="img"
      aria-label="VibeCheck"
      {...rest}
    >
      <defs>
        {/* Bottom-up wipe for the V. userSpaceOnUse + an untransformed host <g>
            means this rect is in plain viewBox units, no flipped space involved. */}
        <clipPath id={wipeId} clipPathUnits="userSpaceOnUse">
          <rect className="vcl__wipe" x="262" y="84" width="202" height="340" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${wipeId})`}>
        <g id="vc-v" transform="translate(0.000000,565.000000) scale(0.100000,-0.100000)">
          <path className="vcl__v" d="M2730 4596 l0 -103 89 -5 c138 -8 230 -57 285 -153 17 -28 1110 -2598 1163 -2732 3 -7 20 -13 38 -13 28 0 33 4 38 28 3 15 45 237 93 493 l87 466 -368 869 c-400 943 -401 946 -351 995 32 33 93 49 180 49 l66 0 0 105 0 105 -660 0 -660 0 0 -104z" />
        </g>
      </g>

      <g id="vc-sparkle" transform="translate(0.000000,565.000000) scale(0.100000,-0.100000)">
        <path className="vcl__sparkle" d="M5521 5535 c-5 -251 -33 -533 -62 -619 -68 -203 -254 -378 -458 -431 -82 -21 -325 -45 -463 -45 -65 0 -108 -4 -108 -10 0 -6 41 -10 103 -10 132 0 394 -25 469 -45 192 -50 361 -199 437 -383 48 -116 63 -224 78 -567 l8 -180 6 165 c10 224 27 413 45 485 57 231 241 419 469 480 75 20 338 45 473 45 61 0 102 4 102 10 0 6 -41 10 -102 10 -135 0 -398 25 -473 45 -224 60 -407 245 -465 469 -21 85 -38 245 -49 486 -4 91 -9 133 -10 95z" />
      </g>

      {!mark && (
        <g id="vc-word" transform="translate(0.000000,565.000000) scale(0.100000,-0.100000)">
          {/* C — 5th glyph left-to-right */}
          <path className="vcl__letter" style={{ '--i': 4 }} d="M4130 949 c-101 -12 -217 -74 -288 -154 -281 -319 -38 -822 383 -792 146 10 292 93 375 213 30 42 29 47 -7 93 -1 2 -30 -26 -64 -62 -45 -50 -79 -76 -136 -104 -67 -33 -85 -38 -169 -41 -90 -4 -98 -3 -160 28 -83 41 -154 112 -196 197 -31 63 -33 75 -33 168 0 87 3 107 26 156 58 123 164 190 310 197 137 7 241 -33 286 -108 17 -30 37 -38 48 -20 7 12 -27 183 -38 191 -5 3 -19 4 -31 2 -13 -3 -45 3 -72 12 -63 22 -164 32 -234 24z" />
          {/* C — 8th glyph left-to-right */}
          <path className="vcl__letter" style={{ '--i': 7 }} d="M7655 948 c-143 -19 -286 -126 -351 -261 -68 -145 -68 -280 2 -425 115 -239 411 -333 646 -205 59 32 159 122 188 168 20 32 20 35 4 60 -19 29 -29 31 -42 9 -25 -45 -113 -118 -181 -152 -72 -36 -79 -37 -180 -37 -99 0 -110 2 -159 30 -69 37 -153 128 -188 202 -38 81 -44 177 -15 271 27 88 95 168 179 209 53 26 66 28 172 28 137 -1 186 -19 250 -94 31 -35 42 -43 51 -34 10 10 8 33 -8 105 -18 88 -21 93 -44 90 -13 -1 -58 6 -99 17 -95 24 -149 29 -225 19z" />
          {/* V — 1st glyph left-to-right */}
          <path className="vcl__letter" style={{ '--i': 0 }} d="M0 937 c0 -2 10 -16 23 -30 12 -15 53 -98 91 -184 62 -140 252 -553 302 -656 15 -32 22 -38 47 -35 27 3 36 20 217 427 105 234 200 435 212 448 12 13 19 25 16 28 -3 3 -49 4 -103 3 l-97 -3 21 -24 c12 -13 21 -33 21 -43 0 -27 -273 -649 -281 -640 -19 22 -279 621 -279 643 0 15 7 32 15 39 30 25 13 30 -95 30 -61 0 -110 -2 -110 -3z" />
          {/* I — 2nd glyph left-to-right */}
          <path className="vcl__letter" style={{ '--i': 1 }} d="M1245 904 l25 -37 0 -372 c0 -374 -4 -427 -36 -439 -37 -14 5 -26 92 -26 77 0 94 3 94 15 0 8 -4 15 -9 15 -27 0 -32 64 -29 442 3 351 5 388 21 405 9 11 17 23 17 26 0 4 -45 7 -100 7 l-99 0 24 -36z" />
          {/* B — 3rd glyph left-to-right */}
          <path className="vcl__letter" style={{ '--i': 2 }} d="M1800 934 c0 -3 9 -17 20 -31 19 -25 20 -41 20 -418 0 -377 -1 -393 -20 -418 -11 -14 -20 -28 -20 -32 0 -3 91 -5 203 -3 187 3 205 5 244 26 65 34 109 78 137 134 60 120 12 243 -125 321 -21 12 -39 25 -39 28 0 3 18 20 39 37 45 36 81 104 81 150 0 73 -60 158 -135 193 -34 16 -66 19 -222 19 -101 0 -183 -3 -183 -6z m371 -107 c45 -30 61 -63 56 -116 -9 -87 -69 -131 -179 -131 l-68 0 0 -49 0 -49 88 -4 c135 -6 203 -52 220 -148 15 -82 -12 -146 -78 -184 -35 -21 -175 -34 -224 -22 l-26 6 0 354 c0 194 3 356 7 359 3 4 43 7 88 7 69 0 88 -4 116 -23z" />
          {/* E — 4th glyph left-to-right */}
          <path className="vcl__letter" style={{ '--i': 3 }} d="M2746 925 c4 -8 10 -15 14 -15 26 0 31 -68 28 -437 l-3 -381 -24 -26 c-19 -20 -21 -27 -10 -31 8 -3 146 -4 308 -3 l294 3 20 57 c23 64 18 81 -14 52 -19 -17 -41 -19 -240 -22 l-219 -3 0 180 0 181 195 0 c183 0 196 -1 215 -20 12 -12 25 -18 30 -15 14 8 13 175 0 175 -6 0 -20 -9 -32 -20 -20 -19 -36 -20 -215 -20 l-193 0 0 135 0 135 214 0 c202 0 215 -1 240 -21 15 -12 30 -18 33 -15 4 4 -2 32 -14 64 l-20 57 -306 3 c-270 2 -306 1 -301 -13z" />
          {/* H — 6th glyph left-to-right */}
          <path className="vcl__letter" style={{ '--i': 5 }} d="M4970 935 c0 -3 9 -18 20 -33 20 -27 21 -39 18 -426 -3 -365 -4 -399 -20 -410 -38 -28 -20 -36 82 -36 55 0 100 3 100 7 0 4 -10 17 -22 31 -22 23 -23 32 -26 228 l-3 204 315 0 316 0 0 -195 c0 -185 -8 -245 -32 -245 -4 0 -8 -7 -8 -15 0 -12 17 -15 93 -15 52 0 97 3 100 7 4 3 -3 17 -15 31 l-23 24 0 393 0 393 23 31 23 31 -101 0 c-55 0 -100 -3 -100 -6 0 -3 9 -17 20 -31 18 -23 20 -41 20 -169 l0 -144 -315 0 -315 0 0 129 c0 130 10 185 36 195 8 3 14 10 14 16 0 6 -38 10 -100 10 -55 0 -100 -2 -100 -5z" />
          {/* E — 7th glyph left-to-right */}
          <path className="vcl__letter" style={{ '--i': 6 }} d="M6280 933 c0 -3 8 -15 18 -26 15 -17 17 -54 20 -405 3 -378 -2 -442 -29 -442 -5 0 -9 -7 -9 -15 0 -13 38 -15 301 -13 l301 3 23 57 c25 62 18 83 -17 51 -18 -16 -43 -18 -239 -21 l-219 -3 0 180 0 181 194 0 c178 0 195 -2 219 -20 14 -11 28 -20 31 -20 3 0 6 41 6 90 0 94 -6 104 -40 70 -19 -19 -33 -20 -215 -20 l-195 0 0 135 0 135 214 0 c200 0 215 -1 240 -21 40 -31 47 -15 23 51 l-22 60 -302 0 c-167 0 -303 -3 -303 -7z" />
          {/* K — 9th glyph left-to-right */}
          <path className="vcl__letter" style={{ '--i': 8 }} d="M8500 934 c0 -3 9 -17 20 -31 19 -25 20 -41 20 -418 0 -377 -1 -393 -20 -418 -11 -14 -20 -28 -20 -31 0 -3 45 -6 100 -6 55 0 100 3 100 7 0 4 -9 16 -20 28 -19 21 -20 33 -18 216 l3 194 140 -173 c166 -206 173 -217 151 -241 -9 -10 -16 -21 -16 -24 0 -4 50 -7 110 -7 61 0 110 4 110 8 0 5 -12 19 -26 33 -26 23 -394 474 -394 482 0 5 202 203 305 298 44 40 82 77 83 81 2 5 -42 8 -99 8 -99 0 -102 -1 -85 -19 16 -18 12 -23 -101 -134 -65 -63 -133 -127 -150 -142 l-33 -27 0 135 c0 121 2 136 20 152 11 10 20 22 20 27 0 4 -45 8 -100 8 -55 0 -100 -3 -100 -6z" />
        </g>
      )}
    </svg>
  );
}

/** Full lockup: V + sparkle + VIBECHECK wordmark. */
export default function Logo(props) {
  return <LogoSvg {...props} />;
}

/** Compact variant for nav / footer: V + sparkle, no wordmark. */
export function LogoMark(props) {
  return <LogoSvg mark {...props} />;
}
