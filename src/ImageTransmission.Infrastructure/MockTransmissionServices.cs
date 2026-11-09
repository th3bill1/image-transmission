using System.Collections.Concurrent;
using ImageTransmission.Application;
using ImageTransmission.Core;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace ImageTransmission.Infrastructure;

public sealed class MockTransmissionCatalog : ITransmissionCatalog
{
    public IReadOnlyList<CodecDescriptor> GetCodecs() =>
    [
        new("uncoded", "Uncoded", "Transmit image bits without redundancy."),
        new("hamming74", "Hamming (7,4)", "Correct one bit error per codeword."),
        new("extended-hamming84", "Extended Hamming (8,4)", "Correct one bit and detect two-bit errors."),
        new("bch", "BCH", "Additional configurable BCH error-correcting code.")
    ];

    public IReadOnlyList<NoiseModelDescriptor> GetNoiseModels() =>
    [
        new("independent", "Independent bit errors", "Invert each bit with a configured probability."),
        new("burst", "Burst errors", "Invert consecutive bits in configured bursts.")
    ];
}

public sealed class MockSimulationService : ISimulationService
{
    private readonly ConcurrentDictionary<Guid, SimulationResult> results = new();
    private readonly ConcurrentDictionary<Guid, IReadOnlyDictionary<string, byte[]>> images = new();

    public async Task<SimulationResult> RunAsync(
        SimulationRequest request,
        Stream image,
        CancellationToken cancellationToken = default)
    {
        var result = await CreateResultAsync(request, image, cancellationToken);
        results[result.Id] = result;
        return result;
    }

    public Task<SimulationResult?> GetAsync(
        Guid id,
        CancellationToken cancellationToken = default) =>
        Task.FromResult(results.TryGetValue(id, out var result) ? result : null);

    public Task<(byte[] Content, string ContentType)?> GetImageAsync(
        Guid id,
        string variant,
        CancellationToken cancellationToken = default)
    {
        if (!images.TryGetValue(id, out var artifacts)
            || !artifacts.TryGetValue(variant, out var content))
        {
            return Task.FromResult< (byte[] Content, string ContentType)?>(null);
        }

        return Task.FromResult<(byte[] Content, string ContentType)?>((content, "image/png"));
    }

    private async Task<SimulationResult> CreateResultAsync(
        SimulationRequest request,
        Stream source,
        CancellationToken cancellationToken)
    {
        var id = Guid.NewGuid();
        var artifactImages = await CreateImagesAsync(source, request.Configuration, cancellationToken);
        images[id] = artifactImages;

        var originalBits = artifactImages["original"].Length * 8;
        var redundantBits = request.Configuration.Codec switch
        {
            TransmissionCodecs.Hamming74 => originalBits / 2,
            TransmissionCodecs.ExtendedHamming84 => originalBits,
            TransmissionCodecs.Bch => originalBits * 8 / 7,
            _ => 0
        };
        var transmittedBits = originalBits + redundantBits;
        var errorRate = Math.Clamp(request.Configuration.ErrorProbability * 100, 0, 100);
        var uncorrectable = request.Configuration.NoiseModel == NoiseModels.Burst
            ? Math.Max(1, request.Configuration.BurstCount)
            : errorRate > 0 ? Math.Max(1, (int)(errorRate / 5)) : 0;
        var corrected = Math.Max(0, (int)(errorRate * 2) - uncorrectable);
        var regions = Enumerable.Range(0, uncorrectable)
            .Select(index => new ErrorRegion(
                index,
                (index * 37) % 400,
                (index * 23) % 300,
                24,
                24,
                ErrorStatuses.Uncorrectable))
            .ToArray();

        return new(
            id,
            "mock",
            $"/api/simulations/{id}/images/original",
            $"/api/simulations/{id}/images/uncorrected",
            $"/api/simulations/{id}/images/decoded",
            new(
                originalBits,
                transmittedBits,
                redundantBits,
                Math.Min(100, errorRate),
                Math.Min(255, errorRate * 1.8),
                originalBits == 0 ? 0 : redundantBits * 100d / originalBits,
                corrected,
                uncorrectable),
            regions.Select(region => region.BlockIndex).ToArray(),
            regions);
    }

