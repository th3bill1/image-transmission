using System.Text.Json;
using ImageTransmission.Application;

namespace ImageTransmission.Infrastructure;

public sealed class TranslationService : ITranslationService
{
    private readonly IReadOnlyDictionary<string, IReadOnlyDictionary<string, string>> translations;

    public TranslationService()
    {
        translations = new Dictionary<string, IReadOnlyDictionary<string, string>>(
            StringComparer.OrdinalIgnoreCase)
        {
            ["en"] = Load("en"),
            ["pl"] = Load("pl")
        };
    }

    public IReadOnlyDictionary<string, string> GetTranslations(string locale) =>
        translations.TryGetValue(locale, out var result) ? result : translations["en"];

    private static IReadOnlyDictionary<string, string> Load(string locale)
    {
        var path = Path.Combine(AppContext.BaseDirectory, "Translations", $"{locale}.json");
        if (!File.Exists(path))
        {
            throw new FileNotFoundException($"Translation file was not found for locale '{locale}'.", path);
        }

        var content = File.ReadAllText(path);
        return JsonSerializer.Deserialize<Dictionary<string, string>>(content)
            ?? throw new InvalidDataException($"Translation file '{path}' is empty or invalid.");
    }
}
