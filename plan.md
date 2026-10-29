
# Project Plan — Image Transmission

## KM1 — Grayscale image transmission and Hamming (7,4)

**Goal:** Lossless image ↔ bits conversion and a verified Hamming (7,4) codec.

This is not the final version of work division.

### Wojtek — Frontend

- [x] Configure Angular, Tailwind, ESLint, and Aspire frontend/API startup.
- [ ] Create image upload and original-image preview.
- [ ] Create initial codec selection and simulation controls.
- [ ] Connect the frontend to the initial simulation API.
- [ ] Implement loading, validation, and API error states.
- [ ] Integrate the complete simulation workflow into the frontend.
- [ ] Demonstrate the working application during KM1.

### Ola — Image processing and backend

- [ ] Implement image loading and conversion to 8-bit grayscale.
- [ ] Implement lossless pixel ↔ bit conversion and bit-length/padding handling.
- [ ] Implement the initial transmission pipeline: encode → transmit → decode → reconstruct.
- [ ] Add tests for exact grayscale image round-trips without noise.
- [ ] Provide an API endpoint for uploading an image and running a Hamming (7,4) simulation.
- [ ] Verify lossless image reconstruction without channel noise.
- [ ] Integrate image processing with the codec interface.
- [ ] Define `IErrorCorrectingCode` and decoding result/error-status contracts.
- [ ] Implement Hamming (7,4) encoder and decoder.

### Hubert — Coding and documentation

- [ ] Test all 16 possible 4-bit messages.
- [ ] Test all 7 single-bit error positions for every message.
- [ ] Document bit ordering, parity positions, and syndrome decoding.
- [ ] Verify the codec's exhaustive test suite.
- [ ] Write KM1 report sections covering theoretical background, architecture, and implementation.
- [ ] Prepare the KM1 presentation covering algorithms, image processing, architecture, and demonstration.
- [ ] Review the integrated KM1 functionality and prepare milestone submission materials.

---

## KM2 — Noise, extended Hamming, and comparison UI

**Goal:** Both Hamming codes, both noise models, image comparisons, metrics, and detection of double-bit errors.

### Wojtek — Frontend

- [ ] Implement controls for codec selection, noise model, probability, burst length/count, and random seed.
- [ ] Display original, corrupted-without-correction, and decoded images side by side.
- [ ] Display key metrics and coding overhead.
- [ ] Overlay regions with detected but uncorrectable errors, including a legend.
- [ ] Implement image download.
- [ ] Implement responsive layouts for desktop and mobile.
- [ ] Add frontend component and API integration tests.
- [ ] Add an end-to-end test for the complete simulation workflow.
- [ ] Prepare and demonstrate the frontend during KM2.

### Ola — Transmission, extended Hamming, and API

- [ ] Implement extended Hamming (8,4) encoder and SECDED decoder.
- [ ] Test all messages with every single-bit error, including the overall parity bit.
- [ ] Test detection of every double-bit error combination.
- [ ] Return corrected, detected-but-uncorrectable, and unflagged block statuses.
- [ ] Implement independent bit flips with configurable probability `p`.
- [ ] Implement burst errors with configurable burst length and count.
- [ ] Support deterministic simulations using a user-specified random seed.
- [ ] Apply noise only to encoded pixel bits; preserve image dimensions and original data length.
- [ ] Implement baseline/no-code and noisy-but-uncorrected image reconstruction.
- [ ] Calculate redundancy, incorrect-pixel percentage, and mean absolute brightness error.
- [ ] Expose simulation outputs, metrics, and detected-error locations through the API.
- [ ] Test both codecs against both noise models.
- [ ] Verify deterministic results for repeated random seeds.

### Hubert — Algorithm verification and documentation

- [ ] Review Hamming (7,4) and Hamming (8,4) behavior under multiple-bit errors.
- [ ] Verify that the application does not overstate error detection or correction guarantees.
- [ ] Verify that error overlays represent detected uncorrectable blocks rather than every actual corruption.
- [ ] Add reference test cases for error detection and correction.
- [ ] Document independent bit-flip and burst-error models.
- [ ] Document Hamming (8,4), SECDED, and error-status interpretation.
- [ ] Write the KM2 report draft covering algorithms, transmission models, measurements, API, and UI.
- [ ] Prepare the KM2 presentation with implementation progress, results, and demonstrations.
- [ ] Review KM2 results and prepare milestone submission materials.

---

## Final — BCH, experiments, report, and presentation

**Goal:** Add BCH, perform reproducible comparisons, and deliver the complete application and academic materials.

### Wojtek — BCH and frontend

- [ ] Implement BCH encoder and decoder using the common codec interface.
- [ ] Support the selected BCH parameters and correction capability.
- [ ] Add BCH reference vectors and round-trip tests.
- [ ] Test correctable and uncorrectable BCH error patterns.
- [ ] Add BCH to the frontend codec selection.
- [ ] Verify the complete BCH simulation workflow.
- [ ] Build an experiment comparison view with charts and results table.
- [ ] Add downloads for recovered images and experiment reports.
- [ ] Polish the UI and improve responsiveness.
- [ ] Run frontend and end-to-end tests.
- [ ] Fix frontend and integration issues.
- [ ] Demonstrate the final application during the presentation.

### Ola — Experiments, metrics, and backend

- [ ] Implement a reproducible experiment runner for multiple noise levels and random seeds.
- [ ] Compare no code, Hamming (7,4), Hamming (8,4), and BCH using identical images and noise settings.
- [ ] Produce plots and tables of incorrect-pixel rate, mean brightness error, and redundancy.
- [ ] Export recovered images and machine-readable experiment results (CSV or JSON).
- [ ] Analyze results and limitations, including burst-error behavior.
- [ ] Implement API endpoints for experiment execution and result retrieval.
- [ ] Verify metrics against known or manually calculated examples.
- [ ] Run backend unit and integration tests.
- [ ] Verify the application runs from the repository root using `aspire run`.
- [ ] Validate the final experiment outputs and reproducibility.

### Hubert — Algorithms, research, report, and presentation

- [ ] Select and document BCH code parameters, such as BCH(15,7), and their correction capability.
- [ ] Research and document the theoretical background of Hamming, extended Hamming, and BCH codes.
- [ ] Compare the redundancy, error-detection, and error-correction capabilities of all methods.
- [ ] Review BCH implementation and algorithm verification results.
- [ ] Document limitations of error correction for independent and burst errors.
- [ ] Document the experimental methodology, random seeds, datasets, and evaluation metrics.
- [ ] Document application architecture, API contracts, and integration design.
- [ ] Write the final report sections covering theoretical background and algorithm implementation.
- [ ] Write the final report sections covering experimental methodology, results, and discussion.
- [ ] Write the final report introduction, objectives, conclusions, and limitations.
- [ ] Assemble, edit, and format the complete final report.
- [ ] Prepare the complete final presentation, including algorithms, experiments, architecture, and demonstration.
- [ ] Coordinate presentation timing and speaking sections.
- [ ] Prepare setup and execution instructions for the project.
- [ ] Prepare the final submission package, including report, presentation, and representative experiment outputs.
- [ ] Verify consistent terminology, formatting, and technical accuracy across documentation.

---

## Suggested workflow

- Use one feature branch and pull request per task or coherent task group.
- Name branches with respective milestone tag, example "KM1#<feature>"
- Keep experiments reproducible with fixed seeds and recorded parameters.
- Update this checklist regularly