    private static async Task<IReadOnlyDictionary<string, byte[]>> CreateImagesAsync(
        Stream source,
        SimulationConfiguration configuration,
        CancellationToken cancellationToken)
    {
        using var original = Image.Load<Rgba32>(source);
        original.Mutate(context => context.Grayscale());

        using var uncorrected = original.Clone();
        using var decoded = original.Clone();
        var random = new Random(configuration.RandomSeed ?? 17);
        var errorCount = Math.Clamp(
            (int)(original.Width * original.Height * configuration.ErrorProbability),
            0,
            original.Width * original.Height);

        ApplyNoise(uncorrected, random, errorCount);
        ApplyNoise(decoded, random, errorCount / 3);

        return new Dictionary<string, byte[]>
        {
            ["original"] = await EncodePngAsync(original, cancellationToken),
            ["uncorrected"] = await EncodePngAsync(uncorrected, cancellationToken),
            ["decoded"] = await EncodePngAsync(decoded, cancellationToken)
        };
    }

    private static void ApplyNoise(Image<Rgba32> image, Random random, int count)
    {
        for (var index = 0; index < count; index++)
        {
            var x = random.Next(image.Width);
            var y = random.Next(image.Height);
            image[x, y] = new Rgba32(
                (byte)(255 - image[x, y].R),
                (byte)(255 - image[x, y].G),
                (byte)(255 - image[x, y].B),
                image[x, y].A);
        }
    }

    private static async Task<byte[]> EncodePngAsync(
        Image<Rgba32> image,
        CancellationToken cancellationToken)
    {
        await using var output = new MemoryStream();
        await image.SaveAsync(output, new PngEncoder(), cancellationToken);
        return output.ToArray();
    }
}

public sealed class MockExperimentService : IExperimentService
{
    private readonly ConcurrentDictionary<Guid, ExperimentResult> results = new();

    public Task<ExperimentResult> RunAsync(
        ExperimentRequest request,
        CancellationToken cancellationToken = default)
    {
        var result = new ExperimentResult(Guid.NewGuid(), "mock", [], []);
        results[result.Id] = result;
        return Task.FromResult(result);
    }

    public Task<ExperimentResult?> GetAsync(
        Guid id,
        CancellationToken cancellationToken = default) =>
        Task.FromResult(results.TryGetValue(id, out var result) ? result : null);
}

public sealed class MockExportService : IExportService
{
    private readonly ConcurrentDictionary<Guid, ExportDownload> downloads = new();
    private readonly ISimulationService simulations;

    public MockExportService(ISimulationService simulations)
    {
        this.simulations = simulations;
    }

    public async Task<ExportDescriptor> CreateAsync(
        Guid simulationId,
        ExportRequest request,
        CancellationToken cancellationToken = default)
    {
        if (request.Format is not (ExportFormats.Json or ExportFormats.Csv or ExportFormats.Png))
        {
            throw new ArgumentException($"Unsupported export format '{request.Format}'.", nameof(request));
        }

        var simulation = await simulations.GetAsync(simulationId, cancellationToken);
        if (simulation is null)
        {
            throw new KeyNotFoundException($"Simulation '{simulationId}' was not found.");
        }

        var id = Guid.NewGuid();
        var download = await CreateDownloadAsync(id, simulation, request, cancellationToken);
        downloads[id] = download;
        return new ExportDescriptor(
            id,
            request.Format,
            $"/api/exports/{id}/download",
            download.ContentType,
            download.FileName);
    }

    public Task<ExportDownload?> DownloadAsync(
        Guid exportId,
        CancellationToken cancellationToken = default) =>
        Task.FromResult(downloads.TryGetValue(exportId, out var content) ? content : null);

    private async Task<ExportDownload> CreateDownloadAsync(
        Guid exportId,
        SimulationResult simulation,
        ExportRequest request,
        CancellationToken cancellationToken)
    {
        if (request.Format == ExportFormats.Png)
        {
            var image = await simulations.GetImageAsync(
                simulation.Id,
                request.Asset switch
                {
                    "original" => "original",
                    "uncorrected" => "uncorrected",
                    _ => "decoded"
                },
                cancellationToken);

            if (image is null)
            {
                throw new KeyNotFoundException($"Image for simulation '{simulation.Id}' was not found.");
            }

            return new ExportDownload(
                image.Value.Content,
                "image/png",
                $"simulation-{simulation.Id}-{request.Asset}.png");
        }

        var content = request.Format == ExportFormats.Csv
            ? $"codec,noiseModel,errorProbability,incorrectPixelPercentage,meanAbsoluteBrightnessError,redundantBits{Environment.NewLine}" +
              $"{simulation.Status},mock,0,{simulation.Metrics.IncorrectPixelPercentage},{simulation.Metrics.MeanAbsoluteBrightnessError},{simulation.Metrics.RedundantBitCount}{Environment.NewLine}"
            : System.Text.Json.JsonSerializer.Serialize(simulation);
        return new ExportDownload(
            System.Text.Encoding.UTF8.GetBytes(content),
            request.Format == ExportFormats.Csv ? "text/csv" : "application/json",
            $"simulation-{simulation.Id}.{request.Format}");
    }
}
