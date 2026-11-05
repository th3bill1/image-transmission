using System.Globalization;
using ImageTransmission.Application;
using ImageTransmission.Core;

namespace ImageTransmission.Api;

public static class ApiEndpoints
{
    public static void MapTransmissionEndpoints(this WebApplication app)
    {
        var api = app.MapGroup("/api");

        api.MapGet("/catalog/codecs", (ITransmissionCatalog catalog) =>
            Results.Ok(catalog.GetCodecs()));

        api.MapGet("/catalog/noise-models", (ITransmissionCatalog catalog) =>
            Results.Ok(catalog.GetNoiseModels()));

        api.MapGet("/translations/{locale}", (
            string locale,
            ITranslationService translations) =>
            Results.Ok(translations.GetTranslations(locale)));

        api.MapPost("/images/grayscale", async (
            HttpRequest httpRequest,
            IImageService images,
            CancellationToken cancellationToken) =>
        {
            var form = await httpRequest.ReadFormAsync(cancellationToken);
            var image = form.Files.GetFile("image");
            if (image is null)
            {
                return Results.BadRequest(new { error = "An image file is required." });
            }

            await using var stream = image.OpenReadStream();
            return Results.Ok(await images.ConvertToGrayscaleAsync(
                stream,
                image.ContentType,
                cancellationToken));
        });

        api.MapGet("/images/{id:guid}/grayscale", async (
            Guid id,
            IImageService images,
            CancellationToken cancellationToken) =>
        {
            var result = await images.GetGrayscaleAsync(id, cancellationToken);
            return result is null
                ? Results.NotFound()
                : Results.File(result.Value.Content, result.Value.ContentType);
        });

        api.MapPost("/simulations", async (
            HttpRequest httpRequest,
            ISimulationService simulations,
            CancellationToken cancellationToken) =>
        {
            var form = await httpRequest.ReadFormAsync(cancellationToken);
            var image = form.Files.GetFile("image");
            if (image is null)
            {
                return Results.BadRequest(new { error = "An image file is required." });
            }

            var request = new SimulationRequest(
                image.FileName,
                image.ContentType,
                image.Length,
                new(
                    form["codec"].ToString(),
                    form["noiseModel"].ToString(),
                    ParseDouble(form["errorProbability"].ToString(), 0),
                    ParseInt(form["burstLength"].ToString(), 0),
                    ParseInt(form["burstCount"].ToString(), 0),
                    ParseNullableInt(form["randomSeed"].ToString())));

            return Results.Ok(await simulations.RunAsync(request, cancellationToken));
        });

        api.MapGet("/simulations/{id:guid}", async (
            Guid id,
            ISimulationService simulations,
            CancellationToken cancellationToken) =>
        {
            var result = await simulations.GetAsync(id, cancellationToken);
            return result is null ? Results.NotFound() : Results.Ok(result);
        });

        api.MapPost("/experiments", async (
            ExperimentRequest request,
            IExperimentService experiments,
            CancellationToken cancellationToken) =>
            Results.Ok(await experiments.RunAsync(request, cancellationToken)));

        api.MapGet("/experiments/{id:guid}", async (
            Guid id,
            IExperimentService experiments,
            CancellationToken cancellationToken) =>
        {
            var result = await experiments.GetAsync(id, cancellationToken);
            return result is null ? Results.NotFound() : Results.Ok(result);
        });

        api.MapPost("/simulations/{simulationId:guid}/exports", async (
            Guid simulationId,
            ExportRequest request,
            IExportService exports,
            CancellationToken cancellationToken) =>
            Results.Ok(await exports.CreateAsync(simulationId, request.Format, cancellationToken)));

        api.MapGet("/exports/{id:guid}/download", async (
            Guid id,
            IExportService exports,
            CancellationToken cancellationToken) =>
        {
            var content = await exports.DownloadAsync(id, cancellationToken);
            return content is null
                ? Results.NotFound()
                : Results.File(content, "application/json", "simulation-export.json");
        });
    }

    private static int ParseInt(string value, int fallback) =>
        int.TryParse(value, NumberStyles.Integer, CultureInfo.InvariantCulture, out var parsed)
            ? parsed
            : fallback;

    private static int? ParseNullableInt(string value) =>
        int.TryParse(value, NumberStyles.Integer, CultureInfo.InvariantCulture, out var parsed)
            ? parsed
            : null;

    private static double ParseDouble(string value, double fallback) =>
        double.TryParse(value, NumberStyles.Float, CultureInfo.InvariantCulture, out var parsed)
            ? parsed
            : fallback;

    private sealed record ExportRequest(string Format);
}
