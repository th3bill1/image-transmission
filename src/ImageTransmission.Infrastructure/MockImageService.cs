using System.Collections.Concurrent;
using ImageTransmission.Application;
using ImageTransmission.Core;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Processing;

namespace ImageTransmission.Infrastructure;

public sealed class ImageService : IImageService
{
    private readonly ConcurrentDictionary<Guid, byte[]> images = new();

    public async Task<ImageUploadResult> ConvertToGrayscaleAsync(
        Stream image,
        string contentType,
        CancellationToken cancellationToken = default)
    {
        using var source = await Image.LoadAsync(image, cancellationToken);
        source.Mutate(context => context.Grayscale());

        await using var output = new MemoryStream();
        await source.SaveAsync(output, new PngEncoder(), cancellationToken);

        var id = Guid.NewGuid();
        var content = output.ToArray();
        images[id] = content;
        return new ImageUploadResult(id, source.Width, source.Height, $"/api/images/{id}/grayscale");
    }

    public Task<(byte[] Content, string ContentType)?> GetGrayscaleAsync(
        Guid id,
        CancellationToken cancellationToken = default) =>
        Task.FromResult(
            images.TryGetValue(id, out var content)
                ? ((byte[] Content, string ContentType)?)(content, "image/png")
                : null);
}
