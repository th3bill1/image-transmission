namespace ImageTransmission.Core;

public sealed record CodecDescriptor(
    string Id,
    string Name,
    string Description);

public sealed record NoiseModelDescriptor(
    string Id,
    string Name,
    string Description);

public sealed record SimulationConfiguration(
    string Codec,
    string NoiseModel,
    double ErrorProbability,
    int BurstLength,
    int BurstCount,
    int? RandomSeed);

public sealed record SimulationRequest(
    string FileName,
    string ContentType,
    long FileSize,
    SimulationConfiguration Configuration);

public sealed record SimulationMetrics(
    int OriginalBitCount,
    int TransmittedBitCount,
    int RedundantBitCount,
    double IncorrectPixelPercentage,
    double MeanAbsoluteBrightnessError);

public sealed record SimulationResult(
    Guid Id,
    string Status,
    string OriginalImageUrl,
    string UncorrectedImageUrl,
    string DecodedImageUrl,
    SimulationMetrics Metrics,
    IReadOnlyList<int> DetectedUncorrectableBlocks);

public sealed record ExperimentRequest(
    string FileName,
    IReadOnlyList<string> Codecs,
    IReadOnlyList<string> NoiseModels,
    IReadOnlyList<double> ErrorProbabilities,
    IReadOnlyList<int> RandomSeeds);

public sealed record ExperimentResult(
    Guid Id,
    string Status,
    IReadOnlyList<SimulationResult> Results);

public sealed record ExportDescriptor(
    Guid Id,
    string Format,
    string DownloadUrl);

public sealed record ImageUploadResult(
    Guid Id,
    int Width,
    int Height,
    string GrayscaleImageUrl);
