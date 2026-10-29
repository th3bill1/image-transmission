
# Image Transmission — Project Description

## 1. Project Overview

**Project:** Transmission and Reconstruction of Images Corrupted During Transmission

**Course:** Error-Correcting Codes and Code-Based Cryptography  
**University:** Warsaw University of Technology, Faculty of Mathematics and Information Science (MiNI PW)

### Objective

The objective of this project is to develop an application that simulates the transmission of digital images through a noisy communication channel and demonstrates how error-correcting codes can improve the quality of reconstructed images.

Digital images consist of numerical values representing pixel colors or brightness levels. During transmission, some bits may be corrupted, resulting in visible image distortions.

Error-correcting codes introduce redundant information before transmission, allowing the receiver to detect and potentially correct corrupted bits.

The application will allow users to compare different coding methods and noise models, visualize transmission errors, and evaluate the effectiveness of error correction using quantitative metrics.

## 2. Scope

The application operates on grayscale images, where each pixel is represented by an 8-bit integer in the range 0–255.

The following transmission methods must be supported:

- **Uncoded transmission:** No error-correcting code is applied.
- **Hamming (7,4):** Encodes 4 information bits into 7 bits and corrects a single-bit error per codeword.
- **Extended Hamming (8,4):** Encodes 4 information bits into 8 bits, corrects single-bit errors, and detects double-bit errors (SECDED).
- **BCH:** An additional error-correcting code required to achieve the maximum project score. Its specific parameters will be selected and documented during implementation.

All coding methods must use a consistent interface to enable comparisons under equivalent experimental conditions.

## 3. Transmission Pipeline

The application must implement the following processing pipeline:

1. Load an image.
2. Convert the image to 8-bit grayscale.
3. Convert pixel values into a binary sequence.
4. Encode the binary data using the selected error-correcting code.
5. Simulate transmission through a noisy channel.
6. Decode the received data.
7. Reconstruct the grayscale image.
8. Compare the reconstructed image with the original.
9. Calculate transmission and reconstruction metrics.

The image dimensions must be stored separately from the transmitted pixel data and must not be affected by simulated noise.

The original data length must be preserved so that any padding introduced during encoding can be removed correctly.

### Example

Consider a grayscale pixel with brightness value `150`.

Its binary representation is:

`150 = 10010110`

For Hamming (7,4), the byte is divided into two 4-bit messages:

- `1001`
- `0110`

Each message is encoded into a 7-bit codeword, resulting in 14 transmitted bits.

If no more than one bit is corrupted in each codeword, the Hamming decoder can recover the original pixel value.

## 4. Error-Correcting Codes

### 4.1. Uncoded Transmission

The original pixel bits are transmitted without redundancy.

This method serves as the baseline for evaluating the effectiveness of error-correcting codes.

### 4.2. Hamming (7,4)

The Hamming (7,4) code maps 4 information bits to a 7-bit codeword.

Requirements:

- Implement encoding and decoding.
- Correct any single-bit error within a codeword.
- Test all 16 possible 4-bit messages.
- Test all 7 possible single-bit error positions for every message.
- Document parity-bit placement, bit ordering, and syndrome decoding.

Correction of multiple-bit errors is not guaranteed.

### 4.3. Extended Hamming (8,4)

The extended Hamming (8,4) code adds an overall parity bit to the Hamming (7,4) code.

It provides Single Error Correction, Double Error Detection (SECDED).

Requirements:

- Implement encoding and decoding.
- Correct single-bit errors, including errors in the overall parity bit.
- Detect double-bit errors.
- Distinguish between corrected errors and detected but uncorrectable errors.
- Test all single-bit and double-bit error combinations.

The decoder must not claim that every error involving three or more corrupted bits can be detected.

### 4.4. BCH

The application must additionally support a BCH error-correcting code.

Requirements:

- Select and document the BCH code parameters.
- Implement encoding and decoding.
- Verify correction capability using automated tests.
- Integrate BCH into the existing transmission pipeline.
- Compare BCH with uncoded transmission and both Hamming codes.

The exact BCH configuration and its guaranteed correction capability must be documented.

## 5. Noise Models

The application must simulate two types of transmission errors.

### 5.1. Independent Bit Errors

Each transmitted bit is independently inverted with probability `p`.

The user must be able to configure the error probability.

