using ImageTransmission.Api;
using ImageTransmission.Application;
using ImageTransmission.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.Services.AddOpenApi();
builder.Services.AddSingleton<ITransmissionCatalog, MockTransmissionCatalog>();
builder.Services.AddSingleton<ITranslationService, TranslationService>();
builder.Services.AddSingleton<IImageService, ImageService>();
builder.Services.AddSingleton<ISimulationService, MockSimulationService>();
builder.Services.AddSingleton<IExperimentService, MockExperimentService>();
builder.Services.AddSingleton<IExportService, MockExportService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapDefaultEndpoints();

app.MapGet("/api/health", () => Results.Ok(new
{
    Status = "Healthy"
}));

app.MapTransmissionEndpoints();

app.Run();