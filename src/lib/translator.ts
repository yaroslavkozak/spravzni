export type Translator = (
  key: string,
  params?: Record<string, string | number>
) => string
