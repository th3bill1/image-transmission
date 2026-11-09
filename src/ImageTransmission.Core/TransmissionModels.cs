namespace ImageTransmission.Core;

public static class TransmissionCodecs
{
    public const string Uncoded = "uncoded";
    public const string Hamming74 = "hamming74";
    public const string ExtendedHamming84 = "extended-hamming84";
    public const string Bch = "bch";
}

public static class NoiseModels
{
    public const string Independent = "independent";
    public const string Burst = "burst";
}

public static class ExportFormats
{
    public const string Json = "json";
    public const string Csv = "csv";
    public const string Png = "png";
}

public static class ErrorStatuses
{
    public const string Corrected = "corrected";
    public const string Uncorrectable = "uncorrectable";
    public const string Undetected = "undetected";
}

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
    SimulationConfiguration Configuration,
    Guid? ImageId = null);

public sealed record SimulationMetrics(
    int OriginalBitCount,
    int TransmittedBitCount,
    int RedundantBitCount,
    double IncorrectPixelPercentage,
    double MeanAbsoluteBrightnessError,
    double CodingOverheadPercentage = 0,
    int CorrectedBlockCount = 0,
    int UncorrectableBlockCount = 0);

public sealed record ErrorRegion(
    int BlockIndex,
    int X,
    int Y,
    int Width,
    int Height,
    string Status);

public sealed record SimulationResult(
    Guid Id,
    string Status,
    string OriginalImageUrl,
    string UncorrectedImageUrl,
    string DecodedImageUrl,
    SimulationMetrics Metrics,
    IReadOnlyList<int> DetectedUncorrectableBlocks,
    IReadOnlyList<ErrorRegion> ErrorRegions);

public sealed record ExperimentRequest(
    string FileName,
    IReadOnlyList<string> Codecs,
    IReadOnlyList<string> NoiseModels,
    IReadOnlyList<double> ErrorProbabilities,
    IReadOnlyList<int> RandomSeeds,
    int BurstLength,
    int BurstCount,
    Guid? ImageId);

public sealed record ExperimentResultRow(
    string Codec,
    string NoiseModel,
    double ErrorProbability,
    int? RandomSeed,
    SimulationMetrics Metrics,
    Guid SimulationId,
    string DecodedImageUrl);

public sealed record ExperimentResult(
    Guid Id,
    string Status,
    IReadOnlyList<SimulationResult> Results,
    IReadOnlyList<ExperimentResultRow> Rows);

public sealed record ExportRequest(
    string Format,
    string Asset = "report");

public sealed record ExportDescriptor(
    Guid Id,
    string Format,
    string DownloadUrl,
    string ContentType = "application/json",
    string? FileName = null);

public sealed record ImageUploadResult(
    Guid Id,
    int Width,
    int Height,
    string GrayscaleImageUrl,
    string ContentType = "image/png");
