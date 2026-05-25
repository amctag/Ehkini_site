function pickCountryCode(country) {
  if (!country || typeof country !== "object") return "";
  return country.country_code ?? country.phone_code ?? country.dial_code ?? country.code ?? "";
}

function pickCountryName(country) {
  if (!country || typeof country !== "object") return "";
  return (
    country.name ??
    country.country_name ??
    country.country ??
    country.title ??
    country.en_name ??
    country.english_name ??
    country.native_name ??
    ""
  );
}

function removeTrailingCode(value) {
  return String(value ?? "")
    .replace(/\s*\([^)]*\)\s*$/, "")
    .trim();
}

export function mapCountryOption(country) {
  const value = String(pickCountryCode(country) ?? "").trim();
  const name = String(pickCountryName(country) ?? "").trim();
  const fallbackLabel = removeTrailingCode(country?.label ?? country?.display_name);
  const finalName = name || fallbackLabel;
  const label = finalName ? `${finalName} (${value})` : value;

  return {
    id: country?.id ?? country?.country_id ?? null,
    name: finalName,
    value,
    label
  };
}

export function mapCountriesResponse(response) {
  const rows = Array.isArray(response) ? response : (response?.data ?? []);

  return rows
    .map(mapCountryOption)
    .filter((country) => country.value.length > 0);
}
