namespace ImageTransmission.Application;

public interface ITranslationService
{
    IReadOnlyDictionary<string, string> GetTranslations(string locale);
}
