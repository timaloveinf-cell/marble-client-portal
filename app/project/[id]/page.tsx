import { Client } from "@notionhq/client";
import Image from "next/image";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ProjectPageProps = {
  params: Promise<{ id: string }>;
};

const STAGES = ["Замер", "Подготовка слэбов", "Монтаж", "Финиш"] as const;

const STATUS_TO_STAGE_INDEX: Record<string, number> = {
  "Замер": 0,
  "Подготовка слэбов": 1,
  "Монтаж": 2,
  "Финиш": 3
};

type ProjectData = {
  contractId: string;
  customer?: string;
  address?: string;
  statusName?: string;
  stageIndex: number;
  photos: Array<{ url: string; name?: string }>;
  docs: Array<{ url: string; name?: string }>;
};

class ProjectNotFoundError extends Error {
  constructor(contractId: string) {
    super(`Project not found for contract: ${contractId}`);
    this.name = "ProjectNotFoundError";
  }
}

function getPlainTextFromTitleProperty(prop: unknown): string | undefined {
  if (!prop || typeof prop !== "object") return undefined;
  // Notion SDK types are quite wide; keep this robust.
  const maybe: any = prop;
  const title = maybe?.title;
  if (!Array.isArray(title)) return undefined;
  return title.map((t: any) => t?.plain_text).filter(Boolean).join("");
}

function getPlainTextFromRichTextProperty(prop: unknown): string | undefined {
  if (!prop || typeof prop !== "object") return undefined;
  const maybe: any = prop;
  const richText = maybe?.rich_text;
  if (!Array.isArray(richText)) return undefined;
  return richText.map((t: any) => t?.plain_text).filter(Boolean).join("");
}

function getSelectLikeName(prop: unknown): string | undefined {
  if (!prop || typeof prop !== "object") return undefined;
  const maybe: any = prop;
  return maybe?.status?.name ?? maybe?.select?.name;
}

function getFiles(prop: unknown): Array<{ url: string; name?: string }> {
  if (!prop || typeof prop !== "object") return [];
  const maybe: any = prop;
  const files = maybe?.files;
  if (!Array.isArray(files)) return [];

  return files
    .map((item: any): { url: string; name?: string } | null => {
      const type = item?.type;
      const url =
        type === "file"
          ? item?.file?.url
          : type === "external"
            ? item?.external?.url
            : item?.file?.url ?? item?.external?.url;

      if (!url || typeof url !== "string") return null;
      const name = typeof item?.name === "string" ? item.name : undefined;
      return { url, name };
    })
    .filter((x): x is { url: string; name?: string } => Boolean(x));
}

function getFileExtensionLower(urlOrName?: string): string {
  if (!urlOrName) return "";
  const s = urlOrName.split("?")[0].split("#")[0];
  const dot = s.lastIndexOf(".");
  if (dot === -1) return "";
  return s.slice(dot + 1).toLowerCase();
}

function isImageFile(file: { url: string; name?: string }): boolean {
  const ext = getFileExtensionLower(file.name) || getFileExtensionLower(file.url);
  return ext === "jpg" || ext === "jpeg" || ext === "png" || ext === "webp";
}

function isPdfFile(file: { url: string; name?: string }): boolean {
  const ext = getFileExtensionLower(file.name) || getFileExtensionLower(file.url);
  return ext === "pdf";
}

