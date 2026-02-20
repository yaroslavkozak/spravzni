import { execFileSync } from 'node:child_process'
import { writeFileSync, unlinkSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { translationsByLanguage } from '../src/i18n/translations'

type SeedLanguage = 'uk' | 'en' | 'pl'

function escapeSqlString(value: string): string {
  return `'${value.replace(/'/g, "''")}'`
}

function toSqlNullable(value: string | undefined): string {
  if (value == null || value === '') {
    return 'NULL'
  }
  return escapeSqlString(value)
}

function buildSeedSql(): { sql: string; keyCount: number } {
  const languages: SeedLanguage[] = ['uk', 'en', 'pl']
  const keys = new Set<string>()
  const ukMap = translationsByLanguage.uk as Record<string, string> | undefined
  const enMap = translationsByLanguage.en as Record<string, string> | undefined
  const plMap = translationsByLanguage.pl as Record<string, string> | undefined

  for (const language of languages) {
    const map = translationsByLanguage[language] || {}
    for (const key of Object.keys(map)) {
      keys.add(key)
    }
  }

  const sortedKeys = Array.from(keys).sort((a, b) => a.localeCompare(b))
  const statements = sortedKeys.map((key) => {
    const ukValue = toSqlNullable(ukMap?.[key])
    const enValue = toSqlNullable(enMap?.[key])
    const plValue = toSqlNullable(plMap?.[key])

    return `INSERT INTO translations (key, ua, en, pl)
VALUES (${escapeSqlString(key)}, ${ukValue}, ${enValue}, ${plValue})
ON CONFLICT(key) DO UPDATE SET
  ua = excluded.ua,
  en = excluded.en,
  pl = excluded.pl,
  updated_at = CURRENT_TIMESTAMP;`
  })

  // NOTE: remote D1 execute can reject explicit BEGIN/COMMIT wrappers.
  // We emit plain idempotent upserts so the seed works for both local and remote.
  const sql = statements.join('\n')
  return { sql, keyCount: sortedKeys.length }
}

function main() {
  const isRemote = process.argv.includes('--remote')
  const dbName = process.env.D1_DATABASE_NAME || 'spravzni-db'
  const { sql, keyCount } = buildSeedSql()
  const tempPath = join(tmpdir(), `seed-translations-${Date.now()}.sql`)

  writeFileSync(tempPath, sql, 'utf8')

  try {
    const args = ['d1', 'execute', dbName, isRemote ? '--remote' : '--local', '--file', tempPath]
    execFileSync('wrangler', args, { stdio: 'inherit' })
    console.log(`Seeded ${keyCount} translation keys into table "translations".`)
  } finally {
    unlinkSync(tempPath)
  }
}

main()
