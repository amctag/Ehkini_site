function pickCountryCode(country) {
  if (!country || typeof country !== "object") return "";
  return country.country_code ?? country.phone_code ?? country.dial_code ?? country.code ?? "";
}

function pickCountryName(country) {
  if (!country || typeof country !== "object") return "";
  return country.name ?? country.country ?? country.title ?? "";
}

export function mapCountryOption(country) {
  const value = String(pickCountryCode(country) ?? "").trim();
  const name = String(pickCountryName(country) ?? "").trim();
  const label = name ? `${name} (${value})` : value;

  return {
    id: country?.id ?? null,
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
