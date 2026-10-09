# FT-IR research workspace

English-only, browser-local wavenumber search and CSV exploration. Apple Human Interface Guidelines inspire the restrained layout, system typography, spacing, clear hierarchy, keyboard focus and responsive controls. This is an independent web app, not an Apple product or official implementation of an Apple design system.

## Run

Requires Node.js 20 or later. No package installation is needed.

```sh
npm start
```

Open http://127.0.0.1:5173. Run focused science checks with `npm test`.

## Scope

- Position or ascending range search, 400–4000 cm⁻¹, adjustable tolerance.
- Thirteen attributed general reference ranges; all overlaps retained.
- Two-column CSV/TSV/semicolon-delimited numeric files, up to 5 MB. Wavenumber first, intensity second, dot decimals. Header/invalid rows reported, duplicate wavenumbers rejected, rows sorted.
- Explicit absorbance/percent-transmittance selection; candidate detection with local contrast and physical separation settings. Optional five-point moving average affects detection only. Raw trace remains visible. Click candidates or manually search corrected positions.
- No network requests for analysis, persistence, telemetry, automated compound identification or probabilistic confidence claims.

## Reference provenance and licensing

`references.js` transcribes numeric range facts from John McMurry, *Organic Chemistry*, OpenStax (2023), §12.7, Table 12.1:
https://openstax.org/books/organic-chemistry/pages/12-7-interpreting-infrared-spectra

Reviewed 2026-10-09. This reduced dataset omits single-position entries rather than inventing widths. The adapted reference dataset is CC BY-NC-SA 4.0, with attribution and share-alike requirements and noncommercial restrictions. Access for free at https://openstax.org/books/organic-chemistry/pages/1-why-this-chapter. No permission for commercial use is asserted. No license is granted for unrelated third-party material. Repository software licensing remains for the owner to choose.

No thesis files, experimental CSV, RRUFF archive, or mineral spectra have been copied into this repository. The local RRUFF library needs a provenance, intensity-unit, sample-purity and redistribution review before integration.

## Scientific limitations

Ordering uses distance to the reference interval, then narrower interval width. It is not a likelihood estimate. Reference intensity and band shape are displayed but not inferred from the imported spectrum. Local peak contrast within ±50 cm⁻¹ is a heuristic, not true prominence or fitted peak analysis. Broad peaks, noise, uneven sampling, endpoints and backgrounds can affect detection. No baseline subtraction, resampling, full-spectrum library matching, instrument correction or mixture identification is performed.

## Publication

Local prototype only. Public deployment and external data uploads require owner approval and a completed source-license review.

## Atmospheric CO2 screening

Two additional manufacturer-guidance entries cover approximate CO2 positions near 2350 and 670 cm⁻¹, sourced from https://www.shimadzu.com/an/service-support/faq/ftir/4/index.html (reviewed 2026-10-09). The application uses an explicitly labeled ±25 cm⁻¹ screening window around each position; this is a heuristic, not a published band width. These are possible background-interference candidates and do not confirm CO2 in the sample. No manufacturer spectrum or image is redistributed. The OpenStax dataset license applies to its adapted entries, not to manufacturer material.
