using System.Collections.Concurrent;
using ImageTransmission.Application;
using ImageTransmission.Core;

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

    public Task<SimulationResult> RunAsync(
        SimulationRequest request,
        CancellationToken cancellationToken = default)
    {
        var result = CreateResult();
        results[result.Id] = result;
        return Task.FromResult(result);
    }

    public Task<SimulationResult?> GetAsync(
        Guid id,
        CancellationToken cancellationToken = default) =>
        Task.FromResult(results.TryGetValue(id, out var result) ? result : null);

    private static SimulationResult CreateResult()
    {
        var id = Guid.NewGuid();
        return new(
            id,
            "mock",
            $"/api/simulations/{id}/images/original",
            $"/api/simulations/{id}/images/uncorrected",
            $"/api/simulations/{id}/images/decoded",
            new(800, 1400, 600, 0, 0),
            []);
    }
}

public sealed class MockExperimentService : IExperimentService
{
    private readonly ConcurrentDictionary<Guid, ExperimentResult> results = new();

    public Task<ExperimentResult> RunAsync(
        ExperimentRequest request,
        CancellationToken cancellationToken = default)
    {
        var result = new ExperimentResult(Guid.NewGuid(), "mock", []);
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
    private readonly ConcurrentDictionary<Guid, byte[]> exports = new();

    public Task<ExportDescriptor> CreateAsync(
        Guid simulationId,
        string format,
        CancellationToken cancellationToken = default)
    {
        var id = Guid.NewGuid();
        exports[id] = System.Text.Encoding.UTF8.GetBytes(
            $$"""{"status":"mock","simulationId":"{{simulationId}}"}""");
        return Task.FromResult(new ExportDescriptor(id, format, $"/api/exports/{id}/download"));
    }

    public Task<byte[]?> DownloadAsync(
        Guid exportId,
        CancellationToken cancellationToken = default) =>
        Task.FromResult(exports.TryGetValue(exportId, out var content) ? content : null);
}