async function fetchProjectData(contractIdFromUrl: string): Promise<ProjectData> {
  const notionToken = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!notionToken) throw new Error("NOTION_TOKEN is missing");
  if (!databaseId) throw new Error("NOTION_DATABASE_ID is missing");

  const notion = new Client({ auth: notionToken });

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: "ID договора",
      title: {
        equals: contractIdFromUrl
      }
    },
    page_size: 1
  });

  const page = response.results?.[0] as any | undefined;
  if (!page) throw new ProjectNotFoundError(contractIdFromUrl);

  const props = page.properties ?? {};

  const statusName = getSelectLikeName(props["Статус строительства"]);
  const stageIndex = statusName && STATUS_TO_STAGE_INDEX[statusName] !== undefined ? STATUS_TO_STAGE_INDEX[statusName] : 0;

  const customer =
    getPlainTextFromRichTextProperty(props["Заказчик"]) ??
    getPlainTextFromTitleProperty(props["Заказчик"]);

  const address =
    getPlainTextFromRichTextProperty(props["Адрес объекта"]) ??
    getPlainTextFromTitleProperty(props["Адрес объекта"]);

  const photoColumns = ["Фото1", "Фото2", "Фото3", "Фото4", "Фото5"] as const;
  const photos = photoColumns.flatMap((col) => getFiles(props[col]));
  const docs = getFiles(props["Документация"]);

  return {
    contractId: contractIdFromUrl,
    customer,
    address,
    statusName,
    stageIndex,
    photos,
    docs
  };
}