### 5.2. Burst Errors

The application must support corruption of consecutive bits in randomly selected bursts.

The user must be able to configure:

- Burst length.
- Number of bursts.

### 5.3. General Requirements

- Noise must be applied to encoded pixel bits.
- Image dimensions and metadata required for reconstruction must remain unchanged.
- Transmission must preserve the total bitstream length.
- Simulations should support reproducibility through configurable random seeds.
- The same noise configurations should be available for all coding methods.

## 6. Application Features

### 6.1. Image Input

The application must allow users to:

- Upload an image.
- Convert it to grayscale.
- Preview the original image.
- Select a transmission method.

### 6.2. Simulation Configuration

Users must be able to configure:

- Error-correcting code.
- Noise model.
- Bit-error probability.
- Burst length and count.
- Random seed.

### 6.3. Image Comparison

The application must display:

1. Original grayscale image.
2. Image reconstructed after transmission without error correction.
3. Image reconstructed after decoding with the selected error-correcting code.

These images should be presented side by side for visual comparison.

### 6.4. Error Visualization

The application must identify and visually highlight image regions associated with detected but uncorrectable errors.

The visualization must clearly distinguish detected uncorrectable errors from errors that were successfully corrected.

It must not imply that all remaining corruptions are necessarily detectable.

### 6.5. Export

Users must be able to:

- Download reconstructed images.
- Export simulation results.
- Save reports containing transmission parameters and evaluation metrics.

## 7. Evaluation Metrics

The application must calculate the following metrics.

### 7.1. Redundancy

The number of additional bits introduced by the selected coding method.

The application should also report coding overhead relative to the original data size.

### 7.2. Incorrect Pixel Percentage

The percentage of reconstructed pixels whose brightness differs from the original image.

### 7.3. Mean Absolute Brightness Error

The mean absolute difference between original and reconstructed pixel brightness values.

For an image containing `N` pixels:

`MAE = (1/N) * Σ |original[i] - reconstructed[i]|`

### 7.4. Comparative Evaluation

The application must compare coding methods under several noise levels.

The evaluation should consider:

- Reconstruction quality.
- Error-correction effectiveness.
- Redundancy.
- Differences between independent and burst errors.
- Limitations of each coding method.

## 8. Technology Stack

The application will use:

- **Backend:** C# / ASP.NET Core
- **Frontend:** Angular / TypeScript
- **Styling:** Tailwind CSS
- **Orchestration:** .NET Aspire
- **Testing:** Automated unit, integration, and frontend tests

The backend is responsible for image processing, coding algorithms, noise simulation, reconstruction, and metrics.

The frontend provides simulation configuration, image visualization, comparisons, and result exports.

## 9. Project Milestones

### KM1 — Initial Implementation

**Goal:** Demonstrate lossless image conversion and a verified Hamming (7,4) implementation.

Required deliverables:

- Image loading and grayscale conversion.
- Lossless pixel-to-bit and bit-to-pixel conversion.
- Working Hamming (7,4) encoder and decoder.
- Tests covering all 16 possible messages.
- Tests covering all single-bit errors in every codeword position.
- Initial integration of the image transmission pipeline.

### KM2 — Complete Hamming Simulation

**Goal:** Support both Hamming codes, both noise models, and a working comparison interface.

Required deliverables:

- Complete image processing using Hamming (7,4) and extended Hamming (8,4).
- Independent bit-error simulation.
- Burst-error simulation.
- Prototype frontend with image comparisons.
- Basic evaluation metrics.
- Visualization of detected double-bit errors that cannot be corrected.

### Final — BCH and Experimental Evaluation

**Goal:** Deliver the complete application and comparative analysis.

Required deliverables:

- BCH encoding and decoding.
- Integration of all coding methods.
- Reproducible experiments across multiple noise levels.
- Comparative charts and tables.
- Image and report export.
- Automated tests.
- Final project report.
- Final presentation and application demonstration.

## 10. Expected Outcome

The final application should demonstrate how error-correcting codes influence image reconstruction quality under different transmission conditions.

Users should be able to observe the trade-off between additional transmitted bits and the ability to recover corrupted image data.

The project should provide both a practical visualization of error correction and a quantitative comparison of uncoded transmission, Hamming (7,4), extended Hamming (8,4), and BCH.
