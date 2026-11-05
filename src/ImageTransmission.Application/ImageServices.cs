using ImageTransmission.Core;

namespace ImageTransmission.Application;

public interface IImageService
{
    Task<ImageUploadResult> ConvertToGrayscaleAsync(
        Stream image,
        string contentType,
        CancellationToken cancellationToken = default);

    Task<(byte[] Content, string ContentType)?> GetGrayscaleAsync(
        Guid id,
        CancellationToken cancellationToken = default);
}