function ProgressBar({ currentIndex }: { currentIndex: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur">
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {STAGES.map((stage, idx) => {
          const isCurrent = idx === currentIndex;
          const isDone = idx < currentIndex;

          return (
            <div key={stage} className="relative">
              <div
                className={[
                  "h-2 w-full rounded-full",
                  isDone ? "bg-gold-600/70" : isCurrent ? "bg-gold-500" : "bg-white/10"
                ].join(" ")}
              />
              <div className="mt-3 flex items-start gap-2">
                <div
                  className={[
                    "mt-0.5 grid size-6 place-items-center rounded-full border text-[11px] font-semibold",
                    isDone
                      ? "border-gold-600/60 bg-gold-600/15 text-gold-500"
                      : isCurrent
                        ? "border-gold-500/70 bg-gold-500/15 text-gold-500"
                        : "border-white/10 bg-white/[0.02] text-zinc-400"
                  ].join(" ")}
                >
                  {idx + 1}
                </div>
                <div className="min-w-0">
                  <div
                    className={[
                      "truncate text-sm font-medium",
                      isCurrent ? "text-zinc-50" : isDone ? "text-zinc-200" : "text-zinc-400"
                    ].join(" ")}
                  >
                    {stage}
                  </div>
                  {isCurrent ? (
                    <div className="mt-1 text-xs text-gold-500/90">Текущий этап</div>
                  ) : (
                    <div className="mt-1 text-xs text-zinc-500">{isDone ? "Завершено" : "Ожидает"}</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const contractId = decodeURIComponent(id);

  try {
    const data = await fetchProjectData(contractId);

    return (
      <main className="px-6 py-12 sm:py-16">
        <div className="mx-auto w-full max-w-6xl">
          <header className="mb-10">
            <div className="text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-500">
              PROJECT
            </div>
            <h1 className="mt-4 font-serif text-3xl leading-tight tracking-tight text-zinc-50 sm:text-5xl">
              {data.contractId}
            </h1>
          </header>

          <section className="mb-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-500">
                  Заказчик
                </div>
                <div className="mt-2 text-sm leading-relaxed text-zinc-100">
                  {data.customer ?? "—"}
                </div>
              </div>
              <div>
                <div className="text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-500">
                  Адрес
                </div>
                <div className="mt-2 text-sm leading-relaxed text-zinc-100">
                  {data.address ?? "—"}
                </div>
              </div>
            </div>
            <div className="mt-6 text-xs tracking-wide text-zinc-500">
              Статус строительства:{" "}
              <span className="font-medium text-zinc-200">{data.statusName ?? "—"}</span>
            </div>
          </section>

          <section className="mb-10">
            <ProgressBar currentIndex={data.stageIndex} />
          </section>

          <section>
            <div className="mb-4 flex items-end justify-between gap-6">
              <h2 className="font-serif text-2xl tracking-tight text-zinc-50">Фотоотчет с объекта</h2>
              <div className="text-sm text-zinc-500">{data.photos.length} файлов</div>
            </div>

            {data.photos.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-zinc-400">
                В Notion пока нет файлов в колонках «Фото1…Фото5».
              </div>
            ) : (
              <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
                {data.photos.map((file, idx) => {
                  const label = file.name ?? `Файл ${idx + 1}`;

                  if (isImageFile(file)) {
                    return (
                      <div
                        key={`${file.url}-${idx}`}
                        className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition hover:border-white/20"
                      >
                        <Image
                          alt={label}
                          src={file.url}
                          width={1600}
                          height={1200}
                          sizes="(max-width: 768px) 100vw, 672px"
                          className="h-auto w-full object-cover"
                        />
                        <div className="border-t border-white/10 px-4 py-3 text-xs text-zinc-400">
                          {label}
                        </div>
                      </div>
                    );
                  }

                  const isPdf = isPdfFile(file);
                  return (
                    <a
                      key={`${file.url}-${idx}`}
                      href={file.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-gold-500/40"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <div className="font-serif text-base text-zinc-100">
                            {isPdf ? "Открыть фото (PDF)" : "Открыть файл"}
                          </div>
                          <div className="mt-1 truncate text-xs text-zinc-500">{label}</div>
                        </div>
                        <div className="shrink-0 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs font-semibold text-gold-500 transition group-hover:border-gold-500/40">
                          Открыть
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </section>

          <section className="mt-12">
            <div className="mb-4 flex items-end justify-between gap-6">
              <h2 className="font-serif text-2xl tracking-tight text-zinc-50">Документация</h2>
              <div className="text-sm text-zinc-500">{data.docs.length} файлов</div>
            </div>

            {data.docs.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-zinc-400">
                В Notion пока нет файлов в колонке «Документация».
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {data.docs.map((doc, idx) => {
                  const name = doc.name ?? `Документ ${idx + 1}`;
                  return (
                    <a
                      key={`${doc.url}-${idx}`}
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4 transition hover:border-gold-500/40"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="grid size-10 place-items-center rounded-xl border border-white/10 bg-black/20 text-gold-500">
                          <span aria-hidden="true">DOC</span>
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium text-zinc-100">{name}</div>
                          <div className="mt-0.5 truncate text-xs text-zinc-500">{doc.url}</div>
                        </div>
                      </div>
                      <div className="shrink-0 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs font-semibold text-gold-500">
                        Открыть
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    );
  } catch (err) {
    if (err instanceof ProjectNotFoundError) {
      return (
        <main className="px-6 py-14">
          <div className="mx-auto w-full max-w-5xl">
            <header className="mb-6">
              <div className="text-xs font-medium uppercase tracking-wider text-zinc-500">Проект</div>
              <h1 className="mt-2 font-serif text-4xl leading-tight tracking-tight text-zinc-50">
                {contractId}
              </h1>
            </header>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur">
              <div className="font-serif text-2xl tracking-tight text-zinc-50">
                Договор <span className="text-gold-500">{contractId}</span> не найден в базе
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
                Проверьте номер или свяжитесь с поддержкой.
              </p>
              <a
                href="/"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-xl border border-gold-500/50 bg-transparent px-6 font-serif text-sm font-semibold tracking-wide text-zinc-100 transition hover:border-gold-500 hover:bg-gold-500/10"
              >
                Вернуться к поиску
              </a>
            </div>
          </div>
        </main>
      );
    }

    const message =
      err instanceof Error ? `${err.name}: ${err.message}\n${err.stack ?? ""}` : String(err);

    return (
      <main className="px-6 py-14">
        <div className="mx-auto w-full max-w-5xl">
          <header className="mb-6">
            <div className="text-xs font-medium uppercase tracking-wider text-zinc-500">Ошибка</div>
            <h1 className="mt-2 font-serif text-4xl leading-tight tracking-tight text-zinc-50">
              {contractId}
            </h1>
          </header>

          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
            <div className="text-sm font-semibold text-red-200">Не удалось загрузить данные из Notion</div>
            <pre className="mt-3 overflow-auto whitespace-pre-wrap break-words text-xs leading-relaxed text-red-100/80">
{message}
            </pre>
          </div>
        </div>
      </main>
    );
  }
}

