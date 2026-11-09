
# Project Plan — Image Transmission

## Wojtek

- [x] Configure Angular, Tailwind, ESLint, and Aspire.
- [x] Implement image upload, preview, validation, and error handling.
- [x] Create codec selection and simulation configuration controls.
- [x] Define shared API contracts for simulations, metrics, experiments, and exports.
- [x] Implement mock-backed simulation and image upload endpoints.
- [x] Implement in-memory image storage and simulation artifacts.
- [x] Integrate frontend with simulation, catalog, and image APIs.
- [x] Implement independent and burst noise configuration with deterministic mock results.
- [x] Display original, corrupted, and decoded images.
- [x] Implement metrics, coding overhead, and error-region visualization.
- [x] Add responsive layouts and image downloads.
- [x] Implement experiment comparison charts and results tables.
- [x] Implement experiment and report export endpoints.
- [x] Add BCH selection and mock simulation support.
- [ ] Implement and test BCH encoder/decoder and integrate real BCH simulations.

## Ola

- [ ] Implement image loading and 8-bit grayscale conversion.
- [ ] Implement lossless pixel-to-bit and bit-to-pixel conversion.
- [ ] Handle bitstream lengths, padding, and image dimensions.
- [ ] Implement the encode → transmit → decode → reconstruct pipeline.
- [ ] Test lossless image round-trips without noise.
- [ ] Define `IErrorCorrectingCode` and decoding result contracts.
- [ ] Implement Hamming (7,4) encoding and decoding.
- [ ] Implement extended Hamming (8,4) with SECDED.
- [ ] Implement error correction, detection, and block statuses.
- [ ] Integrate both Hamming codes with image processing.
- [ ] Implement reproducible experiments across noise levels and seeds.
- [ ] Calculate reconstruction metrics and generate comparison results.
- [ ] Implement real experiment APIs and backend integration tests.
- [ ] Document image conversion, transmission pipeline, and backend implementation.
- [ ] Write the experimental methodology and results sections of the final report.

## Hubert

- [ ] Implement independent bit-flip noise with configurable probability.
- [ ] Implement burst-error simulation with configurable length and count.
- [ ] Implement deterministic noise generation using random seeds.
- [ ] Implement baseline/no-code transmission and reconstruction.
- [ ] Test all 16 Hamming (7,4) messages and all single-bit error positions.
- [ ] Test Hamming (8,4) single-bit correction and double-bit detection.
- [ ] Add reference tests for error detection and correction.
- [ ] Research Hamming, extended Hamming, and BCH coding theory.
- [ ] Document parity bits, bit ordering, and syndrome decoding.
- [ ] Document noise models, error-correction capabilities, and limitations.
- [ ] Compare coding redundancy and error-correction effectiveness.
- [ ] Document application architecture, API contracts, and data flow.
- [ ] Prepare KM1 and KM2 reports and presentations.
- [ ] Write and assemble the final report, including theory and conclusions.
- [ ] Prepare the final presentation, setup instructions, and submission materials.
