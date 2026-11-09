using ImageTransmission.Core;

namespace ImageTransmission.Application;

public interface ITransmissionCatalog
{
    IReadOnlyList<CodecDescriptor> GetCodecs();

    IReadOnlyList<NoiseModelDescriptor> GetNoiseModels();
}

public interface ISimulationService
{
    Task<SimulationResult> RunAsync(
        SimulationRequest request,
        Stream image,
        CancellationToken cancellationToken = default);

    Task<SimulationResult?> GetAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task<(byte[] Content, string ContentType)?> GetImageAsync(
        Guid id,
        string variant,
        CancellationToken cancellationToken = default);
}

public interface IExperimentService
{
    Task<ExperimentResult> RunAsync(
        ExperimentRequest request,
        CancellationToken cancellationToken = default);

    Task<ExperimentResult?> GetAsync(
        Guid id,
        CancellationToken cancellationToken = default);
}

public interface IExportService
{
    Task<ExportDescriptor> CreateAsync(
        Guid simulationId,
        ExportRequest request,
        CancellationToken cancellationToken = default);

    Task<ExportDownload?> DownloadAsync(
        Guid exportId,
        CancellationToken cancellationToken = default);
}
