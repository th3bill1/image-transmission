var builder = DistributedApplication.CreateBuilder(args);

var api = builder.AddProject<Projects.ImageTransmission_Api>("api")
    .WithHttpHealthCheck("/health");

builder.AddJavaScriptApp("frontend", "../../frontend", "start")
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints()
    .WithReference(api)
    .WaitFor(api);

builder.Build().Run();