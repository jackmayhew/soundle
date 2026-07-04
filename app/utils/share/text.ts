import type { GameInstance } from '~/types/game/game.types'
import type { ResultsShareOptions } from '~/types/share/results'
import type { UserStatistics } from '~/types/stats/user-stats.types'
import { URL_QUERY_PARAMS } from '~/constants/app/routing'

export function generateResultShareText(data: GameInstance, options: ResultsShareOptions): string {
  const timeStr = data.completionTime ? formatPuzzleTime(data.completionTime) : 'N/A'
  const lines: string[] = ['Soundle']

  lines.push(formatPuzzleTitle(data.puzzleNumber, data.puzzleDate, true))
  lines.push(`Diff: ${data.difficulty ? `${data.difficulty}/5` : 'N/A'} | Time: ${timeStr}`)

  if (options.showAnswer && data.answer) {
    let ans = data.answer.charAt(0).toUpperCase() + data.answer.slice(1)
    if (ans.length > 24)
      ans = `${ans.substring(0, 23)}…`
    lines.push(`🔊 ${ans}`)
  }

  if (options.showGuesses && data.guesses.length > 0) {
    lines.push('')
    data.guesses.forEach((g, i) => {
      const icon = g.correct ? '✅' : '❌'
      const text = g.text.length > 15 ? `${g.text.substring(0, 14)}…` : g.text
      lines.push(`${i + 1}. ${text} ${icon}`)
    })
  }
  else {
    lines.push(`Guesses: ${data.guesses.length}`)
    lines.push(`Result: ${data.result === 'win' ? 'Win' : 'Loss'}`)
  }

  lines.push('', '🎧 soundle.game 🎧')
  return lines.join('\n')
}

export function generateStatsShareText(data: UserStatistics): string {
  return [
    'Soundle Stats 📊',
    `Played: ${data.totalGames} • Win Rate: ${data.winRate.toFixed(0)}%`,
    `Current Streak: ${data.currentStreak}${data.currentStreak > 0 ? ' 🔥' : ''}`,
    `Avg Time: ${formatPuzzleTime(data.averageTime)} ⏱️`,
    '',
    '🎧 soundle.game 🎧',
  ].join('\n')
}

export function generatePuzzleUrl(puzzleDate: string, baseUrl: string): string {
  return `${baseUrl}/?${URL_QUERY_PARAMS.PUZZLE_DATE}=${puzzleDate}`
}
