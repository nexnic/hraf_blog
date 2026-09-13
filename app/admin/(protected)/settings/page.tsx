import { getSiteSettings } from "@/lib/theme/settings";
import { themePresets } from "@/lib/theme/presets";
import { applyPreset, updateSettings } from "./actions";

function ColorField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      {label}
      <input type="color" name={name} defaultValue={defaultValue} className="h-9 w-16" />
    </label>
  );
}

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="flex max-w-2xl flex-col gap-10">
      <div>
        <h1 className="text-xl font-semibold">Innstillinger</h1>
        <p className="text-sm opacity-60">Fargepalett og generell nettstedsinformasjon.</p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold">Forhåndsvalgte paletter</h2>
        <div className="flex flex-wrap gap-3">
          {themePresets.map((preset) => (
            <form key={preset.id} action={applyPreset.bind(null, preset.id)}>
              <button
                type="submit"
                className={`flex items-center gap-2 rounded border px-3 py-2 text-sm ${
                  settings.themePreset === preset.id
                    ? "border-foreground"
                    : "border-foreground/10"
                }`}
              >
                <span className="flex gap-1">
                  <span
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: preset.primaryColor }}
                  />
                  <span
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: preset.accentColor }}
                  />
                </span>
                {preset.label}
              </button>
            </form>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold">Egendefinert</h2>
        <form action={updateSettings} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            Nettstedstittel
            <input
              name="siteTitle"
              required
              defaultValue={settings.siteTitle}
              className="rounded border border-foreground/10 px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Beskrivelse (valgfritt)
            <textarea
              name="siteDescription"
              rows={2}
              defaultValue={settings.siteDescription ?? ""}
              className="rounded border border-foreground/10 px-3 py-2"
            />
          </label>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <ColorField name="primaryColor" label="Primær" defaultValue={settings.primaryColor} />
            <ColorField
              name="secondaryColor"
              label="Sekundær"
              defaultValue={settings.secondaryColor}
            />
            <ColorField name="accentColor" label="Aksent" defaultValue={settings.accentColor} />
            <ColorField
              name="backgroundColor"
              label="Bakgrunn"
              defaultValue={settings.backgroundColor}
            />
            <ColorField name="textColor" label="Tekst" defaultValue={settings.textColor} />
          </div>

          <button
            type="submit"
            className="self-start rounded bg-primary px-4 py-2 text-sm text-background"
          >
            Lagre innstillinger
          </button>
        </form>
      </section>
    </div>
  );
}
